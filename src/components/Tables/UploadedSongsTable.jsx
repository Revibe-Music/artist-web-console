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
import { uploadedSongColumns } from 'components/Tables/ColumnConfig.js'
import { selectSong, deleteSong} from 'redux/media/actions.js'


import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
const MySwal = withReactContent(Swal)

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
      contributors = contributors.length > 0 ? contributors.join(", ") : "None"
      let song = {
        name: songs[x].title,
        album: songs[x].album.name,
        contributors: contributors,
        uploaded: moment(songs[x].uploaded_date).format("DD-MM-YYYY"),
        //actions: <Options />,
        actions: <Button
        className="btn-icon btn-link like"
        color="danger"
        size="sm"
        onClick={() => {
          MySwal.fire({
          title: 'Are You Sure?',
          html: "<p style={{color: 'red'}}>Deleting a song is a permanent action that cannot be undone.</p>",
          icon: 'error',
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          background: "#303030"
        })
          .then((result) => {
            if (result.value) {
              var thisSong = songs[x-1].song_id
              console.log(thisSong)
              this.props.selectSong(null)
              this.props.deleteSong(thisSong)
            }
          })
        }}
      >
        <i className="tim-icons icon-simple-remove" />
      </Button>,
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

const mapDispatchToProps = dispatch => ({
  selectSong: (song_id) =>dispatch(selectSong(song_id)),
  deleteSong: (song_id) => dispatch(deleteSong(song_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadedSongsTable);
