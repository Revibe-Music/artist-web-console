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
import { MDBDataTable } from 'mdbreact';
import * as moment from 'moment'
import { compact, uniq } from 'lodash';
import { connect } from 'react-redux';

import Options from 'components/Tables/Options.jsx'
import { uploadedSongColumns } from 'components/Tables/ColumnConfig.js'


class UploadedSongsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.setRowData = this.setRowData.bind(this)
  }

  setRowData(songs) {
    var rows = []
    const displayName = this.props.artistName
    for(var x=0; x<songs.length; x++) {
      var contributors = songs[x].contributors.map(function(elem){if(elem.artist_name !== displayName) return elem.artist_name})
      contributors = compact(contributors)
      contributors = uniq(contributors)
      contributors = contributors.length > 0 ? contributors.join(",") : "None"
      let song = {
        name: songs[x].title,
        album: songs[x].album.name,
        contributors: contributors,
        uploaded: moment(songs[x].uploaded_date).format("DD-MM-YYYY"),
        actions: <Options />,
        streams: songs[x].total_streams
      }
      rows.push(song)
    }
    return rows
  }

  render() {
    var rows = this.setRowData(this.props.uploadedSongs)
    var data = {columns: uploadedSongColumns, rows: rows}
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Uploaded Songs</CardTitle>
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
    uploadedSongs: state.media.uploadedSongs,
    artistName: state.authentication.user.displayName
  }
};


export default connect(mapStateToProps)(UploadedSongsTable);
