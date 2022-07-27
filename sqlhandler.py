from flask_mysqldb import MySQL

# Utility object used to handle reads and writes to SQL database
class SQLHandler:
    def __init__(self, flaskapp):
        """
        Create an SQLHandler instance
        
        Parameters
        -----
        flaskapp : Flask()
            Flask application to link SQL server to
        """
        self.flaskapp = flaskapp
        self.mysql = MySQL(flaskapp)
    
    def save_into_metadata(self, unit, icd):
        """
        Saves data into the SQL database. 

        Parameters
        -----
        unit : dict
            Dictionary that contains all relevant metadata for a single image upload
        """
        # get a cursor for sql connection
        cursor = self.mysql.connection.cursor()
        # create and insert into case
        query = "insert ignore into cases (case_id, reported_diagnosis, uri, age, sex, history, anatomic_site, size, severity) values " + \
            f"('{unit['id']}', '{unit['title']}', '{unit['uri']}', '{str(unit['age'])}', '{unit['sex']}', '{unit['hist']}', '{unit['site']}', '{unit['size']}', '{unit['severity']}');"
        cursor.execute(query)

        # save search results into newly created table
        for result in unit['results']:
            query = f"insert ignore into alt_diagnoses (case_id, diagnosis, uri) values ('{unit['id']}', '{result['title']}', '{result['id']}')"
            cursor.execute(query)

        # save image
        query = f"insert ignore into image (image_id, filename, case_id, modality) values (default, '{unit['file']}', '{unit['id']}', '{unit['imgtype']}');"
        cursor.execute(query)

        cats = self.create_categories(unit['uri'], icd)
        for cat in cats:
            query = f"insert ignore into links (case_id, cat_id) values ('{unit['id']}','{cat}');"
            cursor.execute(query)

        # commit changes
        self.mysql.connection.commit()
        cursor.close()

        return self
    
    def read_from_metadata(self):
        """
        Read metadata from SQL database into dictionary

        Returns
        -----
        dict
            Dictionary containing all image metadata, organized by image ID and containing search results
        """
        # create empty dictionary
        DATA = {}

        # initialize cursor
        cursor = self.mysql.connection.cursor()

        # get case data
        query = "select * from cases;"
        cursor.execute (query)
        cases = cursor.fetchall()

        # create entry for each image
        for case in cases:
            # get query result table
            query = f"select * from alt_diagnoses where alt_diagnoses.case_id = {case[0]};"
            cursor.execute(query)
            results = cursor.fetchall()

            # create list of results
            diaglist = []
            for result in results:
                kvpair = {
                    'id': result[2],
                    'title': result[1]
                }
                diaglist.append(kvpair)

            # get image data
            query = f"select * from image where image.case_id = {case[0]};"
            cursor.execute (query)
            try:
                image = cursor.fetchall()[0]

                # create metadata unit for specific image
                unit = {
                    'id': case[0],
                    'uri': case[2],
                    'file': image[1],
                    'title': case[1],
                    'results': diaglist,
                    'site': case[6],
                    'size': case[7],
                    'severity': case[8],
                    'diffofdiag': 0,
                    'age': case[3],
                    'sex': case[4],
                    'hist': case[5],
                    'imgtype': image[3],
                    'verified': 0
                }
                if not (case[11] == None):
                    unit['title'] = case[11]
                    unit['verified'] = 1
                if not (case[12] == None):
                    unit['title'] = case[12]
                    unit['verified'] = 1
            except:
                pass

            # get parents from links
            query = f"select * from links where links.case_id = {case[0]}"
            cursor.execute(query)
            parents = cursor.fetchall()
            par_str = case[2]
            for parent in parents:
                par_str =  par_str + " " + parent[1]
            unit['parents'] = par_str
            print(unit['parents'])
            # save unit into corresponding key in return dictionary
            DATA[case[0]] = unit
        cursor.close()

        # return the dictionary
        return DATA
    
    def update_image(self, request_id, corrected_uri, corrected_title):
        """
        Update metadata for an entry

        When an image is verified, this function updates the corresponding metadata of that image

        Parameters
        -----
        request_id : str
            The ID of the image to edit; taken from the form request
        corrected_uri : str
            The updated ICD-11 code to change for the image
        corrected_title : str
            The updated diagnosis to change for the image
        """
        # create mysql connection
        cursor = self.mysql.connection.cursor()

        # update metadata accordingly
        query = f"update cases set uri='{corrected_uri}', clinician_diagnosis='{corrected_title}' where case_id={request_id}"
        cursor.execute(query)

        # commit changes
        self.mysql.connection.commit()
        cursor.close()

        return self

    def delete_from_metadata(self, request_id):
        """
        Delete image entry from metadata.

        Removes the corresponding metadata entry for an image in a deletion request.
        
        Parameters
        -----
        request_id : str
            ID of the entry corresponding to the image to delete
        """
        # create connection
        cursor = self.mysql.connection.cursor()

        # TODO: rewrite deletion code

        # delete query result list table
        query = f"delete from alt_diagnoses where case_id = {request_id}"
        cursor.execute(query)

        query = f"delete from links where case_id={request_id}"
        cursor.execute(query)

        query = f"delete from image where case_id={request_id}"
        cursor.execute(query)

        # delete entry
        query = f"delete from cases where case_id = {request_id}"
        cursor.execute(query)

        for category in self.get_categories().keys():
            query = f'select exists(select * from links where cat_id = {category});'
            cursor.execute(query)

            exists = cursor.fetchall()[0][0]
            if exists == 0:
                query = f'delete from categories where cat_id = {category}'
                cursor.execute(query)

        # commit changes
        self.mysql.connection.commit()
        cursor.close()

        return self
    
    def create_categories(self, entity_id, icd):
        """
        Get all parent categories of a certain ICD entity

        Parameters:
        -----
        entity_id: str
            ICD-Entity of interest
        icd: ICDManager
            ICD object passthrough for API queries
        """
        include = "ancestor"
        entity_info = icd.getEntityByID(entity_id, include=include)
        ancestors = entity_info['ancestor']
        category_ids = []
        for ancestor in ancestors:
            ancestor_id = ancestor.split('/')[-1]
            if ancestor_id != '979408586' and ancestor_id != '448895267' and ancestor_id != '455013390' and ancestor_id != '1920852714':
                category_ids.append(ancestor_id)
                self.add_category(ancestor_id, icd)
        return category_ids

    def add_category(self, cat_id, icd):
        """
        Add a disease category to the category table

        Checks if a category exists with a given id. If it does not exist, a new entry is made for that category

        Parameters
        -----
        cat_id : str
            Entity URI of the corresponding ICD-Entity for that category
        icd: ICDManager
            ICD object passthrough for API queries
        """
        cursor = self.mysql.connection.cursor()
        # check if cat_id exists already
        query = f"select exists(select * from categories where cat_id = {cat_id});"
        cursor.execute(query)
        exists = cursor.fetchall()[0][0]
        if exists == 0:
            cat_title = icd.getDiagnosisByID(cat_id)
            query = f"insert ignore into categories(cat_id, cat_title) values ({cat_id}, \"{str(cat_title)}\");"
            cursor.execute(query)
        
        self.mysql.connection.commit()
        cursor.close()

    def get_categories(self):
        """
        Get all categories currently stored in the API

        Returns
        -----
        categories: dict
            Dictionary of all the categories with diagnoses names paired with entity ids
        """
        cursor = self.mysql.connection.cursor()
        query = f"select * from categories"
        cursor.execute(query)
        cats = cursor.fetchall()

        ret_cats = {}
        for cat in cats:
            ret_cats[cat[0]] = cat[1]

        return ret_cats

