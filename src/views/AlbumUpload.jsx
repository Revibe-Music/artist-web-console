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

// reactstrap components
import {
  Button,
  Card,
  Collapse,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Label,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import ReactTable from "react-table";
import TagsInput from "react-tagsinput";
import Select from "react-select";
import ReactTooltip from 'react-tooltip';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';
import { connect } from 'react-redux';

import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import SongSelect from "components/SongSelect.js";
import ContributorTags from "components/ContributorTags.js";
import ContributionWarning from "components/Modals/ContributionWarning.js";
import FileExtensionWarning from "components/Modals/FileExtensionWarning.js";
import UploadStatus from "components/ActivityIndicators/UploadStatus.js";
import { uploadAlbum } from 'redux/media/actions.js'
import * as savedAnimation from 'assets/portal/img/check.json'

const musicMetadata = require('music-metadata-browser');


const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: require('assets/portal/img/check.json'),
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};


class AlbumUpload extends Component {

  constructor() {
      super();
      this.state = {
        songs: [],
        uploading: false,
        attemptedUpload: false, // indicates if the user pressed upload buttun

        openedCollapses: ["collapse0"],


        // form State
        albumName: "Test",
        albumNameState: "",
        albumNameError: "",

        albumType: "Album",
        albumTypeState: "",
        albumTypeError: "",

        albumImage: null,
        albumImageState: "",
        albumImageError: "",

        albumContributors: [],
        albumContributorsState: "",
        albumContributorsError: "",

        songNameError: "",
        songContributionError: "",
        songDurationError: "",  // not currently used

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

      this.songTable = React.createRef()

      // Validation Methods
      this._validateAlbum = this._validateAlbum.bind(this)
      this._validateSongs = this._validateSongs.bind(this)
      this._removeFileExtensions = this._removeFileExtensions.bind(this)

      // Table Edit Methods
      this.editSong = this.editSong.bind(this)
      this.removeSong = this.removeSong.bind(this)
      this.onDrop = this.onDrop.bind(this)

      // Album Edit/State Methods
      this.onSubmit = this.onSubmit.bind(this)
      this.uploadStatus = this.uploadStatus.bind(this)

      // Song Contribution Methods
      this.addSongContributor = this.addSongContributor.bind(this)
      this.removeSongContributor = this.removeSongContributor.bind(this)
      this.updateSongContributions = this.updateSongContributions.bind(this)

      // Album Contribution Methods
      this.addAlbumContributor = this.addAlbumContributor.bind(this)
      this.removeAlbumContributor = this.removeAlbumContributor.bind(this)
      this.updateAlbumContributions = this.updateAlbumContributions.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {

    // this is needed for rendering table rows
    if(this.state.songs.length !== prevState.songs.length) {
      this.state.songs.forEach((item, i) => {
        item.index = i;
      });
    }
  }

  uploadStatus(song) {
    if(this.state.uploading) {
      return <UploadStatus loading={song.uploaded} />
    }
    return (
        <i style={{fontSize: "20px", cursor: 'pointer', color: "red"}} className="tim-icons icon-simple-remove" onClick={() => this.removeSong(song.index)}/>
    )
  }

  _validateAlbum() {
    var validFields = true
    if (this.state.albumName === "") {
      validFields = false
      this.setState({ albumNameState: "has-danger", albumNameError: "This field may not be blank."});
    }
    if (!this.state.ignoreContributionWarning) {
      if (this.contributionStringTests.some(contributionString=>this.state.albumName.toLowerCase().includes(contributionString))) {
        validFields = false
        this.setState({showContributionWarning: true, contributionWarningObjectType: "album"})
      }
    }
    if (this.state.albumType === "") {
      validFields = false
      this.setState({ albumTypeState: "has-danger", albumTypeError: "This field may not be blank."});
    }
    if (this.state.albumImage === null) {
      validFields = false
      this.setState({albumImageState: "has-danger",albumImageError: "Please select an image."});
    }
    for(var i=0; i<this.state.albumContributors.length; i++) {
      if(this.state.albumContributors[i].type.length < 1) {
        this.setState({albumContributorsError: `${this.state.albumContributors[i].contributor.name} has not been assigned a contribution type.`});
        validFields = false
        break
      }
    }
    return validFields
  }

  _validateSongs() {
    var validFields = true
    var showSongContributionWarning = false
    var songContributionWarningOccurances = 0
    var showFileExtensionWarning = false
    var fileExtensionWarningOccurances = 0
    for(var x=0; x<this.state.songs.length; x++) {
      if(this.state.songs[x].title.trim()==="") {
        this.setState({songNameError: "Must provide title for song."});
        validFields = false
      }
      if (!this.state.ignoreFileExtensionWarning) {
        if (this.fileExtensionTests.some(fileExtension=>this.state.songs[x].title.toLowerCase().includes(fileExtension))) {
          validFields = false
          showFileExtensionWarning = true
          fileExtensionWarningOccurances ++
        }
      }
      if (!this.state.ignoreContributionWarning) {
        if (this.contributionStringTests.some(contributionString=>this.state.songs[x].title.trim().toLowerCase().includes(contributionString))) {
          validFields = false
          showSongContributionWarning = true
          songContributionWarningOccurances ++
        }
      }
      if(isNaN(this.state.songs[x].duration)) {
        this.setState({songDurationError: "Song does not have valid duration."});
        validFields = false
      }
      for(var i=0; i<this.state.songs[x].contributors.length; i++) {
        if(this.state.songs[x].contributors[i].type.length < 1) {
          this.setState({songContributionError: `${this.state.songs[x].contributors[i].contributor.name} has not been assigned a contribution type.`});
          validFields = false
          break
        }
      }
    }
    if(showSongContributionWarning && !this.state.ignoreContributionWarning) {
      this.setState({showContributionWarning: true, contributionWarningObjectType: "song", contributionWarningOccurances: songContributionWarningOccurances})
    }
    else if(showFileExtensionWarning && !this.state.ignoreContributionWarning) {
      this.setState({showFileExtensionWarning: true, fileExtensionWarningOccurances: fileExtensionWarningOccurances})
    }
    return validFields
  }

  _removeFileExtensions() {
    const songs = [...this.state.songs]
    for(var x=0; x<songs.length; x++) {
      for(var y=0; y<this.fileExtensionTests.length; y++) {
        if (songs[x].title.toLowerCase().includes(this.fileExtensionTests[y])) {
          songs[x].title = songs[x].title.replace(this.fileExtensionTests[y],'')
        }
      }
    }
    this.setState({songs: songs})
  }

  /// FILE HANDLING METHODS
  formatDuration(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.round(time - minutes * 60);
    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds) ;
  }

  async onDrop(files) {
    var songs = [...this.state.songs]
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
      songs.push(formattedSong)
    }
    this.setState({songs:songs})
  }


