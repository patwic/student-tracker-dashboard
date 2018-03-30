const request = require('request'), // axios clone?
  app = require('./server');

const self = (module.exports = {
  // gets Q data for today so far
  getCurrentQ: () => {
    const day = new Date().toISOString().substring(0, 10);
    request.get(
      `${process.env.DEV_MTN_API}historical/questions/?admin_token=${process.env.ADMIN_TOKEN}&after=${day}`,
      (err, qres, qbody) => {
        if (err) console.log(err);
        else self.setQs(JSON.parse(qbody));
      }
    );
  },

  // will go through each 5-minute increment from 8:50 AM to 5:10 PM
  // will create helpQ, totalQ, and waitQ
  // each of these Qs will hold these 5-minute increments of data
  setQs: qbody => {
    let max = 0;
    const helpQ = [],
      totalQ = [],
      waitQ = [],
      day = new Date().toISOString().substring(0, 10),
      beginTime = new Date(`${day}T14:50:00.000Z`).getTime(),
      increments = Math.ceil((new Date().getTime() - beginTime) / 300000);
    for (let i = 0; i < increments; i += 1) {
      const min = beginTime + i * 300000;
      if (i !== increments - 1) max = beginTime + (i + 1) * 300000;
      else max = new Date().getTime();
      helpQ.push(self.pushSingleQ(min, max, qbody, 'timeMentorBegins', 'timeQuestionAnswered'));
      totalQ.push(self.pushSingleQ(min, max, qbody, 'timeWhenEntered', 'timeQuestionAnswered'));
      waitQ.push(self.pushSingleQ(min, max, qbody, 'timeWhenEntered', 'timeMentorBegins', 'timeQuestionAnswered'));
    }
    app.setQs(helpQ, totalQ, waitQ);
  },

  // creates a batch of data for the needed 5-minute increment
  // q1 is the lower metric (timeWhenEntered or timeMentorBegins)
  // q2 is the upper metric (timeMentorBegins or timeQuestionAnswered)
  // q3 is an extra metric for wait Q times
  // wait Q times needs 3 metrics, so that it can check both when timeMentorBegins is present and absent
  pushSingleQ: (min, max, qbody, q1, q2, q3) => {
    let count = 0,
      sum = 0;
    for (const i in qbody) {
      const q = qbody[i];
      const qMin = new Date(q[q1]).getTime();
      if (qMin < max) {
        qMax = new Date(q[q2]).getTime();
        if (!qMax && q3) qMax = new Date(q[q3]).getTime();
        if (!qMax || qMax >= min) {
          if (!qMax || qMax >= max) qMax = max;
          sum += qMax - qMin;
          count += 1;
        }
      }
    }
    if (count > 0) return [min, (sum / (count * 60000)).toFixed(2)];
    return [min, '0'];
  },
});
