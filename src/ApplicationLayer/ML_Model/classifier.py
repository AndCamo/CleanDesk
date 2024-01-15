import os
import sys
import json
import random
import pprint
"""sys.path.insert(1, f'src{os.sep}ApplicationLayer')
import ApplicationLayer.ML_Model.dataset_manager as dataset_manager"""
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn import metrics
import pickle

LABEL_DICTIONARY = {1 : "Society & Culture", 2 : "Science & Mathematics", 3 : "Health", 4 : "Education & Reference", 5 : "Computers & Internet", 
            6 : "Sports", 7 : "Business & Finance", 8 : "Entertainment & Music", 9 : "Family & Relationships", 10 : "Politics & Government"}
LABEL_LIST = list(LABEL_DICTIONARY.values())

"""
def fakeClassify(folderPath):
   log = []
   for root, dirs, files in os.walk(folderPath):
      for name in files:
         if(name[0] != "."):
            path = os.path.join(root, name)
            label = random.choice(dataset_manager.LABEL_LIST) 
            fileInfo  = {"fileName" : name, "filePath" : path, "category" : label}
            log.append(fileInfo)
   return json.dumps(log, indent = 4)
"""

def getSplits(docs):
   random.shuffle(docs)

   x_list = [] # list of text
   y_list = [] # list of corresponding labels

   for i in range(0, len(docs)):
      x_list.append(docs[i][1])
      y_list.append(docs[i][0])
   
   return x_list, y_list


def evaluateClassifier(title, classifier, vectorizer, x_list, y_list):
    x_test_tfidf = vectorizer.transform(x_list)
    y_pred = classifier.predict(x_test_tfidf)

    precision = metrics.precision_score(y_list, y_pred,labels=LABEL_LIST, average=None)
    recall = metrics.recall_score(y_list, y_pred,labels=LABEL_LIST,  average=None)
    f1 = metrics.f1_score(y_list, y_pred, labels=LABEL_LIST,  average=None)

    precision_dic = createDic(precision.tolist())
    recall_dic = createDic(recall.tolist())
    f1_dic = createDic(f1.tolist())

    print("--------------PRECISION--------------\n")
    pprint.pprint(precision_dic,indent=2)
    print("\n--------------RECALL--------------\n")
    pprint.pprint(recall_dic,indent=2)
    print("\n--------------F1_SCORE--------------\n")
    pprint.pprint(f1_dic,indent=2)

def createDic(lista):
   dictionary = {}
   i = 0
   for label in LABEL_LIST:
      dictionary.update({label: lista[i]})
      i = i+1
   
   return dictionary
   

def trainClassifier(train_docs, test_docs):
   x_train, y_train = getSplits(train_docs)
   x_test, y_test = getSplits(test_docs)

   vectorizer = CountVectorizer(stop_words='english', ngram_range=(1,3), min_df=3, analyzer = 'word')
   
   # create doc-term matrix
   dtm = vectorizer.fit_transform(x_train)

   # Train the Naive Bayes Classifier
   naiveBayesClassifier = MultinomialNB().fit(dtm, y_train)

   print("Naive Bayes\tTRAIN\t\n")
   evaluateClassifier("Naive Bayes\tTRAIN\t", naiveBayesClassifier, vectorizer, x_train, y_train)

   print("Naive Bayes\tTEST\t\n")
   evaluateClassifier("Naive Bayes\tTEST\t", naiveBayesClassifier, vectorizer, x_test, y_test)

   # store the classifier
   clf_filename = 'naive_bayes_classiefier.pkl'
   pickle.dump(naiveBayesClassifier, open(clf_filename, 'wb'))

   # also sotre the vectorizer so we can transform new data
   vec_filename = 'count_vectorizer.pkl'
   pickle.dump(vectorizer, open(vec_filename, 'wb'))