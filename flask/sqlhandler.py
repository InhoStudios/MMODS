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
        # create ICD_entity
        create_entity_query = "insert ignore into ICD_Entity (entity_id, entity_title) values" + \
            f"('{unit['uri']}', '{unit['title']}');"
        cursor.execute(create_entity_query);

        # create and insert into case
        insert_case_query = "insert ignore into Cases (case_id, age, sex, history, user_selected_entity, size, severity) values " + \
            f"('{unit['id']}', '{str(unit['age'])}', '{unit['sex']}', '{unit['hist']}', '{unit['uri']}', '{unit['size']}', '{unit['severity']}');"
        cursor.execute(insert_case_query)

        # save search results into newly created table
        for result in unit['results']:
            fixed_format_title = result['title']
            fixed_format_title = fixed_format_title.replace("—","")
            create_alt_entity_query = "insert ignore into ICD_Entity (entity_id, entity_title) values" + \
                f"('{result['id']}', '{fixed_format_title}');"
            cursor.execute(create_alt_entity_query)
            create_alt_diag_link_query = "insert ignore into Case_Alt_Diagnoses (case_id, entity_id) values" + \
                f"('{unit['id']}', '{result['id']}')"
            cursor.execute(create_alt_diag_link_query)

        # save image
        insert_image_query = "insert ignore into image (img_id, filename, case_id, modality, anatomic_site) values" + \
            f"(default, '{unit['file']}', '{unit['id']}', '{unit['imgtype']}', '{unit['site']}');"
        cursor.execute(insert_image_query)

        cats = self.create_categories(unit['uri'], icd)
        for cat in cats:
            create_cat_entity_query = f"insert ignore into Case_Categories (case_id, entity_id) values ('{unit['id']}','{cat}');"
            cursor.execute(create_cat_entity_query)

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
        get_cases_query = "select c.case_id, c.user_selected_entity, i.filename, e.entity_title, i.anatomic_site, " + \
            "c.size, c.severity, c.age, c.sex, c.history, i.modality " + \
            "from Cases c, ICD_Entity e, Image i " + \
            "where i.case_id = c.case_id and e.entity_id = c.user_selected_entity;"
        cursor.execute (get_cases_query)
        cases = cursor.fetchall()


        # create entry for each image
        for case in cases:
            # GET ALL ALTERNATIVE DIAGNOSES
            # get query result table
            get_alternative_diagnoses_query = f"select c.entity_id, e.entity_title from Case_Alt_Diagnoses c, ICD_Entity e where c.case_id = {case[0]} and e.entity_id = c.entity_id;"
            cursor.execute(get_alternative_diagnoses_query)
            results = cursor.fetchall()

            # create list of results
            diaglist = []
            for result in results:
                kvpair = {
                    'id': result[0],
                    'title': result[1]
                }
                diaglist.append(kvpair)

            # get image data
            try:
                # create metadata unit for specific image
                unit = {
                    'id': case[0],
                    'uri': case[1],
                    'file': case[2],
                    'title': case[3],
                    'results': diaglist,
                    'site': case[4],
                    'size': case[5],
                    'severity': case[6],
                    'diffofdiag': 0,
                    'age': case[7],
                    'sex': case[8],
                    'hist': case[9],
                    'imgtype': case[10],
                    'verified': 0,
                }
                # if not (case[11] == None):
                #     unit['clinician_uri'] = case[11]
                #     unit['clinician_title'] = case[13]
                #     unit['verified'] = 1
                # if not (case[12] == None):
                #     unit['pathologist_uri'] = case[12]
                #     unit['pathologist_title'] = case[14]
                #     unit['verified'] = 1
            except:
                pass

            # get parents from links
            query = f"select entity_id from Case_Categories where case_id = {case[0]}"
            cursor.execute(query)
            parents = cursor.fetchall()
            par_str =  case[1] + " " + " ".join(str(item[0]) for item in parents)
            unit['parents'] = par_str
            print(unit['parents'])
            # save unit into corresponding key in return dictionary
            DATA[case[0]] = unit
        cursor.close()

        # return the dictionary
        return DATA
    
    def update_image(self, request_id, corrected_uri):
        """
        Update metadata for an entry

        When an image is verified, this function updates the corresponding metadata of that image

        Parameters
        -----
        request_id : str
            The ID of the image to edit; taken from the form request
        corrected_uri : str
            The updated ICD-11 code to change for the image
        """
        # create mysql connection
        cursor = self.mysql.connection.cursor()

        # update metadata accordingly
        query = f"update cases set clinician_entity='{corrected_uri}' where case_id={request_id}"
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

        # delete entry
        query = f"delete from Cases where case_id = {request_id}"
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

    def add_category(self, entity_id, icd):
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
        query = f"select exists(select * from ICD_Entity where entity_id = {entity_id});"
        cursor.execute(query)
        exists = cursor.fetchall()[0][0]
        if exists == 0:
            entity_title = icd.getDiagnosisByID(entity_id)
            query = f"insert ignore into ICD_Entity (entity_id, entity_title) values ({entity_id}, \"{str(entity_title)}\");"
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
        query = f"select e.entity_id, e.entity_title from icd_entity e, case_categories c where c.entity_id = e.entity_id"
        cursor.execute(query)
        cats = cursor.fetchall()

        ret_cats = {}
        for cat in cats:
            ret_cats[cat[0]] = cat[1]

        return ret_cats

