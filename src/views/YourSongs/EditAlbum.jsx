import React, {Component} from 'react';
import classNames from "classnames";

// reactstrap components
import {
  Container,
  Button,
  Card,
  CardBody,
  Label,
  Form,
  FormGroup,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import ReactTooltip from 'react-tooltip';
import { NavLink } from "react-router-dom";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';
import { connect } from 'react-redux';

import TextInput from "components/Inputs/TextInput.jsx";
import Select from "components/Inputs/Select.jsx";
import SongCard from "components/Cards/SongCard.jsx";
import EditAlbumCard from "components/Cards/EditAlbumCard.jsx";
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import SongSelect from "components/SongSelect.js";
import ContributorTags from "components/Inputs/ContributorTags.jsx";
import ContributionWarning from "components/Modals/ContributionWarning.js";
import FileExtensionWarning from "components/Modals/FileExtensionWarning.js";
import { uploadAlbum } from 'redux/media/actions.js'
import Song from 'models/Song.js'
import Album from 'models/Album.js'

const musicMetadata = require('music-metadata-browser');


class EditAlbum extends Component {

  constructor() {
      super();
      this.state = {
        songs: [],
        album: new Album(),
        uploading: false,
        attemptedUpload: false, // indicates if the user pressed upload buttun

        showContributionWarning: false,
        ignoreContributionWarning: false,
        contributionWarningObjectType: "",
        contributionWarningOccurances: "",

        showFileExtensionWarning: false,
        ignoreFileExtensionWarning: false,
        fileExtensionWarningOccurances: 0,

        playingSongId: "",
        playing: false
      };

      this.genreOptions = ["Blues","Classical","Country","Electronic","Folk","Hip-hop","Jazz","New age","Reggae","Rock",]

      this.contributionStringTests = [
        " ft ", "ft.", "ft:", "ft-",
        " feat ", "feat.", "feat-", "feat:",
        " feature ", "feature-", " feature:",
        " features ", "features-", "features:",
        " featuring ", "featuring-", "featuring:",
        " prod by ", "prod by-", "prod by:",
        " produced by ", "produced by-", "produced by:",
      ]

      this.fileExtensionTests = [".mp3", ".mp4", ".wav", ".flac", ".ogg"]


      // Table Edit Methods
      this.editSong = this.editSong.bind(this)
      this.removeSong = this.removeSong.bind(this)
      this.onDrop = this.onDrop.bind(this)

      // Album Edit/State Methods
      this.editAlbum = this.editAlbum.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    this.setState({album: this.getAlbum(),songs: this.getAlbumSongs()})
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.uploadedAlbums.length > prevProps.uploadedAlbums) {
      this.setState({album: this.getAlbum()})
    }
    if(this.props.uploadedSongs.length > prevProps.uploadedSongs) {
      this.setState({songs: this.getAlbumSongs()})
    }

    // this is needed for rendering table rows
    if(this.state.songs.length !== prevState.songs.length) {
      this.state.songs.forEach((item, i) => {
        item.index = i;
      });
    }
  }

  getAlbum = () => {
    var album = this.props.uploadedAlbums.filter(x => x.id === this.props.match.params.album_id)
    if(album.length > 0) {
      // album = this._parseAlbum(album[0])
      album = new Album(album[0])
      console.log(album);
      return album
    }
    return new Album()
  }

  getAlbumSongs = () => {
    console.log(this.props.uploadedSongs);
    var songs = this.props.uploadedSongs.filter(x => x.album.id === this.props.match.params.album_id)
    var songs = songs.map(x => new Song(x))
    songs.sort(function(a, b) {
      if(a.order < b.order) { return -1; }
      if(a.order > b.order) { return 1; }
      return 0;
    })
    console.log(songs);
    return songs
  }


  async onDrop(files) {
    var songs = [...this.state.songs]
    for(var x=0; x<files.length; x++) {
      var metadata = await musicMetadata.parseBlob(files[x]);
      var formattedSong = {
        id: Math.floor(Math.random() * 1000000000),       // temp id for referening
        title: metadata.common.title ? metadata.common.title : files[x].name,
        duration: Math.round(metadata.format.duration),
        file: files[x],
        explicit: false,
        contributors: [],
        genres: [],
        tags: [],
        displayed: true,
        error: "",
        state: ""
      }
      var song = new Song(formattedSong)
      song.formatTitle()
      songs.push(song)
    }
    songs = songs.map((song, index) => {
      song.order = index
      return song
    })
    this.setState({songs:songs})
  }

  editAlbum(values, callback) {
    values = values !== "array" ? [values] : values
    var album = this.state.album
    album[callback](...values)
    this.setState({album: album})
  }

  editSong(songId, values, callback) {
    values = values !== "array" ? [values] : values
    var songs = [... this.state.songs]
    var index = songs.map(function(x) {return x.id; }).indexOf(songId)
    songs[index][callback](...values)
    this.setState({songs: songs})
  }

  removeSong(songId) {
    var songs = [... this.state.songs]
    var index = songs.map(function(x) {return x.id; }).indexOf(songId)
    songs.splice(index, 1)
    this.setState({songs: songs})
  }

  albumValidated = () => {
    var album = this.state.album
    album.clearErrors()
    album.validate()
    this.setState({album: album})
    return album.isValid()
  };

  songsValidated = () => {
    if(this.state.songs.length < 1) return false
    var isValid = true
    var showContributionWarning = false
    var contributionWarningOccurances = 0
    var showFileExtensionWarning = false
    var fileExtensionWarningOccurances = 0
    var songs = [...this.state.songs]
    for(var x=0; x<songs.length; x++) {
      songs[x].clearErrors()
      songs[x].validate()
      if (this.fileExtensionTests.some(fileExtension=>songs[x].title.toLowerCase().includes(fileExtension))) {
        if(!this.state.ignoreFileExtensionWarning) {
          showFileExtensionWarning = true
          fileExtensionWarningOccurances ++
          var isValid = false
        }
      }
      if (this.contributionStringTests.some(contributionString => songs[x].title.toLowerCase().includes(contributionString))) {
        if(!this.state.ignoreContributionWarning) {
          showContributionWarning=true
          contributionWarningOccurances++
        }
      }
      isValid = !isValid ? isValid : songs[x].isValid()
    }
    this.setState({songs: songs})
    if(showFileExtensionWarning) {
      this.setState({showFileExtensionWarning: showFileExtensionWarning, fileExtensionWarningOccurances: fileExtensionWarningOccurances})
      return false
    }
    if(showContributionWarning) {
      this.setState({showContributionWarning: showContributionWarning, contributionWarningOccurances: contributionWarningOccurances})
      return false
    }
  }

  async onSubmit() {
    if(this.albumValidated() && this.songsValidated()) {
      this.setState({uploading: true})
      var uploads = this.state.songs
      this.props.uploadAlbum(this.state.albumName, this.state.albumImage, this.state.albumType, this.state.albumContributors, this.state.songs, this.editRow)
    }
    this.setState({attemptedUpload:true})
  }

  playSong(song) {
    if(song.id === this.state.playingSongId) {
      if(this.state.playing) {
        this.audio.pause()
      }
      else {
        this.audio.play()
      }
      this.setState({playing: !this.state.playing})
    }
    else {
      if(this.audio) {
        this.audio.pause()
        this.audio = null
      }
      if(song.tracks.length > 0) {
        if(song.tracks.length > 2) {
          this.audio = new Audio(song.tracks[2].url)
        }
        else {
          this.audio = new Audio(song.tracks[0].url)
        }
        this.audio.play()
        this.setState({playingSongId: song.id, playing: true})
      }
    }
  }

  render() {

    var albumTypes = [
      {
        value: "",
        isDisabled: true
      },
      { value: "2", label: "Album" },
      { value: "3", label: "Single" },
      { value: "4", label: "EP" },
    ]

    return (
      <>
      <div className="rna-container">
        <NotificationAlert ref="notificationAlert" />
      </div>
      <div className="content">
        <Container>
          <Row style={{justifyContent: "space-between", alignItems: "center"}}>
            <NavLink to={'/dashboard/uploads'} activeClassName="">
              <div style={{cursor: 'pointer', backgroundColor: "#7248BD", width: "3rem", height: "3rem", borderRadius: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <i style={{color: "white", fontSize: "1.25rem", marginRight: ".2rem"}} className="tim-icons icon-minimal-left" />
              </div>
            </NavLink>
              <Button
                style={{margin: 0, height: "fit-content"}}
                color="primary"
                onClick={this.onSubmit}
              >
                Save
              </Button>
          </Row>

          <EditAlbumCard
            album={this.state.album}
            onEditAlbum={this.editAlbum}
            disabled={this.state.uploading}
          />

          {this.state.songs.map((song, index) => (
            <div style={{marginTop: index !== 0 ? "30px" : "auto"}}>
              <SongCard
                song={song}
                onPlaySong={() => this.playSong(song)}
                isPlaying={this.state.playingSongId===song.id && this.state.playing}
                onDeleteClicked={() => this.removeSong(song.id)}
                onEditSong={this.editSong}
                displayStreams={false}
              />
            </div>
          ))}
          <SongSelect onFileSelect={this.onDrop} disabled={this.state.uploading} displayDropzone={false}/>

          <ContributionWarning
            show={this.state.showContributionWarning}
            objectType={this.state.contributionWarningObjectType}
            occurances={this.state.contributionWarningOccurances}
            onClose={() => this.setState({showContributionWarning: false})}
            onIgnore={() => this.setState({showContributionWarning: false, ignoreContributionWarning: true, contributionWarningOccurances: 0})}
          />
          <FileExtensionWarning
            show={this.state.showFileExtensionWarning}
            occurances={this.state.fileExtensionWarningOccurances}
            onClose={() => {
              const songs = [...this.state.songs]
              for(var x=0; x<songs.length; x++) {
                songs[x].removeFileExtensionFromTitle()
              }
              this.setState({showFileExtensionWarning: false, fileExtensionWarningOccurances: 0, songs: songs})
            }}
            onIgnore={() => this.setState({showFileExtensionWarning: false, ignoreFileExtensionWarning: true, fileExtensionWarningOccurances: 0})}
          />
        </Container>
      </div>
      </>
    );
  }
}



function mapStateToProps(state) {
  return {
    uploadedAlbums: state.media.uploadedAlbums,
    uploadedSongs: state.media.uploadedSongs,
  }
};

const mapDispatchToProps = dispatch => ({
    editAlbum: (name, image, type, contributors) =>dispatch(uploadAlbum(name, image, type, contributors)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditAlbum)
