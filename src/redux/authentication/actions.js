import RevibeAPI from 'api/revibe.js';
import { logEvent, setUserData, setRegistration } from 'amplitude/amplitude';
import { setIdentity, logout as branchLogout } from 'branch/branch'

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
    logEvent("Signup", "Clicked")
    var response = await revibe.register(username, email, password)
    if(String(response.status).charAt(0)=="2") {
      response = response.data
      var user = {
        id: response.user.user_id,
        username: response.user.username,
        email: response.user.profile.email,
        artistId: "",
        displayName: "",
        images: {
          small: "",
          medium: "",
          large: "",
        },
        artistAboutMe: "",
        country: "",
        state: "",
        city: "",
        zipcode: "",
        requireContributionApproval: true,
        requireContributionApprovalOnEdit: true,
        shareDataWithContributors: true,
        shareAdvancedDataWithContributors: false,
        allowContributorsToEditContributions: false,
        allowContributorsToEditTags: false,
        displayOtherPlatformContentOnRevibePage: true,
      }
      dispatch(loginUser());
      dispatch(updateUser(user));
      history.push("create-profile/")
      logEvent("Signup", "Success")
      setUserData(response.user.user_id)
      setRegistration()
      setIdentity(response.user.user_id)
    }
    else {
      logEvent("Signup", "Failure")
      dispatch(error("register", response.data))
    }
  }
}

export function signInViaGoogle(access_token, history) {
  return async (dispatch) => {
    dispatch(clearErrors("register"))
    var response = await revibe.signInGoogle(access_token)
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
      setUserData(response.user.user_id)
      setIdentity(response.user.user_id)
    }
    else {
      dispatch(error("register", response.data))
    }
  }
}

export function registerArtist(name, image, history) {
  return async (dispatch, getState) => {
    dispatch(clearErrors("registerArtist"))
    var email = getState().authentication.user.email
    var response = await revibe.registerArtist(name, image, email)
    if(String(response.status).charAt(0)=="2") {
      logEvent("Onboarding", "Completed")
      response = response.data
      var user = {
        id: response.user.user_id,
        username: response.user.username,
        email: response.user.email,
        artistId: response.artist_id,
        displayName: response.name,
        images: {
          small: response.images[1] ? response.images[1].url : "",
          medium: response.images[2] ? response.images[2].url : "",
          large: response.images[3] ? response.images[3].url : "",
        },
        artistAboutMe: response.artist_profile.about_me,
        country: "",
        state: "",
        city: "",
        zipcode: "",
        requireContributionApproval: true,
        requireContributionApprovalOnEdit: true,
        shareDataWithContributors: true,
        shareAdvancedDataWithContributors: false,
        allowContributorsToEditContributions: false,
        allowContributorsToEditTags: false,
        displayOtherPlatformContentOnRevibePage: true,
        socialMedia: []
      }
      dispatch(updateUser(user));
      history.push({ pathname: '/dashboard', state: { onboardingSliderOpen: true } });
    }
    else {
      dispatch(error("registerArtist", response.data))
    }
  }
}

export function login(username, password, history) {
  return async (dispatch) => {
    dispatch(clearErrors("login"))
    logEvent("Login", "Clicked")
    var response = await revibe.login(username, password)
    if(String(response.status).charAt(0)=="2") {
      logEvent("Login", "Success")
      response = response.data
      if(response.user.force_change_password) {
        await history.push({
          pathname: '/account/change-password',
          state: { password: password, is_artist: response.user.is_artist }
        })
      } else {
        await history.push((response.user.is_artist ? '/dashboard' : '/account/create-profile'))
      }
      dispatch(loginUser());
      dispatch(getProfile());
      setUserData(response.user.user_id)
      setIdentity(response.user.user_id)
    }
    else {
      logEvent("Login", "Failure")
      dispatch(error("login", response.data))
    }
  }
}

export function logout(history) {
  return async (dispatch) => {
    dispatch(clearErrors("logout"));
    logEvent("Logout", "Clicked")
    var response = await revibe.logout()
    if(String(response.status).charAt(0)=="2") {
      logEvent("Logout", "Success")
      response = response.data
      await history.push('/account/login');
      dispatch(logoutUser());
      dispatch(removeUser());
      branchLogout()
    }
    else {
      logEvent("Logout", "Failure")
      dispatch(error("logout", response.data))
    }
  }
}

