use std::collections::HashMap;

use bevy::prelude::*;
use bevy_rapier3d::prelude::*;
use egui_plot::{Line, Plot};
use osmio::prelude::*;
use osmio::{Node, OSMObjBase};
use bevy_panorbit_camera::{PanOrbitCamera, PanOrbitCameraPlugin};

fn main() {
    let mut reader = osmio::xml::from_filename_uncompressed("data/map.xml").unwrap();
    let mut streets = Vec::new();
    let mut nodes = HashMap::new();
    // Gather all datas
    for object in reader.objects() {
        match object {
            osmio::obj_types::StringOSMObj::Way(way) => {
                if way.has_tag("highway") {
                    streets.push(way);
                }
            }
            osmio::obj_types::StringOSMObj::Node(node) => {
                nodes.insert(node.id(), node);
            }
            _ => {}
        }
    }
    // Format road coords
    let mut road_coords = Vec::new();
    for street in streets {
        road_coords.push((
            street.tag("name").map(|s| String::from(s)),
            street
                .nodes()
                .iter()
                .map(|node| {
                    let (x, y) = nodes.get(node).unwrap().lat_lon_f64().unwrap();
                    [y, x]
                })
                .collect::<Vec<[f64; 2]>>(),
        ));
    }
    //two_d_display(road_coords.clone());
    three_d_display(road_coords.clone());
}

fn two_d_display(road_coords: Vec<(Option<String>, Vec<[f64; 2]>)>) {
    let options = eframe::NativeOptions {
        ..Default::default()
    };

    eframe::run_simple_native("My egui App", options, move |ctx, _frame| {
        egui::CentralPanel::default().show(ctx, |ui| {
            let mut lines = Vec::new();
            for (_, points) in road_coords.clone() {
                let line = Line::new(points);
                lines.push(line);
            }
            Plot::new("my_plot").view_aspect(2.0).show(ui, |plot_ui| {
                for line in lines {
                    plot_ui.line(line)
                }
        });
        });
    }).unwrap();
}

fn three_d_display(road_coords: Vec<(Option<String>, Vec<[f64; 2]>)>) {
    let mut app = App::new();
    let window_plugin = WindowPlugin {
        primary_window: Some(Window {
            title: "OSM-3D".to_string(),
            ..Default::default()
        }),
        ..Default::default()
    };
    app.insert_resource(ClearColor(Color::rgb(0.15, 0.15, 0.15)))
    .insert_resource(Msaa::Sample4)
    .insert_resource(AmbientLight {
        brightness: 0.3,
        ..Default::default()
    })
    .add_plugins(DefaultPlugins.set(window_plugin))
    .add_plugins(RapierPhysicsPlugin::<NoUserData>::default())
        .add_plugins(RapierDebugRenderPlugin::default())
        .add_plugins(PanOrbitCameraPlugin)
        .add_systems(Startup, setup_graphics)
        .add_systems(Startup, setup_physics)
        .add_systems(Update, print_ball_altitude);
    app.run();

fn setup_graphics(mut commands: Commands) {
    // Add a camera so we can see the debug-render.
    commands.spawn((Camera3dBundle {
        transform: Transform::from_xyz(-3.0, 3.0, 10.0).looking_at(Vec3::ZERO, Vec3::Y),
        ..Default::default()
    },     PanOrbitCamera::default()));
}

fn setup_physics(mut commands: Commands) {
    /* Create the ground. */
    commands
        .spawn(Collider::cuboid(2.0, 0.1, 5.0))
        .insert(TransformBundle::from(Transform::from_xyz(0.0, 0.0, 0.0)));
}

fn print_ball_altitude(positions: Query<&Transform, With<RigidBody>>) {
    for transform in positions.iter() {
        println!("Ball altitude: {}", transform.translation.y);
    }
}