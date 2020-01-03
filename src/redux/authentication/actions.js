import { sessionService } from 'redux-react-session';
import RevibeAPI from '../../api/revibe.js';

const revibe = new RevibeAPI()


// check if the app has checked the user's authentication status at all
const checkedAuthentication = bool => ({
    type: 'CHECK_AUTHENTICATION',
    checkedLogin: bool,
});

// check if a user has logged in to any platforms before
const checkHasLoggedIn = bool => ({
    type: 'HAS_AUTHENTICATED',
    hasLoggedIn: bool,
});

const loginUser = user => ({
    type: 'LOGIN_USER',
    checkedLogin: true,
    hasLoggedIn: true,
});

const logoutUser = () => ({
    type: 'LOGOUT_USER',
});

const updateUser = user => ({
    type: 'UPDATE_USER_DATA',
    user: user,
});

const removeUser = artist => ({
    type: 'REMOVE_USER_DATA',
});

const error = (errorType, error) => ({
    type: 'ERROR',
    errorType: errorType,
    error: error,
});

const clearErrors = () => ({
    type: 'CLEAR_ERROR',
});


// Only functions below should ever be called by a component!

export function handleErrors(response) {
  return async (dispatch) => {
    if(response.status === 400) {
      // bad request ish
    }
    if(response.status === 401) {
      // unauthorized ish
    }
    if(response.status === 403) {
      // forbidden ish
    }
    if(response.status === 404) {
      // not found ish
    }
    else if(response.status === 409) {
      // conflict ish
    }
    else if(response.status === 415) {
      // unsupported media type ish
    }
    else if(response.status === 417) {
      console.log(response.data);
      if(Object.keys(response.data).filter(key => key === "username").length > 0) {
        dispatch(error("username",response.data.username[0]));
      }
      if(Object.keys(response.data).filter(key => key === "email").length > 0) {
        dispatch(error("email",response.data.email[0]));
      }
      if(Object.keys(response.data).filter(key => key === "password").length > 0) {
        dispatch(error("password",response.data.password[0]));
      }
      if(Object.keys(response.data).filter(key => key === "non_field_errors").length > 0) {
        dispatch(error("other",response.data.non_field_errors[0]));
      }
    }
    else if(response.status === 500){
      // internal server error ish
    }
    else if(response.status === 501){
      // not implemented error ish
    }
    else if(response.status === 503){
      // Service unavailable error ish
    }
  }
}

export function register(username, email, password, history) {
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

export function registerArtist(name, image, history) {
  return async (dispatch) => {
    var response = await revibe.registerArtist(name, image)
    if(response.status === 201) {
      response = response.data
      var user = {
        username: response.user.username,
        email: response.user.email,
        artistId: response.artist_id,
        displayName: response.name,
        artistImage: response.artist_uri+"."+response.ext,
        artistAboutMe: response.artist_profile.about_me,
        country: "",
        city: "",
        zipcode: ""
      }
      dispatch(updateUser(user));
      dispatch(clearErrors());
      history.push('/dashboard');

    }
    else {
      dispatch(handleErrors(response))
    }
  }
}

export function login(username, password, history) {
  return async (dispatch) => {
    var response = await revibe.login(username, password)
    if(response.status === 200) {
      response = response.data
      if (response.user.is_artist) {
        await history.push('/dashboard');
      }
      else {
        await history.push('/account/create-profile');
      }
      dispatch(loginUser());
      dispatch(getProfile());
      dispatch(clearErrors());
    }
    else {
      dispatch(handleErrors(response))
    }

  }
}

export function logout(history) {
  return async (dispatch) => {
    var response = await revibe.logout()
    if(response.status === 200) {
      response = response.data
      await history.push('/account/login');
      dispatch(logoutUser());
      dispatch(removeUser());
      dispatch(clearErrors());
    }
    else {
      dispatch(error("An error occured while logging you out."));
    }
  }
}

export function getProfile() {
  return async (dispatch) => {
    var response = await revibe.getProfile()
    if(response.status === 200) {
      response = response.data
      var user = {
        username: response.user.username,
        email: response.artist_profile.email,
        artistId: response.artist_id,
        displayName: response.name,
        artistImage: response.artist_uri+"."+response.ext,
        country: response.artist_profile.country,
        city: response.artist_profile.city,
        zipcode: response.artist_profile.zip_code,
        artistAboutMe: response.artist_profile.about_me,
      }
      dispatch(updateUser(user));
      dispatch(clearErrors());
    }
    else {
      dispatch(error("An error occured while fetching user data."));
    }
  }
}


export function editArtistProfile(data) {
  return async (dispatch) => {
    // check to see if variables are in data
    var name = Object.keys(data).filter(x=> x==="name").length > 0 ? data.name : null
    var email = Object.keys(data).filter(x=> x==="email").length > 0 ? data.email : null
    var image = Object.keys(data).filter(x=> x==="image").length > 0 ? data.image : null
    var country = Object.keys(data).filter(x=> x==="country").length > 0 ? data.country : null
    var city = Object.keys(data).filter(x=> x==="city").length > 0 ? data.city : null
    var zipcode = Object.keys(data).filter(x=> x==="zipcode").length > 0 ? data.zipcode : null
    var aboutMe = Object.keys(data).filter(x=> x==="aboutMe").length > 0 ? data.aboutMe : null

    // check to see if user has edited user or artist profile data and make requests accordingly
    if(name || email || image || country || city || zipcode || aboutMe) {
      var response = await revibe.editArtistProfile(name,email,image,country,city,zipcode,aboutMe)
      if(response.status === 200) {
        response = response.data
        dispatch(getProfile());
        dispatch(clearErrors());
      }
      else {
        dispatch(error("An error occured while updating user profile."));
      }
    }
  }
}
