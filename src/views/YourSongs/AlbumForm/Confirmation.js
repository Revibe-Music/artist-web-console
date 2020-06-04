import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import Switch from "react-bootstrap-switch";
import ReactDatetime from "react-datetime";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { Card, CardBody, Button, Row, Col,FormGroup,  UncontrolledTooltip} from "reactstrap";
import moment from 'moment'

import SongCard from "components/Cards/SongCard.jsx";
import AlbumCard from "components/Cards/AlbumCard.jsx";
import UploadStatus from "components/ActivityIndicators/UploadStatus.js";


class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datePublished: moment(new Date()).format('MM/DD/YYYY h:mm A'),
      dateIsValid:true,
      playingSongId: "",
      playing: false
    }

    this.dateTimePicker = React.createRef();
  }

  componentDidMount() {
    var album = this.props.album
    album.datePublished = moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss")
    this.props.onAlbumChange(album)
  }

  onDatePublishedChange = (datetime) => {
    if(datetime instanceof moment) {
      if(datetime.isValid()) {
        this.setState({datePublished: datetime})
        var album = this.props.album
        album.datePublished = datetime.format("YYYY-MM-DD[T]HH:mm:ss");
        this.props.onAlbumChange(album)
      }
      this.setState({dateIsValid: datetime.isValid()})
    }
    else {
      if(datetime === "") {
        this.setState({datePublished: moment(new Date()).format('MM/DD/YYYY h:mm A')})
        this.setState({dateIsValid: true})
        var album = this.props.album
        album.datePublished = moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss")
        this.props.onAlbumChange(album)
      }
      else {
        this.setState({dateIsValid: false})
      }
    }
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
      if(song.file) {
        var url = URL.createObjectURL(song.file);
        this.audio = new Audio(url)
        this.audio.play()
        this.setState({playingSongId: song.id, playing: true})
      }
    }
  }

  render() {
    return (
      <>
        <h1 align="center">Confirm your release</h1>
        {!this.props.beganUploading ?
          <>
          <Card style={{borderRadius: 10, width: window.screen.width < 400 ? "100%" : "50%", margin: "auto"}}>
            <CardBody>
              <Row style={{alignItems: "baseline", justifyContent: "center"}}>
                <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "2%"}} id="playback-question"/>
                <h3 align="center">Allow playback on Revibe Music</h3>
                <UncontrolledTooltip
                  style={{backgroundColor: "#7248BD", color: "white"}}
                  placement="bottom"
                  target="playback-question"
                  hideArrow={true}
                >
                  Enabling this will make the contents of this album discoverable Revibe Music app users.
                </UncontrolledTooltip>
              </Row>
              <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Switch
                  value={this.props.album.hasOwnProperty("displayed") ? this.props.album.displayed : true}
                  onText={<i className="tim-icons icon-check-2" />}
                  offText={<i className="tim-icons icon-simple-remove" />}
                  offColor=""
                  onColor=""
                  onChange={(el, state) => {
                    var album = this.props.album
                    if(!state) {
                      album.datePublished = null
                    }
                    else {
                      album.datePublished = this.dateTimePicker.value
                    }
                    album.displayed = state
                    this.props.onAlbumChange(album)
                    var songs = this.props.songs
                    songs = songs.map(song => {
                      song.displayed = state
                      return song
                    })
                    this.props.onSongsChange(songs)
                  }}
                />
              </div>
              <div style={{display: "grid", alignItems: "center", justifyContent: "center", marginTop: "2%"}}>
                <h3 align="center">Choose your release date</h3>
                <FormGroup>
                  <ReactDatetime
                    ref={this.dateTimePicker}
                    onChange={this.onDatePublishedChange}
                    isValidDate={(current) =>  current.isAfter( moment(new Date()).subtract( 1, 'day' ) ) }
                    inputProps={{
                      disabled: this.props.album.hasOwnProperty("displayed") ? !this.props.album.displayed : false,
                      className: "primary form-control",
                      placeholder: this.state.datePublished
                    }}
                  />
                  {!this.state.dateIsValid ? (
                    <label style={{color: "red"}} className="error">
                      Date/Time invalid.
                    </label>
                  ) : null}
                </FormGroup>
              </div>

              <div style={{display: "grid", alignItems: "center", justifyContent: "center", marginTop: "2%"}}>
                <h4 align="center">Please confirm the details below before uploading</h4>
                <Button
                  style={{width: "fit-content", margin: "auto"}}
                  className="btn-wd btn-primary btn-round"
                  onClick={() => this.props.onUploadSubmit()}
                >
                Upload Album
                </Button>
              </div>
            </CardBody>
          </Card>

          <AlbumCard
            album={this.props.album}
            allowExpansion={false}
            allowEdit={false}
            allowDelete={false}
          />

          {this.props.songs.map((song, index) => (
              <div style={{marginTop: index !== 0 ? "30px" : "auto"}}>
                <SongCard
                  song={song}
                  displayOptions={false}
                  onPlaySong={() => this.playSong(song)}
                  isPlaying={this.state.playingSongId===song.id && this.state.playing}
                  onDeleteClicked={() => this.removeSong(song.id)}
                  onEditSong={this.editSong}
                  displayStreams={false}
                  defaultCollapseState={true}
                />
              </div>
            ))}
          </>
        :
          <Card style={{borderRadius: 10, width: window.screen.width < 400 ? "100%" : "50%", margin: "auto"}}>
            <CardBody>
              {this.props.uploadingAlbum ?
                <FadeIn>
                  <Row style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%",marginBottom: "5%"}}>
                    <Col xs="0" md="4"></Col>
                    <Col xs="9" md="4">
                      <p style={{textAlign: "justify", fontSize: "1.5rem", marginRight: "10%"}}>Creating album</p>
                    </Col>
                    <Col xs="3" md="4">
                      <UploadStatus loading={this.props.uploadAlbumComplete} />
                    </Col>
                  </Row>
                </FadeIn>
              :
                null
              }
              {this.props.uploadingSongs ?
                <FadeIn>
                  <Row style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%",marginBottom: "5%"}}>
                    <Col xs="0" md="4"></Col>
                    <Col xs="9" md="4">
                      <p style={{textAlign: "justify", fontSize: "1.5rem", marginRight: "10%"}}>Attaching songs</p>
                    </Col>
                    <Col xs="3" md="4">
                      <UploadStatus loading={this.props.uploadSongComplete} />
                    </Col>
                  </Row>
                </FadeIn>
              :
                null
              }
              {this.props.finalizing ?
                <FadeIn>
                  <Row style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%",marginBottom: "5%"}}>
                    <Col xs="0" md="4"></Col>
                    <Col xs="9" md="4">
                      <p style={{textAlign: "justify", fontSize: "1.5rem", marginRight: "10%"}}>Checking vibes</p>
                    </Col>
                    <Col xs="3" md="4">
                      <UploadStatus loading={this.props.finalizingComplete} />
                    </Col>
                  </Row>
                </FadeIn>
              :
                null
              }
            </CardBody>
          </Card>
        }
      </>
    );
  }
}

