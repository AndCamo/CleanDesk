import pandas as pd
import os
import dataset_manager as dataset_manager
import data_preparation as data_prep
import pprint
# GLOBAL VARIABLES
PATH_SEPARATOR = os.sep
DATASET_PATH = (f"dataset{PATH_SEPARATOR}shortDataset.csv")



"""

## CREATE SHORT DATASET ##
dataset_manager.createShortDataset(10000)
dataset = pd.read_csv(DATASET_PATH)
out = dataset_manager.countTargetByNumbClass(dataset)
for item in out:
    print(str(item)+": "+str(out[item]))
"""


dataset = pd.read_csv(DATASET_PATH)

dataset_manager.categorizeTarget(dataset)
dataset_manager.mergeTextColumns(dataset)

# docs = data_prep.setupDocs(dataset)
# data_prep.printFrequencyDist(docs)


