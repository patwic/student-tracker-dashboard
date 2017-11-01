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
          "OSAT": 5,
          "subtopic": 'w-1.3',
        },{
          "OSAT": 3,
          "subtopic": 'w-1.1',
        },{
          "OSAT": 4,
          "subtopic": 'w-1.2',
        }]
          
        let data = filteredData

        var margin = {
          top: 30,
          right: 30,
          bottom: 30,
          left: 50
        }

        var width = document.getElementById('surveyInstructorBarChart').offsetWidth - margin.right - margin.left;
        var height = document.getElementById('surveyInstructorBarChart').offsetHeight - margin.top - margin.bottom - 80;

        var x = d3.scaleBand()
        .domain([1, 2, 3, 4, 5])
        .range([0, width])
        .padding(.2)
      var y = d3.scaleLinear()
        .domain([0, 5])
        .range([height, 0]);
      var xAxis = d3.axisBottom(x);
      var yAxis = d3.axisLeft(y);

      var svg = d3.select("#surveyInstructorBarChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        return x(d.unit);
      })
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", function (d) {
        return 0;
      })
     
    changeBar = (surveyData) => {

        console.log(surveyData)

      }

      $scope.$watch('instructordata', function (newValue, oldValue) {
        changeBar($scope.instructordata)
      })
    }
  }
})