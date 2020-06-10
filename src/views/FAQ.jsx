import React from 'react'

import {
  Container,
  Row,
  Col,
  Button
} from "reactstrap";

import { builder, BuilderComponent } from '@builder.io/react'
import { logEvent } from 'amplitude/amplitude';
import OnboardingSlider from 'components/Modals/OnboardingSlider';

builder.init('c4efecdddef14d36a98d2756c1d5f56b')

const hostname = window && window.location && window.location.hostname;

export default class FAQPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({ ...this.state, isOpen: !this.state.isOpen })
  }

  render() {
    console.log(hostname)

    return (
      <div className="content">
        {hostname === "localhost" || hostname === "artist-website-test.s3-website.us-east-2.amazonaws.com" ?
          <>
            <OnboardingSlider isOpen={this.state.isOpen} toggle={this.toggle} />
            <Row className="d-flex">
              <Col md="2" className="ml-auto mr-0 d-flex">
                <Button className="btn-primary btn-simple ml-auto mr-auto" onClick={e => this.toggle()}>Information</Button>
              </Col>
            </Row>
          </>
        : null}
        <Container>
          <BuilderComponent
            name="component"
            entry="a163bda773e346ff96fbbf3bb45a9349" 
          />
        </Container>
      </div>
    )
  }
}