import React, {Component} from 'react';
import classNames from "classnames";

// reactstrap components
import TagsInput from "react-tagsinput";
import Select from "react-select";
import ReactTooltip from 'react-tooltip';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';
import { Button, Card, Collapse, CardHeader, CardBody, CardTitle, CardFooter, Label, Form, FormGroup, Input, Row, Col, UncontrolledTooltip} from "reactstrap";
import { connect } from 'react-redux';

import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import SongSelect from "components/SongSelect.js";
import ContributorTags from "components/ContributorTags.js";
import ContributionWarning from "components/Modals/ContributionWarning.js";
import FileExtensionWarning from "components/Modals/FileExtensionWarning.js";
import UploadStatus from "components/ActivityIndicators/UploadStatus.js";
import { uploadAlbum } from 'redux/media/actions.js'
import Song from 'models/Song.js'
import Album from 'models/Album.js'

const musicMetadata = require('music-metadata-browser');


class AlbumUpload extends Component {

  constructor() {
      super();
      this.state = {
        songs: [],
        album: new Album(),
        uploading: false,
        attemptedUpload: false, // indicates if the user pressed upload buttun

        openedCollapses: [],

        showContributionWarning: false,
        ignoreContributionWarning: false,
        contributionWarningObjectType: "",
        contributionWarningOccurances: "",

        showFileExtensionWarning: false,
        ignoreFileExtensionWarning: false,
        fileExtensionWarningOccurances: 0,
      };

      this.genreOptions = ["Blues","Classical","Country","Electronic","Folk","Hip-hop","Jazz","New age","Reggae","Rock",]

      this.contributionStringTests = [
        " ft ", "ft.", "ft:", "ft-",
        " feat ", "feat.", "feat-", "feat:",
        " feature ", "feature-", " feature:",
        " features ", "features-", "features:",
        " featuring ", "featuring-", "featuring:",
        " prod by ", "prod by-", "prod by:",
        " produced by ", "produced by-", "produced by:",
      ]

      this.fileExtensionTests = [".mp3", ".mp4", ".wav", ".flac", ".ogg"]


      // Table Edit Methods
      this.editSong = this.editSong.bind(this)
      this.removeSong = this.removeSong.bind(this)
      this.onDrop = this.onDrop.bind(this)

      // Album Edit/State Methods
      this.editAlbum = this.editAlbum.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
      this.uploadStatus = this.uploadStatus.bind(this)

  }

  uploadStatus(song) {
    if(this.state.uploading) {
      return <UploadStatus loading={song.uploaded} />
    }
    return (
        <i style={{fontSize: "20px", cursor: 'pointer', color: "red"}} className="tim-icons icon-simple-remove" onClick={() => this.removeSong(song.id)}/>
    )
  }

  async onDrop(files) {
    var songs = [...this.state.songs]
    var songAccordians = [...this.state.openedCollapses]
    for(var x=0; x<files.length; x++) {
      var metadata = await musicMetadata.parseBlob(files[x]);
      var formattedSong = {
        title: metadata.common.title ? metadata.common.title : files[x].name,
        duration: Math.round(metadata.format.duration),
        file: files[x],
        explicit: false,
        uploaded: false,
        contributors: [],
        genres: [],
        tags: [],
        id: Math.floor(Math.random() * 1000000000),       // temp id for referening
        error: "",
        state: ""
      }
      var song = new Song(formattedSong)
      song.formatTitle()
      songs.push(song)
      songAccordians.push(`collapse${formattedSong.id}`)
    }
    this.setState({songs:songs, openedCollapses: songAccordians})
  }

  editAlbum(values, callback) {
    values = values !== "array" ? [values] : values
    var album = this.state.album
    album[callback](...values)
    console.log(album);
    this.setState({album: album, attemptedUpload: false})
  }

  editSong(songId, values, callback) {
    values = values !== "array" ? [values] : values
    var songs = [... this.state.songs]
    var index = songs.map(function(x) {return x.id; }).indexOf(songId)
    songs[index][callback](...values)
    this.setState({songs: songs, attemptedUpload: false})
  }

  removeSong(songId) {
    var songs = [... this.state.songs]
    var index = songs.map(function(x) {return x.id; }).indexOf(songId)
    songs.splice(index, 1)
    this.setState({songs: songs, attemptedUpload: false })
  }


