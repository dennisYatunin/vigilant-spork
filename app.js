Trump = {"IA":7,"NH":11,"SC":50,"NV":14,"AL":36,"AK":14,"AR":16,"GA":42,"MA":22,"MN":8,"OL":13,"TN":33,"TX":48,"VT":8,"VA":17,"KS":9,"KY":17,"LA":18,"ME":9,"HI":11,"ID":12,"MI":25,"MS":24,"WY":1,"FL":99,"IL":53,"MO":25,"NC":29,"AZ":58,"UT":0};

Cruz = {"IA":8,"NH":3,"SC":0,"NV":6,"AL":13,"AK":14,"AR":15,"GA":18,"MA":4,"MN":13,"OL":15,"TN":16,"TX":104,"VT":0,"VA":8,"KS":24,"KY":15,"LA":18,"ME":12,"HI":7,"ID":20,"MI":17,"MS":13,"WY":9,"FL":0,"IL":9,"MO":15,"NC":27,"AZ":0,"UT":40};

Hillary = {"IA":23,"NH":9,"SC":39,"NV":20,"AL":44,"AK":6,"AR":22,"GA":73,"MA":46,"MN":31,"OL":17,"TN":44,"TX":147,"VT":0,"VA":62,"KS":9,"LA":37,"ME":9,"HI":8,"ID":5,"MI":63,"MS":32,"FL":141,"IL":76,"MO":34,"NC":59,"OH":81,"AZ":44,"UT":6,"CO":28,"NE":10,"WA":8};

Sanders = {"IA":21,"NH":15,"SC":14,"NV":15,"AL":9,"AK":13,"AR":10,"GA":29,"MA":45,"MN":46,"OL":21,"TN":23,"TX":75,"VT":16,"VA":33,"KS":24,"LA":14,"ME":16,"HI":17,"ID":17,"MI":67,"MS":4,"FL":70,"IL":73,"MO":34,"NC":45,"OH":62,"AZ":30,"UT":26,"CO":38,"NE":15,"WA":25};

Rubio = {"IA":7,"NH":2,"SC":0,"NV":7,"AL":1,"AK":0,"AR":9,"GA":16,"MA":8,"MN":17,"OL":12,"TN":9,"TX":3,"VT":0,"VA":16,"KS":6,"KY":7,"LA":5,"ME":0,"HI":1,"ID":0,"MI":0,"MS":0,"WY":1,"FL":0,"IL":0,"MO":0,"NC":6,"OH":0,"AZ":0,"UT":0};

Kasich = {"IA":1,"NH":4,"SC":0,"NV":1,"AL":0,"AK":0,"AR":0,"GA":0,"MA":8,"MN":0,"OL":0,"TN":0,"TX":0,"VT":8,"VA":5,"KS":1,"KY":7,"LA":0,"ME":2,"HI":0,"ID":0,"MI":17,"MS":0,"WY":0,"FL":0,"IL":5,"MO":0,"NC":9,"OH":66,"AZ":0,"UT":0};

const MAX_ANGLE = 60, MIN_ANGLE = 0;
var mapAngle = window.getComputedStyle(document.querySelector(".rotatable"));
mapAngle = (
	mapAngle.getPropertyValue("-webkit-transform") ||
	mapAngle.getPropertyValue("-moz-transform") ||
	mapAngle.getPropertyValue("transform") ||
	false
	);
