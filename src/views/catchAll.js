import React, {Component} from 'react';
import { BuilderComponent } from '@builder.io/react';

import Error404 from "./Error404";
import ScrollNavbar from "components/Navbars/ScrollNavbar.jsx";
import Footer from "components/Footers/Footer.jsx";


export default class CatchAllPage extends Component {
  state = { notFound: false }

  render() {
    return (
      <>

      {!this.state.notFound ?
        <>
          <ScrollNavbar/>
          <BuilderComponent
            apiKey="c4efecdddef14d36a98d2756c1d5f56b"
            model="page"
            name="page"
            contentLoaded={content => {
              if (!content) {
                this.setState({ notFound: true });
              }
            }}
            />
          <Footer />
      </>
      :
        <Error404 />
      }
      </>

  )
  }
}
