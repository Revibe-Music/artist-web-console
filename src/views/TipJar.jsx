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


class TipJar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      venmoHandle: "",
      venmoState: "",
      venmoError: "",
      cashAppHandle: "",
      cashAppState: "",
      cashAppError: "",

      saving: false,
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    if(Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "venmo").length > 0) {
      var venmo = Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "venmo")[0]
      this.setState({venmoHandle: venmo.handle})
    }
    if(Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "cash_app").length > 0) {
      var cashApp = Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "cash_app")[0]
      this.setState({cashAppHandle: cashApp.handle})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "venmo").length > 0) {
      var venmo = Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "venmo")[0]
      this.setState({venmoHandle: venmo.handle})
      if(this.state.venmoHandle !== venmo.handle) {
        this.setState({venmoHandle: venmo.handle})
      }
    }
  }

  change(event, stateName) {
    if(event.target.value.length < 4) {
      this.setState({[stateName+"State"]: "has-danger",[stateName+"Error"]: "Invalid handle."});
    }
    else {
      this.setState({[stateName+"State"]: "has-success",[stateName+"Error"]: "", });
    }
    this.setState({[stateName+"Handle"]: event.target.value});
  };

  async onSubmit() {

    if(!this.state.venmoError && this.state.cashappError) {
      this.setState({saving: true})
      var links = []
      if(Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "venmo").length > 0) {
        if(this.state.venmoHandle !== Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "venmo")[0].handle) {
          links.push({service: "venmo", handle: this.state.venmoHandle})
        }
      }
      else if(this.state.venmoHandle) {
        links.push({service: "venmo", handle: this.state.venmoHandle})
      }
      if(Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "cash_app").length > 0) {
        if(this.state.cashAppHandle !== Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "cash_app")[0].handle) {
          links.push({service: "cash_app", handle: this.state.cashAppHandle})
        }
      }
      else if(this.state.cashAppHandle) {
        links.push({service: "cash_app", handle: this.state.cashAppHandle})
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
          <Col md="10">
            <Form className="form">
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">Tip Jar</CardTitle>
                  <CardTitle style={{alignItems: "center", marginRight: 20}} tag="h5">*Adding Venmo/Cash App info will allow tip jar to appear on your Revibe Music artist page and on your Relink profile.</CardTitle>
                </CardHeader>
                <CardBody>
                    <Col className="pr-md-1" md="4">
                      <FormGroup className={`has-label ${this.state.venmoState}`}>
                        <label>Venmo</label>
                        <Input
                          defaultValue={this.state.venmoHandle}
                          type="text"
                          placeholder={`Venmo Handle ex: John-venmo`}
                          onChange={e => this.change(e, "venmo")}
                        />
                        {this.state.venmoState === "has-danger" ? (
                          <label className="error">
                            {this.state.VenmoError}
                          </label>
                        ) : null}
                      </FormGroup>
                    </Col>
                    {this.state.venmoHandle ?
                      <a className="nav-link"
                         target="_blank"
                         style={{padding: 0, margin:0}}
                         href={this.state.venmoHandle}>
                        <i style={{color: "#7482BD", padding: 0, margin:0}} className="tim-icons icon-link-72" />
                      </a>
                    :
                      null
                    }
                    <Col className="pr-md-1" md="4">
                      <FormGroup className={`has-label ${this.state.cashAppState}`}>
                        <label>Cash App</label>
                        <Input
                          defaultValue={this.state.cashAppHandle}
                          type="text"
                          placeholder={`Cash App Handle ex: John-cash-app`}
                          onChange={e => this.change(e, "venmo")}
                        />
                        {this.state.cashAppState === "has-danger" ? (
                          <label className="error">
                            {this.state.cashAppError}
                          </label>
                        ) : null}
                      </FormGroup>
                    </Col>
                    {this.state.cashAppHandle ?
                      <a className="nav-link"
                         target="_blank"
                         style={{padding: 0, margin:0}}
                         href={this.state.cashAppHandle}>
                        <i style={{color: "#7482BD", padding: 0, margin:0}} className="tim-icons icon-link-72" />
                      </a>
                    :
                      null
                    }
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


export default connect(mapStateToProps, mapDispatchToProps)(TipJar);
