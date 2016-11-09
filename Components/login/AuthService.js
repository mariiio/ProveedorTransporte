var buffer = require('buffer');

class AuthService {

	login(creds, callback){
		var b = new buffer.Buffer(creds.username + ':' + creds.password);
		var encodedAuth = b.toString('base64');

		fetch('http://yubertransport.mybluemix.net/YuberServices/rest/proveedor/login', {
			method: 'POST',
			   headers: {
			     'Content-Type': 'application/json'
			   },
			   body: JSON.stringify({
			    userName: creds.username,
       			password: creds.password,
       			verticalName: creds.verticalName
			   })
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
	      return response;
	    })
	    .then((results) => {
	      return callback({success: true});
	    })
	    .catch((err) => {
	      return callback(err);
	    });
	}

	register(creds, callback){

		fetch('http://yubertransport.mybluemix.net/YuberServices/rest/proveedor', { 
			method: 'POST',
			   headers: {
			     'Content-Type': 'application/json',
			   },
			   body: JSON.stringify({
			     userName: creds.username,
			     telefono: creds.phone,
       			 password: creds.password,
       			 verticalName: creds.verticalName
			 })
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
	      return response;
	    })
	    .then((results) => {
	      return callback({success: true});
	    })
	    .catch((err) => {
	      return callback(err);
	    });
	}
}

module.exports = new AuthService();