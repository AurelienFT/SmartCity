from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import threading
import manageMQTT

def launchMQTT():
    manageMQTT.client.loop_forever()

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)

from graphs import roads

api.add_resource(roads.Roads, "/graphs/roads")

def launchAPI():
    app.run(debug=True, host="0.0.0.0", use_reloader=False)

if __name__ == '__main__':
    threadAPI = threading.Thread(target=launchAPI)
    threadAPI.start()
    threadMQTT = threading.Thread(target=launchMQTT)
    threadMQTT.start()