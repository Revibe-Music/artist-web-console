import React from "react";
import PropTypes from "prop-types";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Collapse,
  Label,
  Form,
  FormGroup,
  UncontrolledTooltip,
  Input
} from "reactstrap";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { uniq } from 'lodash';
import { connect } from 'react-redux';

import TextInput from "components/Inputs/TextInput.jsx";
import Select from "components/Inputs/Select.jsx";
import Tags from "components/Inputs/Tags.jsx";
import ContributorTags from "components/Inputs/ContributorTags.jsx";


class SongCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    }
    this.genreOptions = ["Blues","Classical","Country","Electronic","Folk","Hip-hop","Jazz","New age","Reggae","Rock",]
    this.onEditClicked = this.onEditClicked.bind(this)
  }


  getSongContributionTypes(song) {
    var contributionTypes = this.props.song.contributors.map(x => x.type)
    contributionTypes = uniq(contributionTypes)
    return contributionTypes
  }

  formatDuration(song) {
    var minutes = "0" + Math.floor(this.props.song.duration / 60);
    var seconds = "0" + (this.props.song.duration - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
  }

  onEditClicked() {
    if(this.props.onEditClicked) {
      this.props.onEditClicked()
    }
    else {
      // toggle collapse as default behavior
      this.setState({collapsed: !this.state.collapsed})
    }
  }


  render() {
    return (
      <Card className="card-plain" style={{backgroundColor: "#373737", margin: "auto",width: "auto"}}>
        <CardBody>
          <Row style={{alignItems: "center", margin: "auto", justifyContent: "space-between"}}>
            {this.state.collapsed ?
              <>
                <Col xs="12" md="4" className="card-stats">
                  <Row style={{alignItems: "center"}}>
                    <a onClick={() => this.props.onPlaySong()} style={{cursor: "pointer"}}>
                      <div className="info-icon text-center icon-primary">
                        <i className={`tim-icons ${this.props.isPlaying? "icon-button-pause" : "icon-triangle-right-17"}`} />
                      </div>
                    </a>
                    <h3 style={{color: "white",marginBottom: 0, marginLeft: "20px"}}>{this.props.song.title}</h3>
                  </Row>
                </Col>
                <Col xs="12" md="4" style={{marginLeft: window.screen.width < 400 ? "25%" : 0}}>
                  {this.getSongContributionTypes(this.props.song).map(type => (
                    <Row style={{marginTop: "5px", marginBottom: "5px" }}>
                      <h4 style={{color: "white",marginBottom: "auto", marginRight: 10}}>{type}s: </h4>
                      {this.props.song.contributors.filter(x => x.type === type).map(x => (
                        <div style={{backgroundColor: "#7248BD", borderRadius: 15, paddingLeft:10, paddingRight: 10, alignItems: "center", justifyContent: "center", display: "flex", width: "fit-content"}}>
                          <p style={{color:"white", marginBottom: 0 }}>{x.artist.artistName}</p>
                        </div>
                      ))}
                    </Row>
                  ))}
                </Col>
                <Col xs="12" md="2" style={{alignItems: "center", marginLeft: window.screen.width < 400 ? "25%" : 0}}>
                  <Row style={{alignItems: "center",}}>
                    <i style={{color: "#7248BD", fontSize: "1.5rem", marginRight: "10px"}} className="tim-icons icon-watch-time" />
                    <h4 style={{color: "white", marginBottom: 0}}>{this.formatDuration(this.props.song)}</h4>
                  </Row>
                </Col>
                {this.props.displayStreams ?
                  <Col xs="12" md="2" style={{alignItems: "center", marginLeft: window.screen.width < 400 ? "25%" : 0}}>
                    <Row style={{alignItems: "center",}}>
                      <i style={{color: "#7248BD", fontSize: "1.5rem", marginRight: "10px"}} className="tim-icons icon-headphones" />
                      <h4 style={{color: "white", marginBottom: 0}}>{this.props.song.totalStreams}</h4>
                    </Row>
                  </Col>
                :
                  null
                }

              </>
            :
              <Col xs="12" md="4" className="card-stats">
                <Row style={{alignItems: "center"}}>
                  <a onClick={() => this.props.onPlaySong()} style={{cursor: "pointer"}}>
                    <div className="info-icon text-center icon-primary">
                      <i className={`tim-icons ${this.props.isPlaying? "icon-button-pause" : "icon-triangle-right-17"}`} />
                    </div>
                  </a>
                  <div style={{marginLeft: "20px"}}>
                    <TextInput
                      value={this.props.song.title}
                      placeholder="Song Title"
                      disabled={this.props.disableEditing}
                      onChange={event => this.props.onEditSong(this.props.song.id, event.target.value, "setTitle")}
                      errorMessage={this.props.song.errors.filter(error => error.location === "title").length > 0 ? this.props.song.errors.filter(error => error.location === "name")[0].message : ""}
                    />
                  </div>
                </Row>
              </Col>
            }
            {this.props.displayOptions ?
              <Col xs="12" md="2" style={{display: "flex", justifyContent: "flex-end"}}>
              <Row style={{alignItems: "center"}}>
                <a
                  aria-expanded={this.state.collapsed}
                  data-parent="#accordion"
                  data-toggle="collapse"
                  style={{cursor: "pointer"}}
                  onClick={e => this.onEditClicked()}
                >
                  <h4 style={{color: "#7248BD"}}>{!this.state.collapsed ? "Done Editing" : "Edit"}</h4>
                </a>
                <h4 style={{color: "white", marginLeft: "5px", marginRight: "5px"}}> | </h4>
                <a onClick={() => this.props.onDeleteClicked()} style={{cursor: "pointer"}}>
                  <h4 style={{color: "#7248BD"}}> Delete</h4>
                </a>
              </Row>
            </Col>

            :
              null
            }

          </Row>
          <Collapse role="tabpanel" isOpen={!this.state.collapsed}>
            <Row style={{marginLeft: window.screen.width < 400 ? 0 : "5%"}}>
              <Col xs="12" md="6">
                <div style={{color: "white"}}>
                  Contributors
                  <AiOutlineQuestionCircle style={{color: "#7248BD", marginLeft: "5px"}} id={`contribution-question${this.props.song.id}`}/>
                </div>
                <ContributorTags
                  artist_id={this.props.artist_id}
                  onAddContributor={contributor => this.props.onEditSong(this.props.song.id, contributor, "addContributor")}
                  onRemoveContributor={contributor => this.props.onEditSong(this.props.song.id, contributor, "removeContributor")}
                  updateContributionTypes={contributor => this.props.onEditSong(this.props.song.id, contributor, "updateContribution")}
                  disabled={this.state.uploading}
                />
                <UncontrolledTooltip
                  style={{backgroundColor: "#7248BD", color: "white"}}
                  placement="top"
                  target={`contribution-question${this.props.song.id}`}
                  hideArrow={true}
                >
                  Tag others (by their display name) that had a roll in creating this song.
                </UncontrolledTooltip>
              </Col>
              <Col xs="12" md="6">
                <Select
                  label="Genres (optional)"
                  value={this.genreOptions.filter(option => this.props.song.genres.includes(option.label))}
                  isMulti={true}
                  closeMenuOnSelect={false}
                  placeholder="Select Genres"
                  disabled={this.state.uploading}
                  onChange={options => this.props.onEditSong(this.props.song.id, options.map(x => x.label), "setGenres")}
                  options={this.genreOptions.map((genre, index) => ({ value: index, label: genre }))}
                />
              </Col>
            </Row>
            <Row style={{marginTop: "10px", marginLeft: window.screen.width < 400 ? 0 : "5%"}}>
              <Col xs="12" md="6">
                <Tags
                  value={this.props.song.tags}
                  label="Tags (optional)"
                  placeholder="Add here..."
                  disabled={this.props.disableEditing}
                  onChange={tags => this.props.onEditSong(this.props.song.id, tags, "setTags")}
                  errorMessage={this.props.song.errors.filter(error => error.location === "tags").length > 0 ? this.props.song.errors.filter(error => error.location === "tags")[0].message : ""}
                />
              </Col>
              <Col xs="12" md="6">
                <FormGroup check style={{marginTop: 0}}>
                  <div style={{color: "white"}}>Explicit</div>
                  <Label check>
                    <Input
                      disabled={this.state.uploading}
                      type="checkbox"
                      value={this.props.song.explicit}
                      onChange={event => this.props.onEditSong(this.props.song.id, event.target.checked, "setExplicit")}
                    />
                    <span className="form-check-sign" />
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </Collapse>
        </CardBody>
      </Card>
    );
  }
}

SongCard.propTypes = {
  song: PropTypes.object.isRequired,                      // represents current user and is needed in order to exclude form search results
  onPlaySong: PropTypes.func,                             // function that is called whenever a tag is added
  isPlaying: PropTypes.bool,
  displayOptions: PropTypes.bool,                         // Determines whether or not to show "Edit", "Delete", etc
  displayStreams: PropTypes.bool,                         // Determines whether or not to show "Edit", "Delete", etc
  disableEditing: PropTypes.bool,                         // Determines whether or not to show "Edit", "Delete", etc
  onEditClicked: PropTypes.func,                          // function that is called whenever edit button is clicked
  onDeleteClicked: PropTypes.func,               // function that is called whenever edit button is clicked
  onEditSong: PropTypes.func,               // function that is called whenever edit button is clicked
};

SongCard.defaultProps = {
  isPlaying: false,
  disableEditing: false,
  displayOptions: true,
  displayStreams: true
};


function mapStateToProps(state) {
  return {
    artist_id: state.authentication.user.artist_id,
  }
};

export default connect(mapStateToProps)(SongCard)
