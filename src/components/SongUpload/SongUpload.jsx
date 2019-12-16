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

import UploadingSongs from 'components/Tables/UploadingSongs.jsx'

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
    this.onDrop = this.onDrop.bind(this)
  }

  async onDrop(files) {
    var songs = []
    for(var x=0; x<files.length; x++) {
      var metadata = await musicMetadata.parseBlob(files[x]);
      songs.push(metadata)
      // console.log(metadata.common);
    }
    this.setState({songs})
  }

  removeUpload(index) {
    var songs = this.state.songs
    songs.splice(index, 1);
    this.setState({songs: songs})
  }

  render() {
    const maxSize = 10485760; // 10 MB

    return (
      <>
      <div  style={basestyle}>
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
      {this.state.songs.length > 0 ?
        <>

        <div style={{display: 'flex', justifyContent: "center", alignItems: 'center'}}>
        <Button onClick={() => console.log("Uploading...")} className="btn-round" color="primary">
            Upload
        </Button>{` `}
        </div>
        </>
      :
      null
      }

      </>
    );
  }
}

export default SongUpload
