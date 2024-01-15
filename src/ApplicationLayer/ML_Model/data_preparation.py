import pandas as pd
import nltk
from collections import defaultdict
from nltk.corpus import stopwords
import string

STOP_WORDS = set(stopwords.words('english'))
STOP_WORDS.update(['said', 'mr', 'get', 'like', 'would', "nan", "know'", "know", "one", "dont", "n't", "'s", "br"])

def tokenize(text):
   tokens = nltk.word_tokenize(text)
   tokens = [token for token in tokens if not token in STOP_WORDS]

   return tokens


def cleanText(text):
   text = text.lower()
   text = text.translate(str.maketrans('', '', string.punctuation))

   return text

def setupDocs(dataset):
   docs = [] #(label, text)
   for index, row in dataset.iterrows():
      text = cleanText(row[1])
      label = row[0]
      doc = (label, text.strip())

      docs.append(doc)

   return docs

def printFrequencyDist(docs):

   #create the data structure to contain the frequency
   tokens = defaultdict(list)

   #list of all the words for each category
   for doc in docs:
      docLabel = doc[0]
      docText = doc[1]

      docTokens = tokenize(docText)
      
      #update the dictionary with the frequency of the tokens in the class
      tokens[docLabel].extend(docTokens)

   for categoryLabel, categoryTokens in tokens.items():
      print(categoryLabel)
      fd = nltk.FreqDist(categoryTokens)
      print(fd.most_common(20))
      print(" ")
   
   
def printAllFrequencyDist(docs):
   tokens = defaultdict(list)

   for doc in docs:
      docText = doc[1]

      docTokens = tokenize(docText)
      tokens["Word"].extend(docTokens)

   for categoryLabel, categoryTokens  in tokens.items():
      print(categoryLabel)
      fd = nltk.FreqDist(categoryTokens)
      print(fd.most_common(40))
      print("\n")