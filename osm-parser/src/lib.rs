use city_graph::{CityGraph, Node, Street};
use osmio::{Node as OSMNode, OSMObjBase, OSMReader, Way};
use std::{collections::HashMap, path::Path};

pub fn parse_osm_export(path: impl AsRef<Path>) -> CityGraph {
    let mut reader = osmio::xml::from_filename_uncompressed(path).unwrap();
    let mut graph = CityGraph::default();
    // Gather all datas
    for object in reader.objects() {
        match object {
            osmio::obj_types::StringOSMObj::Node(node) => {
                graph.nodes.insert(node.id().try_into().unwrap(), Node {
                    id: node.id().try_into().unwrap(),
                    coords: node.lat_lon_f64().unwrap().into(),
                    linked_nodes: Vec::new(),
                });
            }
            osmio::obj_types::StringOSMObj::Way(way) => {
                if way.has_tag("highway") {
                    graph.streets.insert(
                        way.id().try_into().unwrap(),
                        Street {
                            id: way.id().try_into().unwrap(),
                            name: way.tag("name").map(|s| String::from(s)).unwrap_or_default(),
                            nodes: way.nodes().iter().map(|node| (*node).try_into().unwrap()).collect(),
                        }
                    );
                }
            }
            _ => {}
        }
    }
    graph
}
