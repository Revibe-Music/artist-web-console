

export default class Revibe() {

  constructor() {
    this.baseEndpoint = "127.0.0.1:8000/"

    this.accessToken = accessToken


  }

  setToken(accessToken, refreshToken=null) {
    this.token = accessToken
    localStorage.setItem("accessToken", accessToken)
    if(refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    }
  }

  authenticatedRequest(token, function) {

  }
}
