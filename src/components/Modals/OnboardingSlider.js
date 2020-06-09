import React from 'react'
import PropTypes from "prop-types";

// reactstrap components
import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabContent,
  TabPane,
  Button
} from "reactstrap";
import { builder, BuilderComponent } from '@builder.io/react'
import { logEvent } from 'amplitude/amplitude';

builder.init('c4efecdddef14d36a98d2756c1d5f56b')

export default class OnboardingSlider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTab: 0,
      hasReachedLastTab: false
    }

    this.toggleTab = this.toggleTab.bind(this)
    this.skipEvent = this.skipEvent.bind(this)
    this.finishEvent = this.finishEvent.bind(this)
  }

  toggleTab(e, increase) {
    e.preventDefault()

    if(increase)
      this.setState({ ...this.state, currentTab: this.state.currentTab + 1, hasReachedLastTab: (this.state.hasReachedLastTab || this.state.currentTab + 1 == 3) })
    else
      this.setState({ ...this.state, currentTab: this.state.currentTab - 1 })
  }

  skipEvent(e) {
    e.preventDefault()

    //Add one to the slide for a 1-4 range
    logEvent("Onboarding", "Skipped", { lastSlideSeen: this.state.currentTab + 1 })

    this.props.toggle()
  }

  finishEvent(e) {
    e.preventDefault()

    this.props.toggle()
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        modalClassName="modal-grey"
        size="xl"
        backdrop="static"
      >
        <Container>
          <Row>
            <Col xs="12" sm="12" md="12" xs="12" className="mt-sm">
              <TabContent activeTab={`tab-${this.state.currentTab}`}>
                <TabPane tabId="tab-0">
                  <BuilderComponent
                    name="component"
                    entry="e09041fbc6c146dabed3a955054c0dc4"
                  />
                </TabPane>
                <TabPane tabId="tab-1">
                  <BuilderComponent
                    name="component"
                    entry="7fe29bffeb134d3886a91389db6d8dc0"
                  />
                </TabPane>
                <TabPane tabId="tab-2">
                  <BuilderComponent
                    name="component"
                    entry="8d3ef71939c545ad83d537d1d600753f"
                  />
                </TabPane>
                <TabPane tabId="tab-3">
                  <BuilderComponent
                    name="component"
                    entry="c920f90ffb044b2db774ea2fac952ecc"
                  />
                </TabPane>
              </TabContent>
            </Col>
          </Row>
          <Row>
            <Col xs="4" md="4" className="text-center d-flex align-items-center justify-content-center">
              <a 
                className=""
                href=""
                onClick={e => this.props.skipEvent(e)}
              >
                <h3 className="m-auto text-primary">Skip</h3>
              </a>
            </Col>
            <Col xs="4" md="4" className="d-flex">
              <Button
                className="btn-round btn-icon btn-simple slick-prev slick-arrow ml-auto mr-1 mt-2 mb-2"
                color="primary"
                aria-label="Previous"
                type="button"
                onClick={e => this.toggleTab(e, false)}
                disabled={this.state.currentTab === 0}
              >
                <i className="tim-icons icon-minimal-left" />
              </Button>
              <Button
                className="btn-round btn-icon btn-simple slick-next slick-arrow ml-1 mr-auto mt-2 mb-2"
                color="primary"
                aria-label="Next"
                type="button"
                disabled={this.state.currentTab === 3}
                onClick={e => this.toggleTab(e, true)}
              >
                <i className="tim-icons icon-minimal-right" />
              </Button>
            </Col>
            <Col xs="4" md="4" className="text-center d-flex align-items-center justify-content-center">
              {this.state.hasReachedLastTab ?
                <a 
                  className=""
                  href=""
                  onClick={e => this.props.finishEvent(e)}
                >
                  <h3 className="m-auto text-primary">Finish</h3>
                </a>
              : null}
            </Col>
          </Row>
        </Container>
      </Modal>
    )
  }
}