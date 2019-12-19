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
  Table,
  Progress,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import Dropzone from 'react-dropzone';

import ReactTable from "react-table";
import Select from "react-select";

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
          id: "album",
          Header: "Album",
          accessor: row => <Input value={row.album} onChange={event => this.editRow( row.index,"album", event.target.value)} />,
          filterable: false
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
          accessor: "duration",
          Header: "Duration",
          filterable: false
        },
        {
          Header: "Quality",
          accessor: "quality",
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
      var formattedSong = {name: metadata.common.title,
                           album: metadata.common.album,
                           duration: this.formatDuration(metadata.format.duration),
                           quality: this.formatQuality(metadata.format.bitrate),
                           file: files[x]
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

  uploadButtonPressed() {
    console.log(this.state.songs);
    console.log("Need to actually upload stuffs");
  }

  render() {
    const maxSize = 10485760; // 10 MB
    return (
      <>

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
      </>
    );
  }
}

export default SongUpload
