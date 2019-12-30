var initialState = {
  uploadedAlbums:[],
  uploadedSongs: [],
  albumContributions: [],
  songContributions: [],
  error: null,
}


export const mediaReducer = (state=initialState, action) => {
    switch (action.type) {

        case "FETCH_UPLOADED_ALBUMS":
            return {
              ...state,
              uploadedAlbums: action.uploadedAlbums
            };
        case "FETCH_UPLOADED_SONGS":
            return {
              ...state,
              uploadedSongs: action.uploadedSongs
            };
        case "FETCH_ALBUM_CONTRIBUTIONS":
            return {
              ...state,
              albumContributions: action.albumContributions
            };
        case "FETCH_SONG_CONTRIBUTIONS":
            return {
              ...state,
              songContributions: action.songContributions
            };
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
