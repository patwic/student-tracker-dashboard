angular.module('app')
  .directive('bar', function () {
    return {
      restrict: 'AE',
      template: '<div></div>',
      scope: {
        data: '='
      },
      controller: function () {

        let data;

        data.sort((a, b) => {
          return a[1] - b[1]
        })

        var margin = {
            top: 40,
            right: 20,
            bottom: 30,
            left: 40
          },
          width = 560 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

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

        var svg = d3.select("body").append("svg")
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