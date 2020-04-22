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
import NotificationAlert from "react-notification-alert";
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
      requireContributionApprovalOnEdit: this.props.user.requireContributionApprovalOnEdit,
      shareDataWithContributors: this.props.user.shareDataWithContributors,
      shareAdvancedDataWithContributors: this.props.user.shareAdvancedDataWithContributors,
      allowContributorsToEditContributions: this.props.user.allowContributorsToEditContributions,
      allowContributorsToEditTags: this.props.user.allowContributorsToEditTags,
      displayOtherPlatformContentOnRevibePage: this.props.user.displayOtherPlatformContentOnRevibePage,
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
    if(this.props.user.requireContributionApprovalOnEdit !== prevProps.user.requireContributionApprovalOnEdit) {
      this.setState({requireContributionApprovalOnEdit: this.props.user.requireContributionApprovalOnEdit})
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
    if(this.props.user.allowContributorsToEditTags !== prevProps.user.allowContributorsToEditTags) {
      this.setState({allowContributorsToEditTags:this.props.user.allowContributorsToEditTags})
    }
    if(this.props.user.displayOtherPlatformContentOnRevibePage !== prevProps.user.displayOtherPlatformContentOnRevibePage) {
      this.setState({displayOtherPlatformContentOnRevibePage:this.props.user.displayOtherPlatformContentOnRevibePage})
    }
  }

  async onSubmit() {
    this.setState({saving: true})
    var settings = {
      requireContributionApproval: this.state.requireContributionApproval,
      requireContributionApprovalOnEdit: this.state.requireContributionApprovalOnEdit,
      shareDataWithContributors: this.state.shareDataWithContributors,
      shareAdvancedDataWithContributors: this.state.shareAdvancedDataWithContributors,
      allowContributorsToEditContributions: this.state.allowContributorsToEditContributions,
      allowContributorsToEditTags: this.state.allowContributorsToEditTags,
      displayOtherPlatformContentOnRevibePage: this.state.displayOtherPlatformContentOnRevibePage,
    }
    await this.props.editSettings(settings)
    var options = {
      place: "tr",
      icon: "tim-icons icon-check-2",
      autoDismiss: 2,
      type: "primary",
      message: "Successfully saved settings."
    }
    this.refs.notificationAlert.notificationAlert(options);
    this.setState({saving: false})
  }

  toggleSetting(name, value) {
    this.setState({[name]: value})
  }

  render() {


    return (
      <>
      <div className="rna-container">
        <NotificationAlert ref="notificationAlert" />
      </div>
      <div className="content">
        <Row>
          <Col md="12">
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
                        value={this.state.requireContributionApprovalOnEdit}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("requireContributionApprovalOnEdit", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting2-question"/>
                        Require Contribution Approval On Edit
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting2-question"
                        hideArrow={true}
                      >
                        Enabling this will prevent others from automatically changing your contribution on a song/album after you have approved it.
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
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting3-question"/>
                        Share Data With Contributors
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting3-question"
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
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting4-question"/>
                        Share Advanced Data With Contributors
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting4-question"
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
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting5-question"/>
                        Allow Contributors To Edit Contributions (COMING SOON)
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting5-question"
                        hideArrow={true}
                      >
                        Enabling this will allow contributors on one of your songs/albums to edit their contribution type after you have set it.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.allowContributorsToEditTags}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("allowContributorsToEditTags", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting6-question"/>
                        Allow Contributors To Edit Genres/Tags (COMING SOON)
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting6-question"
                        hideArrow={true}
                      >
                        Enabling this will allow contributors to add/remove genres and tags from the song/album they contributed to.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.displayOtherPlatformContentOnRevibePage}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("displayOtherPlatformContentOnRevibePage", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting7-question"/>
                         Display Other Platform Content On Revibe Page (COMING SOON)
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting7-question"
                        hideArrow={true}
                      >
                       Enabling this will allow Spotify/YouTube content to be displayed on the artist's Revibe artist page.
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
      </>
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
