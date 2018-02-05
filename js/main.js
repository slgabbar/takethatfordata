var coords = [];

function main() {
	console.log("We runnin");
}

function showCoords(event) {
    var cX = event.clientX;
    //var sX = event.screenX;
    var cY = event.clientY;
    //var sY = event.screenY;
    var coords1 = "client - X: " + cX + ", Y coords: " + cY;
    //var coords2 = "screen - X: " + sX + ", Y coords: " + sY;
    storeCoordinates(cX, cY);
    //coords.push({x:cX, y:cY});
    console.log(coords1);
	//console.log(coords2);
	var size = '8px';
	var dot = document.getElementById("dot");
	$('div').append(
            $('<div></div>')
                .css('position', 'absolute')
                .css('top', cY + 'px')
                .css('left', cX + 'px')
                .css('width', size)
                .css('height', size)
                .css('background-color', 'red')
        );

}

function storeCoordinates(x, y) {
	var d3_x = x/10;
	var d3_y = y/10;
	coords.push({x:d3_x, y:d3_y});
}

function printArray(event) {
	for (var i = 0; i < coords.length; i++) {
		console.log("x: "+coords[i].x+" "+"y: "+coords[i].y);
	}
}

$(document).ready(main);