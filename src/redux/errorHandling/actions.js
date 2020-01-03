const execute400Handler = () => ({
    type: "HTTP_400_ERROR",
})

const execute401Handler = history => ({
    type: "HTTP_401_ERROR",
    history: history
})

const execute403Handler = () => ({
    type: "HTTP_403_ERROR",
})

const execute404Handler = history => ({
    type: "HTTP_404_ERROR",
    history: history
})

const execute409Handler = errors => ({
    type: "HTTP_409_ERROR",
    error409Messages: errors
})

const execute415Handler = errors => ({
    type: "HTTP_415_ERROR",
    error415Messages: errors
})

const execute417Handler = errors => ({
    type: "HTTP_417_ERROR",
    error417Messages: errors
})

const execute500Handler = history => ({
    type: "HTTP_500_ERROR",
    history: history
})

const execute501Handler = history => ({
    type: "HTTP_501_ERROR",
    history: history
})

const execute503Handler = history => ({
    type: "HTTP_503_ERROR",
    history: history
})

const executeOtherErrorHandler = errors => ({
    type: "HTTP_OTHER_ERROR",
    errorGeneralMessages: errors
})

export function handleErrors(response, history) {
  return async (dispatch) => {
    if(response.status === 400) {
      // Bad Request Error
      dispatch(execute400Handler());
    }
    if(response.status === 401) {
      // Unauthorized Error
      dispatch(execute401Handler(history));
    }
    if(response.status === 403) {
      // Forbidden Error
      dispatch(execute403Handler());
    }
    if(response.status === 404) {
      // Not Found Error
      dispatch(execute404Handler(history));
    }
    else if(response.status === 409) {
      // Conflict Error
      var errors = {}
      dispatch(execute409Handler(errors));
    }
    else if(response.status === 415) {
      // Unsupported Media Type Error
      var errors = {}
      dispatch(execute415Handler(errors));
    }
    else if(response.status === 417) {
      // Expectation Failed Error
      var errors = {}
      if(Object.keys(response.data).filter(key => key === "username").length > 0) {
        errors.username = response.data.username[0]
      }
      if(Object.keys(response.data).filter(key => key === "email").length > 0) {
        errors.email = response.data.email[0]
      }
      if(Object.keys(response.data).filter(key => key === "password").length > 0) {
        errors.password = response.data.password[0]
      }
      if(Object.keys(response.data).filter(key => key === "non_field_errors").length > 0) {
        errors.other = response.data.non_field_errors[0]
      }
      dispatch(execute417Handler(errors));
    }
    else if(response.status === 500){
      // internal server error ish
      dispatch(execute500Handler(history));
    }
    else if(response.status === 501){
      // not implemented error ish
      dispatch(execute501Handler(history));
    }
    else if(response.status === 503){
      // Service unavailable error ish
      dispatch(execute503Handler(history));
    }
    else {
      var errors = {}
      dispatch(executeOtherErrorHandler(error));
    }
  }
}


export function clearErrors() {
  return async (dispatch) => {
    var response = await revibe.register(username, email, password)
    if(response.status === 200) {
      dispatch(loginUser());
      dispatch(clearErrors());
      history.push("create-profile/")
    }
    else {
      dispatch(handleErrors(response))
    }
  }
}
