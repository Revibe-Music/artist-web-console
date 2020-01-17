import React, {Component} from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

// reactstrap components
import {
  FormGroup,
  Label,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import TagsInput from "react-tagsinput";
import Autosuggest from 'react-autosuggest';
import { compact } from 'lodash';

import RevibeAPI from '../api/revibe.js';
import { API_STORAGE } from 'api/config.js'

const revibe = new RevibeAPI()


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


class ContributorTags extends Component {

  constructor() {
      super();
      this.state = {
        searchResults: [],
        contributions: [],

        // Contribution Modal
        IsOpen: false,
        selectedContribution: {},
        editedContributionTypes: [],

      };

      // Contribution Methods
      this.addContributor = this.addContributor.bind(this)
      this.renderSearchResults = this.renderSearchResults.bind(this)
      this.searchArtists = this.searchArtists.bind(this)

      // Modal Methods
      this.toggleModal = this.toggleModal.bind(this)
      this.toggleContributonType = this.toggleContributonType.bind(this)
      this.modalSaveButtonPressed = this.modalSaveButtonPressed.bind(this)
      this.modalCancelButtonPressed = this.modalCancelButtonPressed.bind(this)
      this.contributionHasBeenSelected = this.contributionHasBeenSelected.bind(this)
  }


  /// CONTRIBUTION MODAL OPERATIONS ///
  toggleModal(contribution=null) {
    var updatedState = {isOpen: !this.state.isOpen}
    if(contribution) {
      updatedState.selectedContribution = contribution
      updatedState.editedContributionTypes = contribution.type
    }
    else {
      updatedState.selectedContribution = {}
      updatedState.editedContributionTypes = []
    }
    this.setState(updatedState)
  }

  toggleContributonType(type) {
    if(this.state.editedContributionTypes.filter(x => x === type).length > 0) {
      // contribution has already been added, need to remove
      this.setState({editedContributionTypes: compact(this.state.editedContributionTypes.map(function(x) {if(x !== type) return x}))})
    }
    else {
      // contribution needs to be added
      this.setState({editedContributionTypes: [...this.state.editedContributionTypes, type]})
    }
  }

  contributionHasBeenSelected(type) {
    // check whether contribution has type
    var contributorIndex = this.state.contributions.map(function(x) {return x.contributor.artist_id; }).indexOf(this.props.artist_id)
    return this.state.contributions[contributorIndex].type.filter(x=>x===type).length>0
  }

  modalSaveButtonPressed() {
    var contributorIndex = this.state.contributions.map(function(x) {return x.contributor.artist_id; }).indexOf(this.state.selectedContribution.contributor.artist_id)
    var contribution = this.state.contributions[contributorIndex]
    contribution.type = this.state.editedContributionTypes
    this.props.updateContributionTypes(contribution, this.props.owner)
    this.toggleModal()
  }

  modalCancelButtonPressed() {
    this.toggleModal()
  }

  validateContributions() {
    for(var i=0; i<this.state.contributions.length; i++) {
      if(this.state.contributions[i].type.length < 1) {
        return false
      }
    }
    return true
  }


  /// CONTRIBUTOR RENDER METHODS ///
  renderTags (props) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
    return (
      <span key={key} {...other} >
        <span onClick={() => this.toggleModal(tag)}>
          {tag.contributor.name} : {tag.type.length > 0 ? tag.type.join(", ").substring(0,15)+'...': "Select Type"}
        </span>

        {!disabled &&
          <a
            className={classNameRemove}
            onClick={(e) => {
              this.removeContributor(tag.contributor)
            }}
          />
        }
      </span>
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
           src={artist.ext ? `${API_STORAGE}Artist/${artist.artist_uri}.${artist.ext}` : require("assets/portal/img/default-avatar.png")} />
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

  addContributor(contributor) {
    var contributorIndex = this.state.contributions.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id)
    if(contributorIndex == -1) {
        this.setState({contributions: [...this.state.contributions, {contributor: contributor, type: []}]})
        this.props.onAddContributor(contributor, this.props.owner)
        this.toggleModal({contributor: contributor, type: []})
    }
  }

  removeContributor(contributor) {
    var contributions = [...this.state.contributions]
    var contributorIndex = contributions.map(function(x) {return x.contributor.artist_id; }).indexOf(contributor.artist_id)
    contributions.splice(contributorIndex, 1)
    this.setState({contributions: contributions})
    this.props.onRemoveContributor(contributor, this.props.owner)
  }

  render() {
    return (
      <>
      <TagsInput
        renderInput={({addTag,...props}) => {
          if(!props.disabled) {
            return (
              <div style={this.state.contributions.length > 0 ? {position: "absolute"} : {position: "absolute", marginTop: 20}}>
              <Autosuggest
                theme={theme}
                suggestions={this.state.searchResults}
                onSuggestionsFetchRequested={this.searchArtists}
                onSuggestionsClearRequested={() => this.setState({searchResults: []})}
                getSuggestionValue={suggestion => suggestion.name}
                onSuggestionSelected={(e, {suggestion}) => {
                  addTag(suggestion.name)
                  this.addContributor(suggestion)
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
          disabled: this.props.disabled
      }}
      onChange={() => console.log()}
      renderTag={props => this.renderTags(props)}
      tagProps={{ className: "react-tagsinput-tag primary", disabled: this.props.disabled }}
      value={this.state.contributions}
      />

      {this.state.isOpen ?
        <Modal
          isOpen={this.state.isOpen}
          toggle={this.toggleModal}
          modalClassName="modal-grey"
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggleModal}>How did {this.state.selectedContribution.contributor.name} contribute to this song?</ModalHeader>
          <ModalBody>
            {this.props.contributionTypes.map(type => (
              <FormGroup check style={{marginLeft: "30px"}}>
                <Label check>
                  <Input
                    type="checkbox"
                    disabled={this.props.disabled}
                    defaultChecked={this.state.editedContributionTypes.filter(x=>x===type).length>0}
                    onClick={() => this.toggleContributonType(type)}
                  />
                  <span className="form-check-sign" style={{color: "white"}}>
                    {type}
                  </span>
                </Label>
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.modalSaveButtonPressed}>Save</Button>
            <Button color="danger" onClick={this.modalCancelButtonPressed}>Cancel</Button>
          </ModalFooter>
        </Modal>
      :
        null
      }
      </>
    )
  }
}

ContributorTags.propTypes = {
  artist_id: PropTypes.string.isRequired,                 // represents current user and is needed in order to exclude form search results
  owner: PropTypes.object.isRequired,                     // this object "owns" the contributions (will be an album or song most likely)
  onAddContributor: PropTypes.func.isRequired,            // function that is called whenever a tag is added
  onRemoveContributor: PropTypes.func.isRequired,         // function that is called whenever a tag is removed
  updateContributionTypes: PropTypes.func.isRequired,     // function that is called whenever a tag is added
  disabled: PropTypes. bool,                              // determines whether search and edittings is disabled
  contributionTypes: PropTypes.arrayOf(PropTypes.string)  // a list of possible contribution types
};

ContributorTags.defaultProps = {
  disabled: false,
  contributionTypes: ["Artist","Feature","Producer","Mixing","Mastering","Song Writer","Vocals","Programmer/Beat Maker","Graphic Designer"]
};

export default ContributorTags
