/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";
import { connect } from 'react-redux';

import AlbumContributionsTable from "components/Tables/AlbumContributionsTable.jsx";
import SongContributionsTable from "components/Tables/SongContributionsTable.jsx";
import PendingContributions from "components/Tables/PendingContributionsTable.jsx";


class Contributions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.shouldDisplayPendingContributions = this.shouldDisplayPendingContributions.bind(this)
  }

  shouldDisplayPendingContributions(songs, albums) {
    var shouldDisplay = false
    for(var x=0; x<songs.length; x++) {
      for(var i=0; i<songs[x].contributors.length; i++) {
        if(songs[x].contributors[i].artist_id === this.props.artist_id) {
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
          if(albums[x].contributors[i].artist_id === this.props.artist_id) {
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

  render() {

    return (
      <div className="content">
        <Container>
          {this.shouldDisplayPendingContributions(this.props.songContributions, this.props.albumContributions) ?
            <Row className="mt-5">
              <Col xs={12} md={12}>
                <PendingContributions />
              </Col>
            </Row>
          :
          null
          }
          <Row className="mt-5">
            <Col xs={12} md={12}>
              <AlbumContributionsTable />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} md={12}>
              <SongContributionsTable />
            </Col>
          </Row>
        </Container>
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
