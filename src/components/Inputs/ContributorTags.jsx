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
import { AiOutlineUserAdd } from 'react-icons/ai';
import { compact } from 'lodash';

import InviteArtist from "components/Modals/InviteArtist.js";
import RevibeAPI from 'api/revibe.js';
import Contributor from 'models/Contributor.js'
import { logEvent } from 'amplitude/amplitude';

var hash = require('object-hash');
const revibe = new RevibeAPI()


const theme = {
  container: {
    position: 'relative'
  },
  input: {
    width: '100%',
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
    minWidth: 200,
    width: "20vw",
    // maxWidth: 280,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontSize: '16px',
    lineHeight: 1.25,
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    zIndex: 2000
  },
  itemsList: {
    // maxHeight: '150px',
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

  constructor(props) {
      super(props);
      this.state = {
        searchResults: [],
        // contributionTags: this.formatContributorTags(),

        // Contribution Modal
        IsOpen: false,
        selectedContribution: {},
        editedContributionTypes: [],

        showInviteArtistModal:false,

        inputColor: "#2b3553"

      };

      // Contribution Methods
      this.addContributor = this.addContributor.bind(this)
      this.renderSearchResults = this.renderSearchResults.bind(this)
      this.renderResultsContainer = this.renderResultsContainer.bind(this)
      this.searchArtists = this.searchArtists.bind(this)

      // Modal Methods
      this.toggleModal = this.toggleModal.bind(this)
      this.toggleArtistInvite = this.toggleArtistInvite.bind(this)
      this.toggleContributonType = this.toggleContributonType.bind(this)
      this.modalSaveButtonPressed = this.modalSaveButtonPressed.bind(this)
      this.modalCancelButtonPressed = this.modalCancelButtonPressed.bind(this)
      this.contributionHasBeenSelected = this.contributionHasBeenSelected.bind(this)

      this.inputRef = React.createRef();
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
    logEvent("New Upload", "Contributor Type Toggled")
  }

  contributionHasBeenSelected(type) {
    // check whether contribution has type
    var contributorIndex = this.props.contributions.map(function(x) {return x.artist.artistId; }).indexOf(this.props.artist_id)
    return this.props.contributions[contributorIndex].type.filter(x=>x===type).length>0
  }

  modalSaveButtonPressed() {
    var contributorIndex = this.props.contributions.map(function(x) {return x.artist.artistId; }).indexOf(this.state.selectedContribution.artist.artistId)
    var contribution = this.props.contributions[contributorIndex]
    contribution.type = this.state.editedContributionTypes
    this.props.updateContributionTypes(contribution)
    this.toggleModal()
    logEvent("New Upload", "Contributor Type Saved")
  }

  modalCancelButtonPressed() {
    this.toggleModal()
    logEvent("New Upload", "Contributor Type Canceled")

  }

  /// CONTRIBUTION MODAL OPERATIONS ///
  toggleArtistInvite() {
    this.setState({showInviteArtistModal: !this.state.showInviteArtistModal})
  }

  /// CONTRIBUTOR RENDER METHODS ///
  renderTags (props) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
    if(tag.type) {
      var type = typeof tag.type !== "array" ? [tag.type] : tag.type
    }
    else {
      type = []
    }
    return (
      <span key={key} {...other} >
        <span
          onClick={() => {
            this.toggleModal(tag)
            logEvent("New Upload", "Contributor Deleted")
          }}
        >
          {tag.artist.artistName}: {type.length > 0 ? type.join(", ").substring(0,15)+'...': "Select Type"}
        </span>

        {!disabled &&
          <a
            className={classNameRemove}
            onClick={(e) => {
              this.removeContributor(tag.contributor)
              logEvent("New Upload", "Contributor Result Selected")
            }}
          />
        }
      </span>
    )
  }

  async searchArtists({ value }) {
    if(value.length > 0) {
      value = value.charAt(0) === "@" ? value.slice(1) : value
      if(value.length > 0) {
        var results = await revibe.searchArtists(value)
        var artists = results.data.filter(artist => artist.artist_id !== this.props.artist_id)
        if(artists.length > 0) {
          this.setState({searchResults: artists})
        }
        else {
          this.setState({searchResults: [{suggestion: "No Results.", name: "No Results."}]})
        }
        logEvent("New Upload", "Contributor Searched", {Results: artists.length})
      }
    }
  }

  renderSearchResults(artist) {
    if(artist.name !== "No Results.") {
      return (
        <Row style={{display: "flex", color:"black",cursor: 'pointer'}}>
         <Col xs={4} md={4}>
           <img
             alt="..."
             style={{aspectRation: "1:1",borderRadius: "50%"}}
             src={artist.images.length > 0 ? artist.images[1].url : require("assets/portal/img/default-avatar.png")}
            />
         </Col>
         <Col style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}} xs={8} md={8}>
           {artist.name}
         </Col>
       </Row>
     );
    }
    return (
      <Row style={{color:"black",paddingTop: "10px",width: "200px",display: "flex", alignItems: "center", justifyContent: "space-evenly"}}>
       <Col style={{textAlign: "left"}} xs={8} md={8}>
         No Results.
       </Col>
     </Row>
   );
  }

  renderResultsContainer({ containerProps, children }) {
      return (
        <div style={{position: "absolute"}}>
          <div {...containerProps}>
            {children}
            <Row style={{alignItems: "center", justifyContent: "center",marginTop: "20px"}}>
              <Button color="primary" onClick={this.toggleArtistInvite} style={{zIndex: 2000}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-evenly"}}>
                 <AiOutlineUserAdd />
                 Invite Artist
               </div>
              </Button>
           </Row>
         </div>
        </div>
      );
  };

  addContributor(contributor) {
    var contributorIndex = this.props.contributions.map(function(x) {return x.artist.id; }).indexOf(contributor.artist_id)
    if(contributorIndex == -1) {
      var newContributor = new Contributor({artist:{artistId: contributor.artist_id, artistName: contributor.name}})
      this.props.onAddContributor(newContributor)
      this.toggleModal(newContributor)
    }
  }

  removeContributor(contributor) {
    var contributions = [...this.props.contributions]
    var contributorIndex = contributions.map(function(x) {return x.artist.id; }).indexOf(contributor.id)
    contributions.splice(contributorIndex, 1)
    this.setState({contributions: contributions})
    this.props.onRemoveContributor(contributor)
  }

  render() {
    return (
      <>
      <TagsInput
        ref={this.inputRef}
        renderInput={({addTag,...props}) => {
          if(!props.disabled) {
            return (
              <Autosuggest
                theme={theme}
                suggestions={this.state.searchResults}
                onSuggestionsFetchRequested={this.searchArtists}
                onSuggestionsClearRequested={() => this.setState({searchResults: []})}
                getSuggestionValue={suggestion => suggestion.name}
                onSuggestionSelected={(e, {suggestion}) => {
                  addTag(suggestion.name)
                  if(this.inputRef.current.props.value.filter(x => x.artist.artistId === suggestion.artist_id).length < 1) {
                    if(suggestion.name!=="No Results.") {
                      this.addContributor(suggestion)
                      logEvent("New Upload", "Contributor Result Selected")
                    }
                  }
                }}
                renderSuggestion={(suggestion) => this.renderSearchResults(suggestion)}
                renderSuggestionsContainer={this.renderResultsContainer}
                inputProps={{
                  ...props,
                 }}
              />

            )
          }
          else {
            return null
          }
      }}
      renderLayout={(tagComponents, inputComponent) => {
        return (
          <div style={{border: `1px solid ${this.state.inputColor}`, fontSize: "0.75rem",  borderRadius: "0.4285rem", paddingTop: "4px", paddingBottom: "4px", marginBottom: "5px", transition: "color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out"}}>
            <Row>
              <Col xs="6" md="4">
                {inputComponent}
              </Col>
              <Col xs="6" md="8">
                {tagComponents}
            </Col>
            </Row>
          </div>
        )
      }}
      inputProps={{
          placeholder: '@Contributor',
          disabled: this.props.disabled,
          onFocus: () => this.setState({inputColor: "#7248BD"}),
          onBlur: () => this.setState({inputColor: "#2b3553"})
      }}
      onChange={() => console.log()}
      renderTag={props => this.renderTags(props)}
      tagProps={{ className: "react-tagsinput-tag primary", disabled: this.props.disabled, }}
      value={this.props.contributions}
      onlyUnique={true}
      style={{width: "100%"}}
      />

      {this.state.isOpen ?
        <Modal
          isOpen={this.state.isOpen}
          toggle={this.toggleModal}
          modalClassName="modal-grey"
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggleModal}>How did {this.state.selectedContribution.artist.artistName} contribute to this song?</ModalHeader>
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
            <p style={{marginLeft: "30px"}}>Don't see the contribution type you want? Tell us <u><a href="/dashboard/feedback">here.</a></u></p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.modalSaveButtonPressed}>Save</Button>
            <Button color="danger" onClick={this.modalCancelButtonPressed}>Cancel</Button>
          </ModalFooter>
        </Modal>
      :
        null
      }
      <InviteArtist show={this.state.showInviteArtistModal} toggle={this.toggleArtistInvite}/>
      </>
    )
  }
}

ContributorTags.propTypes = {
  artist_id: PropTypes.string.isRequired,                 // represents current user and is needed in order to exclude form search results
  onAddContributor: PropTypes.func.isRequired,            // function that is called whenever a tag is added
  onRemoveContributor: PropTypes.func.isRequired,         // function that is called whenever a tag is removed
  updateContributionTypes: PropTypes.func.isRequired,     // function that is called whenever a tag is added
  disabled: PropTypes. bool,                              // determines whether search and edittings is disabled
  contributionTypes: PropTypes.arrayOf(PropTypes.string),  // a list of possible contribution types
  contributions: PropTypes.array                          // list of contributions to populate
};

ContributorTags.defaultProps = {
  disabled: false,
  contributions: [],
  contributionTypes: ["Artist","Feature","Producer","Mixing","Mastering","Song Writer","Vocals","Programmer/Beat Maker","Graphic Designer"]
};

export default ContributorTags
