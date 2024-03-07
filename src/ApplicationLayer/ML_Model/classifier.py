import os
import pandas as pd
import sys
import json
import random
import pprint
import numpy as np
"""sys.path.insert(1, f'src{os.sep}ApplicationLayer')
import ApplicationLayer.ML_Model.dataset_manager as dataset_manager"""
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn import metrics
import pickle
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt

PATH_SEPARATOR = os.sep

LABEL_DICTIONARY = {1 : "Society & Culture", 2 : "Science & Mathematics", 3 : "Health", 4 : "Education & Reference", 5 : "Computers & Internet", 
            6 : "Sports", 7 : "Business & Finance", 8 : "Entertainment & Music", 9 : "Family & Relationships", 10 : "Politics & Government"}
#LABEL_LIST = list(LABEL_DICTIONARY.values())
LABEL_LIST = ['STYLE & BEAUTY', 'PARENTING', 'HOME & LIVING', 'BUSINESS', 'SCIENCE', 'POLITICS', 'ENTERTAINMENT', 'EDUCATION', 'FOOD & DRINK', 'TECH', 'ARTS & CULTURE', 'TRAVEL', 'SPORTS']


def getSplits(docs):
   random.shuffle(docs)

   x_list = [] # list of text
   y_list = [] # list of corresponding labels

   for i in range(0, len(docs)):
      x_list.append(docs[i][1])
      y_list.append(docs[i][0])
   
   return x_list, y_list


def evaluateClassifierWeighted(title, classifier, vectorizer, x_list, y_list):
    x_test_tfidf = vectorizer.transform(x_list)
    y_pred = classifier.predict(x_test_tfidf)

    precision = metrics.precision_score(y_list, y_pred, average="micro")
    recall = metrics.recall_score(y_list, y_pred, average="micro")
    f1 = metrics.f1_score(y_list, y_pred,  average="micro")

    print(title)
    print("--------------PRECISION--------------")
    print(precision)
    print("\n--------------RECALL--------------")
    print(recall)
    print("\n--------------F1_SCORE--------------")
    print(f1)

def evaluateClassifier(title, classifier, vectorizer, x_list, y_list):
    x_test_tfidf = vectorizer.transform(x_list)
    y_pred = classifier.predict(x_test_tfidf)

    plotConfusionMatrix(y_list,y_pred)
    
    precision = metrics.precision_score(y_list, y_pred,labels=LABEL_LIST, average=None)
    recall = metrics.recall_score(y_list, y_pred,labels=LABEL_LIST,  average=None)
    f1 = metrics.f1_score(y_list, y_pred, labels=LABEL_LIST,  average=None)

    precision_dic = createDic(precision.tolist())
    recall_dic = createDic(recall.tolist())
    f1_dic = createDic(f1.tolist())


    print(title)
    print("--------------PRECISION--------------\n")
    for item in precision_dic:
       print(f"- {item}: {precision_dic[item]}")
    print("\n--------------RECALL--------------\n")
    for item in recall_dic:
       print(f"- {item}: {recall_dic[item]}")
    print("\n--------------F1_SCORE--------------\n")
    for item in f1_dic:
       print(f"- {item}: {f1_dic[item]}")

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


   evaluateClassifierWeighted("Naive Bayes\tTRAIN\t\n", naiveBayesClassifier, vectorizer, x_train, y_train)
   evaluateClassifierWeighted("Naive Bayes\tTEST\t\n", naiveBayesClassifier, vectorizer, x_test, y_test)

   evaluateClassifier("Naive Bayes\tTRAIN\t\n", naiveBayesClassifier, vectorizer, x_train, y_train)
   evaluateClassifier("Naive Bayes\tTEST\t\n", naiveBayesClassifier, vectorizer, x_test, y_test)

   # store the classifier
   clf_filename = 'naive_bayes_classiefier.pkl'
   pickle.dump(naiveBayesClassifier, open(clf_filename, 'wb'))

   # also sotre the vectorizer so we can transform new data
   vec_filename = 'count_vectorizer.pkl'
   pickle.dump(vectorizer, open(vec_filename, 'wb'))
   


def get_model():
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)
    print(f"Mi trovo in {os.getcwd()}")
    # load classifier
    clf_filename = 'naive_bayes_classiefier.pkl'
    classifier = pickle.load(open(clf_filename, 'rb'))

    # vectorize the new text
    vec_filename = 'count_vectorizer.pkl'
    vectorizer = pickle.load(open(vec_filename, 'rb'))

    return classifier, vectorizer

def get_prediction(text, classifier, vectorizer):
   prediction = classifier.predict(vectorizer.transform([text]))
   probabilityList = classifier.predict_proba(vectorizer.transform([text]))
   tmpList = probabilityList.astype(float).round(3)
   sorted_array = np.sort(tmpList[0])[::-1]

   return prediction[0], sorted_array[0]


def plotConfusionMatrix(y_list, pred):
   confusion_mat = metrics.confusion_matrix(y_list, pred, labels=LABEL_LIST)
   disp = ConfusionMatrixDisplay(confusion_mat, display_labels=LABEL_LIST)

   # Plot della confusion matrix
   disp.plot(cmap='Greens', values_format='d', xticks_rotation='vertical')  # Aggiungi xticks_rotation
   plt.show()

   