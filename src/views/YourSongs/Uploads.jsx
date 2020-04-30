import React from "react";

// reactstrap components
import Image from 'react-graceful-image';
import moment from 'moment'
import { Card, CardBody, Row, Col, Collapse} from "reactstrap";
import { connect } from 'react-redux';
import { uniq } from 'lodash';

import SongCard from "components/Cards/SongCard.jsx";
import AlbumCard from "components/Cards/AlbumCard.jsx";
import AlbumOptions from 'components/Tables/AlbumOptions.jsx'
import { selectAlbum } from 'redux/media/actions.js'


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
              <AlbumCard
                album={album}
                isExpanded={this.state.openedCollapses.includes(`collapse${album.id}`)}
                onExpand={e => this.toggleSong(e, `collapse${album.id}`)}
              />
              <Collapse role="tabpanel" isOpen={this.state.openedCollapses.includes(`collapse${album.id}`)}>
              {this.getAlbumSongs(album).map((song, index) => (
                <div style={{marginTop: index !== 0 ? "30px" : "auto"}}>
                  <SongCard
                    song={song}
                    onPlaySong={() => this.playSong(song)}
                    isPlaying={this.state.playingSongId===song.id && this.state.playing}
                    displayOptions={false}
                  />
                </div>
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
    uploadedAlbums: state.media.uploadedAlbums,
    uploadedSongs: state.media.uploadedSongs,
  }
};

const mapDispatchToProps = dispatch => ({
    selectAlbum: (album_id) => dispatch(selectAlbum(album_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
