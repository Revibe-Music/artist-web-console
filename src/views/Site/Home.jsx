/*!

=========================================================
* BLK Design System PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


import React from "react";
import { Link } from "react-router-dom";

import { Badge, Button, Container, Row, Col, Nav, NavLink, NavItem, TabContent, TabPane, Card, CardBody, CardHeader, Collapse } from "reactstrap";
import Slick from "react-slick";
import classnames from "classnames"

// core components
import VideoHeader from "components/Headers/VideoHeader.jsx";
import VideoHeader2 from "components/Headers/VideoHeader2.jsx";
import ScrollNavbar from "components/Navbars/ScrollNavbar.jsx";
import Footer from "components/Footers/Footer.jsx";
import QuoteVideo from "components/Features/QuoteVideo.jsx"
import Icon from "components/Icons/icons.js"
import MailChimpForm from "components/Forms/Mailchimp";
import MetaHelmet from "components/MetaHelmet/MetaHelmet";

// custom previous button for the slick component
const PrevButton = props => {
  return (
    <Button
      className="btn-round btn-icon btn-simple slick-prev slick-arrow"
      color="primary"
      aria-label="Previous"
      type="button"
      onClick={props.onClick}
    >
      <i className="tim-icons icon-minimal-left" />
    </Button>
  );
};
// custom next button for the slick component
const NextButton = props => {
  return (
    <Button
      className="btn-round btn-icon btn-simple slick-next slick-arrow"
      color="primary"
      aria-label="Next"
      type="button"
    >
      <i className="tim-icons icon-minimal-right" onClick={props.onClick} />
    </Button>
  );
};


let slickHeader3Settings = {
  dots: false,
  infinite: true,
  centerMode: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  prevArrow: <PrevButton />,
  nextArrow: <NextButton />,
  className: "center slider slick-buttons-under",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
};


class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tabs1: 1,
      collapse: 1
    }
  }

  toggleTabs = (e, tabSet, tabId) => {
    e.preventDefault()
    this.setState({ ["tabs"+tabSet]: tabId })
  }

  openCollapse = collapse => {
    this.setState({ collapse: this.state.collapse === collapse ? -1 : collapse });
  };


  componentDidMount() {
    document.body.classList.add("index-page");
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.wrapper.scrollTop = 0;
  }

  componentWillUnmount() {
    document.body.classList.remove("index-page");
  }

  render() {
    const isMobile = window.innerWidth < 576

    return (
      <>
      <MetaHelmet 
        title="Home - Revibe Artists"
      
      />
      <ScrollNavbar/>
      <div className="wrapper" ref="wrapper">
          <div className="header-filter">
            <VideoHeader />
          </div>
          {/*<div className="header-filter">
            <VideoHeader2/>
          </div>*/}
        <div className="main">
          {/* Navigation Pills Section */}
          <div className="section section-pills">
            <Container>
              <Row>
                <h2 className="title text-center ml-md-auto mr-md-auto ml-1 mr-1">Revibe gives artists one dashboard with all the tools they need to succeed.</h2>
              </Row>
              <Row>
                <Nav className="nav-pills-primary d-flex justify-content-center" pills role="tablist" style={{ width: "100%" }}>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.tabs1 === 1
                      })}
                      onClick={e => this.toggleTabs(e, 1, 1)}
                      style={{ cursor: "pointer" }}
                    >
                      Hosting
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.tabs1 === 2
                      })}
                      onClick={e => this.toggleTabs(e, 1, 2)}
                      style={{ cursor: "pointer" }}
                    >
                      Analytics
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.tabs1 === 3
                      })}
                      onClick={e => this.toggleTabs(e, 1, 3)}
                      style={{ cursor: "pointer" }}
                    >
                      Relink
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.tabs1 === 4
                      })}
                      onClick={e => this.toggleTabs(e, 1, 4)}
                      style={{ cursor: "pointer" }}
                    >
                      Marketplace
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.tabs1 === 5
                      })}
                      onClick={e => this.toggleTabs(e, 1, 5)}
                      style={{ cursor: "pointer" }}
                    >
                      Distribution
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.tabs1 === 6
                      })}
                      onClick={e => this.toggleTabs(e, 1, 6)}
                      style={{ cursor: "pointer" }}
                    >
                      Merchandise
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.tabs1 === 7
                      })}
                      onClick={e => this.toggleTabs(e, 1, 7)}
                      style={{ cursor: "pointer" }}
                    >
                      Marketing
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent className="mt-3 text-md-left text-center ml-md-auto mr-md-auto ml-2 mr-2" style={!isMobile ? { width: "55%" } : { width: "100%" }} activeTab={"tabs1-" + this.state.tabs1}>
                  <TabPane className="description" tabId="tabs1-1">
                    Upload unlimited tracks to be streamed on Revibe Music for free. Give credit to everyone
                    who contributed and reach new fans through our proprietary tagging mechanism. Let your fans
                    stream your free music and distributed tracks through one app, only on Revibe Music.
                  </TabPane>
                  <TabPane className="description" tabId="tabs1-2">
                    View integrated analytics to get a wholistic view of your music career. Revibe is the only
                    platform that can combine data from your streams, link clicks, merchandise and collaboration
                    sales, and marketing efforts.
                  </TabPane>
                  <TabPane className="description" tabId="tabs1-3">
                    Customize your own landing page with unlimited links. These links can be dispalyed on your
                    Revibe Artist Profile, or at a custom URL you can share anywhere, like your Instagram bio!
                  </TabPane>
                  <TabPane className="description" tabId="tabs1-4">
                    Buy and sell beats, features, mixing and mastering services, and more in our all in one
                    collaboration marketplace. Revibe's marketplace is integrated with our distribution and
                    hosting platforms, making it a breeze to manage contracts, leases, licenses, and royalty splits.
                    Our platform was built around giving credit, and all contributions will be visible to fans in
                    the Revibe Music app.
                  </TabPane>
                  <TabPane className="description" tabId="tabs1-5">
                    Distribute your tracks to over 100 streaming services and music stores. Keep 100% of your royalties,
                    and 100% ownership of your music.
                  </TabPane>
                  <TabPane className="description" tabId="tabs1-6">
                    Sell merchandise to fans without paying for inventory. On demand, drop-shipped merchandise allows you
                    to sell products to your fans without the hassle. Simply upload a design, choose a product, and set
                    the price to get started. When a fan makes a purchase, the order will be printed and shipped directly
                    to the customer, and the profists deposited into your bank account.
                  </TabPane>
                  <TabPane className="description" tabId="tabs1-7">
                    Manage your email and social media marketing all through Revibe. Reach your fans
                    directly through Revibe Music. Analyze your marketing data, and see how it is driving streams, sales, and collaborations.
                  </TabPane>
                </TabContent>
                <br/>
                <div style={{ width: "100%" }} className="d-flex justify-content-center">
                  <Link to="/account/register">
                    <Button
                      className="btn-round btn-primary mt-4"
                      size="md"
                    >
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
              </Row>
            </Container>
          </div>
          <div className="accordion-1">
            <Container>
              <Row>
                <Col className="ml-auto mr-auto text-center" md="6">
                  <h1 className="title mb-4 mt-5">Frequently Asked Questions</h1>
                  <div className="section-space" />
                </Col>
              </Row>
              <Row>
                <Col className="ml-auto" md="12">
                  <div className="accordion mt-2 mb-sm">
                    <Card className="custom-accordion">
                      <CardHeader>
                        <h5 className="mb-0">
                          <Button
                            className="w-100 text-left text-primary"
                            color="link"
                            aria-expanded={this.state.collapse === 1}
                            onClick={() => this.openCollapse(1)}
                            style={{ whiteSpace: "normal" }}
                          >
                            How much does Revibe cost?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 1}>
                        <CardBody className="text-white">
                        Revibe is free right now! Ultimately, Revibe will have a freemium model where artists can use
                        most of the features and keep 80-90% of the revenue they generate,
                        or pay us a monthly subscription to keep 100% of the revenue. We expect Revibe's premium plan to cost around $15 per month
                        and include unlimited hosting, unlimited distribution, unlimited marketplace transactions,
                        and unlimited merchandise sales with the artist keeping 100% of all revenues.
                        Please <a href="/contact-us">reach out here</a> if you have any questions, comments, or concernse regarding our model, we are in it to help people like you!
                        </CardBody>
                      </Collapse>
                    </Card>
                    <Card className="custom-accordion other-cards">
                      <CardHeader>
                        <h5 className="mb-0">
                          <Button
                            className="w-100 text-left text-primary"
                            color="link"
                            aria-expanded={this.state.collapse === 2}
                            onClick={() => this.openCollapse(2)}
                            style={{ whiteSpace: "normal" }}
                          >
                            What features are available now? What features does Revibe have planned for the future?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 2}>
                        <CardBody className="text-white">
                        Revibe currently allows you to upload tracks to be streamed on Revibe Music,
                        tag contributors, and set up your tip jar and links to display on your Revibe Artist
                        profile and Relink page. We are currently building out our marketplace,
                        which will allow you to buy and sell beats, mixing and mastering services, cover art,
                        and more with other artists! The marketplace will be ready next month,
                        after which we will focus on improving our analytics and adding digital distribution.
                        We also plan on adding merchandise, marketing, and booking features to the Revibe Artist platform in the future.
                        </CardBody>
                      </Collapse>
                    </Card>
                    <Card className="custom-accordion other-cards">
                      <CardHeader>
                        <h5 className="mb-0">
                          <Button
                            className="w-100 text-left text-primary"
                            color="link"
                            aria-expanded={this.state.collapse === 3}
                            onClick={() => this.openCollapse(3)}
                            style={{ whiteSpace: "normal" }}
                          >
                            Does Revibe own the music that is uploaded?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 3}>
                        <CardBody className="text-white">
                        No! You retain 100% of the rights to your music. By uploading your music,
                        you grant Revibe and Revibe Music users a license to listen to your music
                        royalty free. You can read more information in our <a href="https://revibe-media.s3.us-east-2.amazonaws.com/Terms+and+Conditions.pdf">Terms and Conditions</a>.
                        </CardBody>
                      </Collapse>
                    </Card>
                    <Card className="custom-accordion other-cards">
                      <CardHeader>
                        <h5 className="mb-0">
                          <Button
                            className="w-100 text-left text-primary"
                            color="link"
                            aria-expanded={this.state.collapse === 4}
                            onClick={() => this.openCollapse(4)}
                            style={{ whiteSpace: "normal" }}
                          >
                            Does Revibe pay royalties for songs streamed through Revibe Music?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 4}>
                        <CardBody className="text-white">
                        Artists do not receive royalties on tracks that they upload to Revibe. However,
                        all Spotify and YouTube tracks played through Revibe Music are counted as streams
                        on the respective sources and royalties will be paid accordingly. For example,
                        if you stream a Spotify song on Revibe Music, that stream will be reflected
                        in your Spotify for Artists data and royalties for it will be paid out through
                        your distributor.
                        </CardBody>
                      </Collapse>
                    </Card>
                    <Card className="custom-accordion other-cards">
                      <CardHeader>
                        <h5 className="mb-0">
                          <Button
                            className="w-100 text-left text-primary"
                            color="link"
                            aria-expanded={this.state.collapse === 5}
                            onClick={() => this.openCollapse(5)}
                            style={{ whiteSpace: "normal" }}
                          >
                            What is a contributor? {" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 5}>
                        <CardBody className="text-white">
                        Contributors on Revibe represent everyone who had a part in creating a song.
                        We believe everyone should receive credit, from the producer to the engineer
                        to the graphic designer and contributions are our way of giving them credit.
                        It's just like tagging someone in a picture on Instgram. Once they accept the
                        contribution, their profile will also display the track and their contribution.
                        Contributors are also able to see analytics on tracks they contributed to,
                        depending on each user's settings. If someone doesn't have a Revibe account
                        yet, please invite them! You can tag them as a contributor and they will
                        receive credit upon signing up for an account with the same email address.
                        </CardBody>
                      </Collapse>
                    </Card>
                    <Card className="custom-accordion other-cards">
                      <CardHeader>
                        <h5 className="mb-0">
                          <Button
                            className="w-100 text-left text-primary"
                            color="link"
                            aria-expanded={this.state.collapse === 6}
                            onClick={() => this.openCollapse(6)}
                            style={{ whiteSpace: "normal" }}
                          >
                            How does the Tip Jar work?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 6}>
                        <CardBody className="text-white">
                        The tip jar was designed to be a direct way to draw support from your fans.
                        It's pretty simple, enter your Venmo and Cashapp username, and we will provide
                        a link for your fans to donate directly to you!
                        </CardBody>
                      </Collapse>
                    </Card>
                    <Card className="custom-accordion other-cards">
                      <CardHeader>
                        <h5 className="mb-0">
                          <Button
                            className="w-100 text-left text-primary"
                            color="link"
                            aria-expanded={this.state.collapse === 7}
                            onClick={() => this.openCollapse(7)}
                            style={{ whiteSpace: "normal" }}
                          >
                            Why should I upload my music to Revibe?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 7}>
                        <CardBody className="text-white">
                        Uploading your music to Revibe makes it available to fans on Revibe Music alongside
                        YouTube and Spotify. This makes it a great place to upload your tracks that aren't on
                        those platforms, so that your fans don't have to switch back and forth between apps to
                        enjoy all of your tracks! 
                        </CardBody>
                      </Collapse>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          {/* ********* TESTIMONIALS 3 ********* */}
          <div className="testimonials-3">
            <Container>
              <Row>
                <QuoteVideo
                  artist="Kidnap"
                  avatar={require("assets/site/img/Kidnap.JPG")}
                  video={require("assets/site/img/kidnap-btv.mp4")}
                >
                  I didn't really think they would bring everything
                  I already do every day into one platform.
                  <br/>. . . <br/>
                  One of the most important features Revibe has to offer
                  is the collaboration feature. Being able to credit everyone
                  who had a role in making the music wheter it be engineers, producers,
                  all the way to graphic designers.
                </QuoteVideo>
              </Row>
              <Row>
                <QuoteVideo
                  artist="DJ Cmix"
                  avatar={require("assets/site/img/dj-cmix.jpg")}
                  video={require("assets/site/img/dj-cmix-bdv.mp4")}
                  right
                >
                  If you are serious about your career, I suggest you hop
                  on Revibe.
                  <br/>. . . <br/>
                  This independent route is not as easy as it seems, but
                  it can be done.
                </QuoteVideo>
              </Row>
            </Container>
          </div>
          {/* ********* END TESTIMONIALS 3 ********* */}
          <MailChimpForm />
          <div className="social-line social-line-big-icons mb-lg">
            <Container>
              <Row className="d-flex justify-content-center">
                <Col md="2" className={`${isMobile ? "border-right-0" : ""}`}>
                  <Button
                    className="btn-simple btn-icon btn-footer"
                    color="primary"
                    href="https://instagram.com/revibemusic8"
                    target="_blank"
                  >
                    <i className="fab fa-instagram" />
                  </Button>
                </Col>
                <Col md="2" className={`${isMobile ? "border-right-0" : ""}`}>
                  <Button
                    className="btn-simple btn-icon btn-footer"
                    color="primary"
                    href="https://twitter.com/revibemusic8"
                    target="_blank"
                  >
                    <i className="fab fa-twitter" />
                  </Button>
                </Col>
                <Col md="2" className={`${isMobile ? "border-right-0" : ""}`}>
                  <Button
                    className="btn-simple btn-icon btn-footer"
                    color="primary"
                    href="https://facebook.com/revibemusic8"
                    target="_blank"
                  >
                    <i className="fab fa-facebook-square" />
                  </Button>
                </Col>
                <Col md="2" className={`${isMobile ? "border-right-0" : ""}`}>
                  <Button
                    className="btn-simple btn-icon btn-footer"
                    color="primary"
                    href="https://vm.tiktok.com/GYQojE/"
                    target="_blank"
                  >
                    <Icon icon="tiktok" width="24px" height="24px" color="#7248BD" />
                  </Button>
                </Col>
                <Col md="2" className={`${isMobile ? "border-right-0" : ""}`}>
                  <Button
                    className="btn-simple btn-icon btn-footer"
                    color="primary"
                    href="https://www.youtube.com/channel/UCGSz0umIQ-xCKB8UsGKDK3A"
                    target="_blank"
                  >
                    <i className="fab fa-youtube" />
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        {/* ********* FEATURES 1 *********
        <div className="features-1" style={{paddingBottom: "0px"}}>
          <Container fluid>
            <Row >
              <Col md="4" >
                <div className="info info-hover" style={{paddingTop: "20px"}}>
                  <div className="icon icon-primary">
                  <img
                      alt="..."
                      className="bg-blob"
                      src={require("assets/site/img/feature-blob/primary.png")}
                    />
                    <i className="tim-icons icon-single-02" />
                  </div>
                  <h4 className="info-title">For Artists</h4>
                  <p className="description">
                    Upload your tracks to allow fans to stream
                    on Revibe Music, where they can stream
                    alongside their Spotify and YouTube Music Libraries
                  </p>
                </div>
                </Col>
                <Col md="8">
                <img
                    alt="..."
                    className="img auto"
                    style={{width:"80%"}}
                    // align="middle"
                    src={require("assets/site/img/rapper_1.jpg")}
                  />
                </Col>
                </Row>
                <Row style={{width:"100%"}}> 
                <Col md="4">
                <div className="info info-hover">
                  <div className="icon icon-primary">
                    <img
                      alt="..."
                      className="bg-blob"
                      src={require("assets/site/img/feature-blob/primary.png")}
                    />
                    <i className="tim-icons icon-sound-wave" />
                  </div>
                  <h4 className="info-title">For Creatives</h4>
                  <p className="description">
                    Collaborate through our Marketplace,
                    and recieve credit for your work
                    everywhere in the Revibe ecosystem
                  </p>
                </div>
                </Col>
                <Col md="8">
                <img
                    alt="..."
                    className="img auto"
                    style={{width:"87%", paddingLeft:"5%", paddingTop:"5%", paddingBottom:"5%"}}
                    // align="middle"
                    src={require("assets/site/img/music_studio_1.jpg")}
                  />
                </Col>
                </Row>
                <Row>
                <Col md="4">
                <div className="info info-hover">
                  <div className="icon icon-primary">
                    <img
                      alt="..."
                      className="bg-blob"
                      src={require("assets/site/img/feature-blob/primary.png")}
                    />
                    <i className="tim-icons icon-single-copy-04" />
                  </div>
                  <h4 className="info-title">For Managers</h4>
                  <p className="description">
                    For managers and artists alike, Revibe is
                    an all-in-one platform for managing a
                    recording artist
                  </p>
                </div>
                </Col>
                <Col md="8">
                <img
                    alt="..."
                    className="img auto"
                    style={{width:"80%"}}
                    // align="middle"
                    src={require("assets/site/img/manager_1.jpg")}
                  />
                </Col>
                </Row>
          </Container>
        </div>
        ********* END FEATURES 1 ********* */}
        </div>
        <Footer />
      </div>
      </>
    );
  }
}

export default Home;
