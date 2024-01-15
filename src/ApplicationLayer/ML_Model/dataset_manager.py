import pandas as pd
import os
import random


PATH_SEPARATOR = os.sep
LABEL_DICTIONARY = {1 : "Society & Culture", 2 : "Science & Mathematics", 3 : "Health", 4 : "Education & Reference", 5 : "Computers & Internet", 
            6 : "Sports", 7 : "Business & Finance", 8 : "Entertainment & Music", 9 : "Family & Relationships", 10 : "Politics & Government"}
LABEL_LIST = list(LABEL_DICTIONARY.values())

def createShortDataset(rowsNumber):
   # read the original dataset 
   dataset = pd.read_csv(f"dataset{PATH_SEPARATOR}train.csv")
   shortDataset = []

   # to create a balanced dataset, define the number of rows for each category
   rowsForLabel = rowsNumber // dataset.iloc[:, 0].nunique() # integer division
   # Select unique values from the label column
   uniqueLabel = dataset.iloc[:, 0].unique()

   # inserts the same number of rows of the original dataset for each label in a new list.
   for label in uniqueLabel:
      counter = 1
      for index, row in dataset.iterrows():
         tmpRow = [row[0], row[1], row[2], row[3]]
         if tmpRow[0] == label:
            shortDataset.append(tmpRow)
            if counter >= rowsForLabel:
               break
            else:
               counter += 1
      
      random.shuffle(shortDataset)
      # creates the dataframe and saves the dataset in csv format
      dataframe = pd.DataFrame(shortDataset, columns=['Class', 'Title', 'Body', 'Answer'])
      dataframe.to_csv(f"dataset{PATH_SEPARATOR}shortDataset.csv", encoding='utf-8', index=False, columns=['Class', 'Title', 'Body', 'Answer'])


def countTargetByNumbClass(dataset):
   # creates the data structure to contain the counter
   tmp_dict = {}

   # initializes the counters for each label
   for item in LABEL_LIST:
      tmp_dict.update({item : 0})

   # counts the label in the dataset and update the dictionary
   for index, row in dataset.iterrows():
      tmp_target = LABEL_DICTIONARY[row[0]]
      tmp_dict[tmp_target] += 1
   return tmp_dict


def categorizeTarget(dataset):
   # Seach the int class and replace it with the String
   for index, row in dataset.iterrows():
      tmp_target = LABEL_DICTIONARY[row[0]]
      dataset.iloc[index,0] = tmp_target
   
   #Update e save the new dataset
   dataset.to_csv(f"dataset{PATH_SEPARATOR}dataset.csv", encoding='utf-8', index=False, columns=['Class', 'Title', 'Body', 'Answer'])


def mergeTextColumns(dataset):
   # Merge the columns "Question Title", "Question Body" and "Answer" in one new column named "Text"
   dataset["Text"] = dataset['Title'].astype(str) + " " + dataset['Body'].astype(str) + " " + dataset['Answer'].astype(str)
   
   # Delede the older separate columns
   dataset.drop(dataset.iloc[:, 1:4], axis=1, inplace=True)
   
   # Update e save the new dataset
   dataset.to_csv(f"dataset{PATH_SEPARATOR}dataset.csv", encoding='utf-8', index=False)