  editSong(songId, value, callback) {
    var songs = [... this.state.songs]
    var index = songs.map(function(x) {return x.id; }).indexOf(songId)
    songs[index] = callback(songs[index], value)
    this.setState({songs: songs, attemptedUpload: false})
  }

  removeSong(index) {
    this.setState({songs: [... this.state.songs].splice(index, 1) })
  }

  editTitle(song, title) {
    song.title = title
    return song
  }

  /// SONG CONTRIBUTOR OPRERATIONS ///
  addSongContributor(song, contributor) {
    song.contributors = [...song.contributors, {contributor: contributor, type: []}]
    return song
  }

  removeSongContributor(song, contributor) {
    var contributorIndex = song.contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id)
    song.contributors.splice(contributorIndex, 1)
    return song
  }

  updateSongContributions(song, contribution) {
    var contributorIndex = song.contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contribution.artist_id)
    song.contributors[contributorIndex] = contribution
    return song
  }

  /// SONG GENRE OPRERATIONS ///
  addGenre(song, genre) {
    song.genres = [...song.genres, genre]
    return song
  }

  removeGenre(song, genre) {
    song.genres = song.genres.filter(x => x !== genre)
    return song
  }

  /// SONG TAG OPRERATIONS ///
  addTag(song, tag) {
    song.tags = [...song.tags, tag]
    return song
  }

  editTags(song, tags) {
    song.tags = tags
    return song
  }

  removeTag(song, tag) {
    song.tags = song.tags.filter(x => x !== tag)
    return song
  }

  toggleExplicit(song, isExplicit) {
    song.explicit = isExplicit
    return song
  }

  async onSubmit() {

    if(this._validateAlbum() && this._validateSongs()) {
      this.setState({uploading: true})
      var uploads = this.state.songs
      this.props.uploadAlbum(this.state.albumName, this.state.albumImage, this.state.albumType, this.state.albumContributors, this.state.songs, this.editRow)
    }
    this.setState({attemptedUpload:true})
  }


  /// ALBUM CONTRIBUTOR OPRERATIONS ///
  addAlbumContributor(contributor) {
    this.setState({albumContributors: [...this.state.albumContributors,{contributor: contributor, type:[]}]})
  }

  removeAlbumContributor(contributor) {
    var contributorIndex = this.state.albumContributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id)
    var albumContributors = [...this.state.albumContributors]
    albumContributors.splice(contributorIndex, 1)
    this.setState({albumContributors: albumContributors})
  }

  updateAlbumContributions(contribution) {
    var contributorIndex = this.state.albumContributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contribution.contributor.artist_id)
    var albumContributions = [...this.state.albumContributors]
    albumContributions[contributorIndex] = contribution
    this.setState({
      albumContributors: albumContributions,
      albumContributorsError: "",
      attemptedUpload: false,
    })
  }

  // with this function we create an array with the opened collapses
  // it is like a toggle function for all collapses from this page
  collapsesToggle = (e, collapse) => {
    e.preventDefault();
    let openedCollapses = this.state.openedCollapses;
    if (openedCollapses.includes(collapse)) {
      this.setState({
        openedCollapses: openedCollapses.filter(item => item !== collapse)
      });
    } else {
      openedCollapses.push(collapse);
      this.setState({
        openedCollapses: openedCollapses
      });
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
                          onImageSelect={(file) => this.setState({albumImage: file, albumImageState: "", albumImageError: ""})}
                        />
                      </a>
                      <ReactTooltip id="albumArtTooltip" effect='solid' delayShow={1500}>
                        <span>For best results, please use an image that is square and at least 750x750 pixels.</span>
                      </ReactTooltip>
                    </div>
                  </Row>
                  <Row style={{display: "flex",alignItems: "center", justifyContent: "center",textAlign: "center"}}>
                  {this.state.albumImageState === "has-danger" ? (
                    <label style={{color: "red"}} className="error">
                      {this.state.albumImageError}
                    </label>
                  ) : null}
                  </Row>
                </Col>
                <Col className="m-auto mr-auto" md="6">
                  <Form className="form">
                    <FormGroup className={`has-label ${this.state.albumNameState}`}>
                      <label></label>
                      <Input
                        className="primary"
                        placeholder="Album Name"
                        type="text"
                        disabled={this.state.uploading}
                        onChange={e => this.setState({albumNameState: "has-success",albumNameError: "",albumName: e.target.value})}
                      />
                      {this.state.albumNameState === "has-danger" ? (
                        <label className="error">
                          {this.state.albumNameError}
                        </label>
                      ) : null}
                    </FormGroup>

                    <FormGroup style={{marginTop: "30px"}} className={`has-label ${this.state.albumTypeState}`}>
                      <label></label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        placeholder="Album Type"
                        name="multipleSelect"
                        closeMenuOnSelect={true}
                        isMulti={false}
                        isDisabled={this.state.uploading}
                        onChange={option => this.setState({albumTypeState: "has-success",albumTypeError: "",albumType: option.label})}
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
                      {this.state.albumTypeState === "has-danger" ? (
                        <label className="error">
                          {this.state.albumTypeError}
                        </label>
                      ) : null}
                    </FormGroup>
                    <FormGroup style={{marginTop: "30px", marginBottom: "30px"}}>
                      <Row>
                      {this.state.albumContributorsError ?
                        <>
                        <MdErrorOutline style={{color: "red", marginRight: "25px"}} id="album-contribution-error"/>
                          <UncontrolledTooltip
                            style={{backgroundColor: "red", color: "white"}}
                            placement="top"
                            target="album-contribution-error"
                          >
                            {this.state.albumContributorsError}
                          </UncontrolledTooltip>
                        </>
                      :
                        null
                      }
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
                        owner={null}
                        onAddContributor={this.addAlbumContributor}
                        onRemoveContributor={this.removeAlbumContributor}
                        updateContributionTypes={this.updateAlbumContributions}
                        disabled={this.state.uploading}
                      />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>

            </CardBody>
            <CardFooter>
              <div style={{margin: "2%"}}>
                <p>*For best results, please use an image that is square and at least 750x750 pixels.</p>
              </div>
            </CardFooter>
          </Card>
        </Col>
      <a data-tip data-for="cloudUploadTooltip">
        <Col className="m-auto mr-auto">
          <Card>
            <CardBody>
              <CardTitle tag="h3">Upload Songs</CardTitle>
                <p>*Please note that we only accept MP3, WAV, FLAC, and OGG files at this time.</p>
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
                          <a
                            aria-expanded={this.state.openedCollapses.includes(`collapse${index}`)}
                            data-parent="#accordion"
                            data-toggle="collapse"
                            onClick={e => this.collapsesToggle(e, `collapse${index}`)}
                          >
                            {song.error ?
                              <>
                              <MdErrorOutline style={{color: "red", marginLeft: "35px"}} id={`Song:${song.id}:error`}/>
                                <UncontrolledTooltip
                                  style={{backgroundColor: "red", color: "white"}}
                                  placement="top"
                                  target={`Song:${song.id}:error`}
                                >
                                  {song.error}
                                </UncontrolledTooltip>
                              </>
                            :
                              null
                            }
                            <CardTitle tag="h4">
                              <div style={{float: "left", marginRight: "5%"}} >
                                {this.uploadStatus(song)}
                              </div>
                              {song.title}
                              <i className="tim-icons icon-minimal-down" />
                            </CardTitle>
                          </a>
                        </CardHeader>
                        <Collapse
                          role="tabpanel"
                          isOpen={this.state.openedCollapses.includes(`collapse${index}`)}
                        >
                          <CardBody>
                            <Row>
                              <Col xs="12" md="6">
                                <FormGroup id={"SongName:"+song.id}>
                                  <div>Title</div>
                                  <Input
                                    disabled={this.state.uploading}
                                    value={song.title}
                                    onChange={event => this.editSong(song.id, event.target.value, this.editTitle)}
                                  />
                                </FormGroup>
                              </Col>
                              <Col xs="12" md="6">
                                  <div>
                                    Contributors
                                    <AiOutlineQuestionCircle style={{color: "#7248BD", marginLeft: "5px"}} id={`contribution-question${index}`}/>
                                  </div>
                                  <ContributorTags
                                    artist_id={this.props.artist_id}
                                    owner={song}
                                    onAddContributor={contributor => this.editSong(song.id, contributor, this.addSongContributor)}
                                    onRemoveContributor={contributor => this.editSong(song.id, contributor, this.removeSongContributor)}
                                    updateContributionTypes={contributor => this.editSong(song.id, contributor, this.updateSongContributions)}
                                    disabled={this.state.uploading}
                                  />
                                  <UncontrolledTooltip
                                    style={{backgroundColor: "#7248BD", color: "white"}}
                                    placement="top"
                                    target={`contribution-question${index}`}
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
                                    onChange={option => {
                                      if(song.genres.includes(option.label)) {
                                        this.editSong(song.id, option.label, this.removeGenre)
                                      }
                                      else {
                                        this.editSong(song.id, option.label, this.addGenre)
                                      }
                                    }}
                                    options={this.genreOptions.map((genre, index) => ({ value: index, label: genre }))}
                                  />
                                </FormGroup>
                              </Col>
                              <Col xs="6" md="5">
                                <div>Tags</div>
                                <TagsInput
                                  inputProps={{
                                      className: 'react-tagsinput-input',
                                      placeholder: 'Add Tag',
                                      disabled: this.props.disabled
                                  }}
                                  onChange={tags => this.editSong(song.id, tags, this.editTags)}
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
                                    onChange={event => this.editSong(song.id, event.target.checked, this.toggleExplicit)}
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
          this._removeFileExtensions()
          this.setState({showFileExtensionWarning: false, fileExtensionWarningOccurances: 0})
        }}
        onIgnore={() => this.setState({showFileExtensionWarning: false, ignoreFileExtensionWarning: true, fileExtensionWarningOccurances: 0})}
      />
      </>
    );
  }
}

