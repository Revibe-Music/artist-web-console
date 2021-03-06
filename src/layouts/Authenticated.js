import React, {Component} from "react";
import { Route, Switch } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// core components
import Navbar from "components/Navbar/Navbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import { connect } from 'react-redux';
import { getProfile } from 'redux/authentication/actions.js'
import { getUploadedAlbums, getUploadedSongs, getAlbumContributions, getSongContributions } from 'redux/media/actions.js'

import routes from "./../routes/authenticatedRoutes.js";
import logo from "assets/portal/img/revibe-logo.jpg";

import "assets/portal/scss/black-dashboard-pro-react.scss?v=1.0.1";

var ps;

class Authenticated extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeColor: "primary",
      sidebarMini: true,
      opacity: 0,
      sidebarOpened: false
    };
    this.props.getUploadedAlbums()
    this.props.getUploadedSongs()
    this.props.getAlbumContributions()
    this.props.getSongContributions()
    this.props.getProfile()

    // default to stats page if user just goes to dashboard
    if(window.location.pathname==="/dashboard" || window.location.pathname==="/dashboard/") {
       this.props.history.push('/dashboard/stats')
    }

  }

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(this.refs.mainPanel);
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    window.addEventListener("scroll", this.showNavbarButton);
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
    window.removeEventListener("scroll", this.showNavbarButton);
  }

  componentDidUpdate(e) {
    if (e.location.pathname !== e.history.location.pathname) {
      if (navigator.platform.indexOf("Win") > -1) {
        let tables = document.querySelectorAll(".table-responsive");
        for (let i = 0; i < tables.length; i++) {
          ps = new PerfectScrollbar(tables[i]);
        }
      }
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }

  showNavbarButton = () => {
    if (
      document.documentElement.scrollTop > 50 ||
      document.scrollingElement.scrollTop > 50 ||
      this.refs.mainPanel.scrollTop > 50
    ) {
      this.setState({ opacity: 1 });
    } else if (
      document.documentElement.scrollTop <= 50 ||
      document.scrollingElement.scrollTop <= 50 ||
      this.refs.mainPanel.scrollTop <= 50
    ) {
      this.setState({ opacity: 0 });
    }
  };

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      return (
        <Route
          exact
          path={prop.layout + prop.path}
          component={prop.component}
          key={key}
        />
      );
    });
  };

  getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      }
      else {
        if (window.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  handleActiveClick = color => {
    this.setState({ activeColor: color });
  };

  toggleSidebar = () => {
    this.setState({
      sidebarOpened: !this.state.sidebarOpened
    });
    document.documentElement.classList.toggle("nav-open");
  };

  render() {
    //console.log(this.state)

    return (
      <>
        <div className="wrapper">

          <div className="rna-container">
            <NotificationAlert ref="notificationAlert" />
          </div>

          <Sidebar
            {...this.props}
            closeSidebar={this.toggleSidebar}
            routes={routes}
            activeColor={this.state.activeColor}
            logo={{
              outterLink: "https://revibe.tech",
              text: "Revibe",
              imgSrc: logo
            }}
          />
          <div
            className="main-panel"
            ref="mainPanel"
            data={this.state.activeColor}
          >
            <Navbar
              {...this.props}
              // brandText={this.getActiveRoute(routes)}
              sidebarOpened={this.state.sidebarOpened}
              toggleSidebar={this.toggleSidebar}
            />
            {this.getRoutes(routes)}
            {// we don't want the Footer to be rendered on full screen maps page
            this.props.location.pathname.indexOf("full-screen-map") !==
            -1 ? null : (
              <Footer />
            )}
          </div>
        </div>
      </>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  getProfile: () =>dispatch(getProfile()),
  getUploadedAlbums: () =>dispatch(getUploadedAlbums()),
  getUploadedSongs: () =>dispatch(getUploadedSongs()),
  getAlbumContributions: () =>dispatch(getAlbumContributions()),
  getSongContributions: () =>dispatch(getSongContributions()),
});

export default connect(null, mapDispatchToProps)(Authenticated);
