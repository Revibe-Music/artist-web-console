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
import NotificationAlert from "react-notification-alert";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaSpotify, FaAmazon, FaRegCopy } from "react-icons/fa";
import { AiOutlineApple, AiOutlineAmazon } from "react-icons/ai";
import { FiPlus } from 'react-icons/fi';
import { CopyToClipboard } from 'react-copy-to-clipboard';


import { ReactSVG } from 'react-svg'
import { connect } from 'react-redux';
import validator from 'validator';

import { editSocialMediaLinks } from 'redux/authentication/actions.js'
import LinkManager from 'components/Modals/LinkManager.js'


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
  margin: `0 ${grid}px 0 0`,
  // change background colour if dragging
  background: isDragging ? "#7248BD" : "transparent",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 10,
  borderColor: "#7248BD",
  textAlign:"center",
  width: "100%",
  alignSelf:"center",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "transparent",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  padding: grid,
});

class Relinked extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      socialMedia: [],
      addingLink: false,
      selectedLink: null,
      deletedLinks: false,
      saving: false,
      copyButtonText: "Copy"
    }

    this.addLink = this.addLink.bind(this)
    this.editLink = this.editLink.bind(this)
    this.deleteLink = this.deleteLink.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.getDraggableServices = this.getDraggableServices.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentDidMount() {
    this.setState({socialMedia: JSON.parse(JSON.stringify(this.props.user.socialMedia))})
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.user.socialMedia.length !== prevProps.user.socialMedia.length) {
      this.setState({socialMedia: JSON.parse(JSON.stringify(this.props.user.socialMedia))})
    }
  }

  _toTitleCase(str) {
      str = str.split('_').join(' ')
      return str.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  }


  addLink(name, handle, description=null) {
    var newLink = {social_media: name, handle: handle}
    if(description !== null) {
      newLink.description = description
    }
    let order = Math.max.apply(Math, this.state.socialMedia.map(function(o) { return o.order; }))
    newLink.order = order === -Infinity ? 1 : order + 1
    this.setState({socialMedia: [...this.state.socialMedia, newLink]})
  }

  editLink(name, handle, description=null) {
    var socialMedia = [...this.state.socialMedia]
    var index = socialMedia.map(function(x) {return x.social_media }).indexOf(name)
    socialMedia[index].handle = handle
    if(description !== null) {
      socialMedia[index].description = description
    }
    this.setState({socialMedia: socialMedia})
  }

  deleteLink(name, handle, description=null) {
    var socialMedia = [...this.state.socialMedia]
    var index = socialMedia.map(function(x) {return x.social_media }).indexOf(name)
    socialMedia.splice(index, 1)
    socialMedia = socialMedia.map((item, index) => {
      item.order = index + 1
      return item
    })
    this.setState({socialMedia: socialMedia, deletedLinks: true})
  }

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

  renderIcon(service) {
    if(service === "amazon_music") {
      return <AiOutlineAmazon style={{fontSize: "20px",color: "#7248BD"}} />
    }
    else if(service === "spotify") {
      return <FaSpotify style={{fontSize: "20px", color: "#7248BD"}} />
    }
    else if(service === "apple_music") {
      return <AiOutlineApple style={{fontSize: "20px", color: "#7248BD"}} />
    }

  }

  onCopyLink() {
    var options = {
      place: "tr",
      icon: "tim-icons icon-single-copy-04",
      autoDismiss: 3,
      type: "primary",
      message: "Relink URL copied to clipboard."
    }
    this.refs.notificationAlert.notificationAlert(options);
  }


  async onSubmit() {
    this.setState({saving: true})
    var links = []
    var savedHandle
    for(var x=0; x<this.state.socialMedia.length; x++) {
      links.push({
        service: this.state.socialMedia[x].social_media,
        handle: this.state.socialMedia[x].handle,
        order: this.state.socialMedia[x].order
      })
    }
    if(links.length > 0 || this.state.deletedLinks) {
      await this.props.editSocialMediaLinks(links)
    }
    this.setState({saving: false})
  }

  render() {
    return (
      <>
      <div className="rna-container">
        <NotificationAlert ref="notificationAlert" />
      </div>
      <div className="content" >
        <Form className="form">
          <Card>
            <CardHeader>
              <CardTitle style={{alignItems: "center", marginRight: 20}} tag="h3">Relink</CardTitle>
              <CardTitle style={{alignItems: "center", marginRight: 20}} tag="h5">{this.state.socialMedia.length > 0 ? "*Drag & drop services to change the order they appear on your Relinked page." : ""}</CardTitle>
            </CardHeader>
            <CardBody>
            <Button
              className="btn-fill"
              color="success"
              onClick={() => this.setState({addingLink: true})}
            >
              <Row style={{justifyContent: "center", alignItems: "center"}}>
                <FiPlus style={{fontSize: 15, color: "white"}}/>
                Link
              </Row>
            </Button>
            <CopyToClipboard text={`https://revibe.tech/artists/${this.props.user.artistId}`}
              onCopy={() => this.onCopyLink()}>
              <Button
                className="btn-fill"
                color="primary"
              >
                <Row style={{justifyContent: "center", alignItems: "center"}}>
                  <i style={{fontSize: 15, color: "white"}} className="tim-icons icon-single-copy-04" />
                  Copy
                </Row>
              </Button>
            </CopyToClipboard>

            <div style={{justifyContent: "center", alignItems: "center", minHeight: "100%", display: "flex"}}>
              <DragDropContext onDragEnd={this.onDragEnd} >
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
                              style={{margin: 20}}
                            >
                              <div
                                onClick={() => this.setState({addingLink: true, selectedLink: item})}
                                className="btn-simple" color="primary"
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
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              </div>
            </CardBody>
            <CardFooter>
            <a data-tip data-for="saveButtonTooltip">
              <Button
              className="btn-fill"
              color="primary"
              style={{margin: 20}}
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
        <LinkManager
          show={this.state.addingLink}
          onClose={() => this.setState({addingLink: false, selectedLink: null})}
          onSave={this.editLink}
          onAdd={this.addLink}
          onDelete={this.deleteLink}
          link={this.state.selectedLink}
        />
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.authentication.user,
    editSocialMediaLinksErrors: state.authentication.editSocialMediaLinksErrors,
  }
};

const mapDispatchToProps = (dispatch, getState) => ({
    editSocialMediaLinks: (data) => dispatch(editSocialMediaLinks(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Relinked);
