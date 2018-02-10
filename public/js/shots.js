var data = []

function fill_chart() {
    for (i = 0; i < 1000; i++) {
	var rx = (Math.random() * 50);
	var ry = (Math.random() * 47);
	data[i] = {
	    "shot_attempted_flag": 1,
	    "shot_made_flag": 1,
	    "x": rx,
	    "y": ry
	};
    }
}

function add_data(x, y, index) {
    data[index] = {
	"shot_attempted_flag": 1,
	"shot_made_flag": 1,
	"x":x,
	"y":y
    };
}

