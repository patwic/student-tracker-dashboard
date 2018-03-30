angular.module('app').directive('barChart', function() {
  return {
    restrict: 'AE',
    template: '<div id="barChart"></div>',
    scope: {
      projectData: '=',
      projectName: '=',
    },
    controller: function($scope) {
      const d = $scope.projectData;

      let personalScore = [['ZK', 50], ['HJ', 50], ['JH', 60], ['GH', 65], ['ZZ', 90], ['XX', 100]];
      let groupScore = [['ZK', 90], ['HJ', 80], ['JH', 70], ['GH', 50], ['ZZ', 110], ['XX', 130]];
      let noServerScore = [['ZK', 6], ['HJ', 3], ['JH', 5], ['GH', 2], ['ZZ', 9], ['XX', 11]];

      const project = $scope.projectName;

      let data = [];
      let num;

      if (project === 'personalScore') {
        data = data.concat(personalScore);
        num = 70;
      }
      if (project === 'groupScore') {
        data = data.concat(groupScore);
        num = 100;
      }
      if (project === 'noServerScore') {
        data = data.concat(noServerScore);
        num = 7;
      }

      for (let i = 0; i < d.length; i++) {
        data.push([d[i].initials, d[i][project]]);
      }

      data.sort((a, b) => a[1] - b[1]);

      const margin = {
        top: 40,
        right: 30,
        bottom: 40,
        left: 50,
      };
      const height = document.getElementById('projectScoresDiv').offsetHeight - 100 - margin.top - margin.bottom;
      const width = document.getElementById('projectScoresDiv').offsetWidth - margin.right - margin.left;

      let x = d3
        .scaleBand()
        .domain(
          data.map(function(d) {
            return d[0];
          })
        )
        .range([0, width])
        .padding(0.1);

      let y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function(d) {
            return d[1];
          }),
        ])
        .range([height, 0]);

      const xAxis = d3.axisBottom(x);

      let yAxis = d3.axisLeft(y);

      let tip = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return `<strong>Student:</strong> <span style='color:#21AAE1'> ${  d[0]  }</span>`;
        })
        .style('font-size', '11px');

      let svg = d3
        .select('#barChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${  margin.left  },${  margin.top  })`);

      svg.call(tip);

      svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Student');

      svg
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d[0]);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d[1]);
        })
        .attr('height', function(d) {
          return height - y(d[1]);
        })
        .attr('fill', function(d) {
          if (d[1] >= num) return '#21AAE1';
          return '#141414';
        })
        .on('mouseover', function(d) {
          tip.show(d);
          if (d[1] >= num) {
            d3.select(this).attr('fill', '#297FAA');
          } else {
            d3.select(this).attr('fill', '#000');
          }
        })
        .on('mouseout', function(d) {
          tip.hide(d);
          if (d[1] >= num) {
            d3.select(this).attr('fill', '#21AAE1');
          } else {
            d3.select(this).attr('fill', '#141414');
          }
        });

      function type(d) {
        d[1] = +d[1];
        return d;
      }

      const updateBarChart = (newData, num) => {
        let yD = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(newData, function(d) {
              return d[1];
            }),
          ])
          .range([height - 20, 0]);

        let yAxis = d3.axisLeft(yD);

        let ya = d3.select('#barChart').selectAll('.y.axis');

        const bars = d3
          .select('#barChart')
          .selectAll('.bar')
          .data(newData)
          .attr('y', height)
          .attr('height', 0)
          .on('mouseover', function(d) {
            tip.show(d);
            if (d[1] >= num) {
              d3.select(this).attr('fill', '#297FAA');
            } else {
              d3.select(this).attr('fill', '#000');
            }
          })
          .on('mouseout', function(d) {
            tip.hide(d);
            if (d[1] >= num) {
              d3.select(this).attr('fill', '#21AAE1');
            } else {
              d3.select(this).attr('fill', '#141414');
            }
          });

        bars
          .transition()
          .duration(1000)
          .attr('width', x.bandwidth())
          .attr('y', function(d) {
            return yD(d[1]);
          })
          .attr('height', function(d) {
            return height - yD(d[1]);
          })
          .attr('fill', function(d) {
            if (d[1] >= num) return '#21AAE1';
            return '#141414';
          });

        ya
          .transition()
          .duration(1000)
          .call(yAxis);
      };

      $scope.$watch('projectName', function(newValue, oldValue) {
        const d = $scope.projectData;

        const project = $scope.projectName;

        let data = [];
        let num;

        if (project === 'personalScore') {
          data = data.concat(personalScore);
          num = 70;
        }
        if (project === 'groupScore') {
          data = data.concat(groupScore);
          num = 100;
        }
        if (project === 'noServerScore') {
          data = data.concat(noServerScore);
          num = 7;
        }

        for (let i = 0; i < d.length; i++) {
          data.push([d[i].initials, d[i][project]]);
        }

        data.sort((a, b) => a[1] - b[1]);

        updateBarChart(data, num);
      });
    },
  };
});
