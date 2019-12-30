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
