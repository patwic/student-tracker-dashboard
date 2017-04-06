const config = require('./config.js')

module.exports = {
    attachQueries: (req, res) => {
        let apiCall = `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}`
        if (req.query.id) apiCall += `&id=${req.query.id}`
        if (req.query.cohortId) apiCall += `&cohortId=${req.query.cohortId}`
        if (req.query.directive) apiCall += `&directive=${req.query.directive}`
        if (req.query.mentorName) apiCall += `&mentorName=${req.query.mentorName}`
        if (req.query.name) apiCall += `&name=${req.query.name}`
        if (req.query.questionCategory) apiCall += `&questionCategory=${req.query.questionCategory}`
        if (req.query.studentId) apiCall += `&studentId=${req.query.studentId}`
        if (req.query.timeMentorBegins) apiCall += `&timeMentorBegins=${req.query.timeMentorBegins}`
        if (req.query.timeQuestionAnswered) apiCall += `&timeQuestionAnswered=${req.query.timeQuestionAnswered}`
        if (req.query.timeWhenEntered) apiCall += `&timeWhenEntered=${req.query.timeWhenEntered}`
        if (req.query.after) apiCall += `&after=${req.query.after}`
        if (req.query.before) apiCall += `&before=${req.query.before}`
    }
}