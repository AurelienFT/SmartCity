var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var cellSize = 30;
ctx.beginPath();

ctx.canvas.width = 1000;
ctx.canvas.height = 1000;

ctx.fillStyle = "#303030";
ctx.fillRect(0 * cellSize, 0 * cellSize, cellSize, cellSize);

console.log("test");
var headers = new Headers({
    "Access-Control-Allow-Origin": "*"
})

fetch('http://localhost:5000/graphs/roads', {method: "GET", headers: headers})
    .then(response => response.json())
    .then(data => {
        for (var i = 0; i < data.roads.length; i++) {
            console.log(data.roads[i]);
            for (var x = data.roads[i].start.x; x <= data.roads[i].end.x; x++) {
                ctx.fillRect(x * cellSize, data.roads[i].end.y * cellSize, cellSize, cellSize);
            }
            for (var y = data.roads[i].start.y; y <= data.roads[i].end.y; y++) {
                ctx.fillRect(data.roads[i].end.x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    })
