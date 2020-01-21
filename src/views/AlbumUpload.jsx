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
  CardBody,
  CardTitle,
  Label,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import ReactTable from "react-table";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import Lottie from 'react-lottie';
import ReactTooltip from 'react-tooltip';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';
import { connect } from 'react-redux';

import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import SongSelect from "components/SongSelect.js";
import ContributorTags from "components/ContributorTags.js";
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

      };

      // Table Edit Methods
      this.editRow = this.editRow.bind(this)
      this.removeRow = this.removeRow.bind(this)
      this.onDrop = this.onDrop.bind(this)

      // Album Edit/State Methods
      this.onImageChange = this.onImageChange.bind(this)
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
    var songs = [...this.state.songs]
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
    if(isNaN(newData[index].duration)){
      this.setState({songDurationError: ""})
    }
    if(isNaN(newData[index].quality)){
      this.setState({songQualityError: ""})
    }
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
      if(isNaN(this.state.songs[x].duration)) {
        this.setState({songDurationError: "Song does not have valid duration."});
        validFields = false
      }
      if(isNaN(this.state.songs[x].quality)) {
        this.setState({songQualityError: "Song does not have valid bitrate."});
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
        console.log(this.state.albumContributors);
        this.props.uploadAlbum(this.state.albumName, this.state.albumImage, this.state.albumType, this.state.albumContributors, this.state.songs, this.editRow)
      }
    }
    this.setState({attemptedUpload:true})
  }



  /// SONG CONTRIBUTOR OPRERATIONS ///
  addSongContributor(contributor, song) {
    var newSongs = [ ...this.state.songs]
    newSongs[song.index].contributors.push({contributor: contributor, type: []})
    this.setState({songs: newSongs})
  }

  removeSongContributor(contributor, song) {
    var newSongs = [ ...this.state.songs]
    var contributorIndex = newSongs[song.index].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id)
    newSongs[song.index].contributors.splice(contributorIndex, 1)
    this.setState({songs: newSongs})
  }

  updateSongContributions(contribution, song) {
    var newSongs = [ ...this.state.songs]
    var contributorIndex = newSongs[song.index].contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contribution.contributor.artist_id)
    newSongs[song.index].contributors[contributorIndex] = contribution
    this.setState({
      songs: newSongs,
      songContributionError: "",
      attemptedUpload: false,
    })
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
              Tag other artists that had a roll
            </UncontrolledTooltip>
            </>
          ),
          style: this.state.uploading ? {overflowX:"scroll"} : {paddingTop: 0, marginTop: 0,overflowX:"scroll"},
          accessor: row => (
            <ContributorTags
              artist_id={this.props.artist_id}
              owner={row}
              onAddContributor={this.addSongContributor}
              onRemoveContributor={this.removeSongContributor}
              updateContributionTypes={this.updateSongContributions}
              disabled={this.state.uploading}
            />
          ),
          filterable: false,
          width: 200
        },
        {
          id: "duration",
          Header: () => (
            <div>
              Duration
              {this.state.songDurationError ?
                <>
                <MdErrorOutline style={{color: "red", marginLeft: "35px"}} id="duration-error"/>
                  <UncontrolledTooltip
                    style={{backgroundColor: "red", color: "white"}}
                    placement="top"
                    target="duration-error"
                  >
                    {this.state.songDurationError}
                  </UncontrolledTooltip>
                </>
              :
                null
              }
            </div>
          ),
          accessor: row => this.formatDuration(row.duration),
          filterable: false
        },
        {
          id: "quality",
          Header: () => (
            <div>
              Quality
              {this.state.songQualityError ?
                <>
                <MdErrorOutline style={{color: "red", marginLeft: "35px"}} id="quality-error"/>
                  <UncontrolledTooltip
                    style={{backgroundColor: "red", color: "white"}}
                    placement="top"
                    target="quality-error"
                  >
                    {this.state.songQualityError}
                  </UncontrolledTooltip>
                </>
              :
                null
              }
            </div>
          ),
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
                      Tag other artists that had a roll
                      </UncontrolledTooltip>
                      <label>Add Album Contributors</label>
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
          </Card>
        </Col>
      <a data-tip data-for="cloudUploadTooltip">
        <Col className="m-auto mr-auto">
          <Card>
            <CardBody>
              <CardTitle tag="h4">Upload Songs</CardTitle>
                <p>*Please note that we only accept MP3 files at this time.</p>
                {this.state.songs.length > 0 ?
                  <>
                  <ReactTable
                    data={this.state.songs}
                    resizable={true}
                    columns={columns}
                    defaultPageSize = { this.state.songs.length > 20 ? 20 : this.state.songs.length }
                    pageSize = { this.state.songs.length > 20 ? 20 : this.state.songs.length }
                    showPagination  = { this.state.songs.length > 20 ? true : false}
                    showPageSizeOptions = {false}

                    defaultPageSize={this.state.songs.length}
                    showPagination={false}
                    className="-striped -highlight"
                  />
                  <SongSelect onFileSelect={this.onDrop} disabled={this.props.uploading} displayDropzone={false}/>
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
