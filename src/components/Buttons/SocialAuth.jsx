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
import React from "react";
import SocialLogin from "react-social-login";

import { Button } from "reactstrap";

class SocialButton extends React.Component {
  render() { 
    return (
      <Button
        onClick={this.props.triggerLogin}
        {...this.props}
      >
        {this.props.children}
      </Button>
    );
  }
}

export default SocialLogin(SocialButton);