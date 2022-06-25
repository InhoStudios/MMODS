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
    
    def save_into_metadata(self, unit):
        """
        Saves data into the SQL database. 

        Parameters
        -----
        unit : dict
            Dictionary that contains all relevant metadata for a single image upload
        """
        # get a cursor for sql connection
        cursor = self.mysql.connection.cursor()

        # create a table for all the diagnoses results
        query = "CREATE TABLE img" + unit['id'] + " ( id VARCHAR(50) NOT NULL, diagnosis VARCHAR (150) NOT NULL, selected VARCHAR(10) NOT NULL, PRIMARY KEY (id) )"
        cursor.execute(query)

        # save search results into newly created table
        for result in unit['results']:
            query = "INSERT INTO img" + unit['id'] + \
                " (id, diagnosis, selected) VALUES ('" + \
                    result['id'] + "', '" + \
                    result['title'] + "', '" + \
                    result['selected'] + "')"
            cursor.execute(query)
        
        # save all other metadata
        query = "INSERT INTO metadata (id, uri, file, title, anatomic_site, size, severity, diff_of_diag, age, sex, history, imgtype, verified, parents) VALUES ('" + \
            unit['id'] + "', '" + \
            unit['uri'] + "', '" + \
            unit['file'] + "', '" + \
            unit['title'] + "', '" + \
            unit['site'] + "', '" + \
            str(unit['size']) + "', '" + \
            unit['severity'] + "', '" + \
            str(unit['diffofdiag']) + "', '" + \
            str(unit['age']) + "', '" + \
            unit['sex'] + "', '" + \
            unit['hist'] + "', '" + \
            unit['imgtype'] + "', '" + \
            str(unit['verified']) + "', '" + \
            unit['parents'] + "')"
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

        # get data from SQL database
        cursor = self.mysql.connection.cursor()
        cursor.execute ('''SELECT * FROM metadata''')

        # get all image metadata units
        values = cursor.fetchall()

        # create entry for each image
        for value in values:
            # get query result table
            value_table = "img" + value[0]
            query = "SELECT * FROM " + value_table
            cursor.execute(query)
            results = cursor.fetchall()
            diaglist = []

            # create list of results
            for result in results:
                kvpair = {
                    'id': result[0],
                    'title': result[1],
                    'selected': result[2]
                }
                diaglist.append(kvpair)
            
            # create metadata unit for specific image
            unit = {
                'id': value[0],
                'uri': value[1],
                'file': value[2],
                'title': value[3],
                'results': diaglist,
                'site': value[4],
                'size': value[5],
                'severity': value[6],
                'diffofdiag': value[7],
                'age': value[8],
                'sex': value[9],
                'hist': value[10],
                'imgtype': value[11],
                'verified': value[12],
                'parents': value[13]
            }

            # save unit into corresponding key in return dictionary
            DATA[value[0]] = unit
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
        query = "UPDATE metadata SET uri='" + corrected_uri + "', title='" + corrected_title + "', verified=1 WHERE id=" + request_id
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

        # delete entry
        query = "DELETE FROM metadata WHERE id=" + request_id
        cursor.execute(query)

        # delete query result list table
        query = "DROP TABLE img" + request_id
        cursor.execute(query)

        # commit changes
        self.mysql.connection.commit()
        cursor.close()

        return self
