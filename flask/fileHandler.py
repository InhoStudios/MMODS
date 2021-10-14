from flask import url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = url_for('static') + "/img"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'pdf', 'tiff', 'gif'}

def getUploadFolder():
    return UPLOAD_FOLDER;