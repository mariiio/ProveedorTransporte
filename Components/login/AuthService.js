var buffer = require('buffer');

class AuthService {

	login(creds, callback){
		var b = new buffer.Buffer(creds.username + ':' + creds.password);
		var encodedAuth = b.toString('base64');

		fetch('http://yubertransport.mybluemix.net/YuberServices/rest/user/', {
	      // headers: {
	      //   'AuthorizationToken' : encodedAuth
	      // }
	    })
	    .then((response) => {
	      if (response.status >= 200 && response.status < 300){
	        return response;
	      }
	      throw {
	        badCredentials: response.status == 401,
	        unknownError: response.status != 401
	      }
	    })
	    .then((response) => {
	      return response//.json();
	    })
	    .then((results) => {
	      console.log('results');
	      return callback({success: true});
	    })
	    .catch((err) => {
	      return callback(err);
	    });
	}
}

module.exports = new AuthService();