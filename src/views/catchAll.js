import React, {Component} from 'react';

import Error404 from "./Error404";
import { BuilderComponent } from '@builder.io/react';


export default class CatchAllPage extends Component {
  state = { notFound: false }

  render() {
    return (
      <>

      {!this.state.notFound ?
        <>
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
          <div className="loading">Loading...</div>
      </>
      :
        <Error404 />
      }
      </>

  )
  }
}
