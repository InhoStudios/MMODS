from flask_mysqldb import MySQL

class SQLHandler:
    def __init__(self, flaskapp):
        self.flaskapp = flaskapp
        self.mysql = MySQL(flaskapp)
    def save_into_metadata(self, unit):
        cursor = self.mysql.connection.cursor();
        query = "CREATE TABLE img" + unit['id'] + " ( id VARCHAR(50) NOT NULL, diagnosis VARCHAR (150) NOT NULL, selected VARCHAR(10) NOT NULL, PRIMARY KEY (id) )"
        cursor.execute(query);
        for result in unit['results']:
            query = "INSERT INTO img" + unit['id'] + " (id, diagnosis, selected) VALUES ('" + result['id'] + "', '" + result['title'] + "', '" + result['selected'] + "')"
            cursor.execute(query)
        query = "INSERT INTO metadata (id, uri, file, title,  verified) VALUES ('" + unit['id'] + "', '" + unit['uri'] + "', '" + unit['file'] + "', '" + unit['title'] + "', " + str(unit['verified']) + ")"
        cursor.execute(query)
        self.mysql.connection.commit()
        cursor.close()
    def read_from_metadata(self):
        DATA = {}
        cursor = self.mysql.connection.cursor()
        cursor.execute ('''SELECT * FROM metadata''')
        values = cursor.fetchall()
        for value in values:
            value_table = "img" + value[0]
            query = "SELECT * FROM " + value_table
            cursor.execute(query)
            results = cursor.fetchall()
            diaglist = []
            for result in results:
                kvpair = {
                    'id': result[0],
                    'title': result[1],
                    'selected': result[2]
                }
                diaglist.append(kvpair)
            unit = {
                'id': value[0],
                'uri': value[1],
                'file': value[2],
                'title': value[3],
                'results': diaglist,
                'verified': value[4]
            }
            DATA[value[0]] = unit
        cursor.close()
        return DATA
    def update_image(self, request_id, corrected_uri, corrected_title):
        cursor = self.mysql.connection.cursor()
        query = "UPDATE metadata SET uri='" + corrected_uri + "', title='" + corrected_title + "', verified=1 WHERE id=" + request_id
        cursor.execute(query)
        self.mysql.connection.commit()
        cursor.close()
    def delete_from_metadata(self, request_id):
        cursor = self.mysql.connection.cursor()
        query = "DELETE FROM metadata WHERE id=" + request_id
        cursor.execute(query)
        query = "DROP TABLE img" + request_id
        cursor.execute(query)
        self.mysql.connection.commit()
        cursor.close()
