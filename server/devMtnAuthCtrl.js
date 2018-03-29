Devmtn = require('devmtn-auth');

module.exports = {
  loginSuccessRouter: (req, res) => {
    console.log('Login Success');
    console.log('The User: ', req.user);

    // This is where we are sending users to the appropriate place in our app depending on their roles
    if (req.user.roles) {
      if (req.user.roles.length === 0) {
        console.log('WARNING: This person has NO roles: ', req.user.roles.length);
        res.redirect('/#!/login');
      }
      console.log('This person has roles: ', req.user.roles.length);
      if (Devmtn.checkRoles(req.user, 'admin')) {
        console.log('This person is an admin, redirecting to admin page.');
        res.redirect('/');
      } else if (Devmtn.checkRoles(req.user, 'mentor')) {
        console.log('This person is a mentor, redirecting to student page.');
        res.redirect('/');
      } else {
        console.log('This person is a student, redirecting to student page.');
        res.redirect('/#!/login');
      }
    }
  },
};
