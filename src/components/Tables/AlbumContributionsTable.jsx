import React, { Component, useState } from "react";
import classNames from "classnames";
// react component for creating dynamic tables
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { MDBDataTable, MDBBtn } from 'mdbreact';
import * as moment from 'moment'
import { connect } from 'react-redux';

// import AlbumOptions from 'components/Tables/AlbumOptions.jsx'
import { albumContributionColumns } from 'components/Tables/ColumnConfig.js'


class AlbumContributionsTable extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.setRowData = this.setRowData.bind(this)
  }

  setRowData(albums) {
    var rows = []
    for(var x=0; x<albums.length; x++) {
      const contributionIndexes = albums[x].contributors.map((contribution, i) => contribution.artist_id === this.props.artist_id ? i : -1).filter(index => index !== -1);
      var contributionTypes = []
      for(var i=0; i<contributionIndexes.length; i++) {
        var index = contributionIndexes[i]
        if(albums[x].contributors[index].approved) {
          contributionTypes.push(albums[x].contributors[index].contribution_type)
        }
      }
      if(contributionTypes.length > 0) {
        let album = {
          name: albums[x].name,
          uploadedBy: albums[x].uploaded_by.name,
          uploaded: moment(albums[x].uploaded_date).format("MM-DD-YYYY"),
          contributionType: contributionTypes.join(", "),
        }
        rows.push(album)
      }
    }
    return rows
  }

  render() {
    var rows = this.setRowData(this.props.albumContributions)
    var data = {columns: albumContributionColumns, rows: rows}

    return (
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Album Contributions</CardTitle>
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
    albumContributions: state.media.albumContributions,
  }
};

export default connect(mapStateToProps)(AlbumContributionsTable);
