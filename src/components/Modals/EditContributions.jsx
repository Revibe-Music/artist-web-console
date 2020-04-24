import React, { Component, useState } from 'react';
import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input ,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import Select from "react-select";
import { FaTimes, FaUserPlus } from "react-icons/fa";

import RevibeAPI from 'api/revibe.js';

const revibe = new RevibeAPI()
const PicsDB = "https://revibe-media-test.s3.amazonaws.com/media/images/Artist/"


class EditContributions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      searched: false,
      searchResults: [],
      contributions: []
    }

    this.contributionTypes = [
      {
        value: "",
        isDisabled: true
      },
      { value: "2", label: "Artist " },
      { value: "3", label: "Feature " },
      { value: "3", label: "Producer" },
      { value: "4", label: "Song Writer" },
      { value: "5", label: "Audio Engineer" },
      { value: "6", label: "Graphic Designer" },
      { value: "7", label: "Videographer" },
    ]

    this.toggle = this.toggle.bind(this)
    this.displaySearch = this.displaySearch.bind(this)
    this.displayContributors = this.displayContributors.bind(this)
    this.addContributor = this.addContributor.bind(this)
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen, searchResults: [], searched: false})
  }

  async searchArtists(query) {
    if(query.length > 0) {
      var results = await revibe.searchArtists(query)
      this.setState({searchResults: results.artists, searched:true})
    }
  }

  addContributor(contributor) {
    if(this.state.contributions.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id) == -1) {
      this.setState({contributions: [...this.state.contributions, {contributor: contributor, type: null}]})
    }

  }

  removeContributor(artist_id) {
     var index = this.state.contributions.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
     this.setState({
      contributions: [
        ...this.state.contributions.slice(0, index),
        ...this.state.contributions.slice(index+1)
      ]})
  }

  addContributonType(artist_id, type) {
    var index = this.state.contributions.map(function(x) {return x.contributor.artist_id; }).indexOf(artist_id)
    const editedContribution = { contributor: this.state.contributions[index].contributor, type: type }
    var contributions = this.state.contributions.map((contribution) => (
      contribution.contributor.artist_id===artist_id ? editedContribution: contribution
    ))
    this.setState({contributions: contributions})

  }

  displaySearch() {
    if(this.state.searched) {
      if(this.state.searchResults.length > 0) {
        return (
          <ListGroup>
            {
              this.state.searchResults.map(artist => (
                <Row
                  style={{color:"black",paddingTop: "10px",cursor: 'pointer'}}
                  onClick={() => this.addContributor(artist)}
                >
                  <Col xs={2} md={2}>
                    <div className="photo">
                      <img
                      alt="..."
                      style={{height:"40px", width: "40px", borderRadius: "50%"}}
                      src={artist.ext ? PicsDB+artist.artist_uri+"."+artist.ext : require("assets/img/default-avatar.png")} />
                    </div>
                  </Col>
                  <Col style={{textAlign: "left"}} xs={8} md={8}>
                    {artist.name}
                  </Col>
                </Row>
              ))
            }
          </ListGroup>
        )
      }
      return (
        <h4 style={{color:"black"}}>No Results</h4>
      )
    }
    return
  }

  displayContributors() {
    if(this.state.contributions.length > 0) {
      return (
        <div>
          <h4 style={{color:"black", paddingTop: "15px", paddingBottom: "15px"}}> Contributors </h4>
          <ListGroup>
            {
              this.state.contributions.map(contribution => (
                <Row style={{color:"black",paddingTop: "10px"}}>
                  <a onClick={() => this.removeContributor(contribution.contributor.artist_id)}>
                    <FaTimes style={{fontSize: "20px", color: "red"}} />
                  </a>
                  <Col xs={2} md={2}>
                    <div className="photo">
                      <img
                      alt="..."
                      style={{height:"40px", width: "40px", borderRadius: "50%"}}
                      src={contribution.contributor.ext ? PicsDB+contribution.contributor.artist_uri+"."+contribution.contributor.ext : require("assets/img/default-avatar.png")} />
                    </div>
                  </Col>
                  <Col style={{textAlign: "left"}} xs={4} md={4}>
                    {contribution.contributor.name}
                  </Col>
                  <Col xs={5} md={5}>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      isMulti={false}
                      placeholder="Type"
                      closeMenuOnSelect={true}
                      defaultValue={this.contributionTypes.filter(option => option.label === contribution.type)}
                      onChange={value => this.addContributonType(contribution.contributor.artist_id, value.label)}
                      options={this.contributionTypes}
                    />
                  </Col>
                </Row>
              ))
            }
          </ListGroup>
        </div>
      )
    }
    return
  }



  render() {
    return (
      <div>
        <FaUserPlus style={{color: "green", cursor: 'pointer',fontSize: "20px"}} onClick={this.toggle} />
        <Modal
          isOpen={this.state.isOpen}
          toggle={this.toggle}
          className={""}
          backdrop={true}
        >
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i style={{color: "#7482BD"}} className="tim-icons icon-zoom-split" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              style={{color: "black"}}
              className="form-control"
              type="text"
              placeholder="Search Artists..."
              onChange={event => this.searchArtists(event.target.value)}
            />
            </InputGroup>
            {this.displaySearch()}
            {this.displayContributors()}
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default EditContributions;
