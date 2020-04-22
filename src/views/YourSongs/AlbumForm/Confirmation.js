import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import Switch from "react-bootstrap-switch";
import ReactDatetime from "react-datetime";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { Row, Col,FormGroup,  UncontrolledTooltip} from "reactstrap";
import moment from 'moment'

import UploadStatus from "components/ActivityIndicators/UploadStatus.js";


class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      releaseDate: moment(new Date()).format('MM/DD/YYYY h:mm A'),
      dateIsValid:true,
    }
  }

  componentDidMount() {
    var album = this.props.album
    album.releaseDate = moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss")
    this.props.onAlbumChange(album)
  }

  onReleaseDateChange = (datetime) => {
    if(datetime instanceof moment) {
      if(datetime.isValid()) {
        this.setState({releaseDate: datetime})
        var album = this.props.album
        album.releaseDate = datetime.format("YYYY-MM-DD[T]HH:mm:ss");
        console.log(album.releaseDate);
        this.props.onAlbumChange(album)
      }
      this.setState({dateIsValid: datetime.isValid()})
    }
    else {
      if(datetime === "") {
        this.setState({releaseDate: moment(new Date()).format('MM/DD/YYYY h:mm A')})
        this.setState({dateIsValid: true})
        var album = this.props.album
        album.releaseDate = moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss")
        this.props.onAlbumChange(album)
      }
      else {
        this.setState({dateIsValid: false})
      }
    }
  }

  render() {
    return (
      <>
        {!this.props.beganUploading ?
          <>
          <h3 className="info-text">
            Just a few more things.
          </h3>
          <Row>
          <Col xs="12" md="6">
            <h4>
              Album Overview
            </h4>
            <h5>
              Name: {this.props.album.hasOwnProperty("name") ? this.props.album.name : ""}
            </h5>
            <h5>
              Type: {this.props.album.hasOwnProperty("type") ? this.props.album.type : ""}
            </h5>
            <h5>
              Songs:
            </h5>
            <ul>
              {this.props.songs.map(song => (
                <li>{song.displayTitle()}</li>
              ))}
            </ul>
          </Col>
          <Col xs="12" md="6">
            <h4>
              Choose Revibe Music release date.
            </h4>
            <FormGroup>
              <ReactDatetime
                onChange={this.onReleaseDateChange}
                inputProps={{
                  disabled: this.props.album.hasOwnProperty("displayed") ? !this.props.album.displayed : false,
                  className: "primary form-control",
                  placeholder: this.state.releaseDate
                }}
              />
              {!this.state.dateIsValid ? (
                <label style={{color: "red"}} className="error">
                  Date/Time invalid.
                </label>
              ) : null}
            </FormGroup>

            <Row style={{marginTop: "5%"}}>
              <Col xs="4" md="2">
                <Switch
                  value={this.props.album.hasOwnProperty("displayed") ? this.props.album.displayed : true}
                  offColor=""
                  onColor=""
                  onChange={(el, state) => {
                    var album = this.props.album
                    if(!state) {
                      album.releaseDate = null
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
              </Col>
              <Col xs="8" md="10">
                <p>
                  <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="playback-question"/>
                  Allow playback in Revibe Music app.
                </p>
                <UncontrolledTooltip
                  style={{backgroundColor: "#7248BD", color: "white"}}
                  placement="bottom"
                  target="playback-question"
                  hideArrow={true}
                >
                  Enabling this will make the contents of this album discoverable Revibe Music app users.
                </UncontrolledTooltip>
              </Col>
            </Row>
          </Col>
          </Row>
          </>
        :
        <>
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
        </>
      }
      </>
    );
  }
}

export default Confirmation
