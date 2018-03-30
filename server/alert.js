const config = require('./config.js'),
  request = require('request-promise'),
  app = require('./server'),
  q = require('q');

const self = (module.exports = {
  // gets data from DevMtn DB to check if any student currently in Q too long
  getCurrentRedAlert: () => {
    const day = new Date().toISOString().substring(0, 10);
    request.get(
      `${process.env.DEV_MTN_API}historical/questions/?admin_token=${process.env.ADMIN_TOKEN}&after=${day}`,
      (err, qres, qbody) => {
        if (err) console.log(err);
        else self.redAlert(JSON.parse(qbody));
      }
    );
  },

  // checks if any student currently waiting in Q for more than 10 minutes
  redAlert: qbody => {
    const alerts = [];
    for (let i = 0; i < qbody.length; i += 1) {
      if (!qbody[i].timeMentorBegins && !qbody[i].timeQuestionAnswered) {
        const currentTime = new Date().getTime();
        const startTime = new Date(qbody[i].timeWhenEntered).getTime();
        if (currentTime - startTime > 600000) {
          alerts.push({
            name: qbody[i].name,
            waitTime: currentTime - startTime,
          });
        }
      }
    }
    app.setRedAlerts(alerts);
  },

  // checks for absent students from yesterday among all cohorts
  attendanceAlert: (req, res, err) => {
    const today = new Date().toISOString().substring(0, 10);
    let yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    yesterday = yesterday.toISOString().substring(0, 10);
    request.get(
      `${process.env.DEV_MTN_API}attendancedays/?admin_token=${
        process.env.ADMIN_TOKEN
      }&after=${yesterday}&before=${today}`,
      (err, qres, daysBody) => {
        if (err) console.log(err);
        else {
          daysBody = JSON.parse(daysBody);
          const promises = [];
          for (const day of daysBody) {
            promises.push(
              request.get(
                `${process.env.DEV_MTN_API}attendancedays/${day.cohortId}/${day.day}?admin_token=${
                  process.env.ADMIN_TOKEN
                }`,
                {
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                  },
                }
              )
            );
          }
          Promise.all(promises)
            .then(response => {
              const attendObj = [];
              for (let i = 0; i < response.length; i += 1) {
                attendObj.push(JSON.parse(response[i]));
              }
              res.send(self.attendanceObjectParsing(attendObj));
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    );
  },

  // goes through attendance data, dividing by day with a list of absent, late, and left early students
  attendanceObjectParsing: attendObj => {
    const absences = [];
    const lates = [];
    const leftEarly = [];
    for (let i = 0; i < attendObj.length; i += 1) {
      const aobj = attendObj[i].attendances;
      const k = 0;
      for (let j = 0; j < aobj.length; j += 1) {
        if (aobj[j].attendanceData) {
          if (aobj[j].attendanceData.abscent === true) {
            absences.push([aobj[j].user.firstName, aobj[j].user.lastName]);
          }
          if (aobj[j].attendanceData.late === true) {
            lates.push([aobj[j].user.firstName, aobj[j].user.lastName]);
          }
          if (aobj[j].attendanceData.leftEarly === true) {
            leftEarly.push([aobj[j].user.firstName, aobj[j].user.lastName]);
          }
        }
      }
    }
    return {
      absences,
      lates,
      leftEarly,
    };
  },

  // checks if any student has done less than 3 assessments
  // will need to be updated later to check only when students on week 5 or later
  progressAlert: (req, res, err) => {
    request.get('https://sheetsu.com/apis/v1.0/45425dfc758e').then(response => {
      sheet = JSON.parse(response);
      const students = [];
      for (const i in sheet) {
        let count = 0;
        const student = sheet[i];
        if ((student.HTML = 'Pass')) count += 1;
        if (student['JS Basic v1'] == 'Pass' || student['JS Basic v2'] == 'Pass') count += 1;
        if (student['JS Intermediate p1v1'] == 'Pass' || student['JS Intermediate p1v2'] == 'Pass') count += 1;
        if (student.Angular == 'Pass') count += 1;
        if (student.Node == 'Pass') count += 1;
        if (student['SQL Week Passed'] != '') count += 1;
        if (count < 3) students.push(student.Student);
      }
      res.send(students);
    });
  },

  // checks if any active cohorts failed to insert attendance yesterday
  // works with checkActiveCohorts
  noAttendanceAlert: (req, res, err) => {
    const today = new Date().toISOString().substring(0, 10);
    let yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    yesterday = yesterday.toISOString().substring(0, 10);
    request.get(
      `${process.env.DEV_MTN_API}attendancedays/?admin_token=${
        process.env.ADMIN_TOKEN
      }&after=${yesterday}&before=${today}`,
      (err, response, body) => {
        if (err) console.log(err);
        else {
          const daysBody = JSON.parse(body);
          const cohorts = [];
          daysBody.forEach(d => {
            if (cohorts.indexOf(d.cohortId) == -1) cohorts.push(d.cohortId);
          });
          self.checkActiveCohorts(cohorts, res);
        }
      }
    );
  },

  // checks active cohorts for noAttendanceAlert
  checkActiveCohorts: (cohorts, res) => {
    request.get(`${process.env.DEV_MTN_API}aliases?admin_token=${process.env.ADMIN_TOKEN}`, (err, response, body) => {
      cohortBody = JSON.parse(body);
      const noAttendCohorts = cohortBody.filter(c => c.active && cohorts.indexOf(c.cohortId) == -1);
      res.send(noAttendCohorts);
    });
  },

  // checks if any student is using Q excessively
  // refer to getStudentTimes
  studentQAlert: (req, res, err) => {
    const today = new Date().toISOString().substring(0, 10);
    let yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    yesterday = yesterday.toISOString().substring(0, 10);
    request.get(
      `${process.env.DEV_MTN_API}historical/questions/?admin_token=${
        process.env.ADMIN_TOKEN
      }&after=${yesterday}&before=${today}`,
      (err, response, body) => {
        self.getStudentTimes(JSON.parse(body), res);
      }
    );
  },

  // puts together all individual student stats
  // student.count: number of help requests
  // student.sum: total time helped by mentors
  // student.average: average time helped per request (sum/count)
  getStudentTimes: (qbody, res) => {
    const students = [];
    for (let i = 0; i < qbody.length; i += 1) {
      if (qbody[i].timeMentorBegins) {
        let isNewStudent = true;
        for (let j = 0; j < students.length; j += 1) {
          if (students[j].name === qbody[i].name) {
            let max = new Date(qbody[i].timeQuestionAnswered).getTime();
            const min = new Date(qbody[i].timeMentorBegins).getTime();
            if (!max) {
              max = new Date().getTime();
            }
            students[j].count += 1;
            students[j].sum += max - min;
            isNewStudent = false;
          }
        }
        if (isNewStudent) {
          let max = new Date(qbody[i].timeQuestionAnswered).getTime();
          const min = new Date(qbody[i].timeMentorBegins).getTime();
          if (!max) {
            max = new Date().getTime();
          }
          const student = {
            name: qbody[i].name,
            count: 1,
            sum: max - min,
          };
          students.push(student);
        }
      }
    }
    for (let j = 0; j < students.length; j += 1) {
      students[j].average = parseFloat((students[j].sum / (students[j].count * 60000)).toFixed(2));
    }
    let total = 0;
    students.forEach(s => {
      total += s.sum;
    });

    res.send(
      students.filter(s => {
        s.percent = `${(s.sum * 100 / total).toFixed(2)}%`;
        return s.sum / total >= 0.1;
      })
    );
  },
});
