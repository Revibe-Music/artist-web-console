/*!

=========================================================
* BLK Design System PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe"
// nodejs library that concatenates classes
import classnames from "classnames";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const url = "https://tech.us7.list-manage.com/subscribe/post?u=2d8b716c70bb90ba9d0fcf460&amp;id=0acdd15301"

const CustomForm = ({ status, message, onSubmit }) => {
  let email;

  var [emailFocus, setEmailFocus] = useState(false)

  const submit = () => {
    if(email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      onSubmit({ EMAIL: email })
    else {
      MySwal.fire({
        title: 'Failed to Subscribe',
        text: 'You have submitted an invalid email address. Please try again!',
        icon: 'error',
        showCloseButton: true,
        background: "#303030"
      })
    }
  }

  if(status === "success") {
    MySwal.fire({
      title: 'Thank you For Subscribing!',
      text: 'You will now receive emails from us, which will feature new music, playlists, artist interviews, and more!',
      icon: 'success',
      showCloseButton: true,
      background: "#303030"
    })
  } else if(status === "error") {
    MySwal.fire({
      title: 'Failed to Subscribe',
      text: 'An error has occurred when submitting the form. Error: ' + message,
      icon: 'error',
      showCloseButton: true,
      background: "#303030"
    })
  }

  return (
    <Row>
      <Col sm="8">
        <InputGroup
          className={classnames({
            "input-group-focus": emailFocus
          })}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="tim-icons icon-email-85" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Your Email..."
            type="text"
            onFocus={e =>
              setEmailFocus(true)
            }
            onBlur={e =>
              setEmailFocus(true)
            }
            onChange={e => email = e.target.value}
          />
        </InputGroup>
      </Col>
      <Col sm="4">
        <Button
          block
          className="btn-round"
          color="primary"
          type="button"
          onClick={submit}
        >
          Subscribe
        </Button>
      </Col>
    </Row>
  )
}

export default class MailChimpForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="subscribe-line subscribe-line-white">
        <Container>
          <Row>
            <Col lg="6">
              <h4 className="title">Subscribe to our Mailing List!</h4>
              <p className="description">
                Join our mailing list for new music, playlists, artist interviews, and more!
              </p>
            </Col>
            <Col lg="6">
              <Card className="card-plain card-form-horizontal">
                <CardBody>
                  <MailchimpSubscribe 
                    url={url}
                    render={({ subscribe, status, message }) => (
                      <CustomForm 
                        status={status}
                        message={message}
                        onSubmit={formData => subscribe(formData)}
                      />
                    )}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}