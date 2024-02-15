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
DATASET_PATH = (f"dataset{PATH_SEPARATOR}train_dataset_balanced.csv")

#dataset = pd.read_csv("/Users/andrea/Desktop/UNIVERSITÀ/CleanDesk/dataset/train_dataset_balanced.csv")

#count = dataset_manager.countClassValues(dataset)

"""for item in count:
   print(f"{item}\t{count[item]}")"""
"""

dataset = dataset_manager.createRandomDataset(dataset, 130000)

dataset.to_csv(f"dataset{PATH_SEPARATOR}train_dataset_balanced.csv", encoding='utf-8', index=False)

dataset = dataset_manager.oversampleData(dataset, ["SPORTS", "TRAVEL", "FOOD & DRINK", "PARENTING", "TECH"], 9000)
dataset = dataset_manager.oversampleData(dataset, ["EDUCATION", "SCIENCE"], 14000)
dataset = dataset_manager.oversampleData(dataset, ["HOME & LIVING", "ARTS & CULTURE"], 12000)
dataset = dataset_manager.oversampleData(dataset, ["STYLE & BEAUTY", "BUSINESS"], 6000)


dataset.to_csv(f"dataset{PATH_SEPARATOR}train_dataset_oversampled.csv", encoding='utf-8', index=False)

"""

#print(dataset["Class"].nunique())




"""dataset = pd.read_csv(DATASET_PATH)
dataset_manager.splitDataset(dataset)"""


#dataset_manager.createShortDataset(50000)


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

"""
# ----TRAIN MODEL----
train_dataset = pd.read_csv("/Users/andrea/Desktop/UNIVERSITÀ/CleanDesk/dataset/train_dataset_balanced.csv")
train_dataset.dropna(axis=0, how="any", subset=None, inplace=True)
test_dataset = pd.read_csv("/Users/andrea/Desktop/UNIVERSITÀ/CleanDesk/dataset/test_dataset.csv")
test_dataset.dropna(axis=0, how="any", subset=None, inplace=True)

print(list(train_dataset["Class"].unique()))

train_docs = data_prep.setupDocs(train_dataset)
test_docs = data_prep.setupDocs(test_dataset)

classifier.trainClassifier(train_docs, test_docs)

"""####################################PRINT-FREQUENCY-DIST#########################à
"""docs = data_prep.setupDocs(dataset)
data_prep.printFrequencyDist(docs)"""


#---------------------------EVALUATE MODEL------------------------#

train_dataset = pd.read_csv(DATASET_PATH)
train_docs = data_prep.setupDocs(train_dataset)
x_test, y_test = classifier.getSplits(train_docs)
title = "Train"
classificatore, vectorizer = classifier.get_model();
classifier.evaluateClassifier(title,classificatore,vectorizer,x_test,y_test)