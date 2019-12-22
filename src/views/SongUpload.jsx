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
import RevibeAPI from '../api/revibe.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../redux/authentication/actions.js';
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";

const revibe = new RevibeAPI()

const musicMetadata = require('music-metadata-browser');


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

class SongUpload extends Component {

  constructor() {
    super();
    this.state = {
      album_image: null,
      album_name: "",
      album_type: "",
      songs: []
    };
    this.columns = [
        {
          id: "name",
          Header: "Name",
          accessor: row => <Input value={row.name} onChange={event => this.editRow( row.index,"name", event.target.value)} />,
          filterable: false,
        },
        {
          id: "contributors",
          Header: "Contributors",
          style:{overflow: "visible"},
          Cell: row => <Select
            className="react-select info"
            classNamePrefix="react-select"
            placeholder="Contributors"
            name="multipleSelect"
            closeMenuOnSelect={false}
            isMulti
            value={row.contributors}
            onChange={value =>
              this.editRow( row.index,"contributors", value)
            }
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
          accessor: row => (<FormGroup check style={{alignItems: "center", justifyContent: "center"}}>
                              <Label check>
                                <Input type="checkbox" />
                                <span className="form-check-sign" />
                              </Label>
                            </FormGroup>),
          filterable: false
        },
        {
          Header: "Actions",
          accessor: "actions",
          Cell: row => (<Button onClick={() => this.removeRow(row.index)} className="btn-round" color="danger">
                          Remove
                       </Button>),
          sortable: false,
          filterable: false
        }
      ]

      this.editRow = this.editRow.bind(this)
      this.removeRow = this.removeRow.bind(this)
      this.onDrop = this.onDrop.bind(this)
      this.uploadButtonPressed = this.uploadButtonPressed.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.songs.length !== prevState.songs.length) {
      this.state.songs.forEach((item, i) => {
        item.index = i;
      });
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

  async onDrop(files) {
    var songs = []
    for(var x=0; x<files.length; x++) {
      var metadata = await musicMetadata.parseBlob(files[x]);
      var formattedSong = {title: metadata.common.title,
                           duration: metadata.format.duration,
                           quality: metadata.format.bitrate,
                           song: files[x]
                         }
      songs.push(formattedSong)
    }
    songs.forEach((item, i) => {
      item.index = i;
    });
    this.setState({songs})
  }

  editRow(index, key, value) {
    var newData = [... this.state.songs]
    newData[index][key] = value
    this.setState({songs: newData})
  }

  removeRow(index) {
    var newData = [... this.state.songs]
    newData.splice(index, 1);
    this.setState({songs: newData})
  }

  async uploadButtonPressed()
  {
    var uploads = this.state.songs
    var album = await revibe.createAlbum()
    for(var x=0; x<uploads.length; x++) {
      uploads[x].album_id = album.id
      revibe.uploadSong(uploads[x])
    }
  }

  render() {
    const maxSize = 10485760; // 10 MB
    return (
<>
      <Row>
        <Col className="m-auto mr-auto">
          <Card>
            <CardBody>
              <Row>
                <Col className="m-auto m-auto" md="4">
                  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <ImageUpload
                      avatar={require("../assets/img/album-img.jpg")}
                      btnText="Album Art"
                      addBtnColor="default"
                      changeBtnColor="default"
                      ref={this.ImageUploader}
                    />
                  </div>
                </Col>
                  <Col className="m-auto mr-auto" md="6">
                    <InputGroup style={{marginBottom: "20px"}}>
                      <Input placeholder="Album Name" type="text" onChange={event => this.setState({album_name: event.target.value})}/>
                    </InputGroup>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      placeholder="Album Type"
                      name="multipleSelect"
                      closeMenuOnSelect={true}
                      isMulti={false}
                      onChange={option => this.setState({album_type: option.label})}
                      options={[
                        {
                          value: "",
                          isDisabled: true
                        },
                        { value: "2", label: "Album " },
                        { value: "3", label: "Single" },
                        { value: "4", label: "EP" },
                      ]}
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
                <CardTitle tag="h4">Upload Songs</CardTitle>

      {this.state.songs.length > 0 ?
        <>
        <ReactTable
          data={this.state.songs}
          resizable={true}
          columns={this.columns}
          defaultPageSize={this.state.songs.length}
          showPagination={false}
          className="-striped -highlight"
        />
        <div style={{display: 'flex', justifyContent: "center", alignItems: 'center'}}>
        <Button onClick={this.uploadButtonPressed} className="btn-round" color="primary">
            Upload
        </Button>
        </div>
        </>
      :
      <div style={basestyle}>
      <Dropzone
        onDrop={this.onDrop}
        accept="audio/*"
        minSize={0}
        maxSize={maxSize}
        multiple
      >
        {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
          const filesRejected = rejectedFiles.length > 0 && rejectedFiles[0].size < maxSize
          const isFileTooLarge = filesRejected && rejectedFiles[0].size > maxSize;
          return (
            <div {...getRootProps()} className="text-center">
              <input {...getInputProps()} />
              <p>Choose a file or drop it in here.</p>
              {filesRejected && (
                <div className="text-danger mt-2">
                  Unsupported file types.
                </div>
              )}
              {isFileTooLarge && filesRejected && (
                <div className="text-danger mt-2">
                  File is too large.
                </div>
              )}
              <i style={{fontSize: 80, marginTop: 50, color: "#7248BD"}} className="tim-icons icon-cloud-upload-94" />

            </div>
          )}
        }
      </Dropzone>
      </div>
      }
            </CardBody>
          </Card>
        </Col>
      </Row>
      </>
    );
  }
}

export default SongUpload
