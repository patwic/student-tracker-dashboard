angular.module('app').directive('requestsPie', function() {
  return {
    restrict: 'AE',
    template: '<div id="requestsPie"></div>',
    scope: {
      requestsData: '=',
    },
    controller: function($scope) {
      let requestsData = $scope.requestsData;
      requestsData = [
        requestsData[0].percent,
        requestsData[1].percent,
        requestsData[2].percent,
        requestsData[3].percent,
      ];

      const height = document.getElementById('requestsDiv').offsetHeight / 3;
      const width = height;
      const radius = Math.min(width, height) / 2;

      let arc = d3
        .arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      let pie = d3
        .pie()
        .sort(null)
        .value(function(d) {
          return d;
        });

      let svg = d3
        .select('#requestsPie')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${  width / 2  },${  height / 2  })`);

      let g = svg
        .selectAll('.arc')
        .data(pie(requestsData))
        .enter()
        .append('g')
        .attr('class', 'arc');

      let gradient = svg
        .append('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#999')
        .attr('stop-opacity', 1);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#111')
        .attr('stop-opacity', 1);

      let color = d3.scaleOrdinal().range(['#25AAE1', '#297FAA', '#1C648C', 'url(#gradient)']);

      g
        .append('path')
        .attr('d', arc)
        .style('fill', function(d, i) {
          return color(i);
        });

      const updateRequestsData = data => {
        requestsData = [data[0].percent, data[1].percent, data[2].percent, data[3].percent];
        const pie = d3.pie().value(function(d) {
          return d;
        })(requestsData);
        path = d3
          .select('#requestsPie')
          .selectAll('path')
          .data(pie);
        path
          .transition()
          .duration(500)
          .attrTween('d', arcTween);
      };

      function arcTween(a) {
        const i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }

      $scope.$watch('requestsData', function(newValue, oldValue) {
        updateRequestsData($scope.requestsData);
      });
    },
  };
});
