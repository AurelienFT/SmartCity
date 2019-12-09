import json
from flask_restful import Resource

class Roads(Resource):
    def get(self):
        with open('graphs/way_maps_example.json') as json_file:
            data = json.load(json_file)
            return data, 200