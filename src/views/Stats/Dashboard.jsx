/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import { connect } from 'react-redux';

// react plugin for creating vector maps
import VectorMap from "components/Map/VectorMap.jsx";
import BarGraph from "components/Charts/BarGraph.jsx";
import LineGraph from "components/Charts/LineGraph.jsx";
import GraphComp from "components/Charts/GraphComp.jsx";
import CharityCard from "components/Cards/CharityAnalytics.jsx";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content">
        <Container style={{ maxWidth: "90%" }}>
          <Row>
            <Col xs="12" sm="9" md="9" className="d-flex">
              <h1 className="m-0 mb-0 mt-auto" style={{ fontSize: "3.25rem" }}>Welcome, {this.props.user.displayName}</h1>
              {/*<Card className="card-chart">
                <CardHeader className="m-auto mr-auto">
                    <CardTitle tag="h4">The following charts/graphs are displaying stock data. User generated data is coming soon. </CardTitle>
                </CardHeader>
              </Card>*/}
            </Col>
            <Col xs="12" sm="3" md="3">
              <CharityCard />
            </Col>
            {/* Stream/Listener Cols */}
            <Col lg="3" md="6" sm="6" xs="12">
              <GraphComp
                type="card"
                data_type="num_streams"
                icon="icon-headphones"
                pills={[ "1w", "3m", "6m" ]}
              />
            </Col>
            <Col lg="3" md="6" sm="6" xs="12">
              <GraphComp
                type="card"
                data_type="listeners"
                pills={[ "1w", "3m", "6m" ]}
              />
            </Col>
            <Col lg="3" md="6" sm="6" xs="12">
              <GraphComp
                type="card"
                data_type="num_streams"
                period="all-time"
                icon="icon-headphones"
              />
            </Col>
            <Col lg="3" md="6" sm="6" xs="12">
              <GraphComp
                type="card"
                data_type="listeners"
                period="all-time"
              />
            </Col>
            {/* Line Graph Col */}
            <Col xs="12">
              <GraphComp
                type="line"
                data_type="num_streams"
                pills={[ "1w", "3m", "6m", "All-Time" ]}
                defaultPill={3}
              />
            </Col>
            <Col lg="6">
              <GraphComp
                type="bar"
                data_type="num_streams"
                pills={[ "1w", "3m", "6m", "All-Time" ]}
                defaultPill={3}
            />
            </Col>
            <Col lg="6">
              <GraphComp
                type="bar"
                data_type="listeners"
                pills={[ "1w", "3m", "6m", "All-Time" ]}
                defaultPill={3}
              />
            </Col>
            {/*<Col lg="12">
              <VectorMap />
            </Col>*/}
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(Dashboard);
