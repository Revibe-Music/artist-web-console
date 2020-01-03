/*!

=========================================================
* Black Dashboard React v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {Component} from 'react';

import classNames from "classnames";
// react plugin used to create charts


// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Container,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Table,
  Progress,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import Dropzone from 'react-dropzone';

import ReactTable from "react-table";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";
import { connect } from 'react-redux';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import RevibeAPI from '../api/revibe.js';
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import { editAlbum, deleteAlbum, deleteSong } from 'redux/media/actions.js'

const MySwal = withReactContent(Swal)
const musicMetadata = require('music-metadata-browser');
const revibe = new RevibeAPI()

const albumPicsDB = "https://revibe-media-test.s3.us-east-2.amazonaws.com/media/images/Album/"

const basestyle = {
  display: 'flex',
  justifyContent: "center",
  alignItems: 'center',
  padding: '20px',
  borderWidth: 3,
  borderRadius: 10,
  borderColor: '#7248BD',
  borderStyle: 'dashed',
  backgroundColor: 'transparent',
};

class EditAlbum extends Component {

  constructor(props) {
      super(props);
      this.state = {
        edited_album_image: null,
        edited_album_name: null,
        edited_album_type: null,
        songs: this.props.uploadedSongs.filter(song => song.album.album_id === this.props.selectedAlbum),
      };

      this.ImageUploader = React.createRef();

      this.editRow = this.editRow.bind(this)
      this.saveButtonPressed = this.saveButtonPressed.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.songs.length !== prevState.songs.length) {
      // this.state.songs.forEach((item, i) => {
      //   item.index = i;
      // });
      this.setState({songs: this.props.uploadedSongs.filter(song => song.album.album_id === this.props.selectedAlbum)})
    }
  }

  formatDuration(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.round(time - minutes * 60);
    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds) ;
  }

  formatQuality(bitrate) {
    return (bitrate / 1000).toString() + " kb/s"
  }

  editRow(index, key, value) {
    var newData = [... this.state.songs]
    newData[index][key] = value
    this.setState({songs: newData})
  }

  async saveButtonPressed() {
    var image = this.ImageUploader.current.state.file ? this.ImageUploader.current.state.file : null
    this.props.editAlbum(this.props.selectedAlbum, this.state.edited_album_name, image, this.state.edited_album_type)
  }

  render() {

    var columns = [
        {
          id: "title",
          Header: "Title",
          accessor: row => (
            <Input value={row.title} onChange={event => this.editRow(row.index,"title", event.target.value)} />
          ),
          filterable: false,
        },
        {
          id: "contributors",
          Header: "Contributors",
          style:{overflow: "visible"},
          accessor: row => <Select
            className="react-select info"
            classNamePrefix="react-select"
            placeholder="Select"
            name="multipleSelect"
            closeMenuOnSelect={false}
            isMulti
            value={row.contributors}
            onChange={value => this.editRow( row.index,"contributors", value)}
            options={[
              {
                value: "",
                isDisabled: true
              },
              { value: "2", label: "Drake " },
              { value: "3", label: "Travis Scott" },
              { value: "4", label: "J. Cole" },
            ]}
          />,
          filterable: false
        },
        {
          id: "duration",
          Header: "Duration",
          accessor: row => this.formatDuration(row.duration),
          filterable: false
        },
        {
          id: "quality",
          Header: "Quality",
          accessor: row => this.formatQuality(row.quality),
          filterable: false
        },
        {
          id: "explicit",
          Header: "Explicit",
          accessor: row => (
            <FormGroup check style={{alignItems: "center", justifyContent: "center"}}>
              <Label check>
                <Input type="checkbox" value={row.explicit} onChange={event => this.editRow(row.index,"explicit", event.target.checked)}/>
                <span className="form-check-sign" />
              </Label>
            </FormGroup>),
          sortable: false,
          filterable: false
        },
        {
          id: "actions",
          Header: () => (
            <div style={{textAlign: "center"}}>
              "Actions"
            </div>
            ),
          accessor: row => (<Button
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
                                      this.props.deleteSong(row.song_id)
                                    }
                                  })
                                }
                              }
                              className="btn-round" color="danger">
                                Remove
                              </Button>),
          sortable: false,
          filterable: false
        }
      ]

    var albumTypes = [
      {
        value: "",
        isDisabled: true
      },
      { value: "2", label: "Album " },
      { value: "3", label: "Single" },
      { value: "4", label: "EP" },
    ]
    var index = this.props.uploadedAlbums.map(function(x) {return x.album_id; }).indexOf(this.props.selectedAlbum);
    var album = this.props.uploadedAlbums[index];
    var songs = this.props.uploadedSongs.filter(song => song.album.album_id === this.props.selectedAlbum)

    return (
      <>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col className="m-auto m-auto" md="4">
                  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <ImageUpload
                      defaultImage={require("../assets/img/album-img.jpg")}
                      uploadedImage={albumPicsDB+album.album_uri+"."+album.ext}
                      btnText="Album Art"
                      addBtnColor="default"
                      changeBtnColor="default"
                      ref={this.ImageUploader}
                    />
                  </div>
                </Col>
                  <Col className="m-auto mr-auto" md="6">
                    <InputGroup style={{marginBottom: "20px"}}>
                      <Input defaultValue={album.name} placeholder="Album Name" type="text" onChange={event => this.setState({edited_album_name: event.target.value})}/>
                    </InputGroup>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      defaultValue={albumTypes.filter(option => option.label === album.type)}
                      placeholder="Album Type"
                      name="multipleSelect"
                      closeMenuOnSelect={true}
                      isMulti={false}
                      onChange={option => this.setState({edited_album_type: option.label})}
                      options={albumTypes}
                    />
                  </Col>
              </Row>

            </CardBody>
          </Card>
        </Col>
      </Row>
       <Row>
          <Col className="m-auto mr-auto">
            <Card>
              <CardBody>
                <CardTitle tag="h4">Songs</CardTitle>
                  <ReactTable
                    data={songs}
                    resizable={true}
                    columns={columns}
                    defaultPageSize={songs.length}
                    showPagination={false}
                    className="-striped -highlight"
                  />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Button onClick={this.saveButtonPressed} className="btn-round" color="primary">
          Save
      </Button>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    uploadedAlbums: state.media.uploadedAlbums,
    uploadedSongs: state.media.uploadedSongs,
    selectedAlbum: state.media.selectedAlbum
  }
};

const mapDispatchToProps = dispatch => ({
    editAlbum: (id, name, image, type) =>dispatch(editAlbum(id, name, image, type)),
    deleteAlbum: (id) =>dispatch(deleteAlbum(id)),
    deleteSong: (id) =>dispatch(deleteSong(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditAlbum)
