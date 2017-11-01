angular.module('app')
.directive('surveyInstructorBarChart', function () {
  return {
    template: '<div id="surveyInstructorBarChart"></div>',
    scope: {
        instructordata: '=',
    },
    controller: function ($scope, surveyService) {

        // console.log($scope.instructordata)

        let filteredData = [{
          "OSAT": 4.5,
          "subtopic": '1.1',
          "count": 8
        },{
          "OSAT": 3,
          "subtopic": '1.2',
          "count": 9
        },{
          "OSAT": 4,
          "subtopic": '1.3',
          "count": 10
        },{
          "OSAT": 4.5,
          "subtopic": '1.4',
          "count": 12
        },{
          "OSAT": 3,
          "subtopic": '1.5',
          "count": 7
        },{
          "OSAT": 4.5,
          "subtopic": '1.6',
          "count": 6
        }]

        xAxisData = filteredData.map(e => e.subtopic)

        console.log(xAxis)
          
        let data = filteredData

        var margin = {
          top: 30,
          right: 30,
          bottom: 30,
          left: 50
        }

      let num = 4;
      var width = document.getElementById('surveyInstructorBarChart').offsetWidth - margin.right - margin.left;
      var height = document.getElementById('surveyInstructorBarChart').offsetHeight - margin.top - margin.bottom - 80;

      var x = d3.scaleBand()
        .domain(xAxisData)
        .range([0, width])
        .padding(.2)
      var y = d3.scaleLinear()
        .domain([0, 5])
        .range([height, 0]);
      var xAxis = d3.axisBottom(x);
      var yAxis = d3.axisLeft(y);
      var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-15, 0])
      .html(function (d) {
        // let count = survey + 'count'
        return "Average Rating: <span style='color:#21AAE1; line-height: 1.5;'> " + d.OSAT + "</span>" + "<br>" + "Responded: <span style='color:#21AAE1; line-height: 1.5;'> " + d.count + "</span>"
      })
      .style('font-size', '11px')
      var svg = d3.select("#surveyInstructorBarChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      svg.call(tip);
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
      svg.append('g')
        .attr('class', 'x axis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
        return x(d.subtopic);
      })
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", function (d) {
        return 0;
      })
        .attr('fill', function (d) {
          if (d.OSAT >= num) return '#21AAE1'
          else return '#3d3d3d';
        })
        .on('mouseover', function (d) {
          tip.show(d)
          if (d.OSAT >= num) {
            d3.select(this)
              .attr("fill", "#297FAA");
          } else {
            d3.select(this)
              .attr("fill", "#000");
          }
        })
        .on('mouseout', function (d) {
          tip.hide(d)
          if (d.OSAT >= num) {
            d3.select(this)
              .attr("fill", '#21AAE1');
          } else {
            d3.select(this)
              .attr("fill", "#3d3d3d");
          }
        })
        .transition()
        .duration(1000)
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
          return y(d.OSAT);
        })
        .attr("height", function (d) {
          return height - y(d.OSAT);
        })
        .attr('fill', function (d) {
          if (d.OSAT >= num) return '#21AAE1'
          else return '#3d3d3d';
        })

    changeBar = (surveyData) => {
        console.log(surveyData)
        let num = 4;
        let newData = filteredData;
        
        var yD = d3.scaleLinear().domain([0, 5]).range([height - 20, 0]);

        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-15, 0])
        .html(function (d) {
          // let count = survey + 'count'
          return "Average Rating: <span style='color:#21AAE1; line-height: 1.5;'> " + d.OSAT + "</span>" + "<br>" + "Responded: <span style='color:#21AAE1; line-height: 1.5;'> " + d.count + "</span>"
        })
        .style('font-size', '11px')
        svg.call(tip);

        d3.selectAll('.bar')
          .attr("y", height)
          .attr("height", function (d) {
            return 0;
          })
        d3.select('#surveyInstructorBarChart')
          .selectAll(".bar")
          .data(newData)
          .attr("x", function (d) {
            return x(d.subtopic);
          })
          .on('mouseover', function (d) {
            tip.show(d)
            if (d.OSAT >= num) {
              d3.select(this)
                .attr("fill", "#297FAA");
            } else {
              d3.select(this)
                .attr("fill", "#000");
            }
          })
          .on('mouseout', function (d) {
            tip.hide(d)
            if (d.OSAT >= num) {
              d3.select(this)
                .attr("fill", '#21AAE1');
            } else {
              d3.select(this)
                .attr("fill", "#3d3d3d");
            }
          })
          .transition()
          .duration(1000)
          .attr("width", x.bandwidth())
          .attr("y", function (d) {
            return yD(d.OSAT);
          })
          .attr("height", function (d) {
            return height - yD(d.OSAT);
          })
          .attr('fill', function (d) {
            if (d.OSAT >= num) return '#21AAE1'
            else return '#3d3d3d';
          })

      }

      $scope.$watch('instructordata', function (newValue, oldValue) {
        changeBar($scope.instructordata)
      })
    }
  }
})