var isMapAngle;
if (mapAngle) {
	isMapAngle = true;
	mapAngle = mapAngle.split("(")[1];
    mapAngle = mapAngle.split(")")[0];
    mapAngle = mapAngle.split(",")[1];
    mapAngle = Math.round(Math.asin(mapAngle) * 180 / Math.PI);
}
else {
	isMapAngle = false;
}
var rotatable = d3.select(".rotatable");
var container = d3.select("#container");
if (isMapAngle) {
	window.addEventListener("wheel", function(e) {
		var evt = window.event || e;
		evt = evt.originalEvent ? evt.originalEvent : evt;
		var delta = evt.detail ? -evt.detail : evt.wheelDelta;
		var changed = false;
		if (delta > 0){
			// scroll up
			if (mapAngle < MAX_ANGLE) {
				mapAngle += 1;
				changed = true;
			}
		}
		else {
			if (mapAngle > MIN_ANGLE) {
				mapAngle -= 1;
				changed = true;
			}
		}
		if (changed) {
			rotatable.style(
				"-webkit-transform", "rotateX(" + mapAngle + "deg)"
				);
			rotatable.style(
				"-moz-transform", "rotateX(" + mapAngle + "deg)"
				);
			rotatable.style(
				"transform", "rotateX(" + mapAngle + "deg)"
				);
			container.style(
				"bottom", 35 + mapAngle / 2 + "%"
				);
			console.log(mapAngle);
		}
	});
}

var chart = document.getElementById("container");
var curState = null;
d3.selectAll("path, rect").on("click", function() {
	var newState = this.className.baseVal.split(" ")[0];
	if (curState == newState) {
		chart.innerHTML = "";
		curState = null;
	}
	else {
		curState = newState;
		drawCharts(curState, true);
	}
});

window.onresize = function() {
	if (curState) {
		drawCharts(curState, false);
	}
}

function drawCharts(state, doTransition) {
	chart.innerHTML = "";
	var h = document.getElementById("container").offsetHeight * 5 / 7;
	var r = h / 2;
	// Republicans
	if (state in Trump && state in Cruz && state in Rubio && state in Kasich) {
		var color = d3.scale.ordinal().range(
			["Tomato", "Red", "FireBrick", "LightCoral"]
			);
		var data = [
		{label: "Trump", value: Trump[state]}, // trump = tomato
		{label: "Cruz", value: Cruz[state]}, // cruz = red
		{label: "Rubio", value: Rubio[state]}, // rubio = fire
		{label: "Kasich", value: Kasich[state]} // kasich = coral
		];
		drawChart(h, r, color, data, doTransition);
	}
	// Democrats
	if (state in Hillary && state in Sanders) {
		var color = d3.scale.ordinal().range(["RoyalBlue", "SkyBlue"]);
		var data = [
		{label: "Hillary", value: Hillary[state]}, // hillary = royal
		{label: "Sanders", value: Sanders[state]} // sanders = sky
		];
		drawChart(h, r, color, data, doTransition);
	}
}

function drawChart(h, r, color, data, doTransition) {
	var svg = container
	.append("svg:svg").data([data])
	.attr("width", h).attr("height", h)
	.style("padding", "5%");
	if (doTransition) {
		svg.style("opacity", 0);
		svg.transition().style("opacity", 1);
	}
	svg.append("defs").html(`
		<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
		<feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
		<feColorMatrix result="matrixOut" in="offOut" type="matrix"
		values="5 0 0 0 0 0 5 0 0 0 0 0 5 0 0 0 0 0 1 0" />
		<feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="15" />
		<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
		</filter>
		`);
	var vis = svg.append("svg:g")
	.attr("transform", "translate(" + r + "," + r + ")")
	.attr("filter", "url(#glow)");
	var pie = d3.layout.pie().value(function(d) {return d.value;});
	var arc = d3.svg.arc().outerRadius(r);
	var arcs = vis.selectAll("g.slice").data(pie).enter()
	.append("svg:g").attr("class", "slice");
	arcs.append("svg:path").attr("fill", function(d, i) {return color(i);})
	.attr("d", function(d) {return arc(d);});
	arcs.append("svg:text").attr("transform", function(d) {
		d.innerRadius = 0;
		d.outerRadius = r;
	    return "translate(" + arc.centroid(d) + ")";
	}).attr("text-anchor", "middle").text(function(d, i) {
	    return data[i].value ?
	    (data[i].label + " (" + data[i].value + ")") : "";
	}).attr("class", "pie-label");
	return svg;
}
