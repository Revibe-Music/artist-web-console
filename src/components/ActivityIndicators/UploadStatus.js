import React from "react";

import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import Lottie from 'react-lottie';

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: require('../../assets/portal/img/check.json'),
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

class UploadStatus extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        {this.props.loading ?
          <Lottie options={defaultOptions} height={50} width={50} />
        :
          <ClipLoader size={50} color={"#7248BD"} loading={true} />
        }
      </div>
    );
  }
}

UploadStatus.propTypes = {
  loading: PropTypes.bool,
};

UploadStatus.defaultProps = {
  loading: false,
};

export default UploadStatus;
