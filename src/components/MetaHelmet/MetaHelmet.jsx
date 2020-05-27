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
import React from 'react'
import { Helmet } from 'react-helmet'

import previewImg from '../../assets/site/img/preview.png'

const MetaHelmet = props => {
  return (
    <Helmet>
      <title>{props.title ? props.title : "Revibe Artists"}</title>
      <meta name="title" content={props.title ? props.title : "Revibe Artists - The Independent Artist Dashboard"} />
      <meta name="description" content={props.description ? props.desctiption : "Revibe is an all-in-one platform where independent artists can manage their entire career!"} />
      <meta name="image" content={props.image ? props.image : `https://artist.revibe.tech${previewImg}`} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={props.url} />
      <meta property="og:title" content={props.title ? props.title : "Revibe Artists - The Independent Artist Dashboard"} />
      <meta property="og:description" content={props.description ? props.desctiption : "Revibe is an all-in-one platform where independent artists can manage their entire career!"} />
      <meta property="og:image" content={props.image ? props.image : `https://artist.revibe.tech${previewImg}`} />
      
      <meta property="twitter:card" content={props.cardSize ? props.cardSize : "summary_large_image"} />
      <meta property="twitter:url" content={props.url} />
      <meta property="twitter:title" content={props.title ? props.title : "Revibe Artists - The Independent Artist Dashboard"} />
      <meta property="twitter:description" content={props.description ? props.desctiption : "Revibe is an all-in-one platform where independent artists can manage their entire career!"} />
      <meta property="twitter:image" content={props.image ? props.image : `https://revibe.tech${previewImg}`} />
    </Helmet>
  )
}

export default MetaHelmet