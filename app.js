Trump = {"IA":7,"NH":11,"SC":50,"NV":14,"AL":36,"AK":14,"AR":16,"GA":42,"MA":22,"MN":8,"OL":13,"TN":33,"TX":48,"VT":8,"VA":17,"KS":9,"KY":17,"LA":18,"ME":9,"HI":11,"ID":12,"MI":25,"MS":24,"WY":1,"FL":99,"IL":53,"MO":25,"NC":29,"OH":0,"AZ":58,"UT":0};

Cruz = {"IA":8,"NH":3,"SC":0,"NV":6,"AL":13,"AK":14,"AR":15,"GA":18,"MA":4,"MN":13,"OL":15,"TN":16,"TX":104,"VT":0,"VA":8,"KS":24,"KY":15,"LA":18,"ME":12,"HI":7,"ID":20,"MI":17,"MS":13,"WY":9,"FL":0,"IL":9,"MO":15,"NC":27,"OH":0,"AZ":0,"UT":40};

Hillary = {"IA":23,"NH":9,"SC":39,"NV":20,"AL":44,"AK":6,"AR":22,"GA":73,"MA":46,"MN":31,"OL":17,"TN":44,"TX":147,"VT":0,"VA":62,"KS":9,"LA":37,"ME":9,"HI":8,"ID":5,"MI":63,"MS":32,"FL":141,"IL":76,"MO":34,"NC":59,"OH":81,"AZ":44,"UT":6,"CO":28,"NE":10,"WA":8};

Sanders = {"IA":21,"NH":15,"SC":14,"NV":15,"AL":9,"AK":13,"AR":10,"GA":29,"MA":45,"MN":46,"OL":21,"TN":23,"TX":75,"VT":16,"VA":33,"KS":24,"LA":14,"ME":16,"HI":17,"ID":17,"MI":67,"MS":4,"FL":70,"IL":73,"MO":34,"NC":45,"OH":62,"AZ":30,"UT":26,"CO":38,"NE":15,"WA":25};

var mapAngle = window.getComputedStyle(document.querySelector('.rotatable'));
mapAngle = (
	mapAngle.getPropertyValue("-webkit-transform") ||
	mapAngle.getPropertyValue("-moz-transform") ||
	mapAngle.getPropertyValue("transform") ||
	false
	);
var isMapAngle;
if (mapAngle) {
	isMapAngle = true;
	mapAngle = mapAngle.split('(')[1];
    mapAngle = mapAngle.split(')')[0];
    mapAngle = mapAngle.split(',')[1];
    mapAngle = Math.round(Math.asin(mapAngle) * 180 / Math.PI);
}
else {
	isMapAngle = false;
}
var rotatable = d3.select(".rotatable");
if (isMapAngle) {
	window.addEventListener("wheel", function(e) {
		var evt = window.event || e;
		evt = evt.originalEvent ? evt.originalEvent : evt;
		var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta;
		var changed = false;
		if (delta > 0){
			// scroll up
			if (mapAngle < 45) {
				mapAngle += 1;
				changed = true;
			}
		}
		else {
			if (mapAngle > 0) {
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
		}
	});
}

var state = d3.select(".states").selectAll("path")

var tooltip = d3.select(".tooltip");
var close = d3.select("i");

var isDem = true;//Democratic or not
state.on("click", function(e){//when a state is clicked
	this.parentNode.appendChild(this);
	state.classed("active",false);
	var c = d3.select(this);
	c.classed("active", true);

	
		var key = this.className["baseVal"].substring(0,2);//gets state initials
		console.log(Hillary[key]);
	if(isDem)
		c.data([Hillary[key],Sanders[key]]);
	else
		c.data([Trump[key],Sanders[key]]);
	tooltip.style("visibility", "visible");
});

close.on("click", function(e){//when the tooltip x is clicked
	tooltip.style("visibility", "hidden");
	state.classed("active",false);
});