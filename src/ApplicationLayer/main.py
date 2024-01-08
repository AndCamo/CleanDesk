import pandas as pd
import os
import dataset_manager
# GLOBAL VARIABLES
PATH_SEPARATOR = os.sep

#dataset_manager.createShortDataset(3000)
"""out = dataset_manager.countTargetByClass()
for item in out:
    print(str(item)+": "+str(out[item]))"""

"""dataset = pd.read_csv(f"dataset{PATH_SEPARATOR}tmp_dataset.csv")
print(dataset.info())"""

dataset_manager.categorizeTarget()