import React, {Component} from "react";
// react plugin used to create a form with multiple steps
// import ReactWizard from "react-bootstrap-wizard";

// reactstrap components
import { Col,Container } from "reactstrap";
import { connect } from 'react-redux';
import { uploadAlbum, uploadAlbumSong } from 'redux/media/actions.js'
import { Prompt } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";

// wizard steps
import ReactWizard from 'components/ReactWizard.js'
import AlbumInfo from "./AlbumForm/AlbumInfo.js";
import SongInfo from "./AlbumForm/SongInfo.js";
import Confirmation from "./AlbumForm/Confirmation.js";
import Album from 'models/Album.js'
import { Beforeunload } from 'react-beforeunload';
import { logEvent } from 'amplitude/amplitude';


class AlbumUpload extends Component {

  constructor(props) {
    super(props)
    this.state = {
      album: new Album(),
      uploadedAlbum: {},
      songs: [],
      beganUploading: false,
      uploadingAlbum: false,
      uploadAlbumComplete: false,
      uploadingSongs: false,
      uploadSongComplete: false,
      finalizing: false,
      finalizingComplete: false
    }
    this.setAlbum = this.setAlbum.bind(this)
    this.setSongs = this.setSongs.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    logEvent("New Upload", "Started")
  }

  componentWillUnmount() {
    logEvent("New Upload", "Ended")
  }

  setAlbum(album) {
    this.setState({album: album})
  }

  setSongs(songs) {
    this.setState({songs: [...songs]})
  }

  async onSubmit() {
    this.setState({beganUploading: true, uploadingAlbum: true})
    await this.props.uploadAlbum(this.state.album, (album) => this.setState({uploadedAlbum: album}))
    this.setState({uploadAlbumComplete: true, uploadingSongs: true})
    var songPromises = this.state.songs.map(song => this.props.uploadAlbumSong(this.state.uploadedAlbum, song))
    var uploadedSongs = await Promise.all(songPromises)
    this.setState({uploadSongComplete: true, finalizing: true})
    setTimeout(() => this.setState({finalizingComplete: true}), 2000)
    logEvent("New Upload", "Submission Complete")
  }

  onDone() {
    window.location.href="/dashboard/uploads"
  }

  render() {
    var steps = [
      {
        stepName: "Details",
        stepIcon: "tim-icons icon-notes",
        component: AlbumInfo,
        stepProps: {
          onAlbumChange: this.setAlbum,
          album: this.state.album,
          artist_id: this.props.artist_id
        }
      },
      {
        stepName: "Songs",
        stepIcon: "tim-icons icon-headphones",
        component: SongInfo,
        stepProps: {
          onSongsChange: this.setSongs,
          artist_id: this.props.artist_id
        }
      },
      {
        stepName: "Confirm",
        stepIcon: "tim-icons icon-check-2",
        component: Confirmation,
        stepProps: {
          album: this.state.album,
          songs: this.state.songs,

          onSongsChange: this.setSongs,
          onAlbumChange: this.setAlbum,
          onUploadSubmit: this.onSubmit,
          beganUploading: this.state.beganUploading,
          uploadingAlbum: this.state.uploadingAlbum,
          uploadAlbumComplete: this.state.uploadAlbumComplete,
          uploadingSongs: this.state.uploadingSongs,
          uploadSongComplete: this.state.uploadSongComplete,
          finalizing: this.state.finalizing ,
          finalizingComplete: this.state.finalizingComplete
        }
      },
    ];

    return (
      <>
      <div className="content">
      <Container>
        <NavLink to={'/dashboard/uploads'} activeClassName="">
          <div style={{cursor: 'pointer', backgroundColor: "#7248BD", width: "3.5rem", height: "3.5rem", borderRadius: "1.75rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <i style={{color: "white", fontSize: "1.5rem", marginRight: ".25rem"}} className="tim-icons icon-minimal-left" />
          </div>
        </NavLink>
        <Prompt
          when={true}
          message={"Are you sure you want to leave? " + (this.state.beganUploading && !this.state.finalizingComplete ? "Your upload will be interupted, which could result in losing your album :(" : "Your progress will not be saved.")}
        />
        {this.state.beganUploading && !this.state.finalizingComplete ? <Beforeunload onBeforeunload={() => "You'll lose your data!"} /> : null}

        <Col className="mr-auto ml-auto" md="12">
          <ReactWizard
            navSteps
            validate
            headerTextCenter
            steps={steps}
            showFinishButton={false}
            afterPrevButtonClick={() => logEvent("New Upload", "Previous Button Clicked")}
            afterNextButtonClick={() => logEvent("New Upload", "Next Button Clicked")}
            displayButtons={!this.state.beganUploading || (this.state.finalizingComplete)}
            complete={this.state.finalizingComplete}
            title=""
            doneButtonClasses="btn-wd btn-success"
            nextButtonClasses="btn-wd btn-primary btn-round"
            previousButtonClasses="btn-wd btn-round"
            doneButtonClick={this.onDone}
            progressbar
            color="primary"
          />
        </Col>
      </Container>
      </div>
      </>
    );
  }
}


function mapStateToProps(state) {
  return {
    artist_id: state.authentication.user.artistId,
  }
};

const mapDispatchToProps = dispatch => ({
  uploadAlbum: (album, callback) =>dispatch(uploadAlbum(album, callback)),
  uploadAlbumSong: (album, songs) =>dispatch(uploadAlbumSong(album, songs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumUpload)
