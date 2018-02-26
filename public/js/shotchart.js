//shotchart.js
var data = []
var home = 0;
var visitor = 0;
var count = 0;
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
    dispHome();
    dispVisitor();
    set_chart();

    var doubleClickTime = 0;
    var threshold = 250;

    // Upon loading main start click event on shot chart
    $('.shot-chart').click(function(event){
        // Get time of single click
        var singleClickTime = new Date();
        // If the time between single and double is greater than threshold
        // It is a single click
        if (singleClickTime - doubleClickTime > threshold) {
        setTimeout(function () {
            if (singleClickTime - doubleClickTime > threshold) {
                //console.log("SINGLE");
                // Call show coords to log coordinates
                showCoords(event, 1);
                //console.log(data);
            }
        },threshold);
    }
    });

    // Upon loading main start double click event on shot chart
    $('.shot-chart').dblclick(function(event){
        // Get time of double click
        doubleClickTime = new Date();
        //console.log("DOUBLE");
        // Call show coords to log coordinates
        showCoords(event, 0);
        //console.log(data);
    });
}

/*function add_data(x, y, index, made) {
    data[index] = {
    "shot_attempted_flag": 1,
    "shot_made_flag": made,
    "x":x,
    "y":y
    };
}*/

function set_chart() {
    var shot_chart = d3.select(".shot-chart").attr('width', width - margin.left + margin.right);
    var court = d3.court().width(700);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("scatter");
    shot_chart.call(court);
    shot_chart.datum(data).call(shots);
    cpixel_width = $(".shot-chart").width() + 2;
    cpixel_height = $(".shot-chart").height() + 2;
    cmargin_left = $(".shot-chart").offset().left;
    cmargin_top = $(".shot-chart").offset().top;
}

function toHexbin() {
    var shot_chart = d3.select(".shot-chart").attr('width', width - margin.left + margin.right);
    var court = d3.court().width(700);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("hexbin");
    shot_chart.call(court);
    shot_chart.datum(data).call(shots);
}

function deleteShot() {
    //console.log("Deleting shot");
    var tmp = data.pop();
    if (tmp.shot_made_flag == 1) {
        home -= tmp.shot_attempted;
    }
    if(count > 0) {
       count--;
    }   
    set_chart();
    dispHome();
}

function pi_th(x, y) {
    var a = x - 25;
    var b = y - 5;
    return Math.sqrt((a * a) + (b * b));
}

function checkThree(x,y) {
    var dist = pi_th(x,y);
    if (x < 2.3 || x > 47.7) {
        return true;
    } else if (dist >= 24.6) {
        return true;
    } else {
        return false;
    }
}

function plot(x,y,flag) {
    var value = 0;
    if (checkThree(x,y)) {
        value = 3;
        if (flag == 1) {
            home += 3;
        }
    } else {
        value = 2;
        if (flag == 1) {
            home += 2;
        }
    }
    data[count] = {
        "shot_attempted_flag": 1,
        "shot_attempted": value,
        "shot_made_flag": flag,
        "x":x,
        "y":y
    };
    console.log(data[count]);
    count++;
    set_chart();
    dispHome();
}

function showCoords(event, flag) {
    var cX = event.clientX;
    var cY = event.clientY;

    var x_ratio = cpixel_width/50;//(actual pixel width)/50
    var y_ratio = cpixel_height/47;//(actual pixel height)/47
    var margin_width = -cmargin_left;//width from margin to start of schotchart
    var margin_height = cmargin_top;//height from top to top of shot chart


    var dX = (margin_width + cX)/x_ratio;
    var dY = 47 - ((cY - margin_height)/y_ratio);

    plot(dX, dY, flag);
}

function decrement(flag) {
    if (flag == 1) {
        if (home > 0)
            home--;
        dispHome();
    } else {
        if (visitor > 0)
            visitor--;
        dispVisitor();
    }

}

function dispHome() {
    document.getElementById("home_score").innerHTML = 
                                      ("Home: " + home);
}

function dispVisitor() {
    document.getElementById("visitor_score").innerHTML = 
                                      ("Visitor: " + visitor);
}

function oppScore() {
    visitor++;
    dispVisitor();
}

function makeFT() {
    home++;
    dispHome();
}

$(document).ready(main);
