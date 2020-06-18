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

import NotificationAlert from "react-notification-alert";

import Icon from "components/Icons/icons.js"
import ArtistsReferrals from './Artists';
import FansReferrals from './Fans';

export default class ReferralsPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTab: 0
    }

    this.setActiveTab = this.setActiveTab.bind(this)
    this.showNotification = this.showNotification.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  setActiveTab(e, tab) {
    e.preventDefault()

    this.setState({ ...this.state, currentTab: tab })
  }

  showNotification(options) {
    this.refs.notificationAlert.notificationAlert(options);
  }

  render() {
    return (
      <>
        <div className="rna-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <div className="content">
          <Container className="mt-sm">
            <Nav className="nav-pills-primary" pills>
              <NavItem>
                <NavLink
                  data-toggle="tab"
                  className={this.state.currentTab === 0 ? "active" : "" }
                  onClick={e => this.setActiveTab(e, 0) }
                >
                  Artists
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  data-toggle="tab"
                  className={this.state.currentTab === 1 ? "active" : "" }
                  onClick={e => this.setActiveTab(e, 1) }
                >
                  Fans
                </NavLink>
              </NavItem>
            </Nav>
            <Card>
              <TabContent
                className="tab-space"
                activeTab={this.state.currentTab}
              >
                <TabPane tabId={0}>
                  <ArtistsReferrals showNotification={this.showNotification} />
                </TabPane>
                <TabPane tabId={1}>
                  <FansReferrals showNotification={this.showNotification} />
                </TabPane>
              </TabContent>
            </Card>
          </Container>
        </div>
      </>
    )
  }
}