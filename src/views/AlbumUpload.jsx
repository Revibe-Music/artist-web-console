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
  Card,
  CardBody,
  CardTitle,
  Container,
  Label,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Tooltip,
  UncontrolledTooltip
} from "reactstrap";
import Dropzone from 'react-dropzone';
import ReactTable from "react-table";
import Select from "react-select";
import TagsInput from "react-tagsinput";
import Autosuggest from 'react-autosuggest';
import { ClipLoader } from "react-spinners";
import Lottie from 'react-lottie';
import ReactTooltip from 'react-tooltip';
import { FiDownload } from 'react-icons/fi';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import RevibeAPI from '../api/revibe.js';
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import { uploadAlbum } from 'redux/media/actions.js'

import * as savedAnimation from 'assets/portal/img/check.json'

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
      animationData: require('assets/portal/img/check.json'),
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
    width: '100%',
    minWidth: 150,
    maxWidth: 280,
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


class AlbumUpload extends Component {

  constructor() {
      super();
      this.state = {
        songs: [],
        uploading: false,
        searchResults: [],

        // Song Contribution Modal
        modalSongContributionsIsOpen: false,
        modalSongIndex: null,
        modalSongContribution: {},
        modalEditedSongContributions: [],

        // Album Contribution Modal
        modalAlbumContributionsIsOpen: false,
        modalAlbumContributions: {},
        modalEditedAlbumContributions: [],

        // form State
        albumName: "",
        albumNameState: "",
        albumNameError: "",

        albumType: "",
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
        songQualityError: "",   // not currently used

        attemptedUpload: false, // indicates if the user pressed upload buttun
      };

      this.contributionTypes = ["Artist","Feature","Producer","Mixing","Mastering","Song Writer","Vocals","Programmer/Beat Maker","Graphic Designer"]

      // Table Edit Methods
      this.editRow = this.editRow.bind(this)
      this.removeRow = this.removeRow.bind(this)
      this.onDrop = this.onDrop.bind(this)

      // Album Edit/State Methods
      this.onImageChange = this.onImageChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
      this.uploadStatus = this.uploadStatus.bind(this)

      // Song Contribution Methods
      this.renderSearchResults = this.renderSearchResults.bind(this)
      this.searchArtists = this.searchArtists.bind(this)
      this.toggleSongContributorModal = this.toggleSongContributorModal.bind(this)
      this.toggleSongContributonType = this.toggleSongContributonType.bind(this)
      this.saveSongContributions = this.saveSongContributions.bind(this)
      this.cancelSongContributions = this.cancelSongContributions.bind(this)
      this.songContributionHasBeenSelected = this.songContributionHasBeenSelected.bind(this)

      this.toggleAlbumContributorModal = this.toggleAlbumContributorModal.bind(this)
      this.toggleAlbumContributonType = this.toggleAlbumContributonType.bind(this)
      this.saveAlbumContributions = this.saveAlbumContributions.bind(this)
      this.cancelAlbumContributions = this.cancelAlbumContributions.bind(this)
      this.albumContributionHasBeenSelected = this.albumContributionHasBeenSelected.bind(this)
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

  onImageChange(file) {
    this.setState({
      albumImage: file,
      albumImageState: "",
      albumImageError: ""
     });
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
      var formattedSong = {
        title: metadata.common.title ? metadata.common.title : files[x].name,
        duration: Math.round(metadata.format.duration),
        quality: metadata.format.bitrate,
        file: files[x],
        explicit: false,
        uploaded: false,
        contributors: [],
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
    if(key === "title") {
      this.setState({songNameError: ""})
    }
    this.setState({songs: newData, attemptedUpload: false})
  }

  removeRow(index) {
    var newData = [... this.state.songs]
    newData.splice(index, 1);
    this.setState({songs: newData})
  }

  async onSubmit() {

    var validFields = true
    if (this.state.albumName === "") {
      validFields = false
      this.setState({
        albumNameState: "has-danger",
        albumNameError: "This field may not be blank."
       });
    }
    if (this.state.albumType === "") {
      validFields = false
      this.setState({
        albumTypeState: "has-danger",
        albumTypeError: "This field may not be blank."
       });
    }
    if (this.state.albumImage === null) {
      validFields = false
      this.setState({
        albumImageState: "has-danger",
        albumImageError: "Please select an image."
       });
    }
    for(var x=0; x<this.state.songs.length; x++) {
      if(this.state.songs[x].title.trim()==="") {
        this.setState({songNameError: "Must provide title for song."});
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
    for(var i=0; i<this.state.albumContributors.length; i++) {
      if(this.state.albumContributors[i].type.length < 1) {
        this.setState({albumContributorsError: `${this.state.albumContributors[i].contributor.name} has not been assigned a contribution type.`});
        validFields = false
        break
      }
    }
    if(validFields) {
      if(this.state.albumNameError==="" && this.state.albumTypeError==="" && this.state.albumImage !== null) {
        this.setState({uploading: true})
        var uploads = this.state.songs
        this.props.uploadAlbum(this.state.albumName, this.state.albumImage, this.state.albumType, this.state.albumContributors, this.state.songs, this.editRow)
      }
    }
    this.setState({attemptedUpload:true})
  }



  /// SONG CONTRIBUTOR OPRERATIONS ///
  addSongContributor(index, contributor) {
    var newSongs = [ ...this.state.songs]
    var contributorIndex = newSongs[index].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id)
    if(contributorIndex == -1) {
        newSongs[index].contributors.push({contributor: contributor, type: []})
        this.setState({songs: newSongs})
        this.toggleSongContributorModal(index, {contributor: contributor, type: []})
    }
  }

  removeSongContributor(index, artist_id) {
    var newSongs = [ ...this.state.songs]
    var contributorIndex = newSongs[index].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    newSongs[index].contributors.splice(contributorIndex, 1)
    this.setState({songs: newSongs})
  }

  /// SONG CONTRIBUTION MODAL OPERATIONS ///
  toggleSongContributorModal(songIndex=null, contribution=null) {
    var updatedState = {modalSongContributionsIsOpen: !this.state.modalSongContributionsIsOpen}
    if(songIndex !== null) {
      updatedState.modalSongIndex = songIndex
    }
    else {
      updatedState.modalSongIndex = null
    }
    if(contribution) {
      updatedState.modalSongContribution = contribution
      updatedState.modalEditedSongContributions = contribution.type
    }
    else {
      updatedState.modalSongContribution = {}
      updatedState.modalEditedSongContributions = []
    }
    this.setState(updatedState)
  }

  toggleSongContributonType(type) {
    if(this.state.modalEditedSongContributions.filter(x => x === type).length > 0) {
      // contribution has already been added, need to remove
      this.setState({modalEditedSongContributions: compact(this.state.modalEditedSongContributions.map(function(x) {if(x !== type) return x}))})
    }
    else {
      // contribution needs to be added
      this.setState({modalEditedSongContributions: [...this.state.modalEditedSongContributions, type]})
    }
  }

  songContributionHasBeenSelected(type) {
    // check whether contribution has type
    var artist_id = this.state.modalSongContribution.contributor.artist_id
    var contributorIndex = this.state.songs[this.state.modalSongIndex].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    return this.state.songs[this.state.modalSongIndex].contributors[contributorIndex].type.filter(x=>x===type).length>0
  }

  saveSongContributions() {
    var newSongs = [ ...this.state.songs]
    var artist_id = this.state.modalSongContribution.contributor.artist_id
    var contributorIndex = newSongs[this.state.modalSongIndex].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    newSongs[this.state.modalSongIndex].contributors[contributorIndex].type = this.state.modalEditedSongContributions
    this.setState({
      songs: newSongs,
      modalSongIndex: null,
      modalSongContribution: {},
      modalEditedSongContributions: [],
      songContributionError: "",
      attemptedUpload: false,
    })
    this.toggleSongContributorModal()
  }

  cancelSongContributions() {
    this.setState({
      modalSongIndex: null,
      modalSongContribution: {},
      modalEditedSongContributions: [],
      songContributionError: "",
    })
    this.toggleSongContributorModal()
  }

  /// ALBUM CONTRIBUTOR OPRERATIONS ///
  addAlbumContributor(contributor) {
    var contributorIndex = this.state.albumContributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id)
    if(contributorIndex == -1) {
        this.setState({albumContributors: [...this.state.albumContributors,{contributor: contributor, type:[]}]})
        this.toggleAlbumContributorModal({contributor: contributor, type: []})
    }
  }

  removeAlbumContributor(artist_id) {
    var contributorIndex = this.state.albumContributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    var albumContributors = [...this.state.albumContributors]
    albumContributors.splice(contributorIndex, 1)
    this.setState({albumContributors: albumContributors})
  }

  /// ALBUM CONTRIBUTION MODAL OPERATIONS ///
  toggleAlbumContributorModal(contribution=null) {
    var updatedState = {modalAlbumContributionsIsOpen: !this.state.modalAlbumContributionsIsOpen}
    if(contribution) {
      updatedState.modalEditedAlbumContributions = contribution.type
      updatedState.modalAlbumContributions = contribution
    }
    else {
      updatedState.modalEditedAlbumContributions = []
      updatedState.modalAlbumContributions = {}
    }
    this.setState(updatedState)
  }

  toggleAlbumContributonType(type) {
    if(this.state.modalEditedAlbumContributions.filter(x => x === type).length > 0) {
      // contribution has already been added, need to remove
      this.setState({modalEditedAlbumContributions: compact(this.state.modalEditedAlbumContributions.map(function(x) {if(x !== type) return x}))})
    }
    else {
      // contribution needs to be added
      this.setState({modalEditedAlbumContributions: [...this.state.modalEditedAlbumContributions, type]})
    }
  }

  albumContributionHasBeenSelected(type) {
    // check whether contribution has type
    var artist_id = this.state.modalAlbumContributions.contributor.artist_id
    var contributorIndex = this.state.albumContributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    return this.state.albumContributors[contributorIndex].type.filter(x=>x===type).length>0
  }

  saveAlbumContributions() {
    var artist_id = this.state.modalAlbumContributions.contributor.artist_id
    var contributorIndex = this.state.albumContributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    var albumContributions = [...this.state.albumContributors]
    albumContributions[contributorIndex].type = this.state.modalEditedAlbumContributions
    this.setState({
      albumContributions: albumContributions,
      modalAlbumContributions: {},
      modalEditedAlbumContributions: [],
      albumContributorsError: "",
      albumContributorsState: "",
      attemptedUpload: false,
    })
    this.toggleAlbumContributorModal()
  }

  cancelAlbumContributions() {
    this.setState({
      modalAlbumContributions: {},
      modalEditedAlbumContributions: [],
      albumContributorsError: "",
    })
    this.toggleAlbumContributorModal()
  }

  /// SONG CONTRIBUTOR RENDER METHODS ///
  renderSongContributorTags (props, index) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
    return (
      <>
      <span key={key} {...other} >
        <span onClick={() => this.toggleSongContributorModal(index, tag)}>
          {tag.contributor.name} : {tag.type.length > 0 ? tag.type.join(", ").substring(0,15)+'...': "Select Type"}
        </span>

        {!disabled &&
          <a
            className={classNameRemove}
            onClick={(e) => {
              // onRemove(key)
              this.removeSongContributor(index,tag.contributor.artist_id)
            }}
          />
        }
      </span>
      </>
    )
  }

  /// ALBUM CONTRIBUTOR RENDER METHODS ///
  renderAlbumContributorTags (props) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
    return (
      <>
      <span key={key} {...other} >
        <span onClick={() => this.toggleAlbumContributorModal(tag)}>
          {tag.contributor.name} : {tag.type.length > 0 ? tag.type.join(", ").substring(0,15)+'...': "Select Type"}
        </span>

        {!disabled &&
          <a
            className={classNameRemove}
            onClick={(e) => {
              // onRemove(key)
              this.removeAlbumContributor(tag.contributor.artist_id)
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
      var artists = results.data.filter(artist => artist.artist_id !== this.props.artist_id)
      if(artists.length > 0) {
        this.setState({searchResults: artists})
      }
      else {
        this.setState({searchResults: ["No Results."]})
      }
    }
  };

  renderSearchResults(artist) {
    if(artist.name) {
      return (
        <Row style={{color:"black",paddingTop: "10px",cursor: 'pointer',width: "100%"}}>
         <Col xs={4} md={4}>
           <img
           alt="..."
           style={{height:"80%", width: "80%",borderRadius: "50%"}}
           src={artist.ext ? PicsDB+artist.artist_uri+"."+artist.ext : require("assets/portal/img/default-avatar.png")} />
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


  displaySongContributions(row) {
    return (
      <TagsInput
        renderInput={({addTag,...props}) => {
          if(!props.disabled) {
            return (
              <div style={row.contributors.length > 0 ? {position: "absolute"} : {position: "absolute", marginTop: 20}}>
              <Autosuggest
                theme={theme}
                suggestions={this.state.searchResults}
                onSuggestionsFetchRequested={this.searchArtists}
                onSuggestionsClearRequested={() => this.setState({searchResults: []})}
                getSuggestionValue={suggestion => suggestion.name}
                onSuggestionSelected={(e, {suggestion}) => {
                  addTag(suggestion.name)
                  this.addSongContributor(row.index, suggestion)
                }}
                renderSuggestion={(suggestion) => this.renderSearchResults(suggestion)}
                inputProps={{
                  ...props,
                   placeholder: 'Add Contributors...',
                   type: 'search',
                 }}
              />
              </div>
            )
          }
          else {
            return null
          }
        }}
      inputProps={{
          className: 'react-tagsinput-input',
          placeholder: 'Add Contributor',
          disabled: this.state.uploading
      }}
      onChange={() => console.log("Changed")}
      renderTag={props => this.renderSongContributorTags(props,row.index)}
      tagProps={{ className: "react-tagsinput-tag primary", disabled: this.state.uploading }}
      value={row.contributors}
      />
    )
  }

  displayAlbumContributions() {
    return (
      <TagsInput
        renderInput={({addTag,...props}) => {
          if(!props.disabled) {
            return (
              <div style={this.state.albumContributors.length > 0 ? {position: "absolute",left:0} : {position: "absolute", left:0}}>
                <Autosuggest
                  theme={theme}
                  suggestions={this.state.searchResults}
                  onSuggestionsFetchRequested={this.searchArtists}
                  onSuggestionsClearRequested={() => this.setState({searchResults: []})}
                  getSuggestionValue={suggestion => suggestion.name}
                  onSuggestionSelected={(e, {suggestion}) => {
                    addTag(suggestion.name)
                    this.addAlbumContributor(suggestion)
                  }}
                  renderSuggestion={(suggestion) => this.renderSearchResults(suggestion)}
                  inputProps={{
                    ...props,
                     placeholder: 'Search Artists...',
                     type: 'search',
                   }}
                />
              </div>
            )
          }
          else {
            return null
          }
        }}
      inputProps={{
          disabled: this.state.uploading
      }}
      onChange={() => console.log("Changed")}
      renderTag={props => this.renderAlbumContributorTags(props)}
      tagProps={{ className: "react-tagsinput-tag primary", disabled: this.state.uploading }}
      value={this.state.albumContributors}
      />
    )
  }

  render() {

    var columns = [
        {
          id: "title",
          Header: () => (
            <div>
              Title
              {this.state.songNameError ?
                <>
                <MdErrorOutline style={{color: "red", marginLeft: "35px"}} id="name-error"/>
                  <UncontrolledTooltip
                    style={{backgroundColor: "red", color: "white"}}
                    placement="top"
                    target="name-error"
                  >
                    {this.state.songNameError}
                  </UncontrolledTooltip>
                </>
              :
                null
              }
            </div>
          ),
          accessor: row => (
            <>
              <FormGroup id={"SongName"+row.index}>
                <Input
                  placeholder="Song Title"
                  disabled={this.state.uploading}
                  value={row.title}
                  onChange={event => this.editRow(row.index,"title", event.target.value)}
                />
              </FormGroup>
            </>
          ),
          filterable: false,
        },
        {
          id: "contributors",
          Header: () => (
            <>
            <div>
              Contributors
              <AiOutlineQuestionCircle style={{color: "#7248BD", marginLeft: "5px"}} id="contribution-question"/>
              {this.state.songContributionError ?
                <>
                <MdErrorOutline style={{color: "red", marginLeft: "25px"}} id="contribution-error"/>
                  <UncontrolledTooltip
                    style={{backgroundColor: "red", color: "white"}}
                    placement="top"
                    target="contribution-error"
                  >
                    {this.state.songContributionError}
                  </UncontrolledTooltip>
                </>
              :
                null
              }
            </div>
            <UncontrolledTooltip
              style={{backgroundColor: "#7248BD", color: "white"}}
              placement="bottom"
              target="contribution-question"
              hideArrow={true}
            >
              Add other artists that had roll in creating these songs.
            </UncontrolledTooltip>
            </>
          ),
          style: this.state.uploading ? {overflowX:"scroll"} : {paddingTop: 0, marginTop: 0,overflowX:"scroll"},
          accessor: row => this.displaySongContributions(row),
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
                <Input
                  disabled={this.state.uploading}
                  type="checkbox"
                  value={row.explicit}
                  onChange={event => this.editRow(row.index,"explicit", event.target.checked)}
                />
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
                          onImageSelect={this.onImageChange}
                        />
                      </a>
                      <ReactTooltip id="albumArtTooltip" effect='solid' delayShow={1500}>
                        <span>Upload an album cover</span>
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
                        <MdErrorOutline style={{color: "red", marginLeft: "25px"}} id="album-contribution-error"/>
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
                      Add other artists that had roll in creating this album as a whole.
                      </UncontrolledTooltip>
                      <label>Add Album Contributors</label>
                      </Row>
                      {this.displayAlbumContributions(this.state.albumContributors)}
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
                  <div style={{display: 'flex', justifyContent: "center", alignItems: 'center', marginTop: 20}}>
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
                <div style={basestyle}>
                <Dropzone
                  onDrop={this.onDrop}
                  accept="audio/mp3"
                  minSize={0}
                  multiple
                >
                  {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
                    const filesRejected = rejectedFiles.length > 0
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
                    )}
                  }
                </Dropzone>
                </div>
                }
            </CardBody>
          </Card>
        </Col>
      </a>
      <ReactTooltip id="cloudUploadTooltip" effect='solid' delayShow={1500}>
        <span>Click or drag songs into box to upload</span>
      </ReactTooltip>
      {this.state.modalSongContributionsIsOpen ?
        <Modal
          isOpen={this.state.modalSongContributionsIsOpen}
          toggle={this.toggleSongContributorModal}
          className={"modal-dialog"}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggleSongContributorModal}>How did {this.state.modalSongContribution.contributor.name} contribute to this song?</ModalHeader>
          <ModalBody>
            {this.contributionTypes.map(type => (
              <FormGroup check style={{marginLeft: "30px"}}>
                <Label check>
                  <Input
                    type="checkbox"
                    disabled={this.state.uploading}
                    defaultChecked={this.state.modalEditedSongContributions.filter(x=>x===type).length>0}
                    onClick={() => this.toggleSongContributonType(type)}
                  />
                  <span className="form-check-sign" style={{color: "black"}}>
                    {type}
                  </span>
                </Label>
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveSongContributions}>Save</Button>
            <Button color="danger" onClick={this.cancelSongContributions}>Cancel</Button>
          </ModalFooter>
        </Modal>
      :
        null
      }
      {this.state.modalAlbumContributionsIsOpen ?
        <Modal
          isOpen={this.state.modalAlbumContributionsIsOpen}
          toggle={this.toggleAlbumContributorModal}
          className={"modal-dialog"}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggleAlbumContributorModal}>How did {this.state.modalAlbumContributions.contributor.name} contribute to this album?</ModalHeader>
          <ModalBody>
            {this.contributionTypes.map(type => (
              <FormGroup check style={{marginLeft: "30px"}}>
                <Label check>
                  <Input
                    type="checkbox"
                    disabled={this.state.uploading}
                    defaultChecked={this.state.modalEditedAlbumContributions.filter(x=>x===type).length>0}
                    onClick={() => this.toggleAlbumContributonType(type)}
                  />
                  <span className="form-check-sign"  style={{color: "black"}}>
                    {type}
                  </span>
                </Label>
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveAlbumContributions}>Save</Button>
            <Button color="danger" onClick={this.cancelAlbumContributions}>Cancel</Button>
          </ModalFooter>
        </Modal>
      :
        null
      }
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
    uploadAlbum: (name, image, type, contributors, ongs, uploadStatusFn) =>dispatch(uploadAlbum(name, image, type, contributors, ongs, uploadStatusFn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumUpload)
