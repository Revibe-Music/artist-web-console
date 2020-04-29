import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Container,
  Progress,
  Table,
  Row,
  Col,
  Collapse
} from "reactstrap";
import { FaArrowLeft } from "react-icons/fa";
import { connect } from 'react-redux';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { NavLink } from "react-router-dom";
import TagsInput from "react-tagsinput";
import { uniq } from 'lodash';

import UploadedAlbumsTable from "components/Tables/UploadedAlbumsTable.jsx";
import UploadedSongsTable from "components/Tables/UploadedSongsTable.jsx";
import EditAlbum from "./EditAlbum.jsx";
import AlbumUpload from "./AlbumUpload.jsx";
import AlbumOptions from 'components/Tables/AlbumOptions.jsx'

import { selectAlbum } from 'redux/media/actions.js'

import ReactList from 'react-list';
import Image from 'react-graceful-image';
import moment from 'moment'


const MySwal = withReactContent(Swal)

class Uploads extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openedCollapses: [],
      playingSongId: "",
      playing: false
    }
    this.getAlbumSongs = this.getAlbumSongs.bind(this)
    this.playSong = this.playSong.bind(this)
  }

  getAlbumSongs(album) {
    var songs = this.props.uploadedSongs.filter(x => x.album.id === album.id)
    songs.sort(function(a, b) {
      if(a.order < b.order) { return -1; }
      if(a.order > b.order) { return 1; }
      return 0;
    })
    return songs
  }

  getSongContributionTypes(song) {
    var contributionTypes = song.contributors.map(x => x.type)
    contributionTypes = uniq(contributionTypes)
    return contributionTypes
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

  // with this function we create an array with the opened collapses
  // it is like a toggle function for all collapses from this page
  toggleSong = (e, collapse) => {
    e.preventDefault();
    let openedCollapses = this.state.openedCollapses;
    if (openedCollapses.includes(collapse)) {
      this.setState({openedCollapses: openedCollapses.filter(item => item !== collapse)});
    }
    else {
      this.setState({openedCollapses: [...openedCollapses, collapse]});
    }
  };


  render() {
    return (
      <>
      {this.props.uploadedAlbums.map(album => {

          return (
            <div>
              <Card>
                <CardBody>
                  <Row style={{alignItems: "center", margin: "auto"}}>
                    <Image
                      src={album.images.length > 0 ? album.images[1] : null}
                      width='15%'
                      height='15%'
                      alt='My awesome image'
                      retry={{ count: 15, delay: 1}}
                    />
                  <div style={{marginLeft: "5%", width: "80%"}}>
                    <Row style={{width: "100%", alignItems: "center", justifyContent: "space-between"}}>
                      <Col xs="12" md="6">
                        <h3 style={{color: "white", marginBottom: "20px"}}>{album.name}</h3>
                      </Col>
                      <Col xs="12" md="3" style={{alignItems: "center"}}>
                        <h5 style={{color: "white"}}>{moment(album.uploadDate).format("MM/DD/YYYY HH:mm")}</h5>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" md="6">
                        <Row style={{margin: "auto"}}>
                        <h4 style={{color: "white",marginBottom: "auto", marginRight: 10}}>Contributors: </h4>
                        {album.contributors.map(x => (
                          <div style={{backgroundColor: "#7248BD", borderRadius: 15, paddingLeft:10, paddingRight: 10, alignItems: "center", justifyContent: "center", display: "flex", width: "fit-content"}}>
                            <p style={{color:"white", marginBottom: 0 }}>{x.artist.artistName}</p>
                          </div>
                        ))}
                      </Row>
                      </Col>
                    </Row>

                    <Row style={{alignItems: "center", margin: "auto", marginTop: "20px"}}>
                      <i style={{color: "#7248BD", fontSize: "1.5rem", marginRight: "10px"}} className="tim-icons icon-headphones" />
                      <h4 style={{color: "white", marginBottom: 0}}>{album.totalStreams}</h4>
                    </Row>

                    <a
                      aria-expanded={this.state.openedCollapses.includes(`collapse${album.id}`)}
                      data-parent="#accordion"
                      data-toggle="collapse"
                      style={{cursor: "pointer",position: "absolute", right: "5%", bottom: "2%", color: "#7248BD", fontSize: "1.5rem"}}
                      onClick={e => this.toggleSong(e, `collapse${album.id}`)}
                    >
                      {this.state.openedCollapses.includes(`collapse${album.id}`) ?
                        <i className="tim-icons icon-minimal-up" />
                      :
                        <i className="tim-icons icon-minimal-down" />
                      }
                    </a>
                  </div>
                  <div style={{position: "absolute", right: "5%", top: "45%"}}>
                    <AlbumOptions id={album.id} edit={this.props.selectAlbum} />
                  </div>
                </Row>
              </CardBody>
            </Card>

            <Collapse role="tabpanel" isOpen={this.state.openedCollapses.includes(`collapse${album.id}`)}>
            {this.getAlbumSongs(album).map((song, index) => (
              <Card style={{backgroundColor: "#373737", margin: "auto",width: "auto", marginTop: index !== 0 ? "30px" : "auto"}}>
                <CardBody>
                  <Row style={{alignItems: "center", margin: "auto", justifyContent: "space-between"}}>
                  <Col xs="12" md="4" className="card-stats">
                    <Row style={{alignItems: "center"}}>
                      <a onClick={() => this.playSong(song)} style={{cursor: "pointer"}}>
                        <div className="info-icon text-center icon-primary">
                          <i className={`tim-icons ${this.state.playingSongId===song.id && this.state.playing? "icon-button-pause" : "icon-triangle-right-17"}`} />
                        </div>
                      </a>
                      <h3 style={{color: "white",marginBottom: 0, marginLeft: "20px"}}>{song.title}</h3>
                    </Row>
                  </Col>
                  <Col xs="12" md="6" style={{marginLeft: window.screen.width < 400 ? "25%" : 0}}>
                    {this.getSongContributionTypes(song).map(type => (
                      <Row style={{marginTop: "5px", marginBottom: "5px" }}>
                        <h4 style={{color: "white",marginBottom: "auto", marginRight: 10}}>{type}s: </h4>
                        {song.contributors.filter(x => x.type === type).map(x => (
                          <div style={{backgroundColor: "#7248BD", borderRadius: 15, paddingLeft:10, paddingRight: 10, alignItems: "center", justifyContent: "center", display: "flex", width: "fit-content"}}>
                            <p style={{color:"white", marginBottom: 0 }}>{x.artist.artistName}</p>
                          </div>
                        ))}
                      </Row>
                    ))}
                  </Col>
                  <Col xs="12" md="2" style={{alignItems: "center", marginLeft: window.screen.width < 400 ? "25%" : 0}}>
                    <Row style={{alignItems: "center",}}>
                      <i style={{color: "#7248BD", fontSize: "1.5rem", marginRight: "10px"}} className="tim-icons icon-headphones" />
                      <h4 style={{color: "white", marginBottom: 0}}>{song.totalStreams}</h4>
                    </Row>
                  </Col>

                  </Row>
                </CardBody>
              </Card>
            ))}
            </Collapse>
          </div>
          )
      })}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    artist_id: state.authentication.user.artistId,
    uploadedAlbums: state.media.uploadedAlbums,
    uploadedSongs: state.media.uploadedSongs,
  }
};

const mapDispatchToProps = dispatch => ({
    selectAlbum: (album_id) => dispatch(selectAlbum(album_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
