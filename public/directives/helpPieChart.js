angular.module('app')
  .directive('helpPie', function () {
    return {
      restrict: 'AE',
      template: '<div id="helpPie"></div>',
      scope: {
        helpData: '='
      },
      controller: function ($scope) {

        let helpData = $scope.helpData
        helpData = [helpData[0].percent, helpData[1].percent, helpData[2].percent, helpData[3].percent]

        var height = document.getElementById('helpDiv').offsetHeight / 3;
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

        var svg = d3.select("#helpPie").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
          .data(pie(helpData))
          .enter().append("g")
          .attr("class", "arc");

        var gradient = svg.append("defs")
          .append("linearGradient")
          .attr("id", "gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "100%")
          .attr("spreadMethod", "pad");

        gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#999")
          .attr("stop-opacity", 1);

        gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#111")
          .attr("stop-opacity", 1);

        var color = d3.scaleOrdinal()
          .range(["#25AAE1", "#297FAA", "#1C648C", 'url(#gradient)']);

        g.append("path")
          .attr("d", arc)
          .style("fill", function (d, i) {
            return color(i);
          })


        let updateHelpData = (data) => {
          helpData = [data[0].percent, data[1].percent, data[2].percent, data[3].percent]

          g.data(pie(helpData));
          g.transition().duration(750).attrTween('d', arcTween)
        }

        function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function (t) {
            return arc(i(t));
          };
        }

        $scope.$watch('helpData', function (newValue, oldValue) {
          updateHelpData($scope.helpData)
        })

      }
    }
  })