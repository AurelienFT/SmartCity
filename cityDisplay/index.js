var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var cellSize = 100;
ctx.beginPath();

ctx.canvas.width = 1000;
ctx.canvas.height = 1000;

ctx.fillStyle = "#303030";
ctx.fillRect(0 * cellSize, 0 * cellSize, cellSize, cellSize);
for (var i = 0; i < ways.nodes.length; i++) {
    console.log(ways.nodes[i]);
    for (var x = ways.nodes[i].start.x; x <= ways.nodes[i].end.x; x++) {
        ctx.fillRect(x * cellSize, ways.nodes[i].end.y * cellSize, cellSize, cellSize);
        console.log("print x")
    }
    for (var y = ways.nodes[i].start.y; y <= ways.nodes[i].end.y; y++) {
        ctx.fillRect(ways.nodes[i].end.x * cellSize, y * cellSize, cellSize, cellSize);
        console.log("print y : " + ways.nodes[i].end.x + " | : " + y);
    }
}
