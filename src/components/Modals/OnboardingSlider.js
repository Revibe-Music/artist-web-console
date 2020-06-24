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
  Button,
  Progress
} from "reactstrap";
import { builder, BuilderComponent } from '@builder.io/react'
import { logEvent } from 'amplitude/amplitude';
import { withRouter } from 'react-router-dom';
import Icon from 'components/Icons/icons';
import { FaHeadphones, FaLink, FaChartLine } from 'react-icons/fa';

builder.init('c4efecdddef14d36a98d2756c1d5f56b')

export default class OnboardingSlider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTab: 0,
      hasReachedLastTab: false,
      tabsVisited: [0]
    }

    this.toggleTab = this.toggleTab.bind(this)
    this.finishEvent = this.finishEvent.bind(this)
    this.setTab = this.setTab.bind(this)
  }

  toggleTab(e, increase) {
    e.preventDefault()

    if(increase) {
      var tabsVisited = this.state.tabsVisited

      if(!tabsVisited.includes(this.state.currentTab+1))
        tabsVisited.push(this.state.currentTab+1)

      this.setState({ ...this.state, currentTab: this.state.currentTab + 1, hasReachedLastTab: (this.state.hasReachedLastTab || (tabsVisited.length === 4 || this.state.currentTab + 1 == 3)), tabsVisited: tabsVisited })
    } else
      this.setState({ ...this.state, currentTab: this.state.currentTab - 1 })
  }

  setTab(tabId) {
    var tabsVisited = this.state.tabsVisited

    if(!tabsVisited.includes(tabId))
      tabsVisited.push(tabId)

    this.setState({ ...this.state, currentTab: tabId, tabsVisited: tabsVisited, hasReachedLastTab: (this.state.hasReachedLastTab || (tabsVisited.length === 4 && tabId == 3)) })
  }

  finishEvent(e, history) {
    e.preventDefault()

    if(!this.state.hasReachedLastTab || this.state.tabsVisited.length != 4)
      logEvent("Onboarding", "Skipped", { lastSlideSeen: this.state.currentTab + 1 })

    history.push("/dashboard/uploads")
  }

  render() {
    const FinishButton = withRouter(({ history }) => (
      <Button
        color="primary"
        className={`ml-auto mr-0`}
        size="md"
        onClick={e => this.finishEvent(e, history)}
      >
        Let's Go!
      </Button>
    ));

    return (
      <Container>
        {this.props.tutorialMode ? <Row className="d-flex">
          <Col xs="6" md="3" className="ml-auto mr-0 d-flex">
            <FinishButton />
          </Col>
        </Row> : null}
        <Row className="d-flex">
          <Col xs="10" md="8" className="ml-auto mr-auto d-flex">
            <div className="w-100 ml-auto mr-auto d-flex" style={{ height: "100px" }}>
              <div
                id="progress-bar"
                style={{ backgroundColor: "rgba(59,56,53,1)", 
                  width: "80%", 
                  height: "15px", 
                  borderRadius: "10px" 
                }}
                className="m-auto d-flex"
              >
                <div
                  id="progress-bar"
                  style={{ backgroundColor: "#7248BD", 
                    width: `calc(${(this.state.currentTab+1) * 20}% - 6px)`, 
                    height: "9px", 
                    margin: "3px", 
                    borderRadius: "5px" 
                  }}
                />
              </div>
              <div 
                id="icons"
                className="position-absolute d-flex w-100"
              >
                <div className="ml-auto mr-auto d-flex" style={{ width: "65%" }}>
                  <div
                    className="ml-auto mr-auto"
                    style={{
                      backgroundColor: "black",
                      width: "100px",
                      height: "100px",
                      borderRadius: "100%",
                      border: "5px solid rgba(59,56,53,1)",
                      cursor: "pointer"
                    }}
                    onClick={() => this.setTab(0)}
                  >
                    <Icon
                      icon="revibe"
                      width="90px"
                      height="90px"
                      style={{
                        padding: "15px",
                      }}
                    />
                  </div>
                  <div
                    className="ml-auto mr-auto"
                    style={{
                      backgroundColor: `${this.state.tabsVisited.includes(1) ? "black" : "white"}`,
                      width: "100px",
                      height: "100px",
                      borderRadius: "100%",
                      border: "5px solid rgba(59,56,53,1)",
                      cursor: "pointer"
                    }}
                    onClick={() => this.setTab(1)}
                  >
                    <FaHeadphones 
                      className="ml-auto mr-auto"
                      style={{
                        color: `${this.state.tabsVisited.includes(1) ? "#7248BD" : "black"}`,
                        width: "90px",
                        height: "90px",
                        padding: "15px",
                      }}
                    />
                  </div>
                  <div
                    className="ml-auto mr-auto"
                    style={{
                      backgroundColor: `${this.state.tabsVisited.includes(2) ? "black" : "white"}`,
                      width: "100px",
                      height: "100px",
                      borderRadius: "100%",
                      border: "5px solid rgba(59,56,53,1)",
                      cursor: "pointer"
                    }}
                    onClick={() => this.setTab(2)}
                  >
                    <FaLink 
                      className="ml-auto mr-auto"
                      style={{
                        color: `${this.state.tabsVisited.includes(2) ? "#7248BD" : "black"}`,
                        width: "90px",
                        height: "90px",
                        padding: "15px"
                      }}
                    />
                  </div>
                  <div
                    className="ml-auto mr-auto"
                    style={{
                      backgroundColor: `${this.state.tabsVisited.includes(3) ? "black" : "white"}`,
                      width: "100px",
                      height: "100px",
                      borderRadius: "100%",
                      border: "5px solid rgba(59,56,53,1)",
                      cursor: "pointer"
                    }}
                    onClick={() => this.setTab(3)}
                  >
                    <FaChartLine 
                      className="ml-auto mr-auto"
                      style={{
                        color: `${this.state.tabsVisited.includes(3) ? "#7248BD" : "black"}`,
                        width: "90px",
                        height: "90px",
                        padding: "15px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" md="12" xs="12" className="mt-sm">
            <TabContent activeTab={`tab-${this.state.currentTab}`}>
              <TabPane tabId="tab-0">
              <BuilderComponent
                name="artist-onboarding-sliders"
                entry="22e1e398acf945cd81c1d8c53c6c8621" 
              />
              </TabPane>
              <TabPane tabId="tab-1">
                <BuilderComponent
                  name="artist-onboarding-sliders"
                  entry="544cd145971e4545b6a833142e0f6296"
                />
              </TabPane>
              <TabPane tabId="tab-2">
                <BuilderComponent
                  name="artist-onboarding-sliders"
                  entry="5ec9af8e1ee74ad7b3ebfdadc60c8138"
                />
              </TabPane>
              <TabPane tabId="tab-3">
                <BuilderComponent
                  name="artist-onboarding-sliders"
                  entry="7d81405c1c5a4ca981d795e48a27a159"
                />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
        <Row>
          {/*<Col xs="4" md="4" className="text-center d-flex align-items-center justify-content-center">
            <a 
              className=""
              href=""
              onClick={e => this.skipEvent(e)}
            >
              <h3 className="m-auto text-primary">Skip</h3>
            </a>
          </Col>*/}
          <Col xs="12" sm="12" className="d-flex">
            {this.state.currentTab !== 0 ?
              <Button
                color="primary"
                className={`btn-round ${this.state.currentTab === 3 ? "ml-auto mr-auto" : "ml-sm mr-auto"}`}
                onClick={e => this.toggleTab(e, false)}
              >
                Previous
              </Button>
            : null}
            {this.state.currentTab !== 3 ? <Button
              color="primary"
              className={`btn-round ${this.state.currentTab === 0 ? "ml-auto mr-auto" : "ml-auto mr-sm"}`}
              onClick={e => this.toggleTab(e, true)}
            >
              Next
            </Button> : null}
          </Col>
          {/*<Col xs="4" md="4" className="text-center d-flex align-items-center justify-content-center">
            {this.state.hasReachedLastTab ?
              <a 
                className=""
                href=""
                onClick={e => this.finishEvent(e)}
              >
                <h3 className="m-auto text-primary">Finish</h3>
              </a>
            : null}
            </Col>*/}
        </Row>
      </Container>
    )
  }
}