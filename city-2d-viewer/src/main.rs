use city_graph::CityGraph;
use egui_plot::{Line, Plot};
use osm_parser::parse_osm_export;

fn main() {
    let path = "data/map.xml";
    let graph = parse_osm_export(path);
    two_d_display(&graph);
}

fn two_d_display(road_coords: &CityGraph) {
    let options = eframe::NativeOptions {
        min_window_size: Some(egui::vec2(2080.0, 1520.0)),
        ..Default::default()
    };

    let road_coords = road_coords
        .streets
        .values()
        .map(|street| {
            let points = street
                .nodes
                .iter()
                .map(|node_id| {
                    let node = road_coords.nodes.get(node_id).unwrap();
                    [node.coords[1], node.coords[0]]
                })
                .collect::<Vec<_>>();
            (street.name.clone(), points)
        })
        .collect::<Vec<_>>();

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
    })
    .unwrap();
}
