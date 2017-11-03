angular.module('app')
.directive('surveyInstructorBarChart', function () {
  return {
    template: '<div id="surveyInstructorBarChart"></div>',
    scope: {
        instructordata: '=',
    },
    controller: function ($scope, surveyService) {

      dataset = [{
        "overall": 4,
        "explained": 4.4,
        "prepared": 3,
        "subtopic": '1.1'
      },{
        "overall": 3,
        "explained": 4.5,
        "prepared": 3,
        "subtopic": '1.2'
      },{
        "overall": 4,
        "explained": 3.5,
        "prepared": 3,
        "subtopic": '1.3'
      },{
        "overall": 3.5,
        "explained": 5,
        "prepared": 3,
        "subtopic": '1.4'
      },{
        "overall": 3,
        "explained": 4,
        "prepared": 3,
        "subtopic": '1.5'
      },{
        "overall": 4,
        "explained": 5,
        "prepared": 3,
        "subtopic": '1.6'
      }]


var options = d3.keys(dataset[0]).filter(function(key) { return key !== "subtopic"; });
console.log(options)

dataset.forEach(function(d) {
  console.log(d)
  d.valores = options.map(function(name) { return {name: name, value: +d[name]}; });
});

        // xAxisData = filteredData.map(e => e.subtopic)

        // console.log(xAxis)
          
        // let data = filteredData

        var margin = {
          top: 30,
          right: 30,
          bottom: 30,
          left: 50
        }

      let num = 4;
      var width = document.getElementById('surveyInstructorBarChart').offsetWidth - margin.right - margin.left;
      var height = document.getElementById('surveyInstructorBarChart').offsetHeight - margin.top - margin.bottom - 80;

  var x0 = d3.scaleBand()
      .domain(dataset.map(function(d) { return d.subtopic; }))
      .rangeRound([0, width], .1)
      .paddingInner(0.1);
  
  var x1 = d3.scaleBand()
      .domain(options).rangeRound([0, x0.bandwidth()])
      .padding(0.05)
  
  var y = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) { return d3.max(d.valores, function(d) { return d.value; }); })])
      .range([height, 0]);
  
  var z = d3.scaleOrdinal()
      .range(["#2585b2", "#21AAE1", "#1b6689"]);
  
  var xAxis = d3.axisBottom(x0)
  var yAxis = d3.axisLeft(y)
  
  
  
  var svg = d3.select("#surveyInstructorBarChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // y.domain([0, 5])
  
  // var tip = d3.tip()
  //       .attr('class', 'd3-tip')
  //       .offset([-15, 0])
  //       .html(function (d) {
  //         return "Average Rating: <span style='color:#21AAE1; line-height: 1.5;'> " + d.OSAT + "</span>"
  //       })
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      // .append("text")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 6)
      // .attr("dy", ".71em")
      // .style("text-anchor", "end")
  // svg.call(tip);
  
  var bar = svg.selectAll(".bar")
      .data(dataset)
      .enter().append("g")
      .attr("class", "rect")
      .attr("transform", function(d) { return "translate(" + x0(d.subtopic) + ",0)"; });
  
  bar.selectAll("rect")
      .data(function(d) { return d.valores; })
      .enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("value", function(d){return d.name;})
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return z(d.name); });
  
  bar
      .on("mousemove", function(d){
          // tip.show(d)
          if (d.OSAT >= num) {
              d3.select(this)
                .attr("fill", "#297FAA");
            } else {
              d3.select(this)
                .attr("fill", "#000");
            }
          // divTooltip.style("left", d3.event.pageX+10+"px");
          // divTooltip.style("top", d3.event.pageY-25+"px");
          // divTooltip.style("display", "inline-block");
          // var x = d3.event.pageX, y = d3.event.pageY
          // var elements = document.querySelectorAll(':hover');
          // l = elements.length
          // l = l-1
          // elementData = elements[l].__data__
          // divTooltip.html((d.subtopic)+"<br>"+elementData.name+"<br>"+elementData.value+"%");
      });
  bar
      .on("mouseout", function(d){
          // divTooltip.style("display", "none");
      });
  
  

    //   var x = d3.scaleBand()
    //     .domain(xAxisData)
    //     .range([0, width])
    //     .padding(.2)
    //   var y = d3.scaleLinear()
    //     .domain([0, 5])
    //     .range([height, 0]);
    //   var xAxis = d3.axisBottom(x);
    //   var yAxis = d3.axisLeft(y);
    //   var tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .offset([-15, 0])
    //   .html(function (d) {
    //     // let count = survey + 'count'
    //     return "Average Rating: <span style='color:#21AAE1; line-height: 1.5;'> " + d.OSAT + "</span>" + "<br>" + "Responded: <span style='color:#21AAE1; line-height: 1.5;'> " + d.count + "</span>"
    //   })
    //   .style('font-size', '11px')
    //   var svg = d3.select("#surveyInstructorBarChart").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //   svg.call(tip);
    //   svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //     .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .style("text-anchor", "end")
    //   svg.append('g')
    //     .attr('class', 'x axis')
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)
    //     .append("text")
    //   svg.selectAll(".bar")
    //     .data(data)
    //     .enter().append("rect")
    //     .attr("class", "bar")
    //     .attr("x", function (d) {
    //     return x(d.subtopic);
    //   })
    //     .attr("width", x.bandwidth())
    //     .attr("y", height)
    //     .attr("height", function (d) {
    //     return 0;
    //   })
    //     .attr('fill', function (d) {
    //       if (d.OSAT >= num) return '#21AAE1'
    //       else return '#3d3d3d';
    //     })
    //     .on('mouseover', function (d) {
    //       tip.show(d)
    //       if (d.OSAT >= num) {
    //         d3.select(this)
    //           .attr("fill", "#297FAA");
    //       } else {
    //         d3.select(this)
    //           .attr("fill", "#000");
    //       }
    //     })
    //     .on('mouseout', function (d) {
    //       tip.hide(d)
    //       if (d.OSAT >= num) {
    //         d3.select(this)
    //           .attr("fill", '#21AAE1');
    //       } else {
    //         d3.select(this)
    //           .attr("fill", "#3d3d3d");
    //       }
    //     })
    //     .transition()
    //     .duration(1000)
    //     .attr("width", x.bandwidth())
    //     .attr("y", function (d) {
    //       return y(d.OSAT);
    //     })
    //     .attr("height", function (d) {
    //       return height - y(d.OSAT);
    //     })
    //     .attr('fill', function (d) {
    //       if (d.OSAT >= num) return '#21AAE1'
    //       else return '#3d3d3d';
    //     })

    // changeBar = (surveyData) => {
    //     console.log(surveyData)
    //     let num = 4;
    //     let newData = filteredData;
        
    //     var yD = d3.scaleLinear().domain([0, 5]).range([height - 20, 0]);

    //     var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-15, 0])
    //     .html(function (d) {
    //       // let count = survey + 'count'
    //       return "Average Rating: <span style='color:#21AAE1; line-height: 1.5;'> " + d.OSAT + "</span>" + "<br>" + "Responded: <span style='color:#21AAE1; line-height: 1.5;'> " + d.count + "</span>"
    //     })
    //     .style('font-size', '11px')
    //     svg.call(tip);

    //     d3.selectAll('.bar')
    //       .attr("y", height)
    //       .attr("height", function (d) {
    //         return 0;
    //       })
    //     d3.select('#surveyInstructorBarChart')
    //       .selectAll(".bar")
    //       .data(newData)
    //       .attr("x", function (d) {
    //         return x(d.subtopic);
    //       })
    //       .on('mouseover', function (d) {
    //         tip.show(d)
    //         if (d.OSAT >= num) {
    //           d3.select(this)
    //             .attr("fill", "#297FAA");
    //         } else {
    //           d3.select(this)
    //             .attr("fill", "#000");
    //         }
    //       })
    //       .on('mouseout', function (d) {
    //         tip.hide(d)
    //         if (d.OSAT >= num) {
    //           d3.select(this)
    //             .attr("fill", '#21AAE1');
    //         } else {
    //           d3.select(this)
    //             .attr("fill", "#3d3d3d");
    //         }
    //       })
    //       .transition()
    //       .duration(1000)
    //       .attr("width", x.bandwidth())
    //       .attr("y", function (d) {
    //         return yD(d.OSAT);
    //       })
    //       .attr("height", function (d) {
    //         return height - yD(d.OSAT);
    //       })
    //       .attr('fill', function (d) {
    //         if (d.OSAT >= num) return '#21AAE1'
    //         else return '#3d3d3d';
    //       })

    //   }

    //   $scope.$watch('instructordata', function (newValue, oldValue) {
    //     changeBar($scope.instructordata)
    //   })
    }
  }
})
