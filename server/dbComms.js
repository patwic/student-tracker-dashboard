const app = require('./server')
      db = app.get('db')
      config = require('./config')

module.exports = {
    getPrefs: (req, res) => {
        db.selectPrefsByUser ([req.params.user_id], (err, prefs) => {
            if (err) res.status(500).send(err)
            else res.status(200).send(prefs)
        })
    },

    upsertPrefs: (req, res) => {
        db.upsertPrefsByUser ([req.params.user_id, req.body.cohort_ids], (err) => {
            if (err) res.status(500).send(err)
            else res.status(200).send('User updated.')
        })
    }
}