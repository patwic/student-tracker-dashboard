angular.module('app')
  .directive('barChart', function () {
    return {
      restrict: 'AE',
      template: '<div id="barChart"></div>',
      scope: {
        projectData: '='
      },
      controller: function ($scope) {

        let d = $scope.projectData;
        console.log()

        let dummy = [['ZK', 50], ['HJ', 50], ['JH', 60], ['GH', 65]]

        let data = []
        data = data.concat(dummy)
        for (let i = 0; i < d.length; i++) {
          data.push([d[i].initials, d[i].personalScore])
        }

        data.sort((a, b) => {
          return a[1] - b[1]
        })

        var margin = {
            top: 40,
            right: 30,
            bottom: 40,
            left: 50
          }
        var height = document.getElementById('projectScoresDiv').offsetHeight - 100 - margin.top - margin.bottom;
        var width = document.getElementById('projectScoresDiv').offsetWidth - margin.right - margin.left;

        var x = d3.scaleBand()
          .domain(data.map(function (d) {
            return d[0];
          }))
          .range([0, width])
          .padding(.1);

        var y = d3.scaleLinear()
          .domain([0, d3.max(data, function (d) {
            return d[1];
          })])
          .range([height, 0]);

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y)

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function (d) {
            return "<strong>Student:</strong> <span style='color:#21AAE1'> " + d[0] + "</span>";
          })
          .style('font-size', '11px')

        var svg = d3.select("#barChart").append("svg")
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
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Student");

        svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function (d) {
            return x(d[0]);
          })
          .attr("width", x.bandwidth())
          .attr("y", function (d) {
            return y(d[1]);
          })
          .attr("height", function (d) {
            return height - y(d[1]);
          })
          .attr('fill', function (d) {
            if (d[1] >= 70) return '#21AAE1'
            else return '#141414';
          })
          .on('mouseover', function (d) {
            tip.show(d)
            if (d[1] >= 70) {
              d3.select(this)
                .attr("fill", "#297FAA");
            } else {
              d3.select(this)
                .attr("fill", "#000");
            }
          })
          .on('mouseout', function (d) {
            tip.hide(d)
            if (d[1] >= 70) {
              d3.select(this)
                .attr("fill", '#21AAE1');
            } else {
              d3.select(this)
                .attr("fill", "#141414");
            }
          })




        function type(d) {
          d[1] = +d[1];
          return d;
        }

      }
    }
  })