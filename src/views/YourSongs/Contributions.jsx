import React from "react";

// reactstrap components
import { Container, Row, Col,Card, CardHeader, CardBody, } from "reactstrap";
import { connect } from 'react-redux';
import Image from 'react-graceful-image';
import moment from 'moment'

import AlbumContributionsTable from "components/Tables/AlbumContributionsTable.jsx";
import SongContributionsTable from "components/Tables/SongContributionsTable.jsx";
import PendingContributions from "components/Tables/PendingContributionsTable.jsx";


class Contributions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.shouldDisplayPendingContributions = this.shouldDisplayPendingContributions.bind(this)
    this.getContributionType = this.getContributionType.bind(this)
  }

  shouldDisplayPendingContributions(songs, albums) {
    var shouldDisplay = false
    for(var x=0; x<songs.length; x++) {
      for(var i=0; i<songs[x].contributors.length; i++) {
        if(songs[x].contributors[i].artistId === this.props.artist_id) {
          if(songs[x].contributors[i].pending) {
            shouldDisplay = true
            break
          }
        }
      }
    }
    if(!shouldDisplay) {
      for(var x=0; x<albums.length; x++) {
        for(var i=0; i<albums[x].contributors.length; i++) {
          if(albums[x].contributors[i].artistId === this.props.artist_id) {
            if(albums[x].contributors[i].pending) {
              shouldDisplay = true
              break
            }
          }
        }
      }
    }
    return shouldDisplay
  }

  getContributionType(album) {
    const contributionIndexes = album.contributors.map((contribution, i) => contribution.artistId === this.props.artistId ? i : -1).filter(index => index !== -1);
    var contributionTypes = []
    for(var i=0; i<contributionIndexes.length; i++) {
      var index = contributionIndexes[i]
      if(album.contributors[index].approved) {
        contributionTypes.push(album.contributors[index].type)
      }
    }
    return contributionTypes.length > 0 ? contributionTypes.join(", ") : ""
  }

  render() {

    return (
      <div className="content">
        {this.shouldDisplayPendingContributions(this.props.songContributions, this.props.albumContributions) ?
          <Row className="mt-5">
            <Col xs={12} md={12}>
              <PendingContributions />
            </Col>
          </Row>
        :
        null
        }
        {this.props.albumContributions.map(album => {
            return (
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
                  <div style={{marginLeft: "5%"}}>
                    <h3 style={{color: "white",marginBottom: "auto"}}>{album.name}•{album.type}</h3>
                    <p style={{color: "white"}}>Uploaded By: {album.uploadedBy.artistName}</p>
                    <p style={{color: "white"}}>Your Contributions: {this.getContributionType(album)}</p>
                    <p style={{color: "white"}}>{moment(album.uploadDate).format("MM/DD/YYYY HH:mm")}</p>
                  </div>
                  </Row>
                </CardBody>
              </Card>
            )
        })}
        {this.props.songContributions.map(song => {
            return (
              <Card>
                <CardBody>
                  <Row style={{alignItems: "center", margin: "auto"}}>
                    <Image
                      src={song.album.images ? song.album.images.length > 0 ? song.album.images[1] : null : null}
                      width='15%'
                      height='15%'
                      alt='My awesome image'
                      retry={{ count: 15, delay: 1}}
                    />
                  <div style={{marginLeft: "5%"}}>
                    <h3 style={{color: "white",marginBottom: "auto"}}>{song.title}•Song</h3>
                    <p style={{color: "white"}}>Uploaded By: {song.uploadedBy.artistName}</p>
                    <p style={{color: "white"}}>Your Contributions: {this.getContributionType(song)}</p>
                    <p style={{color: "white"}}>{moment(song.album.uploadDate).format("MM/DD/YYYY HH:mm")}</p>
                  </div>
                  </Row>
                </CardBody>
              </Card>
            )
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    artist_id: state.authentication.user.artistId,
    songContributions: state.media.songContributions,
    albumContributions: state.media.albumContributions,
  }
};

export default connect(mapStateToProps)(Contributions);
