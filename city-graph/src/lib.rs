use std::collections::HashMap;

pub type Id = u64;

pub struct Node {
    pub id: Id,
    pub coords: [f64; 2],
    pub linked_nodes: Vec<Id>,
}

pub struct Street {
    pub id: Id,
    pub name: String,
    pub nodes: Vec<Id>,
}

#[derive(Default)]
pub struct CityGraph {
    pub streets: HashMap<Id, Street>,
    pub nodes: HashMap<Id, Node>,
}
