var initialState = {
  uploadedAlbums:[],
  uploadedSongs: [],
  albumContributions: [],
  songContributions: [],
  selectedAlbum: null,  // this is used to determine which album a user is editing/previewing
  selectedSong: null,   // this is used to determine which song a user is editing/previewing
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
        case "ADD_UPLOADED_ALBUM":
            return {
              ...state,
              uploadedAlbums: [...state.uploadedAlbums, action.newUpload]
            };
        case "EDIT_UPLOADED_ALBUM":
            return {
              ...state,
              uploadedAlbums: state.uploadedAlbums.map((album) => (
                album.album_id===action.editedUpload.album_id ? action.editedUpload: album
              ))
            };
        case 'REMOVE_UPLOADED_ALBUM':
            return {
              ...state,
              uploadedAlbums: [
                ...state.uploadedAlbums.slice(0, action.index),
                ...state.uploadedAlbums.slice(action.index + 1)
              ]
            };

        case "ADD_UPLOADED_SONG":
            return {
              ...state,
              uploadedSongs: [...state.uploadedAlbums, action.newUpload]
            };
        case "EDIT_UPLOADED_SONG":
            return {
              ...state,
              uploadedSongs: state.uploadedSongs.map((song) => (
                song.album_id===action.editedUpload.song_id ? action.editedUpload: song
              ))
            };
        case 'REMOVE_UPLOADED_SONG':
            return {
              ...state,
              uploadedSongs: [
                ...state.uploadedSongs.slice(0, action.index),
                ...state.uploadedSongs.slice(action.index + 1)
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

        case 'SET_SELECTED_ALBUM':
            return {
              ...state,
              selectedAlbum: action.album_id
            };
        case 'SET_SELECTED_SONG':
            return {
              ...state,
              selectedSong: action.song_id
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
