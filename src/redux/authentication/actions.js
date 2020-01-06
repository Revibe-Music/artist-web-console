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

const error = (errorName, errors) => ({
    type: 'ERROR',
    errorName: errorName,
    errors: errors,
});

const clearErrors = (errorName) => ({
    type: 'CLEAR_ERROR',
    errorName: errorName
});


// Only functions below should ever be called by a component!

export function register(username, email, password, history) {
  return async (dispatch) => {
    dispatch(clearErrors("register"))
    var response = await revibe.register(username, email, password)
    if(String(response.status).charAt(0)=="2") {
      response = response.data
      var user = {
        username: response.user.username,
        email: response.user.email,
        artistId: "",
        displayName: "",
        artistImage: "",
        artistAboutMe: "",
        country: "",
        city: "",
        zipcode: ""
      }
      dispatch(loginUser());
      dispatch(updateUser(user));
      history.push("create-profile/")
    }
    else {
      dispatch(error("register", response.data))
    }
  }
}

export function registerArtist(name, image, history) {
  return async (dispatch, getState) => {
    dispatch(clearErrors("registerArtist"))
    var email = getState().authentication.user
    console.log(email);
    var response = await revibe.registerArtist(name, image, email)
    if(String(response.status).charAt(0)=="2") {
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
      history.push('/dashboard');
    }
    else {
      dispatch(error("registerArtist", response.data))
    }
  }
}

export function login(username, password, history) {
  return async (dispatch) => {
    dispatch(clearErrors("login"))
    var response = await revibe.login(username, password)
    if(String(response.status).charAt(0)=="2") {
      response = response.data
      if (response.user.is_artist) {
        await history.push('/dashboard');
      }
      else {
        await history.push('/account/create-profile');
      }
      dispatch(loginUser());
      dispatch(getProfile());
    }
    else {
      console.log(response.data);
      dispatch(error("login", response.data))
    }

  }
}

export function logout(history) {
  return async (dispatch) => {
    dispatch(clearErrors("logout"));
    var response = await revibe.logout()
    if(response.status === 200) {
      response = response.data
      await history.push('/account/login');
      dispatch(logoutUser());
      dispatch(removeUser());
    }
    else {
      dispatch(error("logout", response.data))
    }
  }
}

export function getProfile() {
  return async (dispatch) => {
    dispatch(clearErrors("getProfile"));
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
    }
    else {
      dispatch(error("getProfile", response.data))
    }
  }
}


export function editArtistProfile(data) {
  return async (dispatch) => {
    dispatch(clearErrors("editProfile"));
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
      if(String(response.status).charAt(0)=="2") {
        response = response.data
        dispatch(getProfile());
      }
      else {
        dispatch(error("editProfile", response.data))
      }
    }
  }
}
