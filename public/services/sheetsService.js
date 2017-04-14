angular.module('app').service('sheetsService', function ($http, config) {
    this.getSheet = () => {
        return $http.get('https://sheetsu.com/apis/v1.0/103e1fc72ac5').then(response => {
            return response.data
        })
    }

    this.getProjectScores = (sheet) => {
        console.log(sheet)
        let students = []
        for (let student of sheet) {
            students.push({
                initials: student.Student,
                noServerScore: student.NoServer,
                personalScore: student.Personal,
                groupScore: student.Group
            })
        }
        console.log(students)
    }

    this.getProgress = (sheet) => {
        // console.log(sheet)
        let students = []
        for (let student of sheet) {
            let studProg = {}
            if (student['HTML'] = 'Pass') studProg.html = true
            if (student['JS Basic v1'] == 'Pass'
                || student['JS Basic v2'] == 'Pass') studProg.jsb = true
            if (student['JS Intermediate p1v1'] == 'Pass'
                || student['JS Intermediate p1v2'] == 'Pass') studProg.jsi = true
            if (student['Angular'] == 'Pass') studProg.ang = true
            if (student['Node'] == 'Pass') studProg.node = true
            if (student['SQL Week Passed'] != '') studProg.sql = true
            if (parseInt(student['NoServer']) >= 7) studProg.noserver = true
            if (parseInt(student['Personal']) >= 70) studProg.personal = true
            if (parseInt(student['Group']) >= 100) studProg.group = true
            students.push(studProg)
        }
        // console.log(students)
    }
})