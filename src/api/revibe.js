import Login from "views/Login"
import Register from "views/Register"
import axios from "axios"


export default class RevibeAPI {

  constructor() {
    this.baseEndpoint = " http://test-env.myrpupud2p.us-east-2.elasticbeanstalk.com/v1/"
    // this.session = session
  }

  async _request(endpoint, body, requestType, isAuthenticated, headers={}) {
    // implemenmt way to get auth credentials
    var options = {
      url: this.baseEndpoint + endpoint,
      method: requestType,
      withCredentials: isAuthenticated,
      responseType: "json",
     }
    if(Object.keys(headers).length > 0) {
      options.headers = headers
    }
    

    if (requestType === "GET")  
    {
      return await axios (options);
    }
    else 
    {
      options.data = body;
      return await axios (options);
    }
  }

  async loadUser(data)
  {
    return await this._request("account/profile/", data, "GET", true)
    console.log(data);
  }

  async login(data) {
    console.log(data);
   return await this. _request("account/login/", data, "POST", false)
  }

  async register(data) {
    return await this. _request("account/register/", data, "POST", false)
  }

  async registerArtist(data) {
    var form = new FormData();
    form.set("name", data.name)
    form.append("image_up", data.image_up)
    return await this. _request("account/artist/", form, "POST", true, {"Content-Type": 'multipart/form-data'})
  }

  async logout(data) {
    return await this. _request("logout/", data, "POST", true)
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