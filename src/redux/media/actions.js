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
    error,
});


// Only functions below should ever be called by a component!

export function getUploadedAlbums() {
  return async (dispatch) => {
    var albums = await revibe.getUploadedAlbums()
    dispatch(fetchUploadedAlbums(albums));
  }
}

export function getUploadedSongs() {
  return async (dispatch) => {
    var songs = await revibe.getUploadedSongs()
    dispatch(fetchUploadedSongs(songs));
  }
}

export function getAlbumContributions() {
  return async (dispatch) => {
    var albums = await revibe.getAlbumContributions()
    dispatch(fetchAlbumContributions(albums));
  }
}

export function getSongContributions() {
  return async (dispatch) => {
    var songs = await revibe.getSongContributions()
    dispatch(fetchSongContributions(songs));
  }
}


export function uploadAlbum(name, image, type, songs, uploadStatusFn) {
  return async (dispatch) => {
    var album = await revibe.createUploadedAlbum(name, image, type)
    dispatch(addUploadedAlbum(album));
    for(var x=0; x<songs.length; x++) {
      const song = songs[x]
      revibe.createUploadedSong(song.title, song.file, song.duration, album.album_id, song.explicit)
        .then((savedSong) => {
          uploadStatusFn(song.index, "uploaded", true)
          dispatch(addUploadedSong(savedSong));
        })
    }
  }
}

export function editAlbum(album_id, name=null, image=null, type=null) {
  return async (dispatch) => {
    console.log(album_id);
    console.log(name);
    console.log(image);
    console.log(type);
    var album = await revibe.editUploadedAlbum(album_id, name, image, type)
    console.log(album);
    dispatch(editUploadedAlbum(album));
  }
}

export function deleteAlbum(album_id) {
  return async (dispatch, getState) => {
    revibe.deleteUploadedAlbum(album_id)
    var index = getState().media.uploadedAlbums.map(function(x) {return x.album_id; }).indexOf(album_id)
    dispatch(removeUploadedAlbum(index));
  }
}

export function editSong(song_id, title=null, file=null) {
  return async (dispatch) => {
    var song = await revibe.editUploadedSong(song_id, title, file)
    dispatch(editUploadedSong(song));
  }
}

export function deleteSong(song_id) {
  return async (dispatch, getState) => {
    revibe.deleteUploadedSong(song_id)
    var index = getState().media.uploadedSongs.map(function(x) {return x.song_id; }).indexOf(song_id)
    dispatch(removeUploadedSong(index));
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
