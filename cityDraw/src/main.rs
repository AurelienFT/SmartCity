extern crate kiss3d;
extern crate serde;
extern crate nalgebra as na;

mod highway;

use kiss3d::light::Light;
use kiss3d::scene::SceneNode;
use kiss3d::window::{State, Window};
use na::{UnitQuaternion, Vector3, Translation3};
use mongodb::sync::{Client};

struct AppState {
    c: SceneNode,
    //rot: UnitQuaternion<f32>,
}

impl State for AppState {
    fn step(&mut self, _: &mut Window) {
        //self.c.prepend_to_local_rotation(&self.rot)
    }
}

fn main() {
    let database = Client::with_uri_str("mongodb://localhost:27017/").unwrap().database("OSM");
    let highways = database.collection("highway").find(None, None).unwrap().collect::<Vec<Result<bson::Document, mongodb::error::Error>>>();
    let mut window = Window::new("Kiss3d: wasm example");
    let mut c = window.add_cube(0.1, 0.1, 0.1);
    for highway_bson in highways {
        let node: highway::Highway = bson::from_document(highway_bson.unwrap()).unwrap();
        //let node: highway::Highway = bson::from_document(highways[1].clone().unwrap()).unwrap();
        for i in 0..node.nds.len() {
            if i + 1 == node.nds.len() {
                break;
            }
            let first_node_lat = (node.nds[i].lat.parse::<f32>().unwrap() - 48.0) * 100.0;
            let first_node_lon = (node.nds[i].lon.parse::<f32>().unwrap() - 2.0) * 100.0;
            let second_node_lat = (node.nds[i + 1].lat.parse::<f32>().unwrap() - 48.0) * 100.0;
            let second_node_lon = (node.nds[i + 1].lon.parse::<f32>().unwrap() - 2.0) * 100.0;
            let mut a = window.add_cube((first_node_lat - second_node_lat) * 1.0, 0.05, (first_node_lon - second_node_lon) * 1.0);
            println!("test = {:#?}", first_node_lat * 1.0);
            println!("tes2 = {:#?}", first_node_lon * 1.0);
            a.set_local_translation(Translation3::<f32> {
                vector: Vector3::new(first_node_lat - 73.0, 0.0, first_node_lon - 73.0)
            });
        }
    }
/*     c.set_local_translation(Translation3::<f32> {
        vector: Vector3::new(1.0, 0.0, 1.0)
    }); */
    //window.add_cube(1.0, 1.0, 1.0);
    c.set_color(1.0, 0.0, 0.0);

    window.set_light(Light::StickToCamera);

    //let rot = UnitQuaternion::from_axis_angle(&Vector3::y_axis(), 0.014);
    let state = AppState { c };

    window.render_loop(state)
}