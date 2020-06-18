import React from 'react'

// nodejs library that concatenates classes
import classnames from "classnames";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane
} from "reactstrap";

// material-ui components
import { Paper, Chip } from "@material-ui/core"

// redux
import { connect } from 'react-redux';

// copy stuff
import { CopyToClipboard } from 'react-copy-to-clipboard';

// branch functions
import { createArtistReferralLink } from "branch/branch"

// api
import RevibeAPI from 'api/revibe.js'

const revibe = new RevibeAPI()

class ArtistsReferrals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: "",
      emailState: "",
      emailError: "",

      emails: [],

      deepLinks: {
        copy: "",
        twitter: "",
        facebook: "",
        instagram: "",
        error: null,
        setup: false
      },
      loadingDeepLinks: false
    }

    this.updateField = this.updateField.bind(this)
    this.setupDeepLinks = this.setupDeepLinks.bind(this)
    this.displayNotificationOnCopy = this.displayNotificationOnCopy.bind(this)
    this.displayNotificationOnSend = this.displayNotificationOnSend.bind(this)
    this.addEmailToList = this.addEmailToList.bind(this)
    this.addEmailOnEnter = this.addEmailOnEnter.bind(this)
    this.verifyEmail = this.verifyEmail.bind(this)
    this.removeEmailFromList = this.removeEmailFromList.bind(this)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  displayNotificationOnCopy() {
    var options = {
      place: "tr",
      icon: "far fa-copy",
      autoDismiss: 3,
      type: "success",
      message: "Copied referral link to clipboard!"
    }

    if(this.props.showNotification) {
      this.props.showNotification(options)
    }
  }

  displayNotificationOnSend(icon, type, message) {
    var options = {
      place: "tr",
      icon: icon,
      autoDismiss: 3,
      type: type,
      message: message
    }

    if(this.props.showNotification) {
      this.props.showNotification(options)
    }
  }

  async setupDeepLinks() {
    if(!this.state.loadingDeepLinks)
      this.setState({ ...this.state, loadingDeepLinks: true })

    try {
      var deepLinks = { ...this.state.deepLinks }, userId = this.props.user.id

      deepLinks.copy = await createArtistReferralLink("Pasteboard", userId)
      deepLinks.twitter = await createArtistReferralLink("Twitter", userId)
      deepLinks.facebook = await createArtistReferralLink("Facebook", userId)
      //deepLinks.instagram = await createArtistReferralLink("Instagram", userId)

      deepLinks.setup = true

      this.setState({ ...this.state, deepLinks, loadingDeepLinks: false })
    } catch(e) {
      var deepLinks = { ...this.state.deepLinks }

      deepLinks.error = e

      this.setState({ ...this.state, deepLinks, loadingDeepLinks: false })
    }
  }

  updateField(target, value) {
    var newState = { ...this.state }

    newState[target + "State"] = target === "email" && this.verifyEmail(value) && !this.state.emails.includes(value) ? "has-success" : (value !== "" ? "has-danger" : "")
    newState[target] = value

    this.setState(newState)
  }

  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }

  addEmailOnEnter(e) {
    if(e.keyCode === 13) {
      e.preventDefault()

      this.addEmailToList()
    }
  }

  addEmailToList() {
    var emailList = this.state.emails

    if(this.state.emailState === "has-success") {
      emailList.push(this.state.email)
      this.emailInput.value = ""

      this.setState({ ...this.state, email: "", emailState: "", emailError: "", emails: emailList })
    }
  }

  removeEmailFromList(i) {
    var emailList = this.state.emails

    emailList.splice(i, 1)

    this.setState({ ...this.state, emails: emailList })
  }

  async submitEmails() {
    var { emails } = this.state

    if(emails.length === 0) {
      this.displayNotificationOnSend("fas fa-exclamation", "warning", "There are no emails to invite!")
      return
    }

    try {
      var res = await revibe.sendInvitation({ type: "artist_invite", to: emails, artist: true })

      console.log(res)

      if(String(res.status).charAt(0) == "2") {
        this.displayNotificationOnSend("fa fa-paper-plane", "success", `Success! Sent ${res.data["total sent"]}/${res.data["total requested"]} invite emails.`)

        this.setState({ ...this.state, emails: [] })
        return
      } else {
        this.displayNotificationOnSend("fas fa-exclamation", "danger", `${res.status} Error Code: Failed to Send Emails. See console for more info!`)
        console.log(res)
        return
      }
    } catch(e) {
      this.displayNotificationOnSend("fas fa-exclamation", "danger", `Fatal Error: Failed to Send Emails. See console for more info!`)
      console.log(e)
      return
    }
  }

  render() {
    const isMobile = window.innerWidth < 576

    if((!this.state.deepLinks.setup && !this.state.deepLinks.error) && !this.state.loadingDeepLinks && this.props.user.id !== "")
      this.setupDeepLinks()

    return (
      <>
        <Container>
          <Row>
            <h1 className="w-100 text-center m-0" style={{ fontSize: "3.25rem" }}>Invite Artists</h1>
          </Row>
          <Row className="d-flex mt-sm">
            <Col md="6" className="ml-auto mr-auto">
              <h3 className="text-white w-100 text-center m-0 mb-2">Invite fellow musicians and earn rewards!</h3>
              <div className="w-100 d-flex">
                <div style={isMobile ? { width: "80%" } : { width: "50%" }} className="d-flex ml-auto mr-2 mt-auto mb-auto">
                  <InputGroup
                    className={classnames({
                      "input-group-focus": true
                    }) + ` mb-0 ${this.state.emailState}`}
                  >
                    <Input
                      placeholder="Email..."
                      type="text"
                      onChange={e => this.updateField("email", e.target.value)}
                      style={{ borderBottomRightRadius: "0", borderTopRightRadius: "0" }}
                      innerRef={el => this.emailInput = el}
                      onKeyDown={e => this.addEmailOnEnter(e)}
                    />
                  </InputGroup>
                  <Button
                    className="btn-primary btn-simple referrals-btn"
                    onClick={() => this.addEmailToList()}
                    disabled={this.state.emailState !== "has-success"}
                  >
                    <i className="fa fa-plus" />
                  </Button>
                </div>
                <Button
                  className="btn-primary btn-round ml-2 mr-auto"
                  onClick={() => this.submitEmails()}
                  disabled={this.state.emails == 0 || this.state.email !== ""}
                >
                  <i className="far fa-paper-plane" />
                </Button>
              </div>
              {this.state.emails.length > 0 ? 
                <div style={isMobile ? { width: "80%" } : { width: "75%" }} className="ml-auto mr-auto d-flex">
                  <div className="ml-auto mr-auto d-flex justify-content-center flex-wrap">
                    {this.state.emails.map((email, i) => (
                      <Chip 
                        label={email}
                        onDelete={() => this.removeEmailFromList(i)}
                        className="m-1"
                        color="primary"
                        style={{ backgroundColor: "#7248BD" }}
                      />
                    ))}
                  </div>
                </div>  
              : null}
              {this.state.deepLinks.setup && !this.state.loadingDeepLinks ? 
                <>
                  <h5 className="text-light w-100 text-center mt-sm mb-sm">or</h5>
                  <h3 className="text-white w-100 text-center m-0 mb-3">Share your link:</h3>
                  {this.state.deepLinks.copy !== "" ? <div className="w-100 d-flex">
                    <h4 className="text-primary ml-auto mr-3 mt-auto mb-auto">{this.state.deepLinks.copy}</h4>
                    <CopyToClipboard
                      text={this.state.deepLinks.copy}
                      onCopy={() => this.displayNotificationOnCopy()}
                    >
                      <Button
                        className="ml-2 mr-auto btn-primary btn-round"
                      >
                        <i className="far fa-copy" />
                      </Button>
                    </CopyToClipboard>
                  </div> : null}
                  <div className="w-100 d-flex mt-2">
                    <>
                      {this.state.deepLinks.twitter !== "" ? <Button
                        className="btn-primary btn-icon btn-round ml-auto mr-2"
                        color="default"
                        size="lg"
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out Revibe, the new platform that lets you run your entire music career in one place! Sign up with my link: ${this.state.deepLinks.twitter} @revibemusic8`)}`}
                        target="_blank"
                      >
                        <i className="fab fa-twitter" />
                      </Button> : null}
                      {this.state.deepLinks.instagram !== "" ? <Button
                        className="btn-primary btn-icon btn-round ml-2 mr-2"
                        color="default"
                        size="lg"
                      >
                        <i className="fab fa-instagram" />
                      </Button> : null}
                      {this.state.deepLinks.facebook !== "" ? <Button
                        className="btn-primary btn-icon btn-round ml-2 mr-auto"
                        color="default"
                        size="lg"
                        href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(this.state.deepLinks.facebook)}`}
                        target="_blank"
                      >
                        <i className="fab fa-facebook" />
                      </Button> : null}
                    </>
                  </div>
                </>
              :
                <div className="w-100">
                  <h1 className="w-100 text-center">Loading...</h1>
                </div>
              }
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(ArtistsReferrals)