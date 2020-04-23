import axios from "axios"
import Fingerprint2 from 'fingerprintjs2'
import Cookies from 'js-cookie'
import { API_HOST } from './config.js'

const cookieName = "bshdcce3gcw473q839hxkqabxe3q7qhxbaekc"  // should probably try and set somewhere in env

export default class RevibeAPI {

  constructor() {
    this._saveDeviceData = this._saveDeviceData.bind(this)
    Fingerprint2.get(this._saveDeviceData);
  }

  _saveDeviceData(components) {
    // sets fingerprinted device id and device name to user agent
    var values = components.map(function (component) { return component.value })
    var id = Fingerprint2.x64hash128(values.join(''), 31)
    this.device_id = id
    this.device_name = components.filter(x=>x.key==="userAgent")[0].value
  }

  _setCookie(value) {
    Cookies.set(cookieName, value, { expires: .19}) // expire=4.56 hours
  }

  _getCookie() {
    return Cookies.get(cookieName)
  }

  _deleteCookie() {
    Cookies.remove(cookieName)
  }

  _cookieIsValid() {
    return !!Cookies.get(cookieName)
  }

  _handleErrors(response) {
    var errors = {}
    if(response.status === 400) {
      // bad request ish
      window.location.href = "/400";
    }
    if(response.status === 401) {
      // unauthorized ish
      window.location.href = "/account/login";
    }
    if(response.status === 403) {
      // forbidden ish
      var errorKeys = Object.keys(response.data)
      for(var x=0; x<errorKeys.length; x++) {
        errors[errorKeys[x]] = response.data[errorKeys[x]]
      }
    }
    if(response.status === 404) {
      // not found ish
      window.location.href = "/404";
    }
    else if(response.status === 409) {
      // conflict ish
      var errorKeys = Object.keys(response.data)
      for(var x=0; x<errorKeys.length; x++) {
        errors[errorKeys[x]] = response.data[errorKeys[x]]
      }
    }
    else if(response.status === 415) {
      // unsupported media type ish
      var errorKeys = Object.keys(response.data)
      for(var x=0; x<errorKeys.length; x++) {
        errors[errorKeys[x]] = response.data[errorKeys[x]]
      }
    }
    else if(response.status === 417) {
      var errorKeys = Object.keys(response.data)
      for(var x=0; x<errorKeys.length; x++) {
        errors[errorKeys[x]] = response.data[errorKeys[x]][0]
      }
    }
    else if(response.status === 500) {
      // internal server error ish
      // window.location.href = "/400";
    }
    else if(response.status === 501){
      // not implemented error ish
      window.location.href = "/400";
    }
    else if(response.status === 503){
      // Service unavailable error ish
      window.location.href = "/400";
    }
    return errors
  }

  async _request(endpoint, body, requestType, isAuthenticated, content_type="application/json") {
    var headers = {"Content-Type": content_type}
    if(isAuthenticated) {
      this.isLoggedIn()
      headers.Authorization = "Bearer "+ this._getCookie()
    }

    var numRequestsSent = 0
    var maxRequestAttempts = 2
    var response = null

    while(numRequestsSent < maxRequestAttempts) {
      try {
        response = await axios({
          url: API_HOST + endpoint,
          method: requestType,
          headers: headers,
          responseType: "json",
          data: body
         }
       )
        break
      }
      catch(error) {
        response = error.response
        response.data = this._handleErrors(error.response)
        numRequestsSent += 1
      }
    }
    return response
  }


  ////////////////////////////////////
  ////////// AUTHENTICATION //////////
  ////////////////////////////////////

  async register(username, email, password) {
    var data = {
      username: username,
      password: password,
      profile: {
        email: email,
      },    // just need to pass this
      // device_id: this.device_id,
      // device_name: this.device_name,
      device_type: "browser"
    }
    var response = await this. _request("account/register/", data, "POST", false)
    this._setCookie(response.data.access_token)
    return response

  }

  async registerArtist(name, image, email) {
    var data = new FormData();
    data.set("name", name)
    data.set("email", email)
    data.append("image", image)
    return await this. _request("account/artist/", data, "POST", true, 'multipart/form-data')
  }

  async login(username, password) {
    var data = {
      username: username,
      password: password,
      // device_id: this.device_id,
      // device_name: this.device_name,
      device_type: "browser"
    }
    var response = await this. _request("account/login/", data, "POST", false)
    this._setCookie(response.data.access_token)
    return response
  }

