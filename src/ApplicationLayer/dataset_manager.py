import pandas as pd
import os

PATH_SEPARATOR = os.sep

def createShortDataset(rowsNumber):
   dataset = pd.read_csv(f"dataset{PATH_SEPARATOR}train.csv")
   shortDataset = []
   for index, row in dataset.iterrows():
      tmpRow = [row[0], row[1], row[2], row[3]]
      shortDataset.append(tmpRow)
      if index >= rowsNumber:
         break

      dataframe = pd.DataFrame(shortDataset, columns=['Class', 'Title', 'Body', 'Answer'])
      dataframe.to_csv(f"dataset{PATH_SEPARATOR}tmp_dataset.csv", encoding='utf-8', index=False, columns=['Class', 'Title', 'Body', 'Answer'])
