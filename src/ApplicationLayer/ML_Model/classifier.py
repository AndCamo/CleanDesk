import os
import sys
import json
import random
sys.path.insert(1, f'src{os.sep}ApplicationLayer')
import dataset_manager

def classify(folderPath):
   log = []
   for root, dirs, files in os.walk(folderPath):
      for name in files:
         if(name[0] != "."):
            path = os.path.join(root, name)
            label = random.choice(dataset_manager.LABEL_LIST) 
            fileInfo  = {"fileName" : name, "filePath" : path, "category" : label}
            log.append(fileInfo)
   return json.dumps(log, indent = 4)


