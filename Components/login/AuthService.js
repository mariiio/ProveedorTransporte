var buffer = require('buffer');

class AuthService {

	login(creds, callback){
		var b = new buffer.Buffer(creds.username + ':' + creds.password);
		var encodedAuth = b.toString('base64');

		fetch('http://yubertransport.mybluemix.net/TransportServices/rest/user/verticales', { //cambiar por api login
			// method: 'POST',
			//   headers: {
			//     'Accept': 'application/json',
			//     'Content-Type': 'application/json',
			//   },
			//   body: JSON.stringify({
			//     username: creds.username,
   //    			password: creds.password
			//   })
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

	register(creds, callback){

		fetch('http://yubertransport.mybluemix.net/TransportServices/rest/user/verticales', { //cambiar por api register
			// method: 'POST',
			//   headers: {
			//     'Accept': 'application/json',
			//     'Content-Type': 'application/json',
			//   },
			//   body: JSON.stringify({
			//     username: creds.username,
			//     phone: creds.phone,
   //    			password: creds.password
			// })
	    })
	    .then((response) => {
	      if (response.status >= 200 && response.status < 300){
	        return response;
	      }
	      throw {
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