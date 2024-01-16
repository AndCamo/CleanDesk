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
DATASET_PATH = (f"dataset{PATH_SEPARATOR}finalDataset.csv")



"""

## CREATE SHORT DATASET ##
dataset_manager.createShortDataset(10000)
dataset = pd.read_csv(DATASET_PATH)
out = dataset_manager.countTargetByNumbClass(dataset)
for item in out:
    print(str(item)+": "+str(out[item]))
"""

"""dataset = pd.read_csv(DATASET_PATH)
#dataset_manager.splitDataset(dataset)

#dataset_manager.categorizeTarget(dataset)
#dataset_manager.mergeTextColumns(dataset)

docs = data_prep.setupDocs(dataset)

data_prep.printAllFrequencyDist(docs)

dataset_manager.splitDataset(dataset)"""




"""
----TRAIN MODEL----
train_dataset = pd.read_csv("dataset"+PATH_SEPARATOR+"train_dataset.csv")
test_dataset = pd.read_csv("dataset"+PATH_SEPARATOR+"test_dataset.csv")

train_docs = data_prep.setupDocs(train_dataset)
test_docs = data_prep.setupDocs(test_dataset)

classifier.trainClassifier(train_docs, test_docs)
"""


"""text = "The first new version of cult video game Prince of Persia in 14 years has been released, called The Lost Crown, and it is the first edition in the series to be fully voiced in Farsi."

nbClassiefier, vectorizer = classifier.get_model()
prediction = classifier.get_prediction(text, nbClassiefier, vectorizer)
print(prediction)"""

dataset = pd.read_csv(DATASET_PATH)

#classifier.attachClasses(dataset,["PARENTING", "PARENTS"],"PARENTING")

dataset_manager.removeUselessCategory(dataset,["HEALTHY LIVING", "QUEER VOICES", "COMEDY", "BLACK VOICES", "PARENTS", "THE WORLDPOST", "WEDDINGS", "WOMEN", "CRIME", "IMPACT", "DIVORCE", "WORLD NEWS", "MEDIA", "WEIRD NEWS", "GREEN", "WORLDPOST", "RELIGION", "STYLE", "TASTE", "MONEY", "ARTS", "ENVIRONMENT", "FIFTY", "GOOD NEWS", "U.S. NEWS", "COLLEGE", "LATINO VOICES", "CULTURE & ARTS"])