  async onSubmit() {
    var isValid = true
    var album = this.state.album
    album.clearErrors()
    album.validate()
    isValid = album.isValid
    this.setState({album: album})

    var showSongContributionWarning = false
    var songContributionWarningOccurances = 0
    var showFileExtensionWarning = false
    var fileExtensionWarningOccurances = 0
    var songs = [...this.state.songs]
    for(var x=0; x<songs.length; x++) {
      songs[x].clearErrors()
      songs[x].validate()
      if (this.fileExtensionTests.some(fileExtension=>songs[x].title.toLowerCase().includes(fileExtension))) {
        showFileExtensionWarning = true
        fileExtensionWarningOccurances ++
      }
      if(songs[x].errors.filter(error => error.message.includes("Must actually tag contributors in order to give them create.")).length > 0) {
        showSongContributionWarning=true
        songContributionWarningOccurances++
      }
    }
    this.setState({songs: songs})
    if(showSongContributionWarning && !this.state.ignoreContributionWarning) {
      isValid = false
      this.setState({showContributionWarning: true, contributionWarningObjectType: "song", contributionWarningOccurances: songContributionWarningOccurances})
    }
    else if(showFileExtensionWarning && !this.state.ignoreFileExtensionWarning) {
      isValid = false
      this.setState({showFileExtensionWarning: true, fileExtensionWarningOccurances: fileExtensionWarningOccurances})
    }

    if(isValid) {
      this.setState({uploading: true})
      var uploads = this.state.songs
      this.props.uploadAlbum(this.state.album, this.state.songs, this.editRow)
    }
    this.setState({attemptedUpload:true})
  }



  // with this function we create an array with the opened collapses
  // it is like a toggle function for all collapses from this page
  collapsesToggle = (e, collapse) => {
    e.preventDefault();
    let openedCollapses = this.state.openedCollapses;
    if (openedCollapses.includes(collapse)) {
      this.setState({openedCollapses: openedCollapses.filter(item => item !== collapse)});
    }
    else {
      this.setState({openedCollapses: [...openedCollapses, collapse]});
    }
  };




  render() {

    return (
      <>
        <Col className="m-auto mr-auto">
          <Card className="card-gray">
            <CardBody>
              <Row>
                <Col className="m-auto m-auto" md="4">
                  <Row>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <a data-tip data-for="albumArtTooltip">
                        <ImageUpload
                          defaultImage={require("../assets/portal/img/album-img.jpg")}
                          uploadedImage={null}
                          btnText="Album Art"
                          addBtnColor="primary"
                          changeBtnColor="default"
                          disabled={this.state.uploading}
                          onImageSelect={(file) => this.editAlbum(file, "setImage")}
                        />
                      </a>
                      <ReactTooltip id="albumArtTooltip" effect='solid' delayShow={1500}>
                        <span>For best results, please use an image that is square and at least 750x750 pixels.</span>
                      </ReactTooltip>
                    </div>
                  </Row>
                  <Row style={{display: "flex",alignItems: "center", justifyContent: "center",textAlign: "center"}}>
                  {this.state.album.errors.filter(error => error.location === "image").length > 0 ? (
                    <label style={{color: "red"}} className="error">
                      {this.state.album.errors.filter(error => error.location === "image")[0].message}
                    </label>
                  ) : null}
                  </Row>
                </Col>
                <Col className="m-auto mr-auto" md="6">
                  <Form className="form">
                    <FormGroup>
                      <label></label>
                      <Input
                        className="primary"
                        placeholder="Album Name"
                        type="text"
                        disabled={this.state.uploading}
                        onChange={e => this.editAlbum(e.target.value, "setName")}
                      />
                      {this.state.album.errors.filter(error => error.location === "name").length > 0 ? (
                        <label style={{color: "red"}} className="error">
                          {this.state.album.errors.filter(error => error.location === "name")[0].message}
                        </label>
                      ) : null}
                    </FormGroup>
                    <FormGroup style={{marginTop: "30px"}}>
                      <label></label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        placeholder="Album Type"
                        name="multipleSelect"
                        closeMenuOnSelect={true}
                        isMulti={false}
                        isDisabled={this.state.uploading}
                        onChange={option => this.editAlbum(option.label, "setType")}
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
                      {this.state.album.errors.filter(error => error.location === "type").length > 0 ? (
                        <label style={{color: "red"}} className="error">
                          {this.state.album.errors.filter(error => error.location === "type")[0].message}
                        </label>
                      ) : null}
                    </FormGroup>
                    <FormGroup style={{marginTop: "30px", marginBottom: "30px"}}>
                      <Row>
                        {this.state.album.errors.filter(error => error.location === "contributors").length > 0 ? (
                          <>
                          <MdErrorOutline style={{color: "red", marginRight: "25px"}} id="album-contribution-error"/>
                            <UncontrolledTooltip
                              style={{backgroundColor: "red", color: "white"}}
                              placement="top"
                              target="album-contribution-error"
                            >
                              {this.state.album.errors.filter(error => error.location === "contributors")[0].message}
                            </UncontrolledTooltip>
                          </>
                        ) : null}

                      <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "10px"}} id="album-contribution-question"/>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="album-contribution-question"
                        hideArrow={true}
                      >
                      Tag others (by their display name) that had a roll in creating this album.
                      </UncontrolledTooltip>
                      <label>Album Contributors</label>
                      </Row>
                      <ContributorTags
                        artist_id={this.props.artist_id}
                        onAddContributor={contributor => this.editAlbum(contributor, "addContributor")}
                        onRemoveContributor={contributor => this.editAlbum(contributor, "removeContributor")}
                        updateContributionTypes={contributor => this.editAlbum(contributor, "updateContribution")}
                        disabled={this.state.uploading}
                      />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>

