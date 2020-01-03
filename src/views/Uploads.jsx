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

import UploadedAlbumsTable from "components/Tables/UploadedAlbumsTable.jsx";
import UploadedSongsTable from "components/Tables/UploadedSongsTable.jsx";
import EditAlbum from "views/EditAlbum.jsx";
import SongUpload from "views/SongUpload.jsx";
import { selectAlbum, deleteAlbum } from 'redux/media/actions.js'
import ReactTooltip from 'react-tooltip';

const MySwal = withReactContent(Swal)

class Uploads extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    }
  }

  render() {
    if(this.props.selectedAlbum) {
      return (
        <div className="content">
          <Container>
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
          </Container>
        </div>
      )
    }
    return (
      <div className="content">
      <Container>
      {!this.state.uploading ?
        <>
        <a data-tip data-for="uploadToolTip">
          <Button
            color="primary"
            onClick={() => this.setState({uploading:true})}
          >
            Upload
          </Button>
          </a>
              <ReactTooltip id="uploadToolTip" effect='solid' delayShow={1500}>
                <span>Upload new songs/albums</span>
              </ReactTooltip>

          <Row className="mt-5">
            <Col xs={12} md={12}>
              <UploadedAlbumsTable />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} md={12}>
              <UploadedSongsTable />
            </Col>
          </Row>
        </>
      :
        <>
          <a onClick={e => this.setState({uploading:false})} data-tip data-for="backButtonTooltip">
            <FaArrowLeft style={{fontSize: "30px", marginBottom: "50px", color: "#7248BD"}} />
          </a>
          <ReactTooltip id="backButtonTooltip" effect='solid' delayShow={1500}>
                <span>Back to view catalog</span>
          </ReactTooltip>
          <SongUpload />
        </>
      }
      </Container>
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
