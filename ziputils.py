from zipfile import ZipFile, ZIP_DEFLATED
from io import BytesIO

class InMemoryZip(object):
    def __init__(self):
        """
        Create an InMemoryZip Object
        """
        self.in_memory_zip = BytesIO()
    
    def add_file(self, filename, contents):
        """
        Adds an ephemeral file to the zip archive.

        Parameters
        -----
        filename: str
            A string corresponding to the name of the file in the zip archive
        contents: str
            A string that holds all the contents to be written to the file
        """
        zf = ZipFile(self.in_memory_zip, "a", ZIP_DEFLATED, False)

        zf.writestr(filename, contents)

        for file in zf.filelist:
            file.create_system = 0
        
        return self
    
    def add_image(self, imagepath):
        """
        Adds an image by filepath to the zip archive.

        Parameters
        -----
        imagepath: str
            The path to the image to be written into the zip archive.
        """
        zf = ZipFile(self.in_memory_zip, "a", ZIP_DEFLATED, False)

        zf.write(imagepath)
        for file in zf.filelist:
            file.create_system = 0

        return self

    def read(self):
        """
        Reads the data from the zip archive.

        Returns
        -----
        in_memory_zip.read(): BytesIO()
            Representation of the zip archive as a stream of bytes
        """
        self.in_memory_zip.seek(0)
        return self.in_memory_zip.read()

    def to_byte_stream(self):
        """
        Converts zip archive to stream of bytes to be sent to users as a file.

        Returns:
        zfb: BytesIO()
            A BytesIO representation of the zip file.
        """
        zfb = BytesIO()
        zfb.write(self.read())
        zfb.seek(0)
        return zfb