  isLoggedIn() {
    if(!this._cookieIsValid()) {
      window.location.href = "/account/login";
    }
  }

  async logout() {
    const data = {access_token: this._getCookie()}
    this._deleteCookie()
    return await this. _request("account/logout/", data, "POST", true)
  }

  async logoutAll() {
    this._deleteCookie()
    return await this. _request("account/logout-all/", null, "POST", true)
  }

  async contactUs(data) {
    return await this. _request("administration/forms/contact-form/", data, "POST", false)
  }

  async leaveFeedback(data) {
    return await this. _request("administration/forms/contact-form/", data, "POST", true)
  }

  async sendInvitation(data) {
    return await this. _request("account/send-email", data, "POST", true)
  }

  ////////////////////////////////////
  //////////// USER DATA /////////////
  ////////////////////////////////////

  async getProfile() {
    // returns artist and user profile data
    return await this._request("account/artist/", null, "GET", true)
  }

  async editArtistProfile(name=null,email=null,image=null,country=null,state=null,city=null,zipcode=null,about_me=null) {
    var data = new FormData();
    // only add variables to form if they arent null
    if(name !== null) data.set("name", name)
    if(email !== null) data.set("email", email)
    if(country !== null) data.set("country", country)
    if(state !== null) data.set("state", state)
    if(city !== null) data.set("city", city)
    if(zipcode !== null) data.set("zip_code", zipcode)
    if(about_me !== null) data.set("about_me", about_me)
    if(image !== null) data.append("image", image)

    return await this._request("account/artist/", data, "PATCH", true,'multipart/form-data')
  }

  async editSettings(
    requireContributionApproval=null,
    requireContributionApprovalOnEdit=null,
    shareDataWithContributors=null,
    shareAdvancedDataWithContributors=null,
    allowContributorsToEditContributions=null,
    allowContributorsToEditTags=null,
    displayOtherPlatformContentOnRevibePage=null
  ) {

    var data = new FormData();
    // only add variables to form if they arent null
    if(requireContributionApproval !== null) data.set("require_contribution_approval", requireContributionApproval)
    if(requireContributionApprovalOnEdit !== null) data.set("require_contribution_approval_on_edit", requireContributionApprovalOnEdit)
    if(shareDataWithContributors !== null) data.set("share_data_with_contributors", shareDataWithContributors)
    if(shareAdvancedDataWithContributors !== null) data.set("share_advanced_data_with_contributors", shareAdvancedDataWithContributors)
    if(allowContributorsToEditContributions !== null) data.set("allow_contributors_to_edit_contributions", allowContributorsToEditContributions)
    if(allowContributorsToEditTags !== null) data.set("allow_contributors_to_edit_tags", allowContributorsToEditTags)
    if(displayOtherPlatformContentOnRevibePage !== null) data.set("display_other_platform_content_on_revibe_page", displayOtherPlatformContentOnRevibePage)

    return await this._request("account/artist/", data, "PATCH", true,'multipart/form-data')
  }

  async addSocialMediaLink(data) {
    console.log(data);
    return await this._request("account/artist/social-media/", data, "POST", true)
  }

  async editSocialMediaLink(data) {
    console.log(data);
    return await this._request("account/artist/social-media/", data, "PATCH", true)
  }

  async deleteSocialMediaLink(id) {
    return await this._request("account/artist/social-media/", {socialmedia_id: id}, "DELETE", true)
  }

  async editUserProfile(username=null, email=null) {
    var data = {}
    // only add variables to form if they arent null
    if(username !== null) data.username = username
    if(email !== null) data.email = email
    return await this._request("account/profile/", data, "PATCH", true)
  }


  ////////////////////////////////////
  ////////// UPLOADED ALBUMS /////////
  ////////////////////////////////////

  async getUploadedAlbums() {
    return await this._request("account/artist/albums/", null, "GET", true)
  }

  async createUploadedAlbum(name, image, type, displayed, releaseDate) {
    console.log(displayed);
    var data = new FormData();
    data.set("name", name)
    data.set("type", type)
    data.set("is_displayed", displayed)
    if(releaseDate !== null) data.set("date_published", releaseDate)
    data.append("image", image)
    return await this. _request("account/artist/albums/", data, "POST", true, 'multipart/form-data')
  }

