from flask import Flask, render_template, jsonify, request
from solver import get_suggestion, get_dictionary

dictionary = get_dictionary()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/suggestion', methods=["POST"])
def suggestion_route():
    data = request.json
    words = get_suggestion(dictionary, data["words"], data["word_length"])
    if(len(words)==1):
        for word in data["words"]:
            if word[0]==words[0]:
                return jsonify({"message":"Contrats! you found it"})
    return jsonify({"words":words})

if __name__ == '__main__':
    app.run(debug=True)