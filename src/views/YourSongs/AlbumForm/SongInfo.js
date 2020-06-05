import React, {Component} from 'react';
import classNames from "classnames";

// reactstrap components
import TagsInput from "react-tagsinput";
import Select from "react-select";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';
import { Button, Card, Collapse, CardHeader, CardBody, CardTitle, Label, Form, FormGroup, Input, Row, Col, UncontrolledTooltip} from "reactstrap";
import { connect } from 'react-redux';

import SongSelect from "components/SongSelect.js";
import SongUploadCard from "components/Cards/SongUploadCard.js";
import SongCard from "components/Cards/SongCard.jsx";

import ContributorTags from "components/Inputs/ContributorTags.jsx";
import ContributionWarning from "components/Modals/ContributionWarning.js";
import FileExtensionWarning from "components/Modals/FileExtensionWarning.js";
import Song from 'models/Song.js'
import { logEvent } from 'amplitude/amplitude';
const musicMetadata = require('music-metadata-browser');


class SongInfo extends Component {

  constructor() {
      super();
      this.state = {
        songs: [],
        uploading: false,
        openedCollapses: [],

        showContributionWarning: false,
        ignoreContributionWarning: false,
        contributionWarningOccurances: 0,

        showFileExtensionWarning: false,
        ignoreFileExtensionWarning: false,
        fileExtensionWarningOccurances: 0,

        playingSongId: "",
        playing: false
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

  }

  componentDidMount() {
    this.props.onSongsChange(this.state.songs)
  }


  async onDrop(files) {
    var songs = [...this.state.songs]
    var songAccordians = [...this.state.openedCollapses]
    for(var x=0; x<files.length; x++) {
      var metadata = await musicMetadata.parseBlob(files[x]);
      var formattedSong = {
        id: Math.floor(Math.random() * 1000000000),       // temp id for referening
        title: metadata.common.title ? metadata.common.title : files[x].name,
        duration: Math.round(metadata.format.duration),
        file: files[x],
        explicit: false,
        contributors: [],
        genres: [],
        tags: [],
        displayed: true,
        error: "",
        state: ""
      }
      var song = new Song(formattedSong)
      song.formatTitle()
      songs.push(song)
      songAccordians.push(`collapse${formattedSong.id}`)
    }
    songs = songs.map((song, index) => {
      song.order = index
      return song
    })
    this.setState({songs:songs, openedCollapses: songAccordians})
    this.props.onSongsChange(songs)
    logEvent("New Upload", "Song File Selected")
  }

  editSong(songId, values, callback) {
    values = values !== "array" ? [values] : values
    var songs = [... this.state.songs]
    var index = songs.map(function(x) {return x.id; }).indexOf(songId)
    songs[index][callback](...values)
    this.setState({songs: songs})
    this.props.onSongsChange(songs)
  }

  removeSong(songId) {
    var songs = [... this.state.songs]
    var index = songs.map(function(x) {return x.id; }).indexOf(songId)
    songs.splice(index, 1)
    songs = songs.map((song, index) => {
      song.order = index
      return song
    })
    this.setState({songs: songs})
    this.props.onSongsChange(songs)
  }


  // with this function we create an array with the opened collapses
  // it is like a toggle function for all collapses from this page
  toggleSong = (e, collapse) => {
    e.preventDefault();
    let openedCollapses = this.state.openedCollapses;
    if (openedCollapses.includes(collapse)) {
      this.setState({openedCollapses: openedCollapses.filter(item => item !== collapse)});
    }
    else {
      this.setState({openedCollapses: [...openedCollapses, collapse]});
    }
  };

  isValidated = () => {
    if(this.state.songs.length < 1) return false
    var isValid = true
    var showContributionWarning = false
    var contributionWarningOccurances = 0
    var showFileExtensionWarning = false
    var fileExtensionWarningOccurances = 0
    var songs = [...this.state.songs]
    for(var x=0; x<songs.length; x++) {
      songs[x].clearErrors()
      songs[x].validate()

      if (this.fileExtensionTests.some(fileExtension=>songs[x].title.toLowerCase().includes(fileExtension))) {
        if(!this.state.ignoreFileExtensionWarning) {
          showFileExtensionWarning = true
          fileExtensionWarningOccurances ++

          var isValid = false
        }
      }
      if (this.contributionStringTests.some(contributionString => songs[x].title.toLowerCase().includes(contributionString))) {
        if(!this.state.ignoreContributionWarning) {
          showContributionWarning=true
          contributionWarningOccurances++
        }
      }
      isValid = !isValid ? isValid : songs[x].isValid()
      if(songs[x].errors.length > 0) {
        logEvent("New Upload", "Song Field Error", {Fields: songs[x].errors.map(x => x.location)})
      }
    }
    this.setState({songs: songs})
    if(showFileExtensionWarning) {
      this.setState({showFileExtensionWarning: showFileExtensionWarning, fileExtensionWarningOccurances: fileExtensionWarningOccurances})
      return false
    }
    if(showContributionWarning) {
      this.setState({showContributionWarning: showContributionWarning, contributionWarningOccurances: contributionWarningOccurances})
      return false
    }
    return isValid
  }

  playSong(song) {
    if(song.id === this.state.playingSongId) {
      if(this.state.playing) {
        this.audio.pause()
        logEvent("New Upload", "Pause Song")
      }
      else {
        this.audio.play()
        logEvent("New Upload", "Resume Song")
      }
      this.setState({playing: !this.state.playing})
    }
    else {
      if(this.audio) {
        this.audio.pause()
        this.audio = null
      }
      if(song.file) {
        var url = URL.createObjectURL(song.file);
        this.audio = new Audio(url)
        this.audio.play()
        this.setState({playingSongId: song.id, playing: true})
      }
      logEvent("New Upload", "Play Song")
    }
  }

  render() {
    return (
      <>
        <h1 align="center">Let's add some songs</h1>
        <SongUploadCard onFileSelect={this.onDrop}/>
        {this.state.songs.map((song, index) => (
          <div style={{marginTop: "30px"}}>
            <SongCard
              song={song}
              onPlaySong={() => this.playSong(song)}
              isPlaying={this.state.playingSongId===song.id && this.state.playing}
              onDeleteClicked={() => this.removeSong(song.id)}
              onEditSong={this.editSong}
              displayStreams={false}
              defaultCollapseState={false}
            />
          </div>
        ))}

      <ContributionWarning
        show={this.state.showContributionWarning}
        objectType="song"
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

// <p>*Please note that we only accept MP3, MP4, WAV, FLAC, and OGG files at this time.</p>
// {this.state.songs.length > 0 ?
//   <>
//   <div
//     aria-multiselectable={true}
//     className="card-collapse"
//     id="accordion"
//     role="tablist"
//   >
//     {this.state.songs.map((song, index) => (
//       <Card className="card-plain">
//         <CardHeader role="tab">
//             <CardTitle tag="h4">
//               <div style={{float: "left", marginRight: "5%"}} >
//                 <div style={{float: "left"}} >
//                   <i style={{fontSize: "20px", cursor: 'pointer', color: "red"}} className="tim-icons icon-simple-remove" onClick={() => this.removeSong(song.id)}/>
//                 </div>
//                 <div style={{float: "right"}} >
//                   {song.errors.length > 0 ?
//                     <>
//                       <MdErrorOutline style={{color: "red", marginLeft: "35px"}} id={`Song-${song.id}-error`}/>
//                       <UncontrolledTooltip
//                         style={{backgroundColor: "red", color: "white"}}
//                         placement="top"
//                         target={`Song-${song.id}-error`}
//                       >
//                         <ul>
//                           {song.errors.map(error => {
//                             return (
//                               <li>{error.message}</li>
//                             )
//                           })}
//                         </ul>
//                       </UncontrolledTooltip>
//                     </>
//                   :
//                     null
//                   }
//                 </div>
//               </div>
//               <a
//                 aria-expanded={this.state.openedCollapses.includes(`collapse${song.id}`)}
//                 data-parent="#accordion"
//                 data-toggle="collapse"
//                 style={{cursor: "pointer"}}
//                 onClick={e => this.toggleSong(e, `collapse${song.id}`)}
//               >
//
//               {song.title.trim() ? song.displayTitle() : "Song Title"}
//               <i className="tim-icons icon-minimal-down" />
//               </a>
//             </CardTitle>
//         </CardHeader>
//         <Collapse
//           role="tabpanel"
//           isOpen={this.state.openedCollapses.includes(`collapse${song.id}`)}
//         >
//           <CardBody>
//             <Row>
//               <Col xs="12" md="6">
//                 <FormGroup id={"SongName:"+song.id}>
//                   <div>Title</div>
//                   <Input
//                     disabled={this.state.uploading}
//                     value={song.title}
//                     onChange={event => this.editSong(song.id, event.target.value, "setTitle")}
//                   />
//                 </FormGroup>
//               </Col>
//               <Col xs="12" md="6">
//                   <div>
//                     Contributors
//                     <AiOutlineQuestionCircle style={{color: "#7248BD", marginLeft: "5px"}} id={`contribution-question${song.id}`}/>
//                   </div>
//                   <ContributorTags
//                     artist_id={this.props.artist_id}
//                     onAddContributor={contributor => this.editSong(song.id, contributor, "addContributor")}
//                     onRemoveContributor={contributor => this.editSong(song.id, contributor, "removeContributor")}
//                     updateContributionTypes={contributor => this.editSong(song.id, contributor, "updateContribution")}
//                     disabled={this.state.uploading}
//                   />
//                   <UncontrolledTooltip
//                     style={{backgroundColor: "#7248BD", color: "white"}}
//                     placement="top"
//                     target={`contribution-question${song.id}`}
//                     hideArrow={true}
//                   >
//                     Tag others (by their display name) that had a roll in creating this song.
//                   </UncontrolledTooltip>
//               </Col>
//             </Row>
//
//             <Row style={{marginTop: "10px"}}>
//               <Col xs="12" md="5">
//                 <FormGroup>
//                   <div>Genres (optional)</div>
//                   <Select
//                     className="react-select primary"
//                     classNamePrefix="react-select"
//                     placeholder="None"
//                     name="multipleSelect"
//                     closeMenuOnSelect={true}
//                     isMulti={true}
//                     isDisabled={this.state.uploading}
//                     onChange={options => this.editSong(song.id, options.map(x => x.label), "setGenres")}
//                     options={this.genreOptions.map((genre, index) => ({ value: index, label: genre }))}
//                   />
//                 </FormGroup>
//               </Col>
//               <Col xs="8" md="5">
//                 <div>Tags (optional)</div>
//                 <TagsInput
//                   onlyUnique={true}
//                   inputProps={{
//                       placeholder: 'Add Tag',
//                       disabled: this.props.disabled,
//                       onFocus: () => this.setState({[song.id+"tagInputColor"]: "#7248BD"}),
//                       onBlur: () => this.setState({[song.id+"tagInputColor"]: "#2b3553"})
//                   }}
//                   renderLayout={(tagComponents, inputComponent) => (
//                     <div style={{border: `1px solid ${this.state[song.id+"tagInputColor"] ?this.state[song.id+"tagInputColor"] : "#2b3553"}`, fontSize: "0.75rem",  borderRadius: "0.4285rem", marginBottom: "5px",paddingTop: "7px",paddingBottom: "7px", transition: "color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out"}}>
//                       <Row>
//                         <Col xs="6" md="4">
//                           {inputComponent}
//                         </Col>
//                         <Col xs="6" md="8">
//                           {tagComponents}
//                       </Col>
//                       </Row>
//                     </div>
//                   )}
//                   onChange={tags => this.editSong(song.id, tags, "setTags")}
//                   tagProps={{ className: "react-tagsinput-tag primary", disabled: this.props.disabled }}
//                   value={song.tags}
//                 />
//               </Col>
//               <Col xs="4" md="2" style={{flex: 1, alignItems: "center", justifyContent: "center", textAlign: "center",padding: 0,margin:0}}>
//                 <div>Explicit</div>
//                 <FormGroup check style={{marginTop: 0}}>
//                 <Label check>
//                   <Input
//                     disabled={this.state.uploading}
//                     type="checkbox"
//                     value={song.explicit}
//                     onChange={event => this.editSong(song.id, event.target.checked, "setExplicit")}
//                   />
//                   <span className="form-check-sign" />
//                 </Label>
//               </FormGroup>
//               </Col>
//             </Row>
//
//
//           </CardBody>
//         </Collapse>
//       </Card>
//     ))}
//   </div>
//   <SongSelect
//     onFileSelect={(files) => {
//       this.onDrop(files)
//       logEvent("New Upload", "File Selected", {Method: "Finder"})
//     }}
//     disabled={this.state.uploading}
//     displayDropzone={false}/>
//   </>
// :
// <SongSelect
//   onFileSelect={(files) => {
//     this.onDrop(files)
//     logEvent("New Upload", "File Selected", {Method: "Dropped"})
//   }}
// />
// }

function mapStateToProps(state) {
  return {
    artist_id: state.authentication.user.artistId,
  }
};

// export default connect(mapStateToProps)(SongInfo)
export default SongInfo
