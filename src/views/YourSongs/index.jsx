import React from "react";

// reactstrap components
import {
  Button,
  Container,
  Collapse,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Row,
  Col
} from "reactstrap";
import { NavLink as Link } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

import Uploads from './Uploads'
import Contributions from './Contributions'

class YourSongs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: "uploads",
    };
  }

  // with this function we change the active tab for all the tabs in this page
  changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault();
    this.setState({
      [tabState]: tabName
    });
  };

  render() {
    return (
      <div className="content">
      <Container>
        <Row style={{justifyContent: "space-between", alignItems: "center"}}>
        <Nav className="nav-pills-primary" pills>
          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "uploads" ? "active" : ""}
              onClick={e => this.changeActiveTab(e, "tabs", "uploads")}
            >
              Uploads
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "contributions" ? "active" : "" }
              onClick={e => this.changeActiveTab(e, "tabs", "contributions") }
            >
              Contributions
            </NavLink>
          </NavItem>

        </Nav>
        <a data-tip data-for="uploadToolTip">
          <Link to={'uploads/new'} activeClassName="">
            <Button
              style={{margin: 0}}
              color="primary"
              onClick={() => this.setState({uploading:true})}
            >
              New Upload
            </Button>
          </Link>
        </a>
        <ReactTooltip id="uploadToolTip" effect='solid' delayShow={1500} direction="right">
          <span>Upload new songs/albums</span>
        </ReactTooltip>
        </Row>

        <TabContent
          className="tab-space"
          activeTab={this.state.tabs}
        >
          <TabPane tabId="uploads">
            <Uploads />
          </TabPane>
          <TabPane tabId="contributions">
            <Contributions />
          </TabPane>
        </TabContent>
        </Container>
      </div>
    );
  }
}

export default YourSongs;
