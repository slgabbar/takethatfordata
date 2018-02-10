var count = 0;

function main() {
    //fill_chart();
    set_chart();
}

function set_chart() {
    var shot_chart = d3.select(".shot-chart");
    var court = d3.court().width(700);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("scatter");
    shot_chart.call(court);
    shot_chart.datum(data).call(shots);
}

function showCoords(event) {
    var cX = event.clientX;
    var cY = event.clientY;
    var coords1 = "X coords: " + cX + ", Y coords: " + cY;
    console.log(coords1);
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
    var dX = cX/10;
    var dY = 47 - cY/10;
    add_data(dX, dY, count);
    count++;
    console.log("x: " + cX + " y: " + cY);
    console.log("x: " + dX + " y: " + dY);
    set_chart();
}


$(document).ready(main);
