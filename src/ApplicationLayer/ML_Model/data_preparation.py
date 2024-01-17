import pandas as pd
import nltk
from collections import defaultdict
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, SnowballStemmer
import string

STOP_WORDS = set(stopwords.words('english'))
STOP_WORDS.update(['said', 'mr', 'get', 'like', 'would', "nan", "know'", "know", "one", "dont", "br", "n't", "s", "’", "”", "“", ])

def tokenize(text):
   tokens = nltk.word_tokenize(text)
   tokens = [token for token in tokens if not token in STOP_WORDS]

   return tokens


def cleanText(text):
   mapping_table = str.maketrans({'\n': '', '\t': ''})

   text = text.lower()
   text = text.translate(str.maketrans('', '', string.punctuation))
   text = text.translate(mapping_table)

   text = stemmer(text)

   return text

def stemmer(text):
   word_tokenize = tokenize(text)
   snowStemmer = SnowballStemmer("english")
   textStemmed = " ".join([snowStemmer.stem(words) for words in word_tokenize])

   return textStemmed

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


def setUpDocsNoClean(dataset):
   docs = [] #(label, text)
   for index, row in dataset.iterrows():
      text = row[1]
      label = row[0]
      doc = (label, text.strip())

      docs.append(doc)

   return docs
