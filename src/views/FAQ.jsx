import React from 'react'

import {
  Container,
  Row,
  Col,
  Button,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Card
} from "reactstrap";

import { builder, BuilderComponent } from '@builder.io/react'
import { logEvent } from 'amplitude/amplitude';
import OnboardingSlider from 'components/Modals/OnboardingSlider';

import "@builder.io/widgets"

builder.init('c4efecdddef14d36a98d2756c1d5f56b')

const hostname = window && window.location && window.location.hostname;

export default class FAQPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tutorialMode: this.props.location && this.props.location.state ? this.props.location.state.onboardingSliderOpen : false,
      isOpen: false,
      currentTab: this.props.location && this.props.location.state ? this.props.location.state.onboardingSliderOpen ? 1 : 0 : 0
    }

    this.toggle = this.toggle.bind(this)
    this.setActiveTab = this.setActiveTab.bind(this)
  }

  toggle() {
    this.setState({ ...this.state, isOpen: !this.state.isOpen })
  }

  setActiveTab(e, tab) {
    e.preventDefault()

    this.setState({ ...this.state, currentTab: tab })
  }

  render() {
    console.log(this.state)

    return (
      <div className="content">
        <Container>
          {!this.state.tutorialMode ? <Nav className="nav-pills-primary" pills>
            <NavItem>
              <NavLink
                data-toggle="tab"
                className={this.state.currentTab === 0 ? "active" : "" }
                onClick={e => this.setActiveTab(e, 0) }
              >
                FAQ
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                data-toggle="tab"
                className={this.state.currentTab === 1 ? "active" : "" }
                onClick={e => this.setActiveTab(e, 1) }
              >
                What is Revibe?
              </NavLink>
            </NavItem>
          </Nav> : null}
          <TabContent
            className="tab-space"
            activeTab={this.state.currentTab}
          >
            <TabPane tabId={0}>
              <BuilderComponent
                name="component"
                entry="a163bda773e346ff96fbbf3bb45a9349" 
              />
            </TabPane>
            <TabPane tabId={1}>
              <OnboardingSlider 
                tutorialMode={this.state.tutorialMode}
              />
            </TabPane>
          </TabContent>
        </Container>
      </div>
    )
  }
}