export function getProfile() {
  return async (dispatch) => {
    dispatch(clearErrors("getProfile"));
    var response = await revibe.getProfile()
    if(String(response.status).charAt(0)=="2") {
      response = response.data
      var user = {
        id: response.user.user_id,
        username: response.user.username,
        email: response.artist_profile.email,
        artistId: response.artist_id,
        displayName: response.name,
        images: {
          small: response.images[0] ? response.images[0].url : "",
          medium: response.images[1] ? response.images[1].url : "",
          large: response.images[2] ? response.images[2].url : "",
        },
        country: response.artist_profile.country,
        state: response.artist_profile.state,
        city: response.artist_profile.city,
        zipcode: response.artist_profile.zip_code,
        artistAboutMe: response.artist_profile.about_me,
        requireContributionApproval: response.artist_profile.require_contribution_approval,
        requireContributionApprovalOnEdit: response.artist_profile.require_contribution_approval_on_edit,
        shareDataWithContributors: response.artist_profile.share_data_with_contributors,
        shareAdvancedDataWithContributors: response.artist_profile.share_advanced_data_with_contributors,
        allowContributorsToEditContributions: response.artist_profile.allow_contributors_to_edit_contributions,
        allowContributorsToEditTags: response.artist_profile.allow_contributors_to_edit_tags,
        displayOtherPlatformContentOnRevibePage: response.artist_profile.display_other_platform_content_on_revibe_page,
        socialMedia: response.artist_profile.social_media
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
    logEvent("Profile", "Saved")
    // check to see if variables are in data
    var name = Object.keys(data).filter(x=> x==="name").length > 0 ? data.name : null
    var email = Object.keys(data).filter(x=> x==="email").length > 0 ? data.email : null
    var image = Object.keys(data).filter(x=> x==="image").length > 0 ? data.image : null
    var country = Object.keys(data).filter(x=> x==="country").length > 0 ? data.country : null
    var state = Object.keys(data).filter(x=> x==="state").length > 0 ? data.state : null
    var city = Object.keys(data).filter(x=> x==="city").length > 0 ? data.city : null
    var zipcode = Object.keys(data).filter(x=> x==="zipcode").length > 0 ? data.zipcode : null
    var aboutMe = Object.keys(data).filter(x=> x==="aboutMe").length > 0 ? data.aboutMe : null

    // check to see if user has edited user or artist profile data and make requests accordingly
    if(name || email || image || country || state || city || zipcode || aboutMe ) {
      var response = await revibe.editArtistProfile(name,email,image,country,state,city,zipcode,aboutMe)
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

export function editSettings(data) {
  return async (dispatch) => {
    dispatch(clearErrors("editSettings"));
    logEvent("Settings", "Saved")
    var response = await revibe.editSettings(
      data.requireContributionApproval,
      data.requireContributionApprovalOnEdit,
      data.shareDataWithContributors,
      data.shareAdvancedDataWithContributors,
      data.allowContributorsToEditContributions,
      data.allowContributorsToEditTags,
      data.displayOtherPlatformContentOnRevibePage
    )
    if(String(response.status).charAt(0)=="2") {
      response = response.data
      dispatch(getProfile());
    }
    else {
      dispatch(error("editSettings", response.data))
    }
  }
}

export function editSocialMediaLinks(data) {
  return async (dispatch, getState) => {
    dispatch(clearErrors("addSocialMediaLinks"));
    dispatch(clearErrors("editSocialMediaLinks"));
    logEvent("Relink", "Saved")
    var newLinks = []
    var deletedLinks = []
    var existingLinks = []
    var existingSocialMedia = getState().authentication.user.socialMedia
    var checkedLinks = []
    for(var x=0; x<data.length; x++) {
      if(existingSocialMedia.filter(y => y.social_media === data[x].service).length > 0) {
        var savedObject = existingSocialMedia.filter(y => y.social_media === data[x].service)[0]
        if(data[x].handle !== savedObject.handle || data[x].order !== savedObject.order) {
          data[x].socialmedia_id = savedObject.id
          Object.keys(data[x]).forEach((key) => {if(data[x][key] == null) delete data[x][key]});
          existingLinks.push(revibe.editSocialMediaLink(data[x]))
        }
        checkedLinks.push(data[x])
      }
      else {
        Object.keys(data[x]).forEach((key) => {if(data[x][key] == null) delete data[x][key]});
        newLinks.push(revibe.addSocialMediaLink(data[x]))
      }
    }
    if(checkedLinks.length !== existingSocialMedia.length) {
      for(var x=0; x<existingSocialMedia.length; x++) {
        var wasRemoved = true
        for(var y=0; y<checkedLinks.length; y++) {
          if(existingSocialMedia[x].social_media === checkedLinks[y].service) {
            wasRemoved = false
            break
          }
        }
        if(wasRemoved) {
          deletedLinks.push(revibe.deleteSocialMediaLink(existingSocialMedia[x].id))
        }
      }
    }

    if(existingLinks.length > 0) {
      var existingLinksResponse = await Promise.all(existingLinks)
      for(var x=0; x<existingLinksResponse.length; x++) {
        if(!String(existingLinksResponse[x].status).charAt(0)=="2") {
          dispatch(error("editSocialMediaLinks", existingLinksResponse[x].data))
        }
      }
    }

    if(newLinks.length > 0) {
      var newLinksResponse = await Promise.all(newLinks)
      for(var x=0; x<newLinksResponse.length; x++) {
        if(!String(newLinksResponse[x].status).charAt(0)=="2") {
          dispatch(error("addSocialMediaLinks", newLinksResponse[x].data))
        }
      }
    }

    if(deletedLinks.length > 0) {
      var deletedLinksResponse = await Promise.all(deletedLinks)
      for(var x=0; x<deletedLinksResponse.length; x++) {
        if(!String(deletedLinksResponse[x].status).charAt(0)=="2") {
          dispatch(error("deleteSocialMediaLinks", deletedLinksResponse[x].data))
        }
      }
    }
    dispatch(getProfile());
  }
}

export function editTipJarLinks(data) {
  return async (dispatch, getState) => {
    dispatch(clearErrors("addTipJarLinks"));
    dispatch(clearErrors("editTipJarLinks"));
    logEvent("Tip Jar", "Saved")
    var newLinks = []
    var existingLinks = []
    var existingSocialMedia = getState().authentication.user.socialMedia
    var checkedLinks = []
    for(var x=0; x<data.length; x++) {
      if(existingSocialMedia.filter(y => y.social_media === data[x].service).length > 0) {
        var savedObject = existingSocialMedia.filter(y => y.social_media === data[x].service)[0]
        if(data[x].handle !== savedObject.handle || data[x].order !== savedObject.order) {
          data[x].socialmedia_id = savedObject.id
          Object.keys(data[x]).forEach((key) => {if(data[x][key] == null) delete data[x][key]});
          existingLinks.push(revibe.editSocialMediaLink(data[x]))
        }
        checkedLinks.push(data[x])
      }
      else {
        Object.keys(data[x]).forEach((key) => {if(data[x][key] == null) delete data[x][key]});
        newLinks.push(revibe.addSocialMediaLink(data[x]))
      }
    }

    if(existingLinks.length > 0) {
      var existingLinksResponse = await Promise.all(existingLinks)
      for(var x=0; x<existingLinksResponse.length; x++) {
        if(!String(existingLinksResponse[x].status).charAt(0)=="2") {
          dispatch(error("editSocialMediaLinks", existingLinksResponse[x].data))
        }
      }
    }

    if(newLinks.length > 0) {
      var newLinksResponse = await Promise.all(newLinks)
      for(var x=0; x<newLinksResponse.length; x++) {
        if(!String(newLinksResponse[x].status).charAt(0)=="2") {
          dispatch(error("addSocialMediaLinks", newLinksResponse[x].data))
        }
      }
    }
    dispatch(getProfile());
  }
}
