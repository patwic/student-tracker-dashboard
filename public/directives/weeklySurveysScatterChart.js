angular
  .module('app')
  .directive('surveyScatter', function () {
    return {
      template: '<div id="surveyScatter"></div>',
      scope: {
        sd: '=',
        survey: '='
      },
      controller: function ($scope, surveyService) {


        let survey = $scope.survey //OSAT || MSAT || FSAT || CSAT
        let filteredData = $scope.sd //All data;
        console.log($scope.sd)

        //Builds graph with initial data.

        let averages = (dataArr) => {
          let arr = []
          let obj = {}
          let max = 0;
          let min = 13;
          for (let i = 0; i < dataArr.length; i++) {
            let u = dataArr[i].unit
            if (u > max) 
              max = u
            if (u < min) 
              min = u
            let d = dataArr[i]
            if (!obj[u]) 
              obj[u] = {}
            obj[u].CSAT = obj[u].CSAT
              ? obj[u].CSAT + d.CSAT
              : d.CSAT
            obj[u].FSAT = obj[u].FSAT
              ? obj[u].FSAT + d.FSAT
              : d.FSAT
            obj[u].MSAT = obj[u].MSAT
              ? obj[u].MSAT + d.MSAT
              : d.MSAT
            obj[u].OSAT = obj[u].OSAT
              ? obj[u].OSAT + d.OSAT
              : d.OSAT
            obj[u].CSATcount = obj[u].CSATcount
              ? obj[u].CSATcount += 1
              : 1
            obj[u].FSATcount = obj[u].FSATcount
              ? obj[u].FSATcount += 1
              : 1
            obj[u].MSATcount = obj[u].MSATcount
              ? obj[u].MSATcount += 1
              : 1
            obj[u].OSATcount = obj[u].OSATcount
              ? obj[u].OSATcount += 1
              : 1
          }
          for (let i = min; i <= max; i++) {
            obj[i].CSAT = (obj[i].CSAT / obj[i].CSATcount).toFixed(2)
            obj[i].FSAT = (obj[i].FSAT / obj[i].FSATcount).toFixed(2)
            obj[i].MSAT = (obj[i].MSAT / obj[i].MSATcount).toFixed(2)
            obj[i].OSAT = (obj[i].OSAT / obj[i].OSATcount).toFixed(2)
            obj[i].unit = i
            arr.push(obj[i])
          }
          return arr
        }
        let data = averages(filteredData)
        // let data = filteredData
        console.log("data", data)
        var margin = {
          top: 40,
          right: 40,
          bottom: 30,
          left: 50
        }

        var width = document
          .getElementById('graphBoxDiv')
          .offsetWidth - margin.right - margin.left;
        var height = document
          .getElementById('graphBoxDiv')
          .offsetHeight - margin.top - margin.bottom - 80;

        var x = d3
          .scaleLinear()
          .domain([0, 13])
          .range([0, width]);

        var y = d3
          .scaleLinear()
          .domain([1, 10])
          .range([height, 0]);

        var svg = d3
          .select("#surveyScatter")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("r", 4)
          .attr("cx", function (d) {
            return x(+ d.unit);
          })
          .attr("cy", function (d) {
            // console.log(+d[survey])
            return y(+ d[survey]);
          })
          .attr("fill", "#21AAE1")
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
        svg
          .append("g")
          .call(d3.axisLeft(y));

        changeScatter = (newSurvey) => {
          //Will need to rebuild entire graph with the new data.
          console.log($scope.survey);
          console.log(survey);
          survey = newSurvey;
          let newFilteredData = $scope.sd
          console.log(newFilteredData)

          svg
            .selectAll('circle')
            .remove();

          svg
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 4)
            .attr("cx", function (d) {
              return x(+ d.unit);
            })
            .attr("cy", function (d) {
              // console.log(+d[survey])
              return y(+ d[survey]);
            })
            .attr("fill", "#21AAE1")
          svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
          svg
            .append("g")
            .call(d3.axisLeft(y));
        }

        $scope
          .$watch('survey', function (newValue, oldValue) {
            changeScatter($scope.survey, $scope.sd)
          })
        $scope.$watch('sd', function (newValue, oldValue) {
          changeScatter($scope.survey, $scope.sd)
        })

      }
    }

  })