var initialState = {
  uploads:[],
  contributions: [],
  error: null,
}


export const authenticationReducer = (state=initialState, action) => {
    switch (action.type) {

        case "ADD_UPLOAD":
            return {
              ...state,
              uploads: [...state.uploads, action.newUpload]
            };

        case "EDIT_UPLOAD":
            // FIGURE OUT
            return {
              ...state,
              uploads: [...state.uploads, action.newUpload]
            };
        case 'REMOVE_UPLOAD':
            return {
              ...state,
              uploads: [
                ...state.uploads.slice(0, action.index),
                ...state.uploads.slice(action.index + 1)
              ]
            };
        case "ADD_CONTRIBUTION":
            return {
              ...state,
              contributions: [...state.contributions, action.newContribution]
            };

        case "EDIT_CONTRIBUTION":
            // FIGURE OUT
            return {
              ...state,
              contributions: [...state.contributions, action.contribution]
            };
        case 'REMOVE_CONTRIBUTION':
            return {
              ...state,
              contributions: [
                ...state.contributions.slice(0, action.index),
                ...state.contributions.slice(action.index + 1)
              ]
            };
        case 'ERROR':
            return {
              ...state,
              error: action.error
            };
        default:
            return state;
    }
};
