import React, {Component} from 'react';
import classNames from "classnames";
import PropTypes from "prop-types";

import ReactTooltip from 'react-tooltip';
import { Card, CardBody, Form, FormGroup, Row, Col, UncontrolledTooltip,} from "reactstrap";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';

import TextInput from "components/Inputs/TextInput.jsx";
import Select from "components/Inputs/Select.jsx";
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import ContributorTags from "components/Inputs/ContributorTags.jsx";
import { logEvent } from 'amplitude/amplitude';


class AlbumCard extends Component {

  constructor(props) {
      super(props);
  }

  onBlur(fieldName) {
    if(window.location.pathname === "/dashboard/uploads/new") {
      logEvent("New Upload", "Album Field Edited", {Field: fieldName})
    }
    else {
      logEvent("Edit Album", "Album Field Edited", {Field: fieldName})
    }
  }

  render() {

    var albumTypes = [
      {
        value: "",
        isDisabled: true
      },
      { value: "2", label: "Album" },
      { value: "3", label: "Single" },
      { value: "4", label: "EP" },
    ]

    return (
      <Card className="card-gray">
        <CardBody>
          <Row>
            <Col md="4" lg="4" style={{alignItems: "center", justifyContent: "center", margin: 20}}>
                <a data-tip data-for="albumArtTooltip">
                  <ImageUpload
                    defaultImage={require("assets/portal/img/album-img.jpg")}
                    uploadedImage={this.props.album.images.length > 0 ? this.props.album.images[1] : null}
                    btnText="Change Album Art"
                    addBtnColor="primary"
                    changeBtnColor="default"
                    disabled={this.props.disableEditing}
                    onImageSelect={(file) => this.props.onEditAlbum(file, "setImage")}
                  />
                </a>
                {this.props.album.errors.filter(error => error.location === "image").length > 0 ? (
                  <label style={{color: "red", display: "block", textAlign: "center"}} className="error">
                    {this.props.album.errors.filter(error => error.location === "image")[0].message}
                  </label>
                ) : null}
                <ReactTooltip id="albumArtTooltip" effect='solid' delayShow={1500}>
                  <span>For best results, please use an image that is square and at least 750x750 pixels.</span>
                </ReactTooltip>
            </Col>
            <Col md="6">
              <Form className="form">
                <TextInput
                  value={this.props.album.name}
                  placeholder="Album Name"
                  disabled={this.props.disableEditing}
                  onChange={e => this.props.onEditAlbum(e.target.value, "setName")}
                  onBlur={() => this.onBlur("Name")}
                  errorMessage={this.props.album.errors.filter(error => error.location === "name").length > 0 ? this.props.album.errors.filter(error => error.location === "name")[0].message : ""}
                />
                <Select
                  value={this.props.album.type ? albumTypes.filter(x => x.label === this.props.album.type)[0] : null}
                  placeholder="Album Type"
                  disabled={this.props.disableEditing}
                  onChange={option => this.props.onEditAlbum(option.label, "setType")}
                  onBlur={() => this.onBlur("Type")}
                  options={albumTypes}
                  errorMessage={this.props.album.errors.filter(error => error.location === "type").length > 0 ? this.props.album.errors.filter(error => error.location === "type")[0].message : ""}
                />
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
                    contributions={this.props.album.contributors}
                    artist_id={this.props.artist_id}
                    onAddContributor={contributor => this.props.onEditAlbum(contributor, "addContributor")}
                    onRemoveContributor={contributor => this.props.onEditAlbum(contributor, "removeContributor")}
                    updateContributionTypes={contributor => this.props.onEditAlbum(contributor, "updateContribution")}
                    disabled={this.props.disableEditing}
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

AlbumCard.propTypes = {
  album: PropTypes.object.isRequired,                      // represents current user and is needed in order to exclude form search results
  disableEditing: PropTypes.bool,                         // Determines whether or not to show "Edit", "Delete", etc
  onEditAlbum: PropTypes.func,               // function that is called whenever edit button is clicked
};

AlbumCard.defaultProps = {
  isPlaying: false,
  disableEditing: false,
};

export default AlbumCard
