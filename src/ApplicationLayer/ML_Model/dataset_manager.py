import pandas as pd
import os
import random
import re
import nltk

PATH_SEPARATOR = os.sep
LABEL_DICTIONARY = {1 : "Society & Culture", 2 : "Science & Mathematics", 3 : "Health", 4 : "Education & Reference", 5 : "Computers & Internet", 
            6 : "Sports", 7 : "Business & Finance", 8 : "Entertainment & Music", 9 : "Family & Relationships", 10 : "Politics & Government"}
LABEL_LIST = list(LABEL_DICTIONARY.values())

def createShortYahooDataset(rowsNumber):
   # read the original dataset 
   dataset = pd.read_csv(f"dataset{PATH_SEPARATOR}yahoo_ataset/train.csv")
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


def createShortDataset(rowsNumber):
   # read the original dataset 
   dataset = pd.read_csv(f"dataset{PATH_SEPARATOR}finalDataset.csv")
   shortDataset = []

   # to create a balanced dataset, define the number of rows for each category
   rowsForLabel = rowsNumber // dataset.iloc[:, 0].nunique() # integer division
   # Select unique values from the label column
   uniqueLabel = dataset.iloc[:, 0].unique()

   # inserts the same number of rows of the original dataset for each label in a new list.
   for label in uniqueLabel:
      counter = 1
      for index, row in dataset.iterrows():
         tmpRow = [row[0], row[1]]
         if tmpRow[0] == label:
            shortDataset.append(tmpRow)
            if counter >= rowsForLabel:
               break
            else:
               counter += 1
      
      random.shuffle(shortDataset)
      # creates the dataframe and saves the dataset in csv format
      dataframe = pd.DataFrame(shortDataset, columns=['Class', 'Text'])
      dataframe.to_csv(f"dataset{PATH_SEPARATOR}shortDatasetNEW.csv", encoding='utf-8', index=False, columns=['Class', 'Text'])


def countClassValues(dataset):
   # creates the data structure to contain the counter
   tmp_dict = {}

   labels = list(dataset.iloc[:, 0].unique())

   # initializes the counters for each label
   for item in labels:
      tmp_dict.update({item : 0})

   # counts the label in the dataset and update the dictionary
   for index, row in dataset.iterrows():
      tmp_dict[row[0]] += 1

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

def splitDataset(dataset):
   tmp_train = []
   tmp_test = []

   dataset = dataset.sample(frac = 1)
   pivot = int(.80 * len(dataset))

   for i in range (0, pivot):
      tmp_row = [dataset.iloc[i,0], dataset.iloc[i,1]]
      tmp_train.append(tmp_row)
   
   for i in range(pivot,len(dataset)):
      tmp_row = [dataset.iloc[i,0], dataset.iloc[i,1]]
      tmp_test.append(tmp_row)
   
   train_dataframe = pd.DataFrame(tmp_train, columns=['Class', "Text"])
   test_dataframe = pd.DataFrame(tmp_test, columns=['Class', "Text"])

   train_dataframe.to_csv(f"dataset{PATH_SEPARATOR}train_dataset.csv", encoding='utf-8', index=False)
   test_dataframe.to_csv(f"dataset{PATH_SEPARATOR}test_dataset.csv", encoding='utf-8', index=False)


   #Convert the News Dataset from JSON to CSV format
def convertDataset():
   #read the original JSON Dataset
   dataset = pd.read_json(f"dataset{PATH_SEPARATOR}News_Category_Dataset_v3.json", lines = True)

   # create the column text
   dataset["Text"] = dataset['headline'].astype(str) + " " + dataset['short_description'].astype(str)

   # drop the older columns
   dataset.drop(columns=["link", "headline", "short_description", "date", "authors"], axis=1, inplace=True)
   dataset.rename(columns={'category': 'Class'}, inplace=True)
   # save the new dataset in csv format
   dataset.to_csv(f"dataset{PATH_SEPARATOR}News_Category_Dataset.csv", index=False)

def removeUselessCategory(dataset,array):
   for label in array:
      dataset.drop(dataset[dataset["Class"] == label].index, inplace = True)
   dataset.to_csv(f"dataset{PATH_SEPARATOR}finalDataset_v5.csv", encoding='utf-8', index=False)

