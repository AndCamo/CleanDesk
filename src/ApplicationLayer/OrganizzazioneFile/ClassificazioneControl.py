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

ACCEPTED_EXTENSION = ["txt","docx","pdf","pages"]

def readFile(path, name):
    splitted = []
    splitted = name.split(".")
    fileExtension = splitted[len(splitted) - 1]
    print(f"ESTENSIONE FILE: {fileExtension}")
    if fileExtension == "docx":
        fullText = " "
        doc = docx.Document(path)
        for para in doc.paragraphs:
            fullText += para.text

    elif fileExtension == "txt":
        fullText = " "
        with open(path,"rb") as file:
            fullText = file.read()

    elif fileExtension == "pdf":
        fullText = " "
        reader = PdfReader(path)
        page = reader.pages[0] 
        fullText = page.extract_text()
    
    return fullText


def classifyFiles(folderPath):
   nbClassiefier, vectorizer = classifier.get_model()
   log = []
   for root, dirs, files in os.walk(folderPath):
      for name in files:
         if(name[0] != "."):
            path = os.path.join(root, name)
            text = readFile(path,name)
            print("\n"+path+"\n")
            print(text)
            label, probability = classifier.get_prediction(text, nbClassiefier, vectorizer)
            print(f"{name} probability: {probability}")
            fileInfo  = {"fileName" : name, "filePath" : path, "category" : label}
            log.append(fileInfo)
   return json.dumps(log, indent = 4)


folder = "/Users/andrea/Desktop/Cartella_Prova1"
print(classifyFiles(folder))