from flask import Flask, jsonify, request
import time
import json
from OrganizzazioneFile import ClassificazioneControl

app = Flask(__name__)
@app.route('/classify', methods=["POST"])
def getFileClassification():
   pathToClassify = request.json.get("path")
   filters = request.json.get("filters")
   result = ClassificazioneControl.classifyFiles(pathToClassify, filters)
   return result

@app.route('/test')
def prova():
   return jsonify({"somma": "Ciao"})



if __name__ == "__main__":
   app.run()