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

import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { MDBDataTable, MDBBtn } from 'mdbreact';
import * as moment from 'moment'
import { connect } from 'react-redux';

import Options from 'components/Tables/Options.jsx'
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
      var contributionIndex = songs[x].contributors.map(function(x) {return x.artist_id; }).indexOf(this.props.artist_id)
      if(songs[x].contributors[contributionIndex].approved) {
        let song = {
          name: songs[x].title,
          album: songs[x].album.name,
          uploadedBy: "Drake",
          uploaded: moment(songs[x].uploaded_date).format("DD-MM-YYYY"),
          contributionType: songs[x].contributors[contributionIndex].contribution_type,
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
  }
};

export default connect(mapStateToProps)(SongContributionsTable);
