import RevibeAPI from '../../api/revibe.js';
import { logEvent } from 'amplitude/amplitude';

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

const changeAlbumContributionStatus = albumContribution => ({
    type: 'CHANGE_ALBUM_CONTRIBUTION_STATUS',
    albumContribution: albumContribution,
});

const changeSongContributionStatus = songContribution => ({
    type: 'CHANGE_SONG_CONTRIBUTION_STATUS',
    songContribution: songContribution,
});

const setSelectedAlbum = album_id => ({
    type: 'SET_SELECTED_ALBUM',
    album_id: album_id,
});

const setSelectedSong = song_id => ({
    type: 'SET_SELECTED_SONG',
    song_id: song_id,
});

const setUpload = bool => ({
    type: 'UPLOAD_IN_PROGRESS',
    bool: bool,
});

const error = error => ({
    type: 'ERROR',
    error: error,
});


// Only functions below should ever be called by a component!

export function getUploadedAlbums() {
  return async (dispatch) => {
    var response = await revibe.getUploadedAlbums()
    if(String(response.status).charAt(0)=="2") {
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
    if(String(response.status).charAt(0)=="2") {
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
    if(String(response.status).charAt(0)=="2") {
      response = response.data
      if(response === null) {
        response = []
      }
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
    if(String(response.status).charAt(0)=="2") {
      response = response.data
      if(response === null) {
        response = []
      }
      dispatch(fetchSongContributions(response));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while fetching song contributions."));
    }
  }
}

export function uploadAlbum(album, callback) {
  return async (dispatch) => {
    logEvent("New Upload", "Submitted")
    var response = await revibe.createUploadedAlbum(album.name, album.image, album.type, album.displayed, album.datePublished)
    if(String(response.status).charAt(0)=="2") {
      const newAlbum = response.data
      var albumContributionPromises = []
      for(var i=0; i<album.contributors.length; i++) {
        for(var j=0; j<album.contributors[i].type.length; j++) {
          var albumContributor = revibe.addUploadedAlbumContributor(newAlbum.id, album.contributors[i].contributor.artist_id, album.contributors[i].type[j])
          albumContributionPromises.push(albumContributor)
        }
      }
      // if(album.genres.length > 0) await revibe.addUploadedAlbumGenres(newAlbum.album_id, album.genres)
      // if(album.tags.length > 0) await revibe.addUploadedAlbumTags(newAlbum.album_id, album.tags)

      var albumContributionResult = await Promise.all(albumContributionPromises)
      var allAlbumContributions = albumContributionResult.map(function(x) {return x.data})
      newAlbum.contributors = allAlbumContributions
      newAlbum.total_streams = 0
      await dispatch(addUploadedAlbum(newAlbum));
      await callback(newAlbum);
      dispatch(error(null));
    }
    else {
      // need to dispatch appropriate error here
      logEvent("New Upload", "Album Submission Failure")
      dispatch(error("An error occured while uploading an album."));
    }
  }
}

export function uploadAlbumSong(album, song) {
  return async (dispatch) => {
    const contributors = song.contributors
    var savedSong = await revibe.createUploadedSong(album.id, song.title, song.file, song.duration, song.explicit, song.order,song.displayed)
    if(String(savedSong.status).charAt(0)=="2") {
      const savedSongData = savedSong.data
      var contributionPromises = []
      for(var i=0; i<contributors.length; i++) {
        for(var j=0; j<contributors[i].type.length; j++){
          var contribution = revibe.addUploadedSongContributor(savedSongData.id, contributors[i].contributor.artist_id, contributors[i].type[j])
          contributionPromises.push(contribution)
        }
      }
      if(song.genres.length > 0) await revibe.addUploadedSongGenres(savedSongData.id, song.genres)
      if(song.tags.length > 0) await revibe.addUploadedSongTags(savedSongData.id, song.tags)

      var contributionResult = await Promise.all(contributionPromises)
      // need to check for response errors here
      var allContributions = contributionResult.map(function(x) {return x.data})
      savedSongData.album = album
      savedSongData.contributors = allContributions
      savedSongData.total_streams = 0
      dispatch(addUploadedSong(savedSongData));
      dispatch(error(null));
    }
    else {
      logEvent("New Upload", "Song Submission Failure")
      // need to dispatch appropriate error here
      dispatch(error("An error occured while uploading a song."));
    }
  }
}

export function editAlbum(album_id, name=null, image=null, type=null) {
  return async (dispatch) => {
    var response = await revibe.editUploadedAlbum(album_id, name, image, type)
    if(String(response.status).charAt(0)=="2") {
      response = response.data
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
    var response = await revibe.deleteUploadedAlbum(album_id)
    if(String(response.status).charAt(0)=="2") {
      var index = getState().media.uploadedAlbums.map(function(x) {return x.id; }).indexOf(album_id)
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
    if(String(response.status).charAt(0)=="2") {
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
    var response = await revibe.deleteUploadedSong(song_id)
    if(String(response.status).charAt(0)=="2") {
      var index = getState().media.uploadedSongs.map(function(x) {return x.song_id; }).indexOf(song_id)
      dispatch(removeUploadedSong(index));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while deleting an album."));
    }
  }
}

export function approveAlbumContribution(album, contribution_id) {
  return async (dispatch, getState) => {
    var response = await revibe.approveAlbumContribution(contribution_id)
    if(String(response.status).charAt(0)=="2") {
      logEvent("Contributions", "Approve", {type: "Album"})
      var index = album.contributors.map(function(x) {return x.contribution_id; }).indexOf(contribution_id)
      album.contributors[index].approved = true
      album.contributors[index].pending = false
      dispatch(changeAlbumContributionStatus(album));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while approving an album contribution."));
    }
  }
}

export function rejectAlbumContribution(album, contribution_id) {
  return async (dispatch, getState) => {
    var response = await revibe.rejectAlbumContribution(contribution_id)
    if(String(response.status).charAt(0)=="2") {
      logEvent("Contributions", "Reject", {type: "Album"})
      var index = album.contributors.map(function(x) {return x.contribution_id; }).indexOf(contribution_id)
      album.contributors[index].approved = false
      album.contributors[index].pending = false
      dispatch(changeAlbumContributionStatus(album));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while rejecting an album contribution."));
    }
  }
}

export function approveSongContribution(song, contribution_id) {
  return async (dispatch, getState) => {
    var response = await revibe.approveSongContribution(contribution_id)
    if(String(response.status).charAt(0)=="2") {
      logEvent("Contributions", "Approve", {type: "Song"})
      var index = song.contributors.map(function(x) {return x.contribution_id; }).indexOf(contribution_id)
      song.contributors[index].approved = true
      song.contributors[index].pending = false
      dispatch(changeSongContributionStatus(song));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while approving a song contribution."));
    }
  }
}

export function rejectSongContribution(song, contribution_id) {
  return async (dispatch, getState) => {
    var response = await revibe.rejectSongContribution(contribution_id)
    if(String(response.status).charAt(0)=="2") {
      logEvent("Contributions", "Reject", {type: "Song"})
      var index = song.contributors.map(function(x) {return x.contribution_id; }).indexOf(contribution_id)
      song.contributors[index].approved = false
      song.contributors[index].pending = false
      dispatch(changeSongContributionStatus(song));
      dispatch(error(null));
    }
    else {
      dispatch(error("An error occured while rejecting a song contribution."));
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

export function setUploadInProgress(bool) {
  return async (dispatch) => {
    dispatch(setUpload(bool));
  }
}
