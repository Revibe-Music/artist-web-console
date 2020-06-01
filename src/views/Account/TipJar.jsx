import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Row,
  Col,
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import ReactTooltip from 'react-tooltip';
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import TextInput from "components/Inputs/TextInput.jsx";
import { editTipJarLinks } from 'redux/authentication/actions.js'
import { logEvent } from 'amplitude/amplitude';


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
    if(this.props.user.socialMedia.filter(x => x.social_media === "venmo").length > 0) {
      var venmo = this.props.user.socialMedia.filter(x => x.social_media === "venmo")[0]
      this.setState({venmoHandle: venmo.handle})
    }
    if(this.props.user.socialMedia.filter(x => x.social_media === "cashapp").length > 0) {
      var cashApp = this.props.user.socialMedia.filter(x => x.social_media === "cashapp")[0]
      this.setState({cashAppHandle: cashApp.handle})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.user.socialMedia.filter(x => x.social_media === "venmo").length > 0) {
      var venmo = this.props.user.socialMedia.filter(x => x.social_media === "venmo")[0]
      if(prevProps.user.socialMedia.filter(x => x.social_media === "venmo").length > 0) {
        if(venmo.handle !== prevProps.user.socialMedia.filter(x => x.social_media === "venmo")[0].handle) {
          this.setState({venmoHandle: venmo.handle})
        }
      }
      else {
        this.setState({venmoHandle: venmo.handle})
      }
    }
    if(this.props.user.socialMedia.filter(x => x.social_media === "cashapp").length > 0) {
      var cashApp = this.props.user.socialMedia.filter(x => x.social_media === "cashapp")[0]
      if(prevProps.user.socialMedia.filter(x => x.social_media === "cashapp").length > 0) {
        if(cashApp.handle !== prevProps.user.socialMedia.filter(x => x.social_media === "cashapp")[0].handle) {
          this.setState({cashAppHandle: cashApp.handle})
        }
      }
      else {
        this.setState({cashAppHandle: cashApp.handle})
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

    if(!this.state.venmoError && !this.state.cashappError) {
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
      if(Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "cashapp").length > 0) {
        if(this.state.cashAppHandle !== Object.keys(this.props.user.socialMedia).filter(x => x.social_media === "cashapp")[0].handle) {
          links.push({service: "cashapp", handle: this.state.cashAppHandle})
        }
      }
      else if(this.state.cashAppHandle) {
        links.push({service: "cashapp", handle: this.state.cashAppHandle})
      }

      if(links.length > 0) {
        await this.props.editTipJarLinks(links)
      }
      var options = {
        place: "tr",
        icon: "tim-icons icon-check-2",
        autoDismiss: 2,
        type: "primary",
        message: "Successfully saved Tip Jar."
      }
      this.refs.notificationAlert.notificationAlert(options);
      this.setState({saving: false})
    }
  }

  render() {
    return (
      <>
      <div className="rna-container">
        <NotificationAlert ref="notificationAlert" />
      </div>
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
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <TextInput
                        label="Venmo"
                        placeholder="ex: Jonny-Venmo123"
                        value={this.state.venmoHandle}
                        onChange={e => this.change(e, "venmo")}
                        onBlur={() => logEvent("Tip Jar", "Field Edited", {Field: "Venmo Handle"})}
                        errorMessage={this.state.venmoState === "has-danger" ? this.state.venmoError : ""}
                      />
                    </Col>
                    <Col className="pr-md-1" md="2" style={{display: "flex", alignItems: "center"}}>
                    {this.state.venmoHandle ?
                        <a href={`https://venmo.com/${this.state.venmoHandle}`} target="_blank" style={{marginTop: 10}}>
                        Test Account
                        </a>
                    :
                      null
                    }
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <TextInput
                        label="Cash App"
                        placeholder="ex: Jonny-CashApp123"
                        value={this.state.cashAppHandle}
                        onChange={e => this.change(e, "cashApp")}
                        onBlur={() => logEvent("Tip Jar", "Field Edited", {Field: "Cash App Handle"})}
                        errorMessage={this.state.cashAppState === "has-danger" ? this.state.cashAppError : ""}
                      />
                    </Col>
                    <Col className="pr-md-1" md="2" style={{display: "flex", alignItems: "center"}}>
                      {this.state.cashAppHandle ?
                        <a href={`https://cash.me/$${this.state.cashAppHandle}/${0}`} target="_blank" style={{marginTop: 10}}>
                          Test Account
                        </a>
                      :
                        null
                      }
                    </Col>
                    </Row>

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
                        loading={this.state.saving && Object.keys(this.props.editTipJarLinksErrors).length < 1}
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
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.authentication.user,
    editTipJarLinksErrors: state.authentication.editTipJarLinksErrors,
  }
};

const mapDispatchToProps = (dispatch) => ({
    editTipJarLinks: (data) => dispatch(editTipJarLinks(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(TipJar);
