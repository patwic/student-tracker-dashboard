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

        //Builds graph with initial data.
        let arrLength;
        let averages = (dataArr) => {
          let arr = []
          let obj = {}
          let max = 0;
          let min = 7;
          for (let i = 0; i < dataArr.length; i++) {
            let u = dataArr[i].unit
            if (u > max && u < 14) 
              max = u
            if (u > max && u > 13) 
              max = 13
            if (u < min) 
              min = u
            let d = dataArr[i]
            if (!obj[u]) 
              obj[u] = {}
            obj[u].CSAT = obj[u].CSAT ? obj[u].CSAT + d.CSAT : d.CSAT
            obj[u].FSAT = obj[u].FSAT ? obj[u].FSAT + d.FSAT : d.FSAT
            obj[u].MSAT = obj[u].MSAT ? obj[u].MSAT + d.MSAT : d.MSAT
            obj[u].OSAT = obj[u].OSAT ? obj[u].OSAT + d.OSAT : d.OSAT
            obj[u].CSATcount = obj[u].CSATcount ? obj[u].CSATcount += 1 : 1
            obj[u].FSATcount = obj[u].FSATcount ? obj[u].FSATcount += 1 : 1
            obj[u].MSATcount = obj[u].MSATcount ? obj[u].MSATcount += 1 : 1
            obj[u].OSATcount = obj[u].OSATcount ? obj[u].OSATcount += 1 : 1
          }
          for (let i = min; i <= max; i++) {
              if (!obj[i]) 
                continue

            obj[i].CSAT = (obj[i].CSAT / obj[i].CSATcount).toFixed(2)
            obj[i].FSAT = (obj[i].FSAT / obj[i].FSATcount).toFixed(2)
            obj[i].MSAT = (obj[i].MSAT / obj[i].MSATcount).toFixed(2)
            obj[i].OSAT = (obj[i].OSAT / obj[i].OSATcount).toFixed(2)
            obj[i].unit = i
            obj[i].program = dataArr[i].program;
            arr.push(obj[i])
          }
          return arr
        }
        let data = averages(filteredData)
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

        var tip = d3
          .tip()
          .attr('class', 'd3-tip')
          .offset([-15, 0])
          .html(function (d) {
            let count = survey + 'count'
            return "Average Rating: <span style='color:#21AAE1; line-height: 1.5;'> " + d[survey] + "</span><br>Responded: <span style='color:#21AAE1; line-height: 1.5;'> " + d[count] + "</span></span><br>Program: <span style='color:#21AAE1; line-height: 1.5;'> " + d.program.toUpperCase() + "</span>"
          })

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
            return y(+ d[survey]);
          })
          .attr("fill", "#21AAE1")
          .on('mouseover', function (d) {
            tip.show(d)
          })
          .on('mouseout', function (d) {
            tip.hide(d)
          })

        svg.call(tip);

        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
        svg
          .append("g")
          .call(d3.axisLeft(y));

        // CHANGE SCATTER
        changeScatter = (newSurvey, newSd) => {
          //Will need to rebuild entire graph with the new data.
          survey = newSurvey;

          let webdev = [];
          let ios = [];
          let qa = [];
          let ux = [];

          let newData = [];

          let newFilteredData = newSd

          if (Object.prototype.toString.call(newFilteredData) !== '[object Array]') {
            webdev = averages(newFilteredData.webdev);
            ios = averages(newFilteredData.ios);
            qa = averages(newFilteredData.qa);
            ux = averages(newFilteredData.ux);

            svg
              .selectAll('circle')
              .remove();

            // webdev
            svg
              .selectAll("dot")
              .data(webdev)
              .enter()
              .append("circle")
              .attr("r", 8)
              .attr("cx", function (d) {
                return x(+ d.unit);
              })
              .attr("cy", function (d) {
                return y(+ d[survey]);
              })
              .attr("fill", "#21AAE1")
              .on('mouseover', function (d) {
                tip.show(d)
              })
              .on('mouseout', function (d) {
                tip.hide(d)
              })

            svg.call(tip);

            // ios
            svg
              .selectAll("dot")
              .data(ios)
              .enter()
              .append("circle")
              .attr("r", 8)
              .attr("cx", function (d) {
                return x(+ d.unit);
              })
              .attr("cy", function (d) {
                return y(+ d[survey]);
              })
              .attr("fill", "#1b6689")
              .on('mouseover', function (d) {
                tip.show(d)
              })
              .on('mouseout', function (d) {
                tip.hide(d)
              })

            svg.call(tip);

            // qa
            svg
              .selectAll("dot")
              .data(qa)
              .enter()
              .append("circle")
              .attr("r", 8)
              .attr("cx", function (d) {
                return x(+ d.unit);
              })
              .attr("cy", function (d) {
                return y(+ d[survey]);
              })
              .attr("fill", "#6fbc80")
              .on('mouseover', function (d) {
                tip.show(d)
              })
              .on('mouseout', function (d) {
                tip.hide(d)
              })

            svg.call(tip);

            //ux
            svg
              .selectAll("dot")
              .data(ux)
              .enter()
              .append("circle")
              .attr("r", 8)
              .attr("cx", function (d) {
                return x(+ d.unit);
              })
              .attr("cy", function (d) {
                return y(+ d[survey]);
              })
              .attr("fill", "#b67ec9")
              .on('mouseover', function (d) {
                tip.show(d)
              })
              .on('mouseout', function (d) {
                tip.hide(d)
              })

            svg.call(tip);

          } else {
            newData = averages(newFilteredData)

            svg
              .selectAll('circle')
              .remove();

            svg
              .selectAll("dot")
              .data(newData)
              .enter()
              .append("circle")
              .attr("r", 8)
              .attr("cx", function (d) {
                return x(+ d.unit);
              })
              .attr("cy", function (d) {
                return y(+ d[survey]);
              })
              .attr("fill", function(d) {
                switch(d.program) {
                  case "webdev":
                    return "#21AAE1"
                  case "ios":
                    return "#1b6689"
                  case "qa":
                    return "#6fbc80"
                  case "ux":
                    return "#b67ec9"
                }
              })
              .on('mouseover', function (d) {
                tip.show(d)
              })
              .on('mouseout', function (d) {
                tip.hide(d)
              })

            svg.call(tip);
          }
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