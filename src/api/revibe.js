import Login from "views/Login"
import Register from "views/Register"


export default class RevibeAPI {

  constructor() {
    this.baseEndpoint = " http://test-env.myrpupud2p.us-east-2.elasticbeanstalk.com/v1/"
    // this.session = session
  }

  async _request(endpoint, body, requestType, authenticated) {
    // implemenmt way to get auth credentials
    if (requestType === "GET")  {
      return await fetch(this.baseEndpoint + endpoint, {
        method: requestType,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
    }
    else {
      return await fetch(this.baseEndpoint + endpoint, {
        method: requestType,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
    }
  }

  async login(body) {
    console.log(body);
    
   return await this. _request("account/login/", body, "POST", false)
  }

  async register(body) {
    return await this. _request("register/", body, "POST", false)
  }

  async logout(body) {
    return await this. _request("logout/", body, "POST", true)
  }

}

(async () => {
  const rawResponse = await fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const content = await rawResponse.json();

  console.log(content);
})();