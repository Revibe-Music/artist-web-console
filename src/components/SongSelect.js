import React, {Component} from 'react';
import classNames from "classnames";
import PropTypes from "prop-types";

import { Button } from "reactstrap";
import Dropzone from 'react-dropzone';
import { FiDownload } from 'react-icons/fi';

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

const uploadBtnstyle = {
  display: "flex",
};


class SongSelect extends Component {

  constructor() {
      super();
  }

  render() {
    return (
      <div style={this.props.displayDropzone ? basestyle : uploadBtnstyle}>
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
                <FiDownload style={{fontSize: 80, marginTop: 30, color: "#7248BD"}}/>
                <p style={{fontSize: 20, marginTop: 20}}>Drag & Drop songs here.</p>
                {filesRejected && (
                  <div className="text-danger mt-2">
                    Unsupported file types.
                  </div>
                )}
                <p style={{fontSize: 15, marginTop: 20}}>OR</p>
                <Button style={{fontSize: 15, marginTop: 20}} className="btn-simple" color="primary">
                  Browse Files
                </Button>
              </div>
            )
          }
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
                className="btn-simple"
                color="primary"
                disabled={this.props.disabled}
              >
                <i style={{marginRight: "10%"}} className="tim-icons icon-simple-add"/>
                Song
              </Button>
            </div>
          )
          }
        }
      </Dropzone>
      </div>
    )
  }
}

SongSelect.propTypes = {
  onFileSelect: PropTypes.func.isRequired,         // function that is called whenever a tag is removed
  disabled: PropTypes.bool,                        // determines whether search and edittings is disabled
  displayDropzone: PropTypes.bool
};

SongSelect.defaultProps = {
  disabled: false,
  displayDropzone: true
};

export default SongSelect
