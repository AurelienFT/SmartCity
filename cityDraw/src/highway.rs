use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
pub struct Tag {
    k: String,
    v: String
}

#[derive(Deserialize)]
pub struct Node {
    pub lat: String,
    pub lon: String
}

#[derive(Deserialize)]
pub struct Highway {
    #[serde(rename = "_id")]
    pub id: bson::oid::ObjectId,
    pub nds: Vec<Node>,
    pub tags: Vec<Tag>,
    pub osm_type: String,
    pub osm_id: String
}