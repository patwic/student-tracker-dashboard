angular.module('app').service('sheetsService', function($http, config) {
  // gets data from given google sheet
  this.getSheet = () =>
    $http
      .get('https://sheetsu.com/apis/v1.0/45425dfc758e')
      .then(response => response.data)
      .catch(function(err) {
        console.log('Error');
      });

  // gets project scores for each student
  this.getProjectScores = sheet => {
    const students = [];
    for (const student of sheet) {
      students.push({
        initials: student.Student,
        noServerScore: student.NoServer,
        personalScore: student.Personal,
        groupScore: student.Group,
      });
    }
    return students;
  };

  // checks how many steps towards graduation a student has completed
  this.getProgress = sheet => {
    const students = [];
    for (const student of sheet) {
      const studProg = {};
      studProg.name = student.Student;
      if ((student.HTML = 'Pass')) studProg.HTML = true;
      if (student['JS Basic v1'] == 'Pass' || student['JS Basic v2'] == 'Pass') studProg.JS1 = true;
      if (student['JS Inter p1v1'] == 'Pass' || student['JS Inter p1v2'] == 'Pass') studProg.JS2 = true;
      if (student.Angular == 'Pass') studProg.ANG = true;
      if (student.Node == 'Pass') studProg.NODE = true;
      if (student['SQL Week Passed'] != '') studProg.SQL = true;
      if (parseInt(student.NoServer) >= 7) studProg.NoSERVER = true;
      if (parseInt(student.Personal) >= 70) studProg.PERSONAL = true;
      if (parseInt(student.Group) >= 100) studProg.GROUP = true;
      students.push(studProg);
    }
    return students;
  };
});