            </CardBody>
          </Card>
        </Col>
      <a data-tip data-for="cloudUploadTooltip">
        <Col className="m-auto mr-auto">
          <Card>
            <CardBody>
              <CardTitle tag="h3">Upload Songs</CardTitle>
                <p>*Please note that we only accept MP3, MP4, WAV, FLAC, and OGG files at this time.</p>
                {this.state.songs.length > 0 ?
                  <>
                  <div
                    aria-multiselectable={true}
                    className="card-collapse"
                    id="accordion"
                    role="tablist"
                  >
                    {this.state.songs.map((song, index) => (
                      <Card className="card-plain">
                        <CardHeader role="tab">
                            <CardTitle tag="h4">
                              <div style={{float: "left", marginRight: "5%"}} >
                                <div style={{float: "left"}} >
                                  {this.uploadStatus(song)}
                                </div>
                                <div style={{float: "right"}} >
                                  {song.errors.length > 0 ?
                                    <>
                                      <MdErrorOutline style={{color: "red", marginLeft: "35px"}} id={`Song-${song.id}-error`}/>
                                      <UncontrolledTooltip
                                        style={{backgroundColor: "red", color: "white"}}
                                        placement="top"
                                        target={`Song-${song.id}-error`}
                                      >
                                        <ul>
                                          {song.errors.map(error => {
                                            console.log(error);
                                            return (
                                              <li>{error.message}</li>
                                            )
                                          })}
                                        </ul>
                                      </UncontrolledTooltip>
                                    </>
                                  :
                                    null
                                  }
                                </div>
                              </div>
                              <a
                                aria-expanded={this.state.openedCollapses.includes(`collapse${song.id}`)}
                                data-parent="#accordion"
                                data-toggle="collapse"
                                style={{cursor: "pointer"}}
                                onClick={e => this.collapsesToggle(e, `collapse${song.id}`)}
                              >

                              {song.title.trim() ? song.displayTitle() : "Song Title"}
                              <i className="tim-icons icon-minimal-down" />
                              </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse
                          role="tabpanel"
                          isOpen={this.state.openedCollapses.includes(`collapse${song.id}`)}
                        >
                          <CardBody>
                            <Row>
                              <Col xs="12" md="6">
                                <FormGroup id={"SongName:"+song.id}>
                                  <div>Title</div>
                                  <Input
                                    disabled={this.state.uploading}
                                    value={song.title}
                                    onChange={event => this.editSong(song.id, event.target.value, "setTitle")}
                                  />
                                </FormGroup>
                              </Col>
                              <Col xs="12" md="6">
                                  <div>
                                    Contributors
                                    <AiOutlineQuestionCircle style={{color: "#7248BD", marginLeft: "5px"}} id={`contribution-question${song.id}`}/>
                                  </div>
                                  <ContributorTags
                                    artist_id={this.props.artist_id}
                                    onAddContributor={contributor => this.editSong(song.id, contributor, "addContributor")}
                                    onRemoveContributor={contributor => this.editSong(song.id, contributor, "removeContributor")}
                                    updateContributionTypes={contributor => this.editSong(song.id, contributor, "updateContribution")}
                                    disabled={this.state.uploading}
                                  />
                                  <UncontrolledTooltip
                                    style={{backgroundColor: "#7248BD", color: "white"}}
                                    placement="top"
                                    target={`contribution-question${song.id}`}
                                    hideArrow={true}
                                  >
                                    Tag others (by their display name) that had a roll in creating this song.
                                  </UncontrolledTooltip>
                              </Col>
                            </Row>

                            <Row style={{marginTop: "10px"}}>
                              <Col xs="6" md="5">
                                <FormGroup>
                                  <div>Genre(s)</div>
                                  <Select
                                    className="react-select primary"
                                    classNamePrefix="react-select"
                                    placeholder="None"
                                    name="multipleSelect"
                                    closeMenuOnSelect={true}
                                    isMulti={true}
                                    isDisabled={this.state.uploading}
                                    onChange={options => this.editSong(song.id, options.map(x => x.label), "setGenres")}
                                    options={this.genreOptions.map((genre, index) => ({ value: index, label: genre }))}
                                  />
                                </FormGroup>
                              </Col>
                              <Col xs="6" md="5">
                                <div>Tags</div>
                                <TagsInput
                                  inputProps={{
                                      // className: 'form-control',
                                      placeholder: 'Add Tag',
                                      disabled: this.props.disabled
                                  }}
                                  renderLayout={(tagComponents, inputComponent) => (
                                    <div style={{border: `1px solid ${this.state.inputColor}`, fontSize: "0.75rem",  borderRadius: "0.4285rem", marginBottom: "5px", transition: "color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out"}}>
                                      <Row>
                                        <Col xs="6" md="4">
                                          {inputComponent}
                                        </Col>
                                        <Col xs="6" md="8">
                                          {tagComponents}
                                      </Col>
                                      </Row>
                                    </div>
                                  )}
                                  onChange={tags => this.editSong(song.id, tags, "setTags")}
                                  tagProps={{ className: "react-tagsinput-tag primary", disabled: this.props.disabled }}
                                  value={song.tags}
                                />
                              </Col>
                              <Col xs="6" md="2" style={{flex: 1, alignItems: "center", justifyContent: "center", textAlign: "center",padding: 0,margin:0}}>
                                <div>Explicit</div>
                                <FormGroup check >
                                <Label check>
                                  <Input
                                    disabled={this.state.uploading}
                                    type="checkbox"
                                    value={song.explicit}
                                    onChange={event => this.editSong(song.id, event.target.checked, "setExplicit")}
                                  />
                                  <span className="form-check-sign" />
                                </Label>
                              </FormGroup>
                              </Col>
                            </Row>


                          </CardBody>
                        </Collapse>
                      </Card>
                    ))}
                  </div>

                  <SongSelect onFileSelect={this.onDrop} disabled={this.state.uploading} displayDropzone={false}/>
                  <div style={{display: 'flex', justifyContent: "center", alignItems: 'center'}}>
                    <Button
                      onClick={this.onSubmit}
                      className="btn-round"
                      color="primary"
                      disabled={this.state.uploading}
                    >
                      Upload
                    </Button>
                  </div>
                  </>
                :
                <SongSelect onFileSelect={this.onDrop} />
              }
            </CardBody>
          </Card>
        </Col>
      </a>
      <ContributionWarning
        show={this.state.showContributionWarning}
        objectType={this.state.contributionWarningObjectType}
        occurances={this.state.contributionWarningOccurances}
        onClose={() => this.setState({showContributionWarning: false})}
        onIgnore={() => this.setState({showContributionWarning: false, ignoreContributionWarning: true, contributionWarningOccurances: 0})}
      />
      <FileExtensionWarning
        show={this.state.showFileExtensionWarning}
        occurances={this.state.fileExtensionWarningOccurances}
        onClose={() => {
          const songs = [...this.state.songs]
          for(var x=0; x<songs.length; x++) {
            songs[x].removeFileExtensionFromTitle()
          }
          this.setState({showFileExtensionWarning: false, fileExtensionWarningOccurances: 0, songs: songs})
        }}
        onIgnore={() => this.setState({showFileExtensionWarning: false, ignoreFileExtensionWarning: true, fileExtensionWarningOccurances: 0})}
      />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    artist_id: state.authentication.user.artistId,
  }
};

const mapDispatchToProps = dispatch => ({
    uploadAlbum: (album, songs, uploadStatusFn) =>dispatch(uploadAlbum(album, songs, uploadStatusFn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumUpload)