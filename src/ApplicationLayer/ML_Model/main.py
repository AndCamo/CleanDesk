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
DATASET_PATH = (f"dataset{PATH_SEPARATOR}finalDataset_v5.csv")


<<<<<<< HEAD
=======
dataset = pd.read_csv(DATASET_PATH)

print(dataset["Class"].nunique)

>>>>>>> 251521b793fd0a3abd4d6912835fb7dd2f1eab3d
#dataset_manager.removeUselessCategory(dataset, ["WELLNESS"])


"""dataset = pd.read_csv(DATASET_PATH)
dataset_manager.splitDataset(dataset)"""


"""count = dataset_manager.countClassValues(dataset)
print(list(dataset["Class"].unique()))
for item in count:
   print(f"{item}\t{count[item]}")"""

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
 ----TRAIN MODEL----
train_dataset = pd.read_csv("dataset"+PATH_SEPARATOR+"train_dataset.csv")
test_dataset = pd.read_csv("dataset"+PATH_SEPARATOR+"test_dataset.csv")

print(list(train_dataset["Class"].unique()))

train_docs = data_prep.setupDocs(train_dataset)
test_docs = data_prep.setupDocs(test_dataset)

classifier.trainClassifier(train_docs, test_docs)"""


<<<<<<< HEAD

"""texts = [] 
=======
"""
texts = [] 
>>>>>>> 251521b793fd0a3abd4d6912835fb7dd2f1eab3d

with open("./ProvaClassification.txt", 'rb') as file:
            text = file.read().decode(errors='replace')
            texts = text.split("\n")

texts.append("Vito is a boy, a bit of a jerk, studying economics.")
nbClassiefier, vectorizer = classifier.get_model()
predictionsTest = []
for text in texts:
    prediction = classifier.get_prediction(text, nbClassiefier, vectorizer)
    row = (prediction, text)
    predictionsTest.append(row)

dataframe = pd.DataFrame(predictionsTest, columns=['Class', "Text"])
dataframe.to_csv(f"./predictionTest.csv", encoding='utf-8', index=False)"""
