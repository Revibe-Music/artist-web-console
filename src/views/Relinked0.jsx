import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import ReactTooltip from 'react-tooltip';
import ClipLoader from "react-spinners/ClipLoader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { connect } from 'react-redux';
import validator from 'validator';

import { editSocialMediaLinks } from 'redux/authentication/actions.js'


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

class Relinked extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      socialMedia: [],
      saving: false,
    }



    for(var x=0; x<this.props.user.socialMedia.length; x++) {
      this.state[this._snakeToCamel(this.props.user.socialMedia[x].social_media) + "Link"] = this.props.user.socialMedia[x].handle
    }

    this._sericeNeedsUpdate = this._sericeNeedsUpdate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.getDraggableServices = this.getDraggableServices.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentDidMount() {
    this.setState({socialMedia: this.formatServices(this.props.user.socialMedia)})
    document.body.classList.toggle("profile-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("profile-page");
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.user.socialMedia.length !== prevProps.user.socialMedia.length) {
      this.setState({socialMedia: this.formatServices(this.props.user.socialMedia)})
    }
  }

  formatServices(socialMedia) {
    socialMedia = [...socialMedia]
    var availableStreamingServices = ["spotify", "apple_music", "amazon_music", "tidal", "soundcloud", "google_play_music"]
    var availableSocialServices = ["facebook", "instagram", "twitter"]
    for(var x=0; x<socialMedia.length; x++) {
      if(availableStreamingServices.includes(socialMedia[x].social_media)) {
        socialMedia[x].type = "streaming"
      }
      else if(availableSocialServices.includes(socialMedia[x].social_media)) {
        socialMedia[x].type = "social"
      }
      else {
        socialMedia[x].type = "other"
      }
      if(socialMedia[x].order == null) {
        let order = Math.max.apply(Math, socialMedia.map(function(o) { return o.order; }))
        socialMedia[x].order = order === -Infinity ? 0 : order + 1
      }
      socialMedia[x].state = ""
      socialMedia[x].error = ""
    }

    for(var x=0; x<availableStreamingServices.length; x++) {
      if(socialMedia.filter(y => y.social_media === availableStreamingServices[x]).length < 1) {
        socialMedia.push({social_media: availableStreamingServices[x], handle: "", type: "streaming", state: "", error: ""})
      }
    }
    for(var x=0; x<availableSocialServices.length; x++) {
      if(socialMedia.filter(y => y.social_media === availableSocialServices[x]).length < 1) {
        let order = Math.max.apply(Math, socialMedia.map(function(o) { return o.order; }))
        order = order === -Infinity ? 0 : order + 1
        socialMedia.push({social_media: availableSocialServices[x], handle: "", type: "social", state: "", error: ""})
      }
    }
    socialMedia = socialMedia.sort((a,b) => (a.social_media > b.social_media) ? 1 : ((b.social_media > a.social_media) ? -1 : 0));

    return socialMedia
  }

  _toTitleCase(str) {
      str = str.split('_').join(' ')
      return str.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  }

  _sericeNeedsUpdate(service) {
    if(this.props.user.socialMedia.filter(x => x.social_media === service).length > 0) {
      if(service.handle !== this.props.user.socialMedia.filter(x => x.social_media === service.social_media)[0].handle) {
        return true
      }
      if(service.order !== this.props.user.socialMedia.filter(x => x.social_media === service.social_media)[0].order) {
        return true
      }
    }
    else if(!!service.handle){
      return true
    }
    return false
  }

  change(event, stateName, type) {
    var socialMedia = [...this.state.socialMedia]
    var index = socialMedia.map(function(x) {return x.social_media }).indexOf(stateName)
    if(event.target.value.length < 1) {
      socialMedia[index].state = ""
      socialMedia[index].error = ""
    }
    else if(type == "streaming" ) {
      if (validator.isURL(event.target.value)) {
        socialMedia[index].state = "has-success"
        socialMedia[index].error = ""
      }
      else {
        socialMedia[index].state = "has-danger"
        socialMedia[index].error = "Invalid URL."
        this.setState({socialMedia: socialMedia});
      }
    }
    else if(type == "social") {
      socialMedia[index].state = "has-success"
      socialMedia[index].error = ""
    }
    this.setState({socialMedia: socialMedia});
  };

  getDraggableServices() {
    return this.state.socialMedia.filter(x => !!x.handle).sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
  }



  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    var socialMedia = this.getDraggableServices()
    var startIndex = socialMedia.map(function(x) {return x.order }).indexOf(result.source.index+1)
    var endIndex = socialMedia.map(function(x) {return x.order }).indexOf(result.destination.index+1)

    if(startIndex < endIndex) {
      for(var x=startIndex+1; x<=endIndex; x++) {
        socialMedia[x].order -= 1
      }
    }
    else {
      for(var x=startIndex-1; x>=endIndex; x--) {
        socialMedia[x].order += 1
      }
    }
    socialMedia[startIndex].order = result.destination.index+1
    this.setState({socialMedia: socialMedia});
  }


  async onSubmit() {
    var validFields = true
    for(var x=0; x<this.state.socialMedia.length; x++) {
      if(this.state.socialMedia[x].error !== "") {
        validFields = false
        break
      }
    }
    if(validFields) {
      this.setState({saving: true})
      var links = []
      var savedHandle
      for(var x=0; x<this.state.socialMedia.length; x++) {
        if(this._sericeNeedsUpdate(this.state.socialMedia[x])) {
          links.push({
            service: this.state.socialMedia[x].social_media,
            handle: this.state.socialMedia[x].social_media.handle,
            order: this.state.socialMedia[x].order
          })
        }
      }

      if(links.length > 0) {
        await this.props.editSocialMediaLinks(links)
      }
      this.setState({saving: false})
    }
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md="8">
            <Form className="form">
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">Relinked</CardTitle>
                </CardHeader>
                <CardBody>
                <h4 style={{marginBottom: "2%", color: "#7248BD"}}>Streaming Links:</h4>
                  <Row>
                    {this.state.socialMedia.filter(x => x.type === "streaming").map(service => {
                      return (
                        <Col className="pr-md-1" md="6">
                          <FormGroup className={`has-label ${service.state}`}>
                            <label>{this._toTitleCase(service.social_media)}</label>
                            <Input
                              defaultValue={service.handle}
                              type="url"
                              placeholder={`${service.social_media} Share Link`}
                              onChange={e => this.change(e, service.social_media, "streaming")}
                            />
                            {service.state === "has-danger" ? (
                              <label className="error">
                                {service.error}
                              </label>
                            ) : null}
                          </FormGroup>
                        </Col>
                      )
                    })}
                  </Row>

                  <h4 style={{marginBottom: "2%", marginTop: "2%", color: "#7248BD"}}>Social Handles:</h4>
                  <Row>
                    {this.state.socialMedia.filter(x => x.type === "social").map(service => {
                      return (
                        <Col className="pr-md-1" md="6">
                          <FormGroup className={`has-label ${service.state}`}>
                            <label>{this._toTitleCase(service.social_media)}</label>
                            <Input
                              defaultValue={service.handle}
                              type="url"
                              placeholder={`${service.social_media} Share Link`}
                              onChange={e => this.change(e, service.social_media, service.social_media, "streaming")}
                            />
                            {service.state === "has-danger" ? (
                              <label className="error">
                                {service.error}
                              </label>
                            ) : null}
                          </FormGroup>
                        </Col>
                      )
                    })}
                  </Row>
                </CardBody>
                <CardFooter>
                <a data-tip data-for="saveButtonTooltip">
                  <Button
                  className="btn-fill"
                  color="primary"
                  onClick={this.onSubmit}
                  >
                    Save
                    {this.state.saving ?
                      <div className="pull-right" style={{position: "absolute", right: "10%"}}>
                        <ClipLoader
                        style={{paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, }}
                        size={15}
                        color={"white"}
                        loading={this.state.saving && Object.keys(this.props.editSocialMediaLinksErrors).length < 1}
                        />
                      </div>
                    :
                      null
                    }
                  </Button>
                  </a>
                <ReactTooltip id="saveButtonTooltip" effect='solid' delayShow={1500}>
                  <span>Save changes to profile</span>
                </ReactTooltip>
                </CardFooter>
              </Card>
            </Form>
          </Col>

          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h3">Order</CardTitle>
              </CardHeader>
              <CardBody>
                <Col className="m-auto">
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {this.getDraggableServices().map((item, index) => (
                            <Draggable key={`service-${item.id}`} draggableId={`service-${item.id}`} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {this._toTitleCase(item.social_media)}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.authentication.user,
    editSocialMediaLinksErrors: state.authentication.editSocialMediaLinksErrors,
  }
};

const mapDispatchToProps = (dispatch) => ({
    editSocialMediaLinks: (data) => dispatch(editSocialMediaLinks(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Relinked);
