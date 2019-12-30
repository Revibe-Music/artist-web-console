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

const error = error => ({
    type: 'ERROR',
    error,
});


// Only functions below should ever be called by a component!

export function register(username, email, password) {
  return async (dispatch) => {
    var response = await revibe.register(username, email, password)
    dispatch(loginUser());
  }
}

export function registerArtist(name, image) {
  return async (dispatch) => {
    var response = await revibe.registerArtist(name, image)
    var user = {
      username: response.user.username,
      email: response.user.email,
      artistId: response.artist_id,
      displayName: response.name,
      artistImage: response.artist_uri+"."+response.ext,
      artistAboutMe: response.artist_profile.about_me,
      country: "",
      city: "",
      zipcode: "",
      // country: response.artist_profile.country,
      // city: response.artist_profile.city,
      // zipcode: response.artist_profile.zipcode,
    }
    dispatch(updateUser(user));
  }
}

export function login(username, password, history) {
  return async (dispatch) => {
    var response = await revibe.login(username, password)
    if (response.user.is_artist) {
      await history.push('/dashboard');
    }
    else {
      await history.push('/account/create-profile');
    }
    dispatch(loginUser());
    dispatch(getProfile());
  }
}

export function logout(history) {
  return async (dispatch) => {
    await revibe.logout()
    await history.push('/account/login');
    dispatch(logoutUser());
    dispatch(removeUser());
  }
}

export function getProfile() {
  return async (dispatch) => {
    var response = await revibe.getProfile()
    var user = {
      username: response.user.username,
      email: response.user.email,
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
}


export function editArtistProfile(data) {
  return async (dispatch) => {
    // check to see if variables are in data
    console.log(data);
    var name = Object.keys(data).filter(x=> x==="name").length > 0 ? data.name : null
    var email = Object.keys(data).filter(x=> x==="email").length > 0 ? data.email : null
    var image = Object.keys(data).filter(x=> x==="image").length > 0 ? data.image : null
    var country = Object.keys(data).filter(x=> x==="country").length > 0 ? data.country : null
    var city = Object.keys(data).filter(x=> x==="city").length > 0 ? data.city : null
    var zipcode = Object.keys(data).filter(x=> x==="zipcode").length > 0 ? data.zipcode : null
    var aboutMe = Object.keys(data).filter(x=> x==="aboutMe").length > 0 ? data.aboutMe : null

    // check to see if user has edited user or artist profile data and make requests accordingly
    if(name || email || image || country || city || zipcode || aboutMe) await revibe.editArtistProfile(name,email,image,country,city,zipcode,aboutMe)
    dispatch(getProfile());
  }
}
