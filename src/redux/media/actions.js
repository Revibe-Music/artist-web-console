import { sessionService } from 'redux-react-session';
import RevibeAPI from '../../api/revibe.js';

const revibe = new RevibeAPI()


const fetchUploadedAlbums = uploadedAlbums => ({
    type: 'FETCH_UPLOADED_ALBUMS',
    uploadedAlbums: uploadedAlbums,
});

const fetchUploadedSongs = uploadedSongs => ({
    type: 'FETCH_UPLOADED_SONGS',
    uploadedSongs: uploadedSongs,
});

const fetchAlbumContributions = albumContributions => ({
    type: 'FETCH_ALBUM_CONTRIBUTIONS',
    albumContributions: albumContributions,
});

const fetchSongContributions = songContributions => ({
    type: 'FETCH_SONG_CONTRIBUTIONS',
    songContributions: songContributions,
});

const addUploadedAlbum = newUpload => ({
    type: 'ADD_UPLOADED_ALBUM',
    newUpload: newUpload,
});

const editUploadedAlbum = editedUpload => ({
    type: 'EDIT_UPLOADED_ALBUM',
    editedUpload: editedUpload,
});

const removeUploadedAlbum = index => ({
    type: 'REMOVE_UPLOADED_ALBUM',
    index: index,
});

const addUploadedSong = newUpload => ({
    type: 'ADD_UPLOADED_SONG',
    newUpload: newUpload,
});

const editUploadedSong = editedUpload => ({
    type: 'EDIT_UPLOADED_SONG',
    editedUpload: editedUpload,
});

const removeUploadedSong = index => ({
    type: 'REMOVE_UPLOADED_SONG',
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

const setSelectedAlbum = album_id => ({
    type: 'SET_SELECTED_ALBUM',
    album_id: album_id,
});

const setSelectedSong = song_id => ({
    type: 'SET_SELECTED_SONG',
    song_id: song_id,
});

const error = error => ({
    type: 'ERROR',
    error: error,
});


// Only functions below should ever be called by a component!

export function getUploadedAlbums() {
  return async (dispatch) => {
    var response = await revibe.getUploadedAlbums()
    if(response.status === 200) {
      response = response.data
      dispatch(fetchUploadedAlbums(response));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while fetching uploaded albums."));
    }
  }
}

export function getUploadedSongs() {
  return async (dispatch) => {
    var response = await revibe.getUploadedSongs()
    if(response.status === 200) {
      response = response.data
      dispatch(fetchUploadedSongs(response));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while fetching uploaded songs."));
    }
  }
}

export function getAlbumContributions() {
  return async (dispatch) => {
    var response = await revibe.getAlbumContributions()
    if(response.status === 200) {
      response = response.data
      dispatch(fetchAlbumContributions(response));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while fetching album contributions."));
    }
  }
}

export function getSongContributions() {
  return async (dispatch) => {
    var response = await revibe.getSongContributions()
    if(response.status === 200) {
      response = response.data
      dispatch(fetchSongContributions(response));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while fetching song contributions."));
    }
  }
}


export function uploadAlbum(name, image, type, songs, uploadStatusFn) {
  return async (dispatch) => {
    var response = await revibe.createUploadedAlbum(name, image, type)
    if(response.status === 200) {
      response = response.data
      dispatch(addUploadedAlbum(response));
      for(var x=0; x<songs.length; x++) {
        const song = songs[x]
        revibe.createUploadedSong(song.title, song.file, song.duration, response.album_id, song.explicit)
          .then((savedSong) => {
            savedSong = savedSong.data
            uploadStatusFn(song.index, "uploaded", true)
            dispatch(addUploadedSong(savedSong));
          })
      }
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while uploading an album."));
    }
  }
}

export function editAlbum(album_id, name=null, image=null, type=null) {
  return async (dispatch) => {
    var response = await revibe.editUploadedAlbum(album_id, name, image, type)
    if(response.status === 200) {
      response = response.data
      console.log(response);
      dispatch(editUploadedAlbum(response));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while editing an album."));
    }
  }
}

export function deleteAlbum(album_id) {
  return async (dispatch, getState) => {
    var response = revibe.deleteUploadedAlbum(album_id)
    if(response.status === 200) {
      var index = getState().media.uploadedAlbums.map(function(x) {return x.album_id; }).indexOf(album_id)
      dispatch(removeUploadedAlbum(index));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while deleting an album."));
    }
  }
}

export function editSong(song_id, title=null, file=null) {
  return async (dispatch) => {
    var response = await revibe.editUploadedSong(song_id, title, file)
    if(response.status === 200) {
      response = response.data
      dispatch(editUploadedSong(response));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while deleting an album."));
    }
  }
}

export function deleteSong(song_id) {
  return async (dispatch, getState) => {
    var response = revibe.deleteUploadedSong(song_id)
    if(response.status === 200) {
      var index = getState().media.uploadedSongs.map(function(x) {return x.song_id; }).indexOf(song_id)
      dispatch(removeUploadedSong(index));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while deleting an album."));
    }
  }
}

export function selectAlbum(album_id) {
  return async (dispatch) => {
    dispatch(setSelectedAlbum(album_id));
  }
}

export function selectSong(song_id) {
  return async (dispatch) => {
    dispatch(setSelectedSong(song_id));
  }
}
