var initialState = {
  checkedLogin: true,
  isLoggedIn: true,    // refers to revibe, youtube, and spotify
  user: {
    id: "",
    username: "",
    email: "",
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
    socialMedia: []
  },
  registerErrors: {},
  registerArtistErrors: {},
  loginErrors: {},
  logoutErrors: {},
  getProfileErrors: {},
  editProfileErrors: {},
  editSettingErrors: {},
  editSocialMediaLinksErrors: {},
}


export const authenticationReducer = (state=initialState, action) => {
    switch (action.type) {

        case "CHECK_AUTHENTICATION":
          return { ...state,
            checkedLogin: action.checkedLogin
          };
        case 'IS_AUTHENTICATED':
            return {
              ...state,
              isLoggedIn: action.isLoggedIn
            };
        case 'LOGIN_USER':
          return {
            ...state,
            checkedLogin: action.checkedLogin,
            isLoggedIn: action.isLoggedIn,
          };
        case 'LOGOUT_USER':
          return {
            ...state,
            isLoggedIn: false,
          };
        case 'UPDATE_USER_DATA':
          return {
            ...state,
            user: action.user,
          }
        case 'REMOVE_USER_DATA':
          return {
            ...state,
            initialState
          }
        case 'ERROR':
            return {
              ...state,
              [action.errorName + "Errors"] : action.errors
            };
        case 'CLEAR_ERROR':
            return {
              ...state,
              [action.errorName + "Errors"] : {}
            };
        default:
            return state;
    }
};
