import pandas as pd
import os
import dataset_manager as dataset_manager
import data_preparation as data_prep
import pprint
import classifier
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
# GLOBAL VARIABLES
PATH_SEPARATOR = os.sep
DATASET_PATH = (f"dataset{PATH_SEPARATOR}shortDatasetNEW.csv")

dataset = pd.read_csv(DATASET_PATH)
# dataset_manager.removeUselessCategory(dataset, ["EDUCATION"])
#dataset_manager.createShortDataset(50000)
#pprint.pprint(dataset_manager.countClassValues(dataset), indent=2)

"""# ------INTEGRATE VALUES------

labelIntegrator = "Family & Relationships"
labelToIntegrate = "HOME & LIVING"


datasetIntegrator = pd.read_csv(DATASET_PATH)
datasetToIntegrate = pd.read_csv(f"dataset{PATH_SEPARATOR}finalDataset.csv")
print("PRIMA: " + str(len(datasetToIntegrate[datasetToIntegrate["Class"] == labelToIntegrate])))

dataset_manager.integrateDataFromCSV(datasetToIntegrate, datasetIntegrator, labelToIntegrate, labelIntegrator, 8000)

datasetToIntegrate = pd.read_csv(f"dataset{PATH_SEPARATOR}finalDataset.csv")
print("DOPO: " + str(len(datasetToIntegrate[datasetToIntegrate["Class"] == labelToIntegrate])))


"""


dataset = pd.read_csv(DATASET_PATH)
dataset_manager.splitDataset(dataset)
"""
# ----TRAIN MODEL----
train_dataset = pd.read_csv("dataset"+PATH_SEPARATOR+"train_dataset.csv")
test_dataset = pd.read_csv("dataset"+PATH_SEPARATOR+"test_dataset.csv")

train_docs = data_prep.setupDocs(train_dataset)
test_docs = data_prep.setupDocs(test_dataset)

classifier.trainClassifier(train_docs, test_docs)"""
"""

texts = [] 

with open("./ProvaClassification.txt", 'rb') as file:
            text = file.read().decode(errors='replace')
            texts = text.split("\n")

nbClassiefier, vectorizer = classifier.get_model()
predictionsTest = []
for text in texts:
    prediction = classifier.get_prediction(text, nbClassiefier, vectorizer)
    row = (prediction, text)
    predictionsTest.append(row)

dataframe = pd.DataFrame(predictionsTest, columns=['Class', "Text"])
dataframe.to_csv(f"./predictionTest.csv", encoding='utf-8', index=False)


"""
