import { sessionService } from 'redux-react-session';
import RevibeAPI from '../../api/revibe.js';

const revibe = new RevibeAPI()


const addUpload = newUpload => ({
    type: 'ADD_UPLOAD',
    newUpload: newUpload,
});

const editUpload = upload => ({
    type: 'EDIT_UPLOAD',
    upload: upload,
});

const removeUpload = index => ({
    type: 'REMOVE_UPLOAD',
    index: index,
});

const addContribution = newContribution => ({
    type: 'ADD_CONTRIBUTION',
    newContribution: newContribution,
});

const editContribution = contribution => ({
    type: 'EDIT_CONTRIBUTION',
    contribution: contribution,
});

const removeContribution = index => ({
    type: 'REMOVE_CONTRIBUTION',
    index: index,
});

const error = error => ({
    type: 'ERROR',
    error,
});


let index = state.uploads.findIndex((x) => x.name === n);


// Only functions below should ever be called by a component!

export function addArtistUpload(username, email, password) {
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
      artistBio: response.artist_profile.about_me,
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

export function login(username, password) {
  return async (dispatch) => {
    await revibe.login(username, password)
    dispatch(loginUser());
    dispatch(getProfile());
  }
}

export function logout() {
  return async (dispatch) => {
    await revibe.logout()
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
      artistBio: response.artist_profile.about_me,
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


export function editProfile(data) {
  return async (dispatch) => {
    // check to see if variables are in data
    var username = Object.keys().filter(x==="username").length > 0 ? data.username : null
    var email = Object.keys().filter(x==="email").length > 0 ? data.email : null
    var name = Object.keys().filter(x==="name").length > 0 ? data.name : null
    var image = Object.keys().filter(x==="image").length > 0 ? data.image : null

    // check to see if user has edited user or artist profile data and make requests accordingly
    if(username !== null || email !== null) await revibe.editUserProfile(username, email)
    if(name !== null || image !== null) await revibe.editArtistProfile(name, image)

    dispatch(getProfile());
    }

  }
}


};
