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
// used for making the prop types of this component
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import Img from 'react-image'

// import defaultImage from "assets/img/image_placeholder.jpg";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: this.props.uploadedImage ? this.props.uploadedImage : this.props.defaultImage
    };

    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.uploadedImage !== null) {
      if(this.props.uploadedImage !== this.state.imagePreviewUrl) {
        if(this.state.file === null) {
          this.setState({imagePreviewUrl: this.props.uploadedImage})
        }
      }
    }
  }

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    if(this.props.onImageSelect !== null) {
      this.props.onImageSelect(file)
    }
    reader.readAsDataURL(file);
    // this.props.handleChange(file)
  }
  handleSubmit(e) {
    e.preventDefault();
    // this.state.file is the file/image uploaded
    // in this function you can save the image (this.state.file) on form submit
    // you have to call it yourself
  }
  handleClick() {
    this.refs.fileInput.click();
  }
  handleRemove() {
    this.setState({
      file: null,
      imagePreviewUrl: this.props.defaultImage
    });
    if(this.props.onImageSelect !== null) {
      this.props.onImageSelect(null)
    }
    this.refs.fileInput.value = null;
  }
  render() {

    return (
      <div className="fileinput text-center">
        <input type="file" accept='image/*' onChange={this.handleImageChange} ref="fileInput" />
        <div className={"thumbnail" + (this.props.defaultImage ? "img-circle" : "img-square")}>
          <Img src="https://www.example.com/foo.jpg"
          src={this.state.imagePreviewUrl}
          style={{width: "100%"}}
          />
        </div>
        {!this.props.disabled ?
          <div>
            {this.state.file === null ? (
              <Button
                color={this.props.addBtnColor}
                className={this.props.addBtnClasses}
                onClick={() => this.handleClick()}
              >
                {this.props.btnText}
              </Button>
            ) : (
              <span>
                <Button
                  color={this.props.changeBtnColor}
                  className={this.props.changeBtnClasses}
                  onClick={() => this.handleClick()}
                >
                  Change
                </Button>
                {this.props.defaultImage ? <br /> : null}
                <Button
                  color={this.props.removeBtnColor}
                  className={this.props.removeBtnClasses}
                  onClick={() => this.handleRemove()}
                >
                  <i className="fa fa-times" /> Remove
                </Button>
              </span>
            )}
          </div>
        :
          null
        }
      </div>
    );
  }
}

ImageUpload.defaultProps = {
  disabled: false,
  avatar: true,
  btnText: "Select Image",
  removeBtnClasses: "btn-round",
  removeBtnColor: "danger",
  addBtnClasses: "btn-round",
  addBtnColor: "primary",
  changeBtnClasses: "btn-round",
  changeBtnColor: "primary",
  onImageSelect: null
};

ImageUpload.propTypes = {
  disabled: PropTypes.bool,
  avatar: PropTypes.bool,
  removeBtnClasses: PropTypes.string,
  btnText: PropTypes.string,
  removeBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link"
  ]),
  addBtnClasses: PropTypes.string,
  addBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link"
  ]),
  changeBtnClasses: PropTypes.string,
  changeBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link"
  ]),
  onImageSelect: PropTypes.func,
};

export default ImageUpload;
