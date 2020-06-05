import React, {Component} from 'react';
import classNames from "classnames";
import PropTypes from "prop-types";

import { Button, Card, CardBody } from "reactstrap";
import Dropzone from 'react-dropzone';
import { FiDownload } from 'react-icons/fi';
import { IoMdCloudUpload } from 'react-icons/io';

const basestyle = {
  display: 'flex',
  justifyContent: "center",
  alignItems: 'center',
  // padding: '20px',
  // borderWidth: 3,
  // borderRadius: 10,
  // borderColor: '#7248BD',
  // borderStyle: 'dashed',
  backgroundColor: 'transparent',
};

const uploadBtnstyle = {
  display: "flex",
};


class SongUploadCard extends Component {

  constructor() {
      super();
  }

  render() {
    if(this.props.displayDropzone) {
      return (
        <Card style={{borderRadius: 10, width: window.screen.width < 400 ? "100%" : "50%", margin: "auto"}}>
          <CardBody>
            <div style={basestyle}>
              <Dropzone
                onDrop={this.props.onFileSelect}
                accept=".mp3,mp4,.wav,.flac,.ogg"
                minSize={0}
                multiple
              >
                {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
                  const filesRejected = rejectedFiles.length > 0;
                  if(this.props.displayDropzone) {
                    return (
                      <div {...getRootProps()} style={{width: "100%"}} className="text-center">
                        <input {...getInputProps()} />
                        <h3 className="info-text" style={{marginBottom: 10}}>
                          Drag files to upload
                        </h3>
                        <IoMdCloudUpload style={{fontSize: 140, color: "#7248BD"}}/>
                        {filesRejected && (
                          <div className="text-danger mt-2">
                            Unsupported file types.
                          </div>
                        )}
                        <p style={{fontSize: 10, marginTop: 10}}>OR</p>
                        <Button style={{fontSize: 15, marginTop: 20}} className="btn-round" color="primary">
                          Browse Files
                        </Button>
                        <p style={{marginTop: 15}}>Accepted file types: MP3, MP4, WAV, FLAC, and OGG</p>
                      </div>
                    )
                  }}}
              </Dropzone>
            </div>
          </CardBody>
      </Card>
      )
    }
    else {
      return (
        <div style={uploadBtnstyle}>
          <Dropzone
            onDrop={this.props.onFileSelect}
            accept=".mp3,mp4,.wav,.flac,.ogg"
            minSize={0}
            multiple
          >
            {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
              const filesRejected = rejectedFiles.length > 0;
              return (
                <div {...getRootProps()} className="text-center">
                  <input {...getInputProps()}
                    disabled={this.props.disabled}
                  />
                  {filesRejected && (
                    <div className="text-danger mt-2">
                      Unsupported file types.
                    </div>
                  )}
                  <Button
                    style={{fontSize: 15, marginTop: 20}}
                    className="btn-primary"
                    color="primary"
                    disabled={this.props.disabled}
                  >
                    <i style={{marginRight: "10%"}} className="tim-icons icon-simple-add"/>
                    Song
                  </Button>
                </div>
              )
            }}
          </Dropzone>
        </div>
      )
    }
  }
}

SongUploadCard.propTypes = {
  onFileSelect: PropTypes.func.isRequired,         // function that is called whenever a tag is removed
  disabled: PropTypes.bool,                        // determines whether search and edittings is disabled
  displayDropzone: PropTypes.bool
};

SongUploadCard.defaultProps = {
  disabled: false,
  displayDropzone: true
};

export default SongUploadCard
