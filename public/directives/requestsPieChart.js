angular.module('app')
  .directive('requestsPie', function () {
    return {
      restrict: 'AE',
      template: '<div id="requestsPie"></div>',
      scope: {
        requestsData: '='
      },
      controller: function ($scope) {

        let requestsData = $scope.requestsData.sort((a, b) => {
          return b - a;
        })

        var height = document.getElementById('requestsDiv').offsetHeight/3;
        var width = height;
        var radius = Math.min(width, height) / 2;

        var arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);

        var pie = d3.pie()
          .sort(null)
          .value(function (d) {
            return d;
          });

        var svg = d3.select("#requestsPie").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
          .data(pie(requestsData))
          .enter().append("g")
          .attr("class", "arc");

        var color = d3.scaleOrdinal()
          .range(["#25AAE1", "#297FAA", "#1C648C"]);

        g.append("path")
          .attr("d", arc)
          .style("fill", function (d, i) {
            return color(i);
          })

      }
    }
  })