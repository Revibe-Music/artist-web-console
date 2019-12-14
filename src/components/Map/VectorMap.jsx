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
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
// reactstrap components
import { Card, CardHeader, CardTitle, CardBody, Table, Row, Col } from "reactstrap";

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};

class VectorMapView extends React.Component {
  render() {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Global Streams by Top Locations</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <Table responsive>
                  <tbody>
                    <tr>
                      <td>
                        <div className="flag">
                          <img
                            alt="..."
                            src={require("assets/img/US.png")}
                          />
                        </div>
                      </td>
                      <td>USA</td>
                      <td className="text-right">2.920</td>
                      <td className="text-right">53.23%</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flag">
                          <img
                            alt="..."
                            src={require("assets/img/DE.png")}
                          />
                        </div>
                      </td>
                      <td>Germany</td>
                      <td className="text-right">1.300</td>
                      <td className="text-right">20.43%</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flag">
                          <img
                            alt="..."
                            src={require("assets/img/AU.png")}
                          />
                        </div>
                      </td>
                      <td>Australia</td>
                      <td className="text-right">760</td>
                      <td className="text-right">10.35%</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flag">
                          <img
                            alt="..."
                            src={require("assets/img/GB.png")}
                          />
                        </div>
                      </td>
                      <td>United Kingdom</td>
                      <td className="text-right">690</td>
                      <td className="text-right">7.87%</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flag">
                          <img
                            alt="..."
                            src={require("assets/img/RO.png")}
                          />
                        </div>
                      </td>
                      <td>Romania</td>
                      <td className="text-right">600</td>
                      <td className="text-right">5.94%</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flag">
                          <img
                            alt="..."
                            src={require("assets/img/BR.png")}
                          />
                        </div>
                      </td>
                      <td>Brasil</td>
                      <td className="text-right">550</td>
                      <td className="text-right">4.34%</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col className="ml-auto mr-auto" md="6">
                <VectorMap
                  map={"world_mill"}
                  backgroundColor="transparent"
                  zoomOnScroll={false}
                  containerStyle={{
                    width: "100%",
                    height: "300px"
                  }}
                  regionStyle={{
                    initial: {
                      fill: "#e4e4e4",
                      "fill-opacity": 0.9,
                      stroke: "none",
                      "stroke-width": 0,
                      "stroke-opacity": 0
                    }
                  }}
                  series={{
                    regions: [
                      {
                        values: mapData,
                        scale: ["#7248BD", "#444444"],
                        normalizeFunction: "polynomial"
                      }
                    ]
                  }}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default VectorMapView;