def attachClasses(dataset, array, label):
   attachedClass = []
   for index, row in dataset.iterrows():
      if row[0] in array:
         tmp_row = [label, row[1]]
         attachedClass.append(tmp_row)
      else:
         tmp_row = [row[0], row[1]]
         attachedClass.append(tmp_row)
   
   dataframe = pd.DataFrame(attachedClass, columns=['Class', 'Text'])
   dataframe.to_csv(f"dataset{PATH_SEPARATOR}finalDataset.csv", encoding='utf-8', index=False,columns=['Class', 'Text'])

def oversampleData(dataset, labels, amount):
   for label in labels:
      tmp_data = dataset[dataset["Class"] == label]
      duplicateRows = tmp_data.sample(n=amount, ignore_index=False, replace=True)

      for index, row in duplicateRows.iterrows():
         newRow = {"Class": row[0], "Text": row[1]}
         dataset = dataset.append(newRow, ignore_index = True)
   
   dataset.to_csv(f"dataset{PATH_SEPARATOR}oversapledDataset.csv", encoding='utf-8', index=False,columns=['Class', 'Text'])

def integrateDataFromText(dataset, folderName, label):
   dir = f"/Users/andrea/Desktop/AndCamo/Coding/Python/TextClassification [TEST]/dataset/big_dataset/{folderName}"
   for filename in os.listdir(dir):
      if not filename.startswith("."):
         full_file_path = '%s/%s' % (dir, filename)  
         with open(full_file_path, 'rb') as file:
            text = file.read().decode(errors='replace')
            textTokens = text.split(" ")
         counter = 1
         tmpTokens = []
         for token in textTokens:
            tmpTokens.append(token)
            if counter % 40 == 0:
               text = " ".join(tmpTokens)
               newRow = {"Class": label, "Text": text}
               dataset = dataset.append(newRow, ignore_index = True)
               tmpTokens = []
            counter += 1
               
   
   dataset.to_csv(f"dataset{PATH_SEPARATOR}finalDataset.csv", encoding='utf-8', index=False,columns=['Class', 'Text'])

def featureScaling(dataset):
   newDataset = []
   for index, row in dataset.iterrows():
      text = row[1]
      textTokens = text.split(" ")
      # Tokenize the input text
      tokens = text.split(" ")

      # Group tokens into chunks of 40
      token_groups = [tokens[i:i+40] for i in range(0, len(tokens), 40)]
      for group in token_groups:
         text = " ".join(group)
         newRow = [row[0],text]
         newDataset.append(newRow)
      
   dataframe = pd.DataFrame(newDataset, columns=['Class', 'Text'])
   dataframe.to_csv(f"dataset{PATH_SEPARATOR}bbc-NEW.csv", encoding='utf-8', index=False, columns=['Class', 'Text'])


def integrateDataFromCSV(datasetToIntegrate, datasetIntegrator, labelToIntegrate, labelIntegrator, number):
   counter = 0
   for index, row in datasetIntegrator.iterrows():
      if row[0] == labelIntegrator:
         text = row[1]
         newRow = {"Class": labelToIntegrate, "Text": text}
         datasetToIntegrate = datasetToIntegrate.append(newRow, ignore_index = True)
         counter += 1
      
      if(counter >= number):
         break

   datasetToIntegrate.to_csv(f"dataset{PATH_SEPARATOR}finalDataset.csv", encoding='utf-8', index=False,columns=['Class', 'Text'])

def createRandomDataset(dataset, rowsNumber):
   rowsForLabel = rowsNumber // dataset.iloc[:, 0].nunique()
   uniqueLabel = dataset.iloc[:, 0].unique()
   newDataset = []

   for label in uniqueLabel:
      tmp_data = dataset[dataset["Class"] == label]
      if len(tmp_data) < rowsForLabel:
         rows = len(tmp_data)
      else:
         rows = rowsForLabel
      tmp_data = tmp_data.sample(n=rows, ignore_index=False)
      for index, row in tmp_data.iterrows():
         tmp_row = [row[0], row[1]]
         newDataset.append(tmp_row)

   random.shuffle(newDataset)
   dataframe = pd.DataFrame(newDataset, columns=['Class', 'Text'])
   dataframe.to_csv(f"dataset{PATH_SEPARATOR}shortRandomDataset.csv", encoding='utf-8', index=False)


