var data = []

function add_data(x, y, index, made) {
    data[index] = {
	"shot_attempted_flag": 1,
	"shot_made_flag": made,
	"x":x,
	"y":y
    };
}

