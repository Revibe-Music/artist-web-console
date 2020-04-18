import React, {Component} from 'react';
import { BuilderComponent } from '@builder.io/react';
import { Badge, Button, Container, Row, Col, Nav, NavLink, NavItem, TabContent, TabPane, Card, CardBody, CardHeader, Collapse } from "reactstrap";

import Error404 from "./Error404";
import ScrollNavbar from "components/Navbars/ScrollNavbar.jsx";
import Footer from "components/Footers/Footer.jsx";
import MailChimpForm from "components/Forms/Mailchimp";
import Icon from "components/Icons/icons.js"


export default class CatchAllPage extends Component {
  state = { notFound: false }

  render() {
    const isMobile = window.innerWidth < 576
    return (
      <>

      {!this.state.notFound ?
        <>
          <ScrollNavbar/>
          <BuilderComponent
            apiKey="c4efecdddef14d36a98d2756c1d5f56b"
            model="page"
            name="page"
            contentLoaded={content => {
              if (!content) {
                this.setState({ notFound: true });
              }
            }}
            />
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
          <Footer />
      </>
      :
        <Error404 />
      }
      </>

  )
  }
}
