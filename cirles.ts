
const visObject = {
 /**
  * Configuration options for your visualization. In Looker, these show up in the vis editor
  * panel but here, you can just manually set your default values in the code.
  **/
  options: {
    first_option: {
    	type: "string",
      label: "My First Option",
      default: "Default Value"
    },
    second_option: {
    	type: "number",
      label: "My Second Option",
      default: 42
    }
  },
 
 /**
  * The create function gets called when the visualization is mounted but before any
  * data is passed to it.
  **/
	create: function(element, config){
		element.innerHTML = `<style>
      .funds-allocated-meter .background{
    fill: #E6E7E8;
  }
  .funds-allocated-meter .foreground {
    fill: #00D2B6;
  }
  text .percent-complete {
     {
      font-family: 'Roboto Condensed', sans-serif;
      font-size: 40px;
      fill: #5B8BE3;
      letter-spacing: -.03em;
    }
    text .description {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 11px;
      fill: #9B9B9B;
    }
  
      </style>`;
	},

 /**
  * UpdateAsync is the function that gets called (potentially) multiple times. It receives
  * the data and should update the visualization with the new data.
  **/
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
    // set the dimensions and margins of the graph
    var width = 135,
    height = 135,
    twoPi = 2 * Math.PI,
    progress = 0,
    allocated = 2000000,
    total = 4300000,
    formatPercent = d3.format(".0%");

var arc = d3.svg.arc()
    .startAngle(0)
    .innerRadius(52)
    .outerRadius(66);

   
var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
	;

var meter = svg.append("g")
    .attr("class", "funds-allocated-meter");

meter.append("path")
    .attr("class", "background")
    .attr("d", arc.endAngle(twoPi));

var foreground = meter.append("path")
    .attr("class", "foreground");

var percentComplete = meter.append("text")
    .attr("text-anchor", "middle")
    .attr("class", "percent-complete")
    .attr("dy", "0em");

var description = meter.append("text")
    .attr("text-anchor", "middle")
    .attr("class", "description")
    .attr("dy", "2.3em")
    .text("Total Complete");

var i = d3.interpolate(progress, allocated / total);

 d3.transition().duration(1000).tween("progress", function() {
  return function(t) {
    progress = i(t);
    foreground.attr("d", arc.endAngle(twoPi * progress));
    percentComplete.text(formatPercent(progress));
  };
});
		doneRendering()
	}
};

looker.plugins.visualizations.add(visObject);
