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

import { Button, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { MDBDataTable } from 'mdbreact';
import * as moment from 'moment'
import { compact, uniq } from 'lodash';
import { connect } from 'react-redux';

import Options from 'components/Tables/Options.jsx'
import { uploadedAlbumColumns } from 'components/Tables/ColumnConfig.js'
import { selectAlbum, deleteAlbum} from 'redux/media/actions.js'

import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
const MySwal = withReactContent(Swal)

class UploadedAlbumsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setRowData = this.setRowData.bind(this)
  }

  setRowData(albums) {
    var rows = []
    const displayName = this.props.artistName
    for(var x=0; x<albums.length; x++) {
      var contributors = albums[x].contributors.map(function(elem){if(elem.artist_name !== displayName) return elem.artist_name})
      contributors = compact(contributors)
      contributors = uniq(contributors)
      contributors = contributors.length > 0 ? contributors.join(",") : "None"
      let album = {
        name: albums[x].name,
        type: albums[x].type,
        contributors: contributors,
        uploaded: moment(albums[x].uploaded_date).format("DD-MM-YYYY"),
        //actions: <Options id={albums[x].album_id} edit={this.props.selectAlbum}/>,
        actions: <Button
        className="btn-icon btn-link like"
        size="sm"
        color="danger"
        onClick={() => {
          MySwal.fire({
          title: 'Are You Sure?',
          html: "<p style={{color: 'red'}}>Deleting an album is a permanent action that cannot be undone.</p>",
          icon: 'error',
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          background: "#303030"
        })
          .then((result) => {
            if (result.value) {
              var thisAlbum = albums[x-1].album_id
              console.log(thisAlbum)
              this.props.selectAlbum(null)
              this.props.deleteAlbum(thisAlbum)
            }
          })
        }}
      >
        <i className="tim-icons icon-simple-remove" />
      </Button>,
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

const mapDispatchToProps = dispatch => ({
    selectAlbum: (album_id) =>dispatch(selectAlbum(album_id)),
    deleteAlbum: (album_id) => dispatch(deleteAlbum(album_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadedAlbumsTable);
