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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Table,
  Progress,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import Dropzone from 'react-dropzone';
import ReactTable from "react-table";
import SearchBar from '@opuscapita/react-searchbar';
import Select from "react-select";
import TagsInput from "react-tagsinput";
import Autosuggest from 'react-autosuggest';
import { WithContext as ReactTags } from 'react-tag-input';
import { ClipLoader } from "react-spinners";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import Lottie from 'react-lottie';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import RevibeAPI from '../api/revibe.js';
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import { uploadAlbum } from 'redux/media/actions.js'
import ReactTooltip from 'react-tooltip';

import * as savedAnimation from 'assets/img/check.json'

const musicMetadata = require('music-metadata-browser');
const revibe = new RevibeAPI()
const PicsDB = "https://revibe-media-test.s3.amazonaws.com/media/images/Artist/"

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

const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: require('assets/img/check.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

const theme = {
  container: {
    position: 'relative'
  },
  input: {
    width: '150px',
    height: '30px',
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  inputFocused: {
    outline: 'none'
  },
  itemsContainer: {
    display: 'none'
  },
  itemsContainerOpen: {
    display: 'block',
    position: 'relative',
    top: '-1px',
    width: '280px',
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontSize: '16px',
    lineHeight: 1.25,
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    zIndex: 2
  },
  itemsList: {
    maxHeight: '150px',
    overflowY: "scroll",
    margin: 0,
    padding: 0,
  },
  item: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  itemHighlighted: {
    backgroundColor: '#ddd'
  }
};


class SongUpload extends Component {

  constructor() {
      super();
      this.state = {
        album_image: null,
        album_name: "",
        album_type: "",
        songs: [],
        uploading: false,
        searchResults: [],

        isOpen: false,
        modalSongIndex: null,
        modalContributions: {},
        editedModalContributions: []
      };

      // this.contributionTypes = [
      //   {
      //     value: "",
      //     isDisabled: true
      //   },
      //   { value: "2", label: "Artist "},
      //   { value: "3", label: "Feature "},
      //   { value: "4", label: "Producer"},
      //   { value: "5", label: "Mixing"},
      //   { value: "6", label: "Mastering"},
      //   { value: "7", label: "Song Writer"},
      //   { value: "8", label: "Vocals"},
      //   { value: "8", label: "Programmer/Beat Maker"},
      //   { value: "9", label: "Graphic Designer"},
      // ]

      this.contributionTypes = ["Artist","Feature","Producer","Mixing","Mastering","Song Writer","Vocals","Programmer/Beat Maker","Graphic Designer"]

      this.ImageUploader = React.createRef();

      this.editRow = this.editRow.bind(this)
      this.removeRow = this.removeRow.bind(this)
      this.onDrop = this.onDrop.bind(this)
      this.uploadButtonPressed = this.uploadButtonPressed.bind(this)
      this.uploadStatus = this.uploadStatus.bind(this)
      this.toggle = this.toggle.bind(this)
      this.renderSearchResults = this.renderSearchResults.bind(this)
      this.searchArtists = this.searchArtists.bind(this)
      // this.addContributor = this.addContributor.bind(this)
      // this.removeContributor = this.removeContributor.bind(this)
      this.toggleContributonType = this.toggleContributonType.bind(this)
      this.saveContributions = this.saveContributions.bind(this)
      this.cancelContributions = this.cancelContributions.bind(this)
      this.contributionHasBeenSelected = this.contributionHasBeenSelected.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.songs.length !== prevState.songs.length) {
      this.state.songs.forEach((item, i) => {
        item.index = i;
      });
    }
  }

  toggle(songIndex=null, contribution=null) {
    var updatedState = {isOpen: !this.state.isOpen}
    if(songIndex !== null) {
      updatedState.modalSongIndex = songIndex
    }
    else {
      updatedState.modalSongIndex = null
    }
    if(contribution) {
      updatedState.modalContributions = contribution
      updatedState.editedModalContributions = contribution.type
    }
    else {
      updatedState.modalContributions = {}
    }
    this.setState(updatedState)
  }

  uploadStatus(song) {
    if(this.state.uploading) {
      if(song.uploaded) {
        return (
          <div style={{alignItems: "center", justifyContent: "center", textAlign: "center"}}>
            <Lottie options={defaultOptions}
              height={50}
              width={50}
            />
          </div>
        )
      }
      return (
        <div style={{alignItems: "center", justifyContent: "center", textAlign: "center"}}>
          <ClipLoader
            size={50}
            color={"#7248BD"}
            loading={true}
          />
        </div>
      )
    }
    return (
      <div style={{alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        <i style={{fontSize: "20px", cursor: 'pointer', color: "red"}} className="tim-icons icon-simple-remove" onClick={() => this.removeRow(song.index)}/>
      </div>
    )
  }


  /// FILE HANDLING METHODS
  formatDuration(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.round(time - minutes * 60);
    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds) ;
  }

  formatQuality(bitrate) {
    return Math.round(bitrate / 1000).toString() + " kb/s"
  }

  async onDrop(files) {
    var songs = []
    for(var x=0; x<files.length; x++) {
      var metadata = await musicMetadata.parseBlob(files[x]);
      var formattedSong = {title: metadata.common.title ? metadata.common.title : files[x].name,
                           duration: Math.round(metadata.format.duration),
                           quality: metadata.format.bitrate,
                           file: files[x],
                           explicit: false,
                           uploaded: false,
                           contributors: []
                         }
      songs.push(formattedSong)
    }
    songs.forEach((item, i) => {
      item.index = i;
    });
    this.setState({songs:songs})
  }

  /// TABLE ROW EDIT METHODS
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

  async uploadButtonPressed() {
    this.setState({uploading: true})
    var uploads = this.state.songs
    console.log(uploads);
    this.props.uploadAlbum(this.state.album_name, this.ImageUploader.current.state.file, this.state.album_type, this.state.songs, this.editRow)
  }

  /// CONTRIBUTOR OPRERATIONS ///
  addContributor(index, contributor) {
    var newSongs = [ ...this.state.songs]
    var contributorIndex = newSongs[index].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id)
    if(contributorIndex == -1) {
        newSongs[index].contributors.push({contributor: contributor, type: []})
        this.setState({songs: newSongs})
    }
  }

  removeContributor(index, artist_id) {
    var newSongs = [ ...this.state.songs]
    var contributorIndex = newSongs[index].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    newSongs[index].contributors.splice(contributorIndex, 1)
    this.setState({songs: newSongs})
  }

  contributionHasBeenSelected(type) {
    // check whether contribution has type
    var artist_id = this.state.modalContributions.contributor.artist_id
    var contributorIndex = this.state.songs[this.state.modalSongIndex].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    return this.state.songs[this.state.modalSongIndex].contributors[contributorIndex].type.filter(x=>x===type).length>0
  }

  toggleContributonType(type) {
    if(this.state.editedModalContributions.filter(x => x === type).length > 0) {
      // contribution has already been added, need to remove
      this.setState({editedModalContributions: compact(this.state.editedModalContributions.map(function(x) {if(x !== type) return x}))})
    }
    else {
      // contribution needs to be added
      this.setState({editedModalContributions: [...this.state.editedModalContributions, type]})
    }
  }

  saveContributions() {
    var newSongs = [ ...this.state.songs]
    var artist_id = this.state.modalContributions.contributor.artist_id
    var contributorIndex = newSongs[this.state.modalSongIndex].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    newSongs[this.state.modalSongIndex].contributors[contributorIndex].type = this.state.editedModalContributions
    console.log(newSongs[this.state.modalSongIndex].contributors);
    this.setState({
      songs: newSongs,
      modalSongIndex: null,
      modalContributions: {},
      editedModalContributions: []
    })
    this.toggle()
  }

  cancelContributions() {
    this.setState({
      modalSongIndex: null,
      modalContributions: {},
      editedModalContributions: []
    })
    this.toggle()
  }

  /// CONTRIBUTOR RENDER METHODS ///
  renderContributors (props, index) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
    return (
      <>
      <span key={key} {...other}>
        <span onClick={() => {
          this.toggle(index, tag)
        }}>
          {tag.contributor.name} : {tag.type.length > 0 ? tag.type.join(", ").substring(0,15)+'...': "Select Type"}
        </span>

        {!disabled &&
          <a
            className={classNameRemove}
            onClick={(e) => {
              // onRemove(key)
              this.removeContributor(index,tag.contributor.artist_id)
            }}
          />
        }
      </span>

      </>
    )
  }

  async searchArtists({ value }) {
    if(value.length > 0) {
      var results = await revibe.searchArtists(value)
      if(results.data.artists.length > 0) {
        this.setState({searchResults: results.data.artists})
      }
      else {
        this.setState({searchResults: ["No Results."]})
      }
    }
  };

  renderSearchResults(index, artist) {
    if(artist.name) {
      return (
        <Row style={{color:"black",paddingTop: "10px",cursor: 'pointer',width: "200px"}}>
         <Col md={4}>
           <div className="photo">
             <img
             alt="..."
             style={{height:"80%", width: "80%", borderRadius: "50%"}}
             src={artist.ext ? PicsDB+artist.artist_uri+"."+artist.ext : require("assets/img/default-avatar.png")} />
           </div>
         </Col>
         <Col style={{textAlign: "left"}} xs={8} md={8}>
           {artist.name}
         </Col>
       </Row>
     );
    }
    return (
      <Row style={{color:"black",paddingTop: "10px",cursor: 'pointer',width: "200px"}}>
       <Col style={{textAlign: "left"}} xs={8} md={8}>
         No Results.
       </Col>
     </Row>
   );
  }


  displayContributions(row) {
    return (
      <TagsInput
        renderInput={({addTag,...props}) => {
          return (
          <div style={{position: "absolute"}}>
          <Autosuggest
            theme={theme}
            suggestions={this.state.searchResults}
            onSuggestionsFetchRequested={this.searchArtists}
            onSuggestionsClearRequested={() => this.setState({searchResults: []})}
            getSuggestionValue={suggestion => suggestion.name}
            onSuggestionSelected={(e, {suggestion}) => {
              addTag(suggestion.name)
              this.addContributor(row.index, suggestion)
              this.toggle(row.index, {contributor: suggestion, type: []})
            }}
            renderSuggestion={(suggestion) => this.renderSearchResults(row.index, suggestion)}
            inputProps={{
              ...props,
               placeholder: 'Add Contributors...',
               type: 'search',
             }}
          />
          </div>
        )}}
      inputProps={{
          className: 'react-tagsinput-input',
          placeholder: 'Add Contributor'
      }}
      onChange={() => console.log("Changed")}
      renderTag={props => this.renderContributors(props,row.index)}
      tagProps={{ className: "react-tagsinput-tag primary" }}
      value={row.contributors}
      />
    )

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
          style:{overflowX:"scroll", paddingTop: 0, marginTop: 0},
          accessor: row => this.displayContributions(row),
          filterable: false,
          width: 200
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
          Header: () => (
            <div style={{textAlign: "center"}}>
              Explicit
            </div>
            ),
          style:{margin: 0},
          accessor: row => (
              <FormGroup check style={{flex: 1, alignItems: "center", justifyContent: "center", textAlign: "center",padding: 0,margin:0}}>
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
              {this.state.uploading ? "Upload Status" : "Actions"}
            </div>
            ),
          accessor: row => this.uploadStatus(row),
          sortable: false,
          filterable: false
        }
      ]

    return (
      <>
      <Row>
        <Col className="m-auto mr-auto">
          <Card>
            <CardBody>
              <Row>
                <Col className="m-auto m-auto" md="4">
                  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <a data-tip data-for="albumArtTooltip">
                    <ImageUpload
                      defaultImage={require("../assets/img/album-img.jpg")}
                      uploadedImage={null}
                      btnText="Album Art"
                      addBtnColor="primary"
                      changeBtnColor="default"
                      ref={this.ImageUploader}
                    />
                    </a>
                    <ReactTooltip id="albumArtTooltip" effect='solid' delayShow={1500}>
                <span>Upload the album cover</span>
              </ReactTooltip>
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
      <a data-tip data-for="cloudUploadTooltip">
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
                      columns={columns}
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
                    multiple
                  >
                    {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
                      const filesRejected = rejectedFiles.length > 0
                      return (
                        <div {...getRootProps()} className="text-center">
                          <input {...getInputProps()} />
                          <p>Choose a file or drop it in here.</p>
                          {filesRejected && (
                            <div className="text-danger mt-2">
                              Unsupported file types.
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
      </a>
      <ReactTooltip id="cloudUploadTooltip" effect='solid' delayShow={1500}>
        <span>Click or drag songs into box to upload</span>
      </ReactTooltip>
      {this.state.isOpen ?
        <Modal
          isOpen={this.state.isOpen}
          toggle={this.toggle}
          className={"modal-dialog"}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggle}>How Did {this.state.modalContributions.contributor.name} Contribute?</ModalHeader>
          <ModalBody>
            {this.contributionTypes.map(type => (
              <FormGroup check style={{marginLeft: "30px"}}>
                <Label check>
                  <Input type="checkbox" defaultChecked={this.state.modalContributions.type.filter(x=>x===type).length>0} onClick={() => this.toggleContributonType(type)}/>
                  <span className="form-check-sign">
                    {type}
                  </span>
                </Label>
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveContributions}>Save</Button>
            <Button color="danger" onClick={this.cancelContributions}>Cancel</Button>
          </ModalFooter>
        </Modal>
      :
        null
      }
      </>
    );
  }
}


const mapDispatchToProps = dispatch => ({
    uploadAlbum: (name, image, type, songs, uploadStatusFn) =>dispatch(uploadAlbum(name, image, type, songs, uploadStatusFn)),
});

export default connect(null, mapDispatchToProps)(SongUpload)
