import React, { Component, useState } from "react";
import classNames from "classnames";

import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { MDBDataTable, MDBBtn } from 'mdbreact';
import * as moment from 'moment'
import { connect } from 'react-redux';

// import SongOptions from 'components/Tables/SongOptions.jsx'
import { songContributionColumns } from 'components/Tables/ColumnConfig.js'


class SongContributionsTable extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.setRowData = this.setRowData.bind(this)
  }

  setRowData(songs) {
    var rows = []
    for(var x=0; x<songs.length; x++) {
      const contributionIndexes = songs[x].contributors.map((contribution, i) => contribution.artist_id === this.props.artist_id ? i : -1).filter(index => index !== -1);
      var contributionTypes = []
      for(var i=0; i<contributionIndexes.length; i++) {
        var index = contributionIndexes[i]
        if(songs[x].contributors[index].approved) {
          contributionTypes.push(songs[x].contributors[index].contribution_type)
        }
      }
      if(contributionTypes.length > 0) {
        let song = {
          name: songs[x].title,
          album: songs[x].album.name,
          uploadedBy: songs[x].uploaded_by.name,
          uploaded: moment(songs[x].uploaded_date).format("MM-DD-YYYY"),
          contributionType: contributionTypes.join(", "),
        }
        rows.push(song)
      }
    }
    return rows
  }

  render() {
    var rows = this.setRowData(this.props.songContributions)
    var data = {columns: songContributionColumns, rows: rows}

    return (
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Song Contributions</CardTitle>
          </CardHeader>
          <CardBody>
          <MDBDataTable
            entriesOptions={[5, 10, 15, 20, 25]}
            entries={5}
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
  }
};

export default connect(mapStateToProps)(SongContributionsTable);
