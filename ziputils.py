from zipfile import ZipFile, ZIP_DEFLATED
from io import BytesIO

class InMemoryZip(object):
    def __init__(self):
        self.in_memory_zip = BytesIO()
    
    def add_file(self, filename, contents):
        zf = ZipFile(self.in_memory_zip, "a", ZIP_DEFLATED, False)

        zf.writestr(filename, contents)

        for file in zf.filelist:
            file.create_system = 0
        
        return self
    
    def add_image(self, imagepath):
        zf = ZipFile(self.in_memory_zip, "a", ZIP_DEFLATED, False)

        zf.write(imagepath)
        for file in zf.filelist:
            file.create_system = 0

        return self

    def read(self):
        self.in_memory_zip.seek(0)
        return self.in_memory_zip.read()

    def to_byte_stream(self):
        zfb = BytesIO()
        zfb.write(self.read())
        zfb.seek(0)
        return zfb