// {!this.props.beganUploading ?
//   <>
//   <h3 className="info-text">
//     Just a few more things.
//   </h3>
//   <Row>
//   <Col xs="12" md="6">
//     <h4>
//       Album Overview
//     </h4>
//     <h5>
//       Name: {this.props.album.hasOwnProperty("name") ? this.props.album.name : ""}
//     </h5>
//     <h5>
//       Type: {this.props.album.hasOwnProperty("type") ? this.props.album.type : ""}
//     </h5>
//     <h5>
//       Songs:
//     </h5>
//     <ul>
//       {this.props.songs.map(song => (
//         <li>{song.displayTitle()}</li>
//       ))}
//     </ul>
//   </Col>
//   <Col xs="12" md="6">
//     <h4>
//       Choose Revibe Music release date.
//     </h4>
//     <FormGroup>
//       <ReactDatetime
//         onChange={this.onDatePublishedChange}
//         isValidDate={(current) =>  current.isAfter( moment(new Date()).subtract( 1, 'day' ) ) }
//         inputProps={{
//           disabled: this.props.album.hasOwnProperty("displayed") ? !this.props.album.displayed : false,
//           className: "primary form-control",
//           placeholder: this.state.datePublished
//         }}
//       />
//       {!this.state.dateIsValid ? (
//         <label style={{color: "red"}} className="error">
//           Date/Time invalid.
//         </label>
//       ) : null}
//     </FormGroup>
//
//     <Row style={{marginTop: "5%"}}>
//       <Col xs="4" md="2">
//         <Switch
//           value={this.props.album.hasOwnProperty("displayed") ? this.props.album.displayed : true}
//           offColor=""
//           onColor=""
//           onChange={(el, state) => {
//             var album = this.props.album
//             if(!state) {
//               album.datePublished = null
//             }
//             album.displayed = state
//             this.props.onAlbumChange(album)
//             var songs = this.props.songs
//             songs = songs.map(song => {
//               song.displayed = state
//               return song
//             })
//             this.props.onSongsChange(songs)
//           }}
//         />
//       </Col>
//       <Col xs="8" md="10">
//         <p>
//           <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="playback-question"/>
//           Allow playback in Revibe Music app.
//         </p>
//         <UncontrolledTooltip
//           style={{backgroundColor: "#7248BD", color: "white"}}
//           placement="bottom"
//           target="playback-question"
//           hideArrow={true}
//         >
//           Enabling this will make the contents of this album discoverable Revibe Music app users.
//         </UncontrolledTooltip>
//       </Col>
//     </Row>
//   </Col>
//   </Row>
//   </>
// :
// <>
// {this.props.uploadingAlbum ?
//   <FadeIn>
//     <Row style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%",marginBottom: "5%"}}>
//       <Col xs="0" md="4"></Col>
//       <Col xs="9" md="4">
//         <p style={{textAlign: "justify", fontSize: "1.5rem", marginRight: "10%"}}>Creating album</p>
//       </Col>
//       <Col xs="3" md="4">
//         <UploadStatus loading={this.props.uploadAlbumComplete} />
//       </Col>
//     </Row>
//   </FadeIn>
// :
//   null
// }
// {this.props.uploadingSongs ?
//   <FadeIn>
//     <Row style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%",marginBottom: "5%"}}>
//       <Col xs="0" md="4"></Col>
//       <Col xs="9" md="4">
//         <p style={{textAlign: "justify", fontSize: "1.5rem", marginRight: "10%"}}>Attaching songs</p>
//       </Col>
//       <Col xs="3" md="4">
//         <UploadStatus loading={this.props.uploadSongComplete} />
//       </Col>
//     </Row>
//   </FadeIn>
// :
//   null
// }
// {this.props.finalizing ?
//   <FadeIn>
//     <Row style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%",marginBottom: "5%"}}>
//       <Col xs="0" md="4"></Col>
//       <Col xs="9" md="4">
//         <p style={{textAlign: "justify", fontSize: "1.5rem", marginRight: "10%"}}>Checking vibes</p>
//       </Col>
//       <Col xs="3" md="4">
//         <UploadStatus loading={this.props.finalizingComplete} />
//       </Col>
//     </Row>
//   </FadeIn>
// :
//   null
// }
// </>
// }

export default Confirmation
