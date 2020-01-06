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
import React, { Component } from "react";
import classNames from "classnames";
// react component for creating dynamic tables
import ReactTable from "react-table";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button
} from "reactstrap";
import * as moment from 'moment'
import { MDBDataTable, MDBBtn } from 'mdbreact';
import { connect } from 'react-redux';

import { approveAlbumContribution, rejectAlbumContribution, approveSongContribution, rejectSongContribution } from 'redux/media/actions.js'
import { pendingContributionColumns } from 'components/Tables/ColumnConfig.js'


class PendingContributions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setRowData = this.setRowData.bind(this)
  }

  ApproveDenyContribution(obj, approveFn, rejectFn) {
    return (
      <div>
        <Button
            onClick={() => {
              approveFn(obj)
            }}
            color="success"
            size="sm"
            className="btn-icon btn-link like"
          >
            <i className="tim-icons icon-check-2" />
          </Button>
          <Button
            onClick={() => {
              rejectFn(obj)
            }}
            color="danger"
            size="sm"
            className="btn-icon btn-link like"
          >
            <i className="tim-icons icon-simple-remove" />
          </Button>
        </div>
      )
  }

  setRowData(songs, albums) {
    var rows = []
    for(var x=0; x<songs.length; x++) {
      var contributionIndex = songs[x].contributors.map(function(x) {return x.artist_id; }).indexOf(this.props.artist_id)
      if(songs[x].contributors[contributionIndex].pending) {
        let song = {
          name: songs[x].title,
          type: "Song",
          uploadedBy: "Drake",
          uploaded: moment(songs[x].uploaded_date).format("DD-MM-YYYY"),
          contributionType: songs[x].contributors[contributionIndex].contribution_type,
          status: this.ApproveDenyContribution(songs[x], this.props.approveSongContribution, this.props.rejectSongContribution),
        }
        rows.push(song)
      }
    }
    for(var x=0; x<albums.length; x++) {
      if(albums[x].pending) {
        let album = {
          name: albums[x].name,
          type: "Album",
          uploadedBy: "Drake",
          uploaded:  moment(albums[x].uploaded_date).format("DD-MM-YYYY"),
          contributionType: albums[x].contributionType,
          status: this.ApproveDenyContribution(albums[x], this.props.approveAlbumContribution, this.rejectAlbumContribution),

        }
        rows.push(album)
      }
    }
    return rows
  }

  render() {

    var rows = this.setRowData(this.props.songContributions, this.props.albumContributions)
    var data = {columns: pendingContributionColumns, rows: rows}

    return (
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Pending Contributions</CardTitle>
          </CardHeader>
          <CardBody>
          <MDBDataTable
            entriesOptions={[5, 10, 15, 20, 25]}
            entries={5}
            responsive
            striped
            data={data}
          />

          </CardBody>
        </Card>
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

const mapDispatchToProps = dispatch => ({
    approveAlbumContribution: (album) =>dispatch(approveAlbumContribution(album)),
    rejectAlbumContribution: (album) =>dispatch(rejectAlbumContribution(album)),
    approveSongContribution: (song) =>dispatch(approveSongContribution(song)),
    rejectSongContribution: (song) =>dispatch(rejectSongContribution(song)),
});

export default connect(mapStateToProps,mapDispatchToProps)(PendingContributions);
