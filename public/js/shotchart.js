//shotchart.js
var data = []
var x_coord = -1;
var y_coord = -1;
var count = 0;
//var edit_count = 0;
var cpixel_width = 0;
var cpixel_height = 0;
var cmargin_left = 0;
var cmargin_top = 0;

var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 500 - margin.left - margin.right,
    height = 471 - margin.top - margin.bottom;

//Making it responsive for each screen
var ration = 471/500;
var windowWidth = $(window).width();
//console.log(windowWidth);
if(windowWidth < 500) {
    width = windowWidth;
    height = width * ratio;
};

function main() {
    set_chart();
}

function add_data(x, y, index, made) {
    data[index] = {
    "shot_attempted_flag": 1,
    "shot_made_flag": made,
    "x":x,
    "y":y
    };
}

function set_chart() {
    add_data();
    var shot_chart = d3.select(".shot-chart").attr('width', width - margin.left + margin.right);
    var input_court = document.getElementById("court");
    var court = d3.court().width(700);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("scatter");
    shot_chart.call(court);
    shot_chart.datum(data).call(shots);
    cpixel_width = $(".shot-chart").width() + 2;
    cpixel_height = $(".shot-chart").height() + 2;
    cmargin_left = $(".shot-chart").offset().left;
    cmargin_top = $(".shot-chart").offset().top;
}

function deleteShot() {
    console.log("Deleting shot");
    data.pop();
    if(count > 0) {
       count--;
    }   
    /*for (i = 0; i <= edit_count; i++) {
        data.pop();
        if (count > 0) {
            count--;
        }
    }*/
    set_chart();
}

/*function madeShot() {
    console.log("Shot: Made");
    //edit_count++;
    //console.log(edit_count);
    //count--;
    add_data(x_coord, y_coord, count, 1);
    //console.log(data);
    count++;
    set_chart();
}

function missedShot() {
    console.log("Shot: Missed");
    //edit_count++;
    //console.log(edit_count);
    add_data(x_coord, y_coord, count--, 0);
    count++;
    set_chart();
}*/

function showCoords(event, flag) {
    var cX = event.clientX;
    var cY = event.clientY;
    var coords1 = "X coords: " + cX + ", Y coords: " + cY;

    var x_ratio = cpixel_width/50;//(actual pixel width)/50
    var y_ratio = cpixel_height/47;//(actual pixel height)/47
    var margin_width = -cmargin_left;//width from margin to start of schotchart
    var margin_height = cmargin_top;//height from top to top of shot chart


    var dX = (margin_width + cX)/x_ratio;
    var dY = 47 - ((cY - margin_height)/y_ratio);

    x_coord = dX;
    y_coord = dY;

    //edit_count = 0;
    add_data(x_coord, y_coord, count, flag);
    count++;
    set_chart();
    //console.log(data);
}

$(document).ready(main);
