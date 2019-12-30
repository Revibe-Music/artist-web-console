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
import Moment from 'moment'
import { MDBDataTable } from 'mdbreact';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import Options from 'components/Tables/Options.jsx'
import { uploadedAlbumColumns } from 'components/Tables/ColumnConfig.js'

const momentRandom = require('moment-random');


function randomDate(start, end) {
    return momentRandom(end).format("DD-MM-YYYY")
}





class UploadedAlbumsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.setRowData = this.setRowData.bind(this)
  }

  setRowData(albums) {
    var rows = []
    const displayName = this.props.artistName
    for(var x=0; x<albums.length; x++) {
      var contributors = compact(albums[x].contributors.map(function(elem){
        if(elem.artist_name !== displayName) return elem.artist_name;
      }))
      contributors = contributors.length > 0 ? contributors.join(",") : "None"
      let album = {
        name: albums[x].name,
        type: albums[x].type,
        contributors: contributors,
        uploaded: randomDate(new Date(2012, 0, 1), new Date()),
        actions: <Options />,
        streams: albums[x].total_streams
      }
      rows.push(album)
    }
    return rows
  }

  render() {
    var rows = this.setRowData(this.props.uploadedAlbums)
    var data = {columns: uploadedAlbumColumns, rows: rows}
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Uploaded Albums</CardTitle>
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
    uploadedAlbums: state.media.uploadedAlbums,
    artistName: state.authentication.user.displayName
  }
};

// const mapDispatchToProps = dispatch => ({
//     login: (username, password, history, fn) => dispatch(login(username, password, history, fn)),
// });

export default connect(mapStateToProps)(UploadedAlbumsTable);
