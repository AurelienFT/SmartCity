from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)

from graphs import roads

api.add_resource(roads.Roads, "/graphs/roads")
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")