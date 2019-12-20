import Login from "views/Login"
import Register from "views/Register"
import axios from "axios"


export default class RevibeAPI {

  constructor() {
    this.baseEndpoint = "http://test-env.myrpupud2p.us-east-2.elasticbeanstalk.com/v1/"
  }

  async _request(endpoint, body, requestType, isAuthenticated, headers={}) {
    // implemenmt way to get auth credentials
    headers["Authorization"] = "Bearer tmtCs9W9IJU19aM1PLmImSeCyeEnfo"
    var options = {
      url: this.baseEndpoint + endpoint,
      method: requestType,
      //withCredentials: isAuthenticated //Commented out to hardcode token
      headers: headers,
      responseType: "json",
     }
    if(Object.keys(headers).length > 0) {
      options.headers = headers
    }
    options.data = body
    try
    {
      const response =  await axios(options)
      console.log("response from axios",response);
      
      return response
    }
    catch(error)
    {
      console.log("YOO",error.response);
    }
    
  }

  async getProfile()
  {
    const response = await this._request("account/artist/", null, "GET", true)
    return response.data
  }

  async editProfile(data)
  {
    const response = await this._request("account/artist/", JSON.stringify(data), "PATCH", true,{"content-type": 'application/json'})
    return response.data
  }

  async login(data) 
  {
   return await this. _request("account/login/", data, "POST", false)
  }

  async register(data) {
    return await this. _request("account/register/", data, "POST", false)
  }

  async registerArtist(data) {
    var form = new FormData();
    console.log(data);
    form.set("name", data.name)
    form.append("image_up", data.image_up)
    form.set("platform", "Revibe")
    return await this. _request("account/artist/", form, "POST", true, {"Content-Type": 'multipart/form-data'})
  }

  async logout(data) {
    return await this. _request("logout/", data, "POST", true)
  }

  async uploadSong(data) 
  {
    var form = new FormData();
    console.log(data);
    form.set("title", data.name)
    form.append("song", data.song)
    form.set("duration", data.duration)
    form.set("platform", "Revibe")
    form.set("album_id", data.album)

    return await this. _request("account/artist/songs/", form, "POST", true, {"Content-Type": 'multipart/form-data'})
  }

  async createAlbum(data) 
  {
    var form = new FormData();
    console.log(data);
    form.set("platform", "Revibe")
    form.set("name", data.name)
    form.append("image_up", data.image_up)
    form.set("type", data.type)
    return await this. _request("account/artist/albums/", form, "POST", true, {"Content-Type": 'multipart/form-data'})
  }

}
