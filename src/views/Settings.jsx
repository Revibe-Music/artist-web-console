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
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import ReactTooltip from 'react-tooltip';
import Switch from "react-bootstrap-switch";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { connect } from 'react-redux';

import { editSettings } from 'redux/authentication/actions.js'


class Settings extends React.Component {

  constructor(props) {
    super(props)

    this.state = {

      requireContributionApproval: this.props.user.requireContributionApproval,
      shareDataWithContributors: this.props.user.shareDataWithContributors,
      shareAdvancedDataWithContributors: this.props.user.shareAdvancedDataWithContributors,
      allowContributorsToEditContributions: this.props.user.allowContributorsToEditContributions,

      saving: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.toggleSetting = this.toggleSetting.bind(this)
  }

  componentDidMount() {
    document.body.classList.toggle("profile-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("profile-page");
  }

  componentDidUpdate(prevProps, prevState) {

    if(this.props.user.requireContributionApproval !== prevProps.user.requireContributionApproval) {
      this.setState({requireContributionApproval: this.props.user.requireContributionApproval})
    }
    if(this.props.user.shareDataWithContributors !== prevProps.user.shareDataWithContributors) {
      this.setState({shareDataWithContributors:this.props.user.shareDataWithContributors})
    }
    if(this.props.user.shareAdvancedDataWithContributors !== prevProps.user.shareAdvancedDataWithContributors) {
      this.setState({shareAdvancedDataWithContributors:this.props.user.shareAdvancedDataWithContributors})
    }
    if(this.props.user.allowContributorsToEditContributions !== prevProps.user.allowContributorsToEditContributions) {
      this.setState({allowContributorsToEditContributions:this.props.user.allowContributorsToEditContributions})
    }
  }

  async onSubmit() {
    this.setState({saving: true})
    var settings = {
      requireContributionApproval: this.state.requireContributionApproval,
      shareDataWithContributors: this.state.shareDataWithContributors,
      shareAdvancedDataWithContributors: this.state.shareAdvancedDataWithContributors,
      allowContributorsToEditContributions: this.state.allowContributorsToEditContributions,
    }
    await this.props.editSettings(settings)
    this.setState({saving: false})
  }

  toggleSetting(name, value) {
    this.setState({[name]: value})
  }

  render() {


    return (
      <div className="content">
        <Row>
          <Col md="10">
            <Form className="form">
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">Settings</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.requireContributionApproval}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("requireContributionApproval", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting1-question"/>
                        Require Contribution Approval
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting1-question"
                        hideArrow={true}
                      >
                        Enabling this will prevent others from automatically adding you as a contributor on a song/album.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.shareDataWithContributors}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("shareDataWithContributors", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting2-question"/>
                        Share Data With Contributors
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting2-question"
                        hideArrow={true}
                      >
                        Enabling this will allow contributors on your songs/albums to view basic streaming data.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.shareAdvancedDataWithContributors}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("shareAdvancedDataWithContributors", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting3-question"/>
                        Share Advanced Data With Contributors
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting3-question"
                        hideArrow={true}
                      >
                        Enabling this will allow contributors on your songs/albums to view advanced streaming data.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.allowContributorsToEditContributions}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("allowContributorsToEditContributions", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting4-question"/>
                        Allow Contributors To Edit Contributions
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting4-question"
                        hideArrow={true}
                      >
                        Enabling this will allow contributors on one of your songs/albums to edit their contribution type after you have set it.
                      </UncontrolledTooltip>
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
                        loading={this.state.saving && Object.keys(this.props.editSettingsErrors).length < 1}
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
    editSettingsErrors: state.authentication.editSettingsErrors,
  }
};

const mapDispatchToProps = dispatch => ({
    editSettings: (data) => dispatch(editSettings(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Settings);