  async editUploadedAlbum(album_id, name=null, image=null, type=null, displayed=null) {
    var data = new FormData();
    data.set("album_id", album_id)
    // only add variables to form if they arent null
    if(name !== null) data.set("name", name)
    if(type !== null) data.set("type", type)
    if(displayed !== null) data.set("is_displayed", displayed)
    if(image !== null) data.append("image", image)
    return await this. _request("account/artist/albums/", data, "PATCH", true, 'multipart/form-data')
  }

  async deleteUploadedAlbum(album_id) {
    var data = {album_id: album_id}
    return await this._request("account/artist/albums/", data, "DELETE", true)
  }


  ////////////////////////////////////
  //// UPLOADED ALBUM CONTRIBUTORS ///
  ////////////////////////////////////

  async addUploadedAlbumContributor(album_id, artist_id, contribution_type) {
    var data = {album_id: album_id, artist_id: artist_id, contribution_type: contribution_type}
    return await this._request("account/artist/contributions/albums/", data, "POST", true)
  }

  async editUploadedAlbumContributor(contribution_id, contribution_type) {
    var data = {contribution_id: contribution_id, contribution_type: contribution_type}
    return await this._request("account/artist/contributions/albums/", data, "PATCH", true)
  }

  async deleteUploadedAlbumContributor(contribution_id) {

  }

  ////////////////////////////////////
  //// UPLOADED ALBUM GENRES ///
  ////////////////////////////////////

  async addUploadedAlbumGenres(album_id, genres) {
    genres = typeof genres !== "array" ? [genres] : genres
    return await this._request(`account/artist/album/${album_id}/genres/`, {genres: genres}, "POST", true)
  }

  async removeUploadedAlbumGenres(album_id, genres) {
    genres = typeof genres !== "array" ? [genres] : genres
    return await this._request(`account/artist/album/${album_id}/genres/`, {genres: genres}, "DELETE", true)
  }

  ////////////////////////////////////
  //// UPLOADED ALBUM TAGS ///
  ////////////////////////////////////

  async addUploadedAlbumTags(album_id, tags) {
    tags = typeof tags !== "array" ? [tags] : tags
    return await this._request(`account/artist/album/${album_id}/tags/`, {tags: tags}, "POST", true)
  }

  async removeUploadedAlbumTags(album_id, tags) {
    tags = typeof tags !== "array" ? [tags] : tags
    return await this._request(`account/artist/album/${album_id}/tags/`, {tags: tags}, "DELETE", true)
  }


  ////////////////////////////////////
  ////////// UPLOADED SONGS //////////
  ////////////////////////////////////

  async getUploadedSongs(album_id=null) {
    // if album_id is passed, then only songs from that ablum will be returned
    var data = album_id !== null ? {album_id: album_id} : null
    return await this._request("account/artist/songs/", data, "GET", true)
  }

  async createUploadedSong(album_id, title, file, duration, explicit, order, display=true) {
    console.log(display);
    var data = new FormData();
    data.set("title", title)
    data.set("duration", duration)
    data.set("album_id", album_id)
    data.set("is_explicit", explicit)
    data.set("album_order", order)
    data.set("is_displayed", display)
    data.append("file", file)
    return await this. _request("account/artist/songs/", data, "POST", true, 'multipart/form-data')
  }

  async editUploadedSong(song_id, title=null, file=null, duration=null, genre=null, displayed=null) {
    var data = new FormData();
    data.set("song_id", song_id)
    // only add variables to form if they arent null
    if(title !== null) data.set("title", title)
    if(duration !== null) data.set("duration", duration)
    if(genre !== null) data.set("genre", genre)
    if(displayed !== null) data.set("displayed", displayed)
    if(file !== null) data.append("file", file)
    return await this. _request("account/artist/songs/", data, "PATCH", true, 'multipart/form-data')
  }

  async deleteUploadedSong(song_id) {
    var data = {song_id: song_id}
    return await this. _request("account/artist/songs/", data, "DELETE", true)
  }

  ////////////////////////////////////
  //// UPLOADED SONG CONTRIBUTORS ////
  ////////////////////////////////////

  async addUploadedSongContributor(song_id, artist_id, contribution_type) {
    var data = {song_id: song_id, artist_id: artist_id, contribution_type: contribution_type}
    return await this._request("account/artist/contributions/songs/", data, "POST", true)
  }

  async editUploadedSongContributor(contribution_id, contribution_type) {
    var data = {contribution_id: contribution_id, contribution_type: contribution_type}
    return await this._request("account/artist/contributions/songs/", data, "PATCH", true)
  }

