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
import React, { Component, useState } from "react";
import classNames from "classnames";
// react component for creating dynamic tables
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { MDBDataTable, MDBBtn } from 'mdbreact';
import * as moment from 'moment'
import { connect } from 'react-redux';

import Options from 'components/Tables/Options.jsx'
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
      var contributionIndex = albums[x].contributors.map(function(x) {return x.artist_id; }).indexOf(this.props.artist_id)
      if(albums[x].contributors[contributionIndex].approved) {
        let album = {
          name: albums[x].title,
          album: albums[x].album.name,
          uploadedBy: "Drake",
          uploaded: moment(albums[x].uploaded_date).format("DD-MM-YYYY"),
          contributionType: albums[x].contributors[contributionIndex].contribution_type,
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
    albumContributions: state.media.albumContributions,
  }
};

export default connect(mapStateToProps)(AlbumContributionsTable);
