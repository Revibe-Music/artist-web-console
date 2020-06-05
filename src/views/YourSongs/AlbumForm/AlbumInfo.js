import React, {Component} from 'react';
import classNames from "classnames";
import ReactTooltip from 'react-tooltip';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';
import { Form, FormGroup, Input, Row, Col, UncontrolledTooltip} from "reactstrap";
import { connect } from 'react-redux';

import EditAlbumCard from "components/Cards/EditAlbumCard.jsx";

import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import ContributorTags from "components/Inputs/ContributorTags.jsx";
import Album from 'models/Album.js'
import TextInput from "components/Inputs/TextInput.jsx";
import Select from "components/Inputs/Select.jsx";
import { logEvent } from 'amplitude/amplitude';


class AlbumInfo extends Component {

  constructor(props) {
      super(props);
      this.editAlbum = this.editAlbum.bind(this)
  }

  editAlbum(values, callback) {
    values = values !== "array" ? [values] : values
    var album = this.props.album
    album[callback](...values)
    this.props.onAlbumChange(album)
  }

  isValidated = () => {
    var album = this.props.album
    album.clearErrors()
    album.validate()
    if(album.errors.length > 0) {
      logEvent("New Upload", "Album Field Error", {Fields: album.errors.map(x => x.location)})
    }
    this.props.onAlbumChange(album)
    return album.isValid()
  };


  render() {

    return (
      <>
        <h1 align="center">Create an album</h1>
        <EditAlbumCard
          album={this.props.album}
          onEditAlbum={this.editAlbum}
        />
      {/*<Row>
          <Col className="m-auto m-auto" md="4">
            <Row>
              <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <a data-tip data-for="albumArtTooltip">
                  <ImageUpload
                    defaultImage={require("assets/portal/img/album-img.jpg")}
                    uploadedImage={null}
                    btnText="Album Art"
                    addBtnColor="primary"
                    changeBtnColor="default"
                    onImageSelect={(file) => this.editAlbum(file, "setImage")}
                  />
                </a>
                <ReactTooltip id="albumArtTooltip" effect='solid' delayShow={1500}>
                  <span>For best results, please use an image that is square and at least 750x750 pixels.</span>
                </ReactTooltip>
              </div>
            </Row>
            <Row style={{display: "flex",alignItems: "center", justifyContent: "center",textAlign: "center"}}>
            {this.props.album.errors.filter(error => error.location === "image").length > 0 ? (
              <label style={{color: "red"}} className="error">
                {this.props.album.errors.filter(error => error.location === "image")[0].message}
              </label>
            ) : null}
            </Row>
          </Col>
          <Col className="m-auto mr-auto" md="6">
            <Form className="form">
              <TextInput
                placeholder="Album Name"
                value={this.props.album.name}
                onChange={e => this.editAlbum(e.target.value, "setName")}
                onBlur={() => logEvent("New Upload", "Album Field Edited", {Field: "Name"})}
                errorMessage={this.props.album.errors.filter(error => error.location === "name").length > 0 ? this.props.album.errors.filter(error => error.location === "name")[0].message : ""}
              />
              <div style={{marginTop: "30px"}}>
                <Select
                  className="react-select primary"
                  classNamePrefix="react-select"
                  placeholder="Album Type"
                  value={this.props.album.type ? albumTypes.filter(x => x.label === this.props.album.type)[0] : null}
                  onChange={option => this.editAlbum(option.label, "setType")}
                  onBlur={() => logEvent("New Upload", "Album Field Edited", {Field: "Type"})}
                  options={albumTypes}
                  errorMessage={this.props.album.errors.filter(error => error.location === "type").length > 0 ? this.props.album.errors.filter(error => error.location === "type")[0].message : ""}
                />
              </div>

              <FormGroup style={{marginTop: "30px", marginBottom: "30px"}}>
                <Row>
                  {this.props.album.errors.filter(error => error.location === "contributors").length > 0 ? (
                    <>
                    <MdErrorOutline style={{color: "red", marginRight: "25px"}} id="album-contribution-error"/>
                      <UncontrolledTooltip
                        style={{backgroundColor: "red", color: "white"}}
                        placement="top"
                        target="album-contribution-error"
                      >
                        {this.props.album.errors.filter(error => error.location === "contributors")[0].message}
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
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>*/}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    artist_id: state.authentication.user.artistId,
  }
};

// export default connect(mapStateToProps, null, null, { forwardRef: true })(AlbumInfo);
export default AlbumInfo
