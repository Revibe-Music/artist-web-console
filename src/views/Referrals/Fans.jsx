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

export default class FansReferrals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <Container>
        <Row>
          <h1 className="w-100 text-center m-0" style={{ fontSize: "3.25rem" }}>Invite Fans</h1>
        </Row>
        <Row className="d-flex mt-sm">
          <Col md="6" className="ml-auto mr-auto">
            <h3 className="text-white w-100 text-center m-0 mb-3">Invite your fans to stream your music!</h3>
            <h3 className="text-white w-100 text-center m-0 mb-3">Share your link:</h3>
            <div className="w-100 d-flex">
              <h2 className="text-primary ml-auto mr-3 mt-auto mb-auto">Link goes here</h2>
              <Button
                className="ml-2 mr-auto btn-primary btn-round"
              >
                <i className="far fa-copy" />
              </Button>
            </div>
            <div className="w-100 d-flex mt-2">
              <Button
                className="btn-primary btn-icon btn-round ml-auto mr-2"
                color="default"
                size="lg"
              >
                <i className="fab fa-twitter" />
              </Button>
              <Button
                className="btn-primary btn-icon btn-round ml-2 mr-2"
                color="default"
                size="lg"
              >
                <i className="fab fa-facebook" />
              </Button>
              <Button
                className="btn-primary btn-icon btn-round ml-2 mr-auto"
                color="default"
                size="lg"
              >
                <i className="fab fa-instagram" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}