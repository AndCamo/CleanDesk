from flask import Flask, jsonify, request
import time
from OrganizzazioneFile import ClassificazioneControl

app = Flask(__name__)
@app.route('/classify', methods=["POST"])
def getFileClassification():
   pathToClassify = request.json.get("path")
   result = ClassificazioneControl.classifyFiles(pathToClassify)
   return result

@app.route('/test')
def prova():
   return jsonify({"somma": "Ciao"})



if __name__ == "__main__":
   app.run()