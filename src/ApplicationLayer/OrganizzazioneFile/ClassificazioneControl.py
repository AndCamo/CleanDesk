import os
import sys
import json
import docx

from PyPDF2 import PdfReader
PATH_SEPARATOR = os.sep
"""sys.path.insert(1, 'src'+PATH_SEPARATOR+'ApplicationLayer'+PATH_SEPARATOR+'ML_Model')
import ML_Model.classifier as classifier"""
ml_model_path = os.path.abspath(os.path.join(os.getcwd(), 'src', 'ApplicationLayer', 'ML_Model'))
sys.path.append(ml_model_path)
import classifier

ACCEPTED_CONTENT_EXTENSION = ["txt","docx","pdf","pages"]
MEDIA_EXTENSION = {
    "Images" : ["jpeg", "jpg", "png", "gif", "tiff", "tif", "bmp", "svg", "raw", "webp", "ico", "jpe"],
    "Video" : ["mp4", "wmv", "mov", "flv", "webm", "3gp", "mpeg", "mpg", "vob", "ts", "asf", "rm", "swf", "ogv", "m4v", "m2ts", "webm", "flv"],
    "Music" : ["mp3", "wav", "aac", "flac", "ogg", "wma", "m4a", "aiff", "amr", "ape", "au", "midi", "mp2", "ac3", "ra", "pcm", "dts", "alac", "mpga", "mka"]
    }


def readFile(path, name):
    splitted = []
    splitted = name.split(".")
    fileExtension = splitted[len(splitted) - 1]
    if fileExtension == "docx":
        fullText = splitted[0]+" "
        doc = docx.Document(path)
        for para in doc.paragraphs:
            fullText += para.text

    elif fileExtension == "txt":
        fullText = splitted[0]+" "
        with open(path,"rb") as file:
            fullText = file.read()

    elif fileExtension == "pdf":
        fullText = splitted[0] + " "
        reader = PdfReader(path)
        page = reader.pages[0] 
        fullText = page.extract_text()
    
    return fullText


def classifyFiles(folderPath, filters):
   # load the the Classifier and Vectorizer for the Machine Learning Module

   nbClassiefier, vectorizer = classifier.get_model()
   log = []
   # Initializes the final path with that of the source folder (will be updated with more info)
   finalPath = folderPath
   # walk all the files in the direcotory
   for root, dirs, files in os.walk(folderPath):
      for name in files:
         # Excludes hidden files
         if(name[0] != "."):
            # Excludes the files in the blacklist
            if path in filters["blacklist"]:
                continue
            else: # Files that are not blacklisted
                tmp_name = name.split(".")
                fileExtension = tmp_name[len(tmp_name) - 1].str.lower()

                if fileExtension in ACCEPTED_CONTENT_EXTENSION and filters["content"] == True:
                    print(f"Content considered for {name}.{fileExtension}")
                    # read the content of the file
                    fileContent = readFile(path,name)
                    text = name + " " + fileContent
                else:
                    print(f"Content NOT considered for {name}.{fileExtension}")
                    text = name

                label, probability = classifier.get_prediction(text, nbClassiefier, vectorizer)
                # Create the label "Others" for files with uncertain classification
                if probability < 0.4:
                    label = "Others"

                fileInfo  = {"fileName" : name, "filePath" : path, "category" : label}
                log.append(fileInfo)
   return json.dumps(log, indent = 4)

folder = "C:\\Users\\genny\\Desktop\\Cartella_Prova1"
print(classifyFiles(folder))