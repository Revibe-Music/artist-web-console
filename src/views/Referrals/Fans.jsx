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

//redux
import { connect } from 'react-redux';

// copy stuff
import { CopyToClipboard } from 'react-copy-to-clipboard';

// branch functions
import { createFanReferralLink } from "branch/branch"

class FansReferrals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
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

    this.displayNotificationOnCopy = this.displayNotificationOnCopy.bind(this)
    this.setupDeepLinks = this.setupDeepLinks.bind(this)
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

  async setupDeepLinks() {
    if(!this.state.loadingDeepLinks)
      this.setState({ ...this.state, loadingDeepLinks: true })

    try {
      var deepLinks = { ...this.state.deepLinks }, userId = this.props.user.id, displayName = this.props.user.displayName

      deepLinks.copy = await createFanReferralLink("Pasteboard", userId, displayName)
      deepLinks.twitter = await createFanReferralLink("Twitter", userId, displayName)
      deepLinks.facebook = await createFanReferralLink("Facebook", userId, displayName)
      //deepLinks.instagram = await createArtistReferralLink("Instagram", userId)

      deepLinks.setup = true

      this.setState({ ...this.state, deepLinks, loadingDeepLinks: false })
    } catch(e) {
      var deepLinks = { ...this.state.deepLinks }

      deepLinks.error = e

      this.setState({ ...this.state, deepLinks, loadingDeepLinks: false })
    }
  }

  render() {
    const isMobile = window.innerWidth < 576

    if((!this.state.deepLinks.setup && !this.state.deepLinks.error) && !this.state.loadingDeepLinks && this.props.user.id !== "")
      this.setupDeepLinks()

    return (
      <Container>
        <Row>
          <h1 className="w-100 text-center m-0" style={{ fontSize: "3.25rem" }}>Invite Fans</h1>
        </Row>
        <Row className="d-flex mt-sm">
          <Col md="6" className="ml-auto mr-auto">
            <h3 className="text-white w-100 text-center m-0 mb-3">Invite your fans to stream your music!</h3>
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
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check me out on Revibe Music! ${this.state.deepLinks.twitter} @revibemusic8`)}`}
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
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(FansReferrals)