angular.module('app').service('userService', function($http, config) {
  this.parseCohorts = arr => {
    const newArr = [];
    arr.forEach(e => {
      if (e.alias.includes('Web')) e.program = 'Web';
      if (e.alias.includes('iOS')) e.program = 'iOS';
      if (e.alias.includes('UX')) e.program = 'UX';

      if (e.alias.includes('Provo')) e.location = 'Provo';
      if (e.alias.includes('SLC')) e.location = 'SLC';
      if (e.alias.includes('Dallas')) e.location = 'Dallas';

      newArr.push(e);
    });
    return newArr;
  };

  this.postUserPrefs = prefs => {
    const prefIds = [];
    for (let i = 0; i < prefs.length; i++) {
      prefIds.push(prefs[i].id);
    }
    return $http
      .post('api/prefs/', {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        prefs: prefIds,
      })
      .then(response => {
        console.log('success!', response.data);
        return response.data;
      })
      .catch(function(err) {
        console.log('Error');
      });
  };

  this.getUser = () =>
    $http
      .get('api/getUser')
      .then(res => res.data)
      .catch(function(err) {
        console.log('Error');
      });

  const url = `${config.dev_mtn_api}aliases?admin_token=${config.admin_token}`;
  this.getCohorts = () =>
    $http
      .get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then(res => {
        res.data = this.parseCohorts(res.data);
        return res;
      })
      .catch(function(err) {
        console.log('Error');
      });
});
