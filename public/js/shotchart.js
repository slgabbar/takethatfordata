//shotchart.js
var count = 0;
var x_coord = -1;
var y_coord = -1;


var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 500 - margin.left - margin.right,
    height = 471 - margin.top - margin.bottom;


//Making it responsive for each screen
var ration = 471/500;
var windowWidth = $(window).width();
if(windowWidth < 500) {
    width = windowWidth;
    height = width * ratio;
};

function main() {
    set_chart();
}

function set_chart() {
    add_data();
    var shot_chart = d3.select(".shot-chart").attr('width', width - margin.left + margin.right);
    var court = d3.court().width(500);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("scatter");
    shot_chart.call(court);
    console.log("here");
    shot_chart.datum(data).call(shots);
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
    var court = document.getElementById("court");
    $(court).append(
    $('<div></div>')
        .css('background-color', 'red')
    );
    count++;
    set_chart();
}

function showCoords(event) {
    var cX = event.clientX;
    var cY = event.clientY;
    var coords1 = "X coords: " + cX + ", Y coords: " + cY;
    //console.log(coords1);
    var size = '8px';
    var court = document.getElementById("court");
    $(court).append(
    $('<div></div>')
        .css('position', 'absolute')
        .css('top',cY + 'px')
        .css('left',cX + 'px')
        .css('width', size)
        .css('height', size)
        .css('background-color', 'green')
        .css('border', '1px black')
    );
    var dX = -30 + cX/10;
    var dY = 68 - cY/10;
    x_coord = dX;
    y_coord = dY;
    add_data(dX, dY, count);
    count++;
    //console.log("count:" + count);
    console.log("x: " + cX + " y: " + cY);
    console.log("x: " + dX + " y: " + dY);
    set_chart();
}



$(document).ready(main);
