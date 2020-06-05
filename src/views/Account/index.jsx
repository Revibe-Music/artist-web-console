import React from "react";

// reactstrap components
import {
  Container,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
} from "reactstrap";

import Profile from './Profile'
import Settings from './Settings'
import TipJar from './TipJar'

class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabs: "profile",
    };
  }

  componentDidMount() {
    document.body.classList.toggle("profile-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("profile-page");
  }

  // with this function we change the active tab for all the tabs in this page
  changeActiveTab = (e, tabState, tadName) => {
    e.preventDefault();
    this.setState({
      [tabState]: tadName
    });
  };

  render() {
    return (
      <div className="content">
        <Container>

        <Nav className="nav-pills-primary" pills>

          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "profile" ? "active" : ""}
              onClick={e => this.changeActiveTab(e, "tabs", "profile")}
            >
              Profile
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "tipJar" ? "active" : "" }
              onClick={e => this.changeActiveTab(e, "tabs", "tipJar") }
            >
              Tip Jar
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "settings" ? "active" : "" }
              onClick={e => this.changeActiveTab(e, "tabs", "settings") }
            >
              Settings
            </NavLink>
          </NavItem>

        </Nav>

        <TabContent
          className="tab-space"
          activeTab={this.state.tabs}
        >
          <TabPane tabId="profile">
            <Profile />
          </TabPane>
          <TabPane tabId="tipJar">
            <TipJar />
          </TabPane>
          <TabPane tabId="settings">
            <Settings />
          </TabPane>
        </TabContent>
      </Container>

      </div>
    );
  }
}

export default Account;
