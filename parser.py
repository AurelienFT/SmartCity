from xml.sax import make_parser, handler
from pymongo import MongoClient
from pprint import pprint
import json
import bson
from bson.codec_options import CodecOptions

class NodeRepository:
        def __init__(self):
                self.nodes = {}

        def addNode(self, nodeId, snode):
                self.nodes[nodeId] = snode

        def getNode(self, nodeId):
                return self.nodes[nodeId]
class OSMNode:
    def __init__(self, attrs=[]):
        self.osm_type = "node"
        self.osm_id   = attrs["id"]
        self.lat  = attrs["lat"]
        self.lon  = attrs["lon"]
        self.tags = []
        #self.tags = {}

    def addTag(self, tag):
        #pass
        self.tags.append(tag)
    #def addTag(self, key, value):
    #    self.tags[key] = value


class OSMSNode:
        def __init__(self, osmnode):
                self.lon = osmnode.lon
                self.lat = osmnode.lat

class OSMRelation:
    def __init__(self, attrs=[]):
        self.osm_type = "relation"
        self.osm_id       = attrs["id"]
        self.tags     = []
        self.members  = []

    def addMember(self,member):
        self.members.append(member)

    def addTag(self, tag):
        self.tags.append(tag)

class OSMWay:
    def __init__(self, attrs):
        self.osm_type = "way"
        self.osm_id       = attrs["id"]
        self.nds      = []
        self.tags     = []

    def addNd(self, nd):
        self.nds.append(nd)

    def addTag(self, tag):
        self.tags.append(tag)


class OSMTag:
    def __init__(self, attrs=[]):
        self.k = attrs["k"]
        self.v = attrs["v"]

class OSMNd:
    def __init__(self, attrs=[]):
        self.ref = attrs["ref"]

class OSMMember:
    def __init__(self, attrs=[]):
        self.type = attrs["type"]
        self.ref = attrs["ref"]

class OSMSax(handler.ContentHandler):
    def __init__(self, db):
        self.db = db
        self.node_repo = NodeRepository()

    def startElement(self, name, attrs):
        if (name == "node"):
            self.currentElement = OSMNode(attrs)
        if (name == "way"):
            self.currentElement = OSMWay(attrs)
        if (name == "tag"):
            tag = OSMTag(attrs)
            self.currentElement.addTag(tag)
            if ( tag.k == "building"):
                self.currentType = "building"
            if ( tag.k == "highway"):
                self.currentType = "highway"
            if ( tag.k == "waterway"):
                self.currentType = "waterway"
            if ( tag.k == "landuse"):
                self.currentType = "landuse"
        if (name == "nd"):
            nd = OSMNd(attrs)
            snd = self.node_repo.getNode(nd.ref)
            self.currentElement.addNd(snd)

    def endElement(self, name):
        if (name == "node"):
            snode = OSMSNode(self.currentElement)
            self.node_repo.addNode(self.currentElement.osm_id, snode)
        if (name == "way"):
            jway = json.dumps(self.currentElement, default=lambda x: x.__dict__)
            w = json.loads(jway)
            if ( self.currentType == "building" ):
                db.building.insert(w)
            if ( self.currentType == "highway") :
                db.highway.insert(w)
            if ( self.currentType == "waterway"):
                db.waterway.insert(w)
            if ( self.currentType == "landuse"):
                db.landuse.insert(w)
            self.currentType = "none"


client = MongoClient(port=27017)
db = client.OSM
db.building.drop()
db.highway.drop()
db.waterway.drop()
db.landuse.drop()


parser = make_parser()
b = OSMSax(db)
parser.setContentHandler(b)
parser.parse("./map.osm")