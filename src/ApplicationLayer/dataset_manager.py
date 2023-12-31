import pandas as pd
import os

PATH_SEPARATOR = os.sep
LABEL_DICTIONARY = {1 : "Society & Culture", 2 : "Science & Mathematics", 3 : "Health", 4 : "Education & Reference", 5 : "Computers & Internet", 
            6 : "Sports", 7 : "Business & Finance", 8 : "Entertainment & Music", 9 : "Family & Relationships", 10 : "Politics & Government"}
LABEL_LIST = list(LABEL_DICTIONARY.values())


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


def countTargetByClass(): 
   tmp_dict = {}
   for item in LABEL_LIST:
      tmp_dict.update({item : 0})
   dataset = pd.read_csv(f"dataset{PATH_SEPARATOR}tmp_dataset.csv")
   for index, row in dataset.iterrows():
      tmp_target = LABEL_DICTIONARY[row[0]]
      tmp_dict[tmp_target] += 1
   return tmp_dict


def categorizeTarget():
   # Read the dataset
   dataset = pd.read_csv(f"dataset{PATH_SEPARATOR}tmp_dataset.csv")

   # Seach the int class and replace it with the String
   for index, row in dataset.iterrows():
      tmp_target = LABEL_DICTIONARY[row[0]]
      dataset.iloc[index,0] = tmp_target
   
   #Update e save the new dataset
   dataset.to_csv(f"dataset{PATH_SEPARATOR}tmp_dataset.csv", encoding='utf-8', index=False, columns=['Class', 'Title', 'Body', 'Answer'])


         


def mergeTextColumns():
   # Read the dataset
   dataset = pd.read_csv(f"dataset{PATH_SEPARATOR}tmp_dataset.csv")

   # Merge the columns "Question Title", "Question Body" and "Answer" in one new column named "Text"
   dataset["Text"] = dataset.iloc[:, 1] + " " + dataset.iloc[:, 2] + " " + dataset.iloc[:, 3]

   # Delede the older separate columns
   dataset.drop(dataset.iloc[:, 1:4], axis=1, inplace=True)
   
   #Update e save the new dataset
   dataset.to_csv(f"dataset{PATH_SEPARATOR}tmp_dataset.csv", encoding='utf-8', index=False)