// var columns = [
//     {
//       id: "title",
//       Header: () => (
//         <div>
//           Title
//           {this.state.songNameError ?
//             <>
//             <MdErrorOutline style={{color: "red", marginLeft: "35px"}} id="name-error"/>
//               <UncontrolledTooltip
//                 style={{backgroundColor: "red", color: "white"}}
//                 placement="top"
//                 target="name-error"
//               >
//                 {this.state.songNameError}
//               </UncontrolledTooltip>
//             </>
//           :
//             null
//           }
//         </div>
//       ),
//       accessor: row => (
//         <>
//           <FormGroup id={"SongName"+row.index}>
//             <Input
//               placeholder="Song Title"
//               disabled={this.state.uploading}
//               value={row.title}
//               onChange={event => this.editRow(row.index,"title", event.target.value)}
//             />
//           </FormGroup>
//         </>
//       ),
//       filterable: false,
//     },
//     {
//       id: "contributors",
//       Header: () => (
//         <>
//         <div>
//           Contributors
//           <AiOutlineQuestionCircle style={{color: "#7248BD", marginLeft: "5px"}} id="contribution-question"/>
//           {this.state.songContributionError ?
//             <>
//             <MdErrorOutline style={{color: "red", marginLeft: "25px"}} id="contribution-error"/>
//               <UncontrolledTooltip
//                 style={{backgroundColor: "red", color: "white"}}
//                 placement="top"
//                 target="contribution-error"
//               >
//                 {this.state.songContributionError}
//               </UncontrolledTooltip>
//             </>
//           :
//             null
//           }
//         </div>
//         <UncontrolledTooltip
//           style={{backgroundColor: "#7248BD", color: "white"}}
//           placement="bottom"
//           target="contribution-question"
//           hideArrow={true}
//         >
//           Tag other artists that had a roll
//         </UncontrolledTooltip>
//         </>
//       ),
//       style: this.state.uploading ? {overflowX:"scroll"} : {paddingTop: 0, marginTop: 0,overflowX:"scroll"},
//       accessor: row => (
//         <ContributorTags
//           artist_id={this.props.artist_id}
//           owner={row}
//           onAddContributor={this.addSongContributor}
//           onRemoveContributor={this.removeSongContributor}
//           updateContributionTypes={this.updateSongContributions}
//           disabled={this.state.uploading}
//         />
//       ),
//       filterable: false,
//     },
//     {
//       id: "duration",
//       Header: () => (
//         <div>
//           Duration
//           {this.state.songDurationError ?
//             <>
//             <MdErrorOutline style={{color: "red", marginLeft: "35px"}} id="duration-error"/>
//               <UncontrolledTooltip
//                 style={{backgroundColor: "red", color: "white"}}
//                 placement="top"
//                 target="duration-error"
//               >
//                 {this.state.songDurationError}
//               </UncontrolledTooltip>
//             </>
//           :
//             null
//           }
//         </div>
//       ),
//       accessor: row => this.formatDuration(row.duration),
//       filterable: false,
//     },
//     {
//       id: "explicit",
//       Header: () => (
//         <div style={{textAlign: "center"}}>
//           Explicit
//         </div>
//         ),
//       style:{margin: 0},
//       accessor: row => (
//           <FormGroup check style={{flex: 1, alignItems: "center", justifyContent: "center", textAlign: "center",padding: 0,margin:0}}>
//           <Label check>
//             <Input
//               disabled={this.state.uploading}
//               type="checkbox"
//               value={row.explicit}
//               onChange={event => this.editRow(row.index,"explicit", event.target.checked)}
//             />
//             <span className="form-check-sign" />
//           </Label>
//         </FormGroup>),
//       sortable: false,
//       filterable: false
//     },
//     {
//       id: "actions",
//       Header: () => (
//         <div style={{textAlign: "center"}}>
//           {this.state.uploading ? "Upload Status" : "Actions"}
//         </div>
//         ),
//       accessor: row => this.uploadStatus(row),
//       sortable: false,
//       filterable: false
//     }
//   ]

// <ReactTable
//   ref={this.songTable}
//   data={this.state.songs}
//   resizable={true}
//   columns={columns}
//   defaultPageSize = { this.state.songs.length > 20 ? 20 : this.state.songs.length }
//   pageSize = { this.state.songs.length > 20 ? 20 : this.state.songs.length }
//   showPagination  = { this.state.songs.length > 20 ? true : false}
//   showPageSizeOptions = {false}
//
//   defaultPageSize={this.state.songs.length}
//   showPagination={false}
//   className="-striped -highlight"
// />
function mapStateToProps(state) {
  return {
    artist_id: state.authentication.user.artistId,
  }
};

const mapDispatchToProps = dispatch => ({
    uploadAlbum: (name, image, type, contributors, ongs, uploadStatusFn) =>dispatch(uploadAlbum(name, image, type, contributors, ongs, uploadStatusFn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumUpload)
