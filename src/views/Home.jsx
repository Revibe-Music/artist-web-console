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
                    Buy and sell beats, features, mixiing and mastering services, and more in our all in one
                    collaboration marketplace. Revibe's marketplace is integrated with our distribution and
                    hosting platforms, making it a breeze to manage contracts, leases, licenses, and royalty splits.
                    Our platform was built around giving credit, and all contributions will be visible to fans in
                    the Revibe Music app.
                  </TabPane>
                  <TabPane className="description" tabId="tabs1-4">
                    Customize your own landing page with unlimited links. These links can be dispalyed on your
                    Revibe Artist Profile, or at a custom URL you can share anywhere, like your Instagram bio!
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
                          >
                            How much does Revibe Music cost?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 1}>
                        <CardBody className="text-white">
                          Nothing! Revibe Music is free and always will be.
                          For the best experience, connect your premium Spotify account.
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
                          >
                            What if I don't have a premium subscription?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 2}>
                        <CardBody className="text-white">
                          It's okay! You can still use Revibe to stream our uploads and YouTube's catalog.
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
                          >
                            What music services are available through Revibe Music?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 3}>
                        <CardBody className="text-white">
                          Revibe Music currently supports Spotify, with Apple Music coming soon.
                          If you would like us to add any other services, please let us know <a href="https://revibe.tech/contact" target="_blank">here</a>.
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
                          >
                            Can I play YouTube videos in the background? {" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 4}>
                        <CardBody className="text-white">
                          Unfortunately YouTube videos cannot be played in the background in accordance with their terms of service.
                          To provide a smooth user experience Revibe Music offers a setting to skip
                          YouTube videos when shufﬂing or playing a playlist if the device is locked.
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
                          >
                            How do I upload my music to Revibe?{" "}
                            <i className="tim-icons icon-minimal-down float-right" />
                          </Button>
                        </h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.collapse === 5}>
                        <CardBody className="text-white">
                          If you are an artist you can upload your music to Revibe,
                          view analytics, and more on Revibe Artists!
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
                  <br/><br/>
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
                  <br/><br/>
                  This independent route is not as easy as it seems, but
                  it can be done.
                </QuoteVideo>
              </Row>
            </Container>
          </div>
          {/* ********* END TESTIMONIALS 3 ********* */}
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