  async deleteUploadedSongContributor(contribution_id) {
    var data = {contribution_id: contribution_id}
    return await this._request("account/artist/contributions/songs/", data, "DELETE", true)
  }

  ////////////////////////////////////
  //// UPLOADED SONG GENRES ///
  ////////////////////////////////////

  async addUploadedSongGenres(song_id, genres) {
    genres = typeof genres !== "array" ? [genres] : genres
    var response = await this._request(`account/artist/songs/${song_id}/genres/`, {genres: genres}, "POST", true)
    console.log(response);
  }

  async removeUploadedSongGenres(song_id, genres) {
    genres = typeof genres !== "array" ? [genres] : genres
    var response =  await this._request(`account/artist/songs/${song_id}/genres/`, {genres: genres}, "DELETE", true)
    console.log(response);
  }

  ////////////////////////////////////
  //// UPLOADED SONG TAGS ///
  ////////////////////////////////////

  async addUploadedSongTags(song_id, tags) {
    tags = typeof tags !== "array" ? [tags] : tags
    var response =  await this._request(`account/artist/songs/${song_id}/tags/`, {tags: tags}, "POST", true)
    console.log(response);
  }

  async removeUploadedSongTags(song_id, tags) {
    tags = typeof tags !== "array" ? [tags] : tags
    var response =  await this._request(`account/artist/songs/${song_id}/tags/`, {tags: tags}, "DELETE", true)
    console.log(response);
  }

  ////////////////////////////////////
  //// UPLOADED ALBUM TAGS ///
  ////////////////////////////////////

  async addUploadedAlbumTags(album_id, tags) {
    tags = typeof tags !== "array" ? [tags] : tags
    var data = {album_id: album_id, tags: tags}
    return await this._request("account/artist/albums/tags/", data, "POST", true)
  }

  async removeUploadedAlbumTags(album_id, tags) {
    tags = typeof tags !== "array" ? [tags] : tags
    var data = {album_id: album_id, tags: tags}
    return await this._request("account/artist/albums/tags/", data, "DELETE", true)
  }

  ////////////////////////////////////
  ////// ALL YOUR CONTRIBUTIONS  /////
  ////////////////////////////////////

  async getAllContributions() {
    return await this._request("account/artist/contributions/", null, "GET", true)
  }

  ////////////////////////////////////
  ///// YOUR ALBUM CONTRIBUTIONS  ////
  ////////////////////////////////////

  async getAlbumContributions() {
    return await this._request("account/artist/contributions/albums/", null, "GET", true)
  }

  async editAlbumContribution(contribution_id) {
    // will not implemented in version 1
  }

  async approveAlbumContribution(contribution_id) {
    var data = {contribution_id: contribution_id, content: "album", action: "approve"}
    return await this._request("account/artist/contributions/approve/", data, "POST", true)
  }

  async rejectAlbumContribution(contribution_id) {
    var data = {contribution_id: contribution_id, content: "album", action: "deny"}
    return await this._request("account/artist/contributions/approve/", data, "POST", true)
  }

  async deleteAlbumContribution(contribution_id) {
    var data = {contribution_id: contribution_id}
    return await this._request("account/artist/contributions/albums/", data, "DELETE", true)
  }

  ////////////////////////////////////
  ///// YOUR SONG CONTRIBUTIONS  /////
  ////////////////////////////////////

  async getSongContributions() {
    return await this._request("account/artist/contributions/songs/", null, "GET", true)
  }

  async editSongContribution(contribution_id) {
    // will not implemented in version 1
  }

  async approveSongContribution(contribution_id) {
    var data = {contribution_id: contribution_id, content: "song", action: "approve"}
    return await this._request("account/artist/contributions/approve/", data, "POST", true)
  }

  async rejectSongContribution(contribution_id) {
    var data = {contribution_id: contribution_id, content: "song", action: "deny"}
    return await this._request("account/artist/contributions/approve/", data, "POST", true)
  }

  async deleteSongContribution(contribution_id) {
    var data = {contribution_id: contribution_id}
    return await this._request("account/artist/contributions/songs/", data, "DELETE", true)
  }

  ////////////////////////////////////
  ///////////// SEARCH  //////////////
  ////////////////////////////////////

  async searchArtists(query) {
    return await this._request("content/search/artists/?text="+query, null, "GET", true)
  }


}
