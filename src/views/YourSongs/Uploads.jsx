import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Container,
  Progress,
  Table,
  Row,
  Col,
} from "reactstrap";
import { FaArrowLeft } from "react-icons/fa";
import { connect } from 'react-redux';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { NavLink } from "react-router-dom";

import UploadedAlbumsTable from "components/Tables/UploadedAlbumsTable.jsx";
import UploadedSongsTable from "components/Tables/UploadedSongsTable.jsx";
import EditAlbum from "./EditAlbum.jsx";
import AlbumUpload from "./AlbumUpload.jsx";
import { selectAlbum, deleteAlbum } from 'redux/media/actions.js'
import ReactTooltip from 'react-tooltip';
import { Beforeunload } from 'react-beforeunload';

const MySwal = withReactContent(Swal)

class Uploads extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploading: true,
    }
  }

  render() {
    if(this.props.selectedAlbum) {
      return (
        <div className="content">
            <a onClick={e => this.props.selectAlbum(null)}>
              <FaArrowLeft style={{fontSize: "30px", marginBottom: "50px", color: "#7248BD"}} />
            </a>
            <Button
              className="float-right"
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
                    const album = this.props.selectedAlbum
                    this.props.selectAlbum(null)
                    this.props.deleteAlbum(album)
                  }
                })
              }}
            >
              Delete
            </Button>
            <EditAlbum />
        </div>
      )
    }
    return (
      <div>
        <Row>
          <UploadedAlbumsTable />
        </Row>
        <Row >
          <UploadedSongsTable />
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedAlbum: state.media.selectedAlbum,
    selectedSong: state.media.selectedSong
  }
};

const mapDispatchToProps = dispatch => ({
    selectAlbum: (album_id) => dispatch(selectAlbum(album_id)),
    deleteAlbum: (album_id) => dispatch(deleteAlbum(album_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
