angular.module('app').directive('surveyInstructorBarChart', function() {
  return {
    template: '<div id="surveyInstructorBarChart"></div>',
    scope: {
      instructordata: '=',
    },
    controller: function($scope, surveyService) {
      // /D3 Instructor graph in progress///

      dataset = [
        {
          overall: 0,
          explained: 0,
          prepared: 0,
          subtopic: '1.1',
        },
        {
          overall: 0,
          explained: 0,
          prepared: 0,
          subtopic: '1.2',
        },
        {
          overall: 0,
          explained: 0,
          prepared: 0,
          subtopic: '1.3',
        },
        {
          overall: 0,
          explained: 0,
          prepared: 0,
          subtopic: '1.4',
        },
        {
          overall: 0,
          explained: 0,
          prepared: 0,
          subtopic: '1.5',
        },
        {
          overall: 0,
          explained: 0,
          prepared: 3,
          subtopic: '1.6',
        },
      ];

      const options = d3.keys(dataset[0]).filter(function(key) {
        return key !== 'subtopic';
      });

      dataset.forEach(function(d) {
        d.valores = options.map(function(name) {
          return { name: name, value: +d[name] };
        });
      });

      const margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 50,
      };

      const num = 4;
      const width = document.getElementById('surveyInstructorBarChart').offsetWidth - margin.right - margin.left;
      const height = document.getElementById('surveyInstructorBarChart').offsetHeight - margin.top - margin.bottom - 80;

      const x0 = d3
        .scaleBand()
        .domain(
          dataset.map(function(d) {
            return d.subtopic;
          })
        )
        .rangeRound([0, width], 0.1)
        .paddingInner(0.1);

      const x1 = d3
        .scaleBand()
        .domain(options)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);

      const y = d3
        .scaleLinear()
        .domain([0, 5])
        .range([height, 0]);

      const z = d3.scaleOrdinal().range(['#21AAE1', '#1b6689', '#0f4a66']);

      const xAxis = d3.axisBottom(x0);
      const yAxis = d3.axisLeft(y);

      const divTooltip = d3
        .select('#surveyInstructorBarChart')
        .append('div')
        .attr('class', 'toolTip');
      const tip = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([-15, 0])
        .html(function(d) {
          return (
            `Average Rating: <span style='color:#21AAE1; line-height: 1.5;'> ${
              elementData.value
            }</span><br>Responded: <span style='color:#21AAE1; line-height: 1.5;'> ` +
            `?` +
            `</span></span><br>Program: <span style='color:#21AAE1; line-height: 1.5;'> ${elementData.name.toUpperCase()}</span>`
          );
        })
        .style('font-size', '11px');

      const svg = d3
        .select('#surveyInstructorBarChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      svg.call(tip);
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .append('text');
      svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'end');

      const bar = svg
        .selectAll('.bar')
        .data(dataset)
        .enter()
        .append('g')
        .attr('class', 'rect')
        .attr('transform', function(d) {
          return `translate(${x0(d.subtopic)},0)`;
        });

      bar
        .selectAll('rect')
        .data(function(d) {
          return d.valores;
        })
        .enter()
        .append('rect')
        .attr('width', x1.bandwidth())
        .attr('x', function(d) {
          return x1(d.name);
        })
        .attr('y', function(d) {
          return y(d.value);
        })
        .attr('value', function(d) {
          return d.name;
        })
        .attr('height', function(d) {
          return height - y(d.value);
        })
        .style('fill', function(d) {
          return z(d.name);
        });

      bar.on('mousemove', function(d) {
        let x = d3.event.pageX,
          y = d3.event.pageY;
        const elements = document.querySelectorAll(':hover');
        l = elements.length;
        l -= 1;
        elementData = elements[l].__data__;
        tip.show(d);
      });
      bar.on('mouseout', function(d) {
        tip.hide(d);
      });
      bar
        .transition()
        .duration(1000)
        .attr('width', x1.bandwidth())
        .attr('y', function(d) {
          return y(d.value);
        })
        .attr('height', function(d) {
          return height - y(d.value);
        })
        .style('fill', function(d) {
          return z(d.name);
        });

      changeBar = surveyData => {
        if (surveyData) {
          const filteredSurveyData = surveyData.map(e => {
            const subtopicEdited = e.subtopic
              .split('')
              .splice(2, 4)
              .join('');
            return {
              overall: e.overall,
              prepared: e.prepared,
              explained: e.explain,
              subtopic: subtopicEdited,
            };
          });

          const options = d3.keys(filteredSurveyData[0]).filter(function(key) {
            return key !== 'subtopic';
          });

          filteredSurveyData.forEach(function(d) {
            d.valores = options.map(function(name) {
              return { name: name, value: +d[name] };
            });
          });

          const x0 = d3
            .scaleBand()
            .domain(
              filteredSurveyData.map(function(d) {
                return d.subtopic;
              })
            )
            .rangeRound([0, width], 0.1)
            .paddingInner(0.1);

          const x1 = d3
            .scaleBand()
            .domain(options)
            .rangeRound([0, x0.bandwidth()])
            .padding(0.05);

          const y = d3
            .scaleLinear()
            .domain([0, 5])
            .range([height, 0]);

          const z = d3.scaleOrdinal().range(['#21AAE1', '#1b6689', '#0f4a66']);

          const xAxis = d3.axisBottom(x0);
          const yAxis = d3.axisLeft(y);

          const bar = svg
            .selectAll('.bar')
            .data(filteredSurveyData)
            .enter()
            .append('g')
            .attr('class', 'rect')
            .attr('transform', function(d) {
              return `translate(${x0(d.subtopic)},0)`;
            });

          bar
            .selectAll('rect')
            .data(function(d) {
              return d.valores;
            })
            .enter()
            .append('rect')
            .attr('width', x1.bandwidth())
            .attr('x', function(d) {
              return x1(d.name);
            })
            .attr('y', function(d) {
              return y(d.value);
            })
            .attr('value', function(d) {
              return d.name;
            })
            .attr('height', function(d) {
              return height - y(d.value);
            })
            .style('fill', function(d) {
              return z(d.name);
            });

          bar.on('mousemove', function(d) {
            let x = d3.event.pageX,
              y = d3.event.pageY;
            const elements = document.querySelectorAll(':hover');
            l = elements.length;
            l -= 1;
            elementData = elements[l].__data__;
            tip.show(d);
          });
          bar.on('mouseout', function(d) {
            tip.hide(d);
          });
          bar
            .transition()
            .duration(1000)
            .attr('width', x1.bandwidth())
            .attr('y', function(d) {
              return y(d.value);
            })
            .attr('height', function(d) {
              return height - y(d.value);
            })
            .style('fill', function(d) {
              return z(d.name);
            });
        }
      };

      $scope.$watch('instructordata', function(newValue, oldValue) {
        changeBar($scope.instructordata);
      });
    },
  };
});
