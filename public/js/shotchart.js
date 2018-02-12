var count = 0;
var x_coord = -1;
var y_coord = -1;

function main() {
    set_chart();
}

function set_chart() {
    var left_chart = d3.select(document.getElementById("left_sc"));
    var left_court = d3.court().width(700);
    left_chart.call(left_court);

    var right_chart = d3.select(document.getElementById("right_sc"));
    var right_court = d3.court().width(700);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("scatter");
    right_chart.call(right_court);
    right_chart.datum(data).call(shots);

}

function madeShot() {
    console.log("Shot: Made");
    add_data(x_coord, y_coord, count, 1);
    count++;
    set_chart();

}

function missedShot() {
    console.log("Shot: Missed");
    add_data(x_coord, y_coord, count, 0);
    count++;
    set_chart();
}

function showCoords(event) {
    var cX = event.clientX;
    var cY = event.clientY;
    var coords1 = "X coords: " + cX + ", Y coords: " + cY;
    var size = '8px';
    var court = document.getElementById("court");
    $(court).append(
	$('<div></div>')
	    .css('position', 'absolute')
	    .css('top',cY + 'px')
	    .css('left',cX + 'px')
	    .css('width', size)
	    .css('height', size)
	    .css('background-color', 'red')
    );
    var x_adj = 294;
    var y_adj = 210;
    x_coord = (cX-x_adj)/8.75;
    y_coord = (47-(cY-y_adj)/8.78);
    //console.log("x: " + cX + " y: " + cY);
    //console.log("x: " + dX + " y: " + dY);
}


$(document).ready(main);
