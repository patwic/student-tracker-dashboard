module.exports = {
  getPrefs: (req, res) => {
    // db.selectPrefsByUser ([req.params.user_id], (err, prefs) => {
    //     if (err) res.status(500).send(err)
    //     else res.status(200).send(prefs)
    // })
  },

  upsertPrefs: async (req, res) => {
    try {
      await req.app.get('db').upsertPrefsByUser([req.params.user_id, req.body.cohort_ids]);
      res.status(200).send('User updated.');
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
