angular.module('app').directive('mentorPie', function() {
  return {
    restrict: 'AE',
    template: '<div id="mentorPie"></div>',
    scope: {
      mentorData: '=',
    },
    controller: function($scope) {
      let mentorData = $scope.mentorData.sort((a, b) => b - a);

      const height = document.getElementById('mentorHelpDiv').offsetHeight - 50;
      const width = height;
      const radius = Math.min(width, height) / 2;

      const arc = d3
        .arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      const pie = d3
        .pie()
        .sort(null)
        .value(function(d) {
          return d;
        });

      const svg = d3
        .select('#mentorPie')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const g = svg
        .selectAll('.arc')
        .data(pie(mentorData))
        .enter()
        .append('g')
        .attr('class', 'arc');

      const color = d3.scaleOrdinal().range(['#25AAE1', '#297FAA', '#1C648C']);

      g
        .append('path')
        .attr('d', arc)
        .style('fill', function(d, i) {
          return color(i);
        });

      const updateMentorPieData = data => {
        mentorData = data.sort((a, b) => b - a);
        const pie = d3.pie().value(function(d) {
          return d;
        })(mentorData);
        path = d3
          .select('#mentorPie')
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

      $scope.$watch('mentorData', function(newValue, oldValue) {
        updateMentorPieData($scope.mentorData);
      });
    },
  };
});
