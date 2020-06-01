import React, {Component} from 'react';
import classNames from "classnames";
import PropTypes from "prop-types";

// reactstrap components
import { FormGroup, Label, Input} from "reactstrap";

class TextInput extends Component {

  constructor(props) {
      super(props);
  }

  onChange = event => {
    if(this.props.validate) {
      this.props.validate(event)
    }
    this.props.onChange(event)
  }


  render() {
    return (
      <FormGroup>
        <label style={{color: "white"}}>{this.props.label}</label>
        <Input
          defaultValue={this.props.defaultValue}
          value={this.props.value}
          className={this.props.className}
          placeholder={this.props.placeholder}
          type={this.props.text}
          disabled={this.props.disabled}
          onChange={event => this.onChange(event)}
        />
        {this.props.displayError ?
          <>
          {this.props.errorMessage ? (
            <label style={{color: "red"}} className="error">
              {this.props.errorMessage}
            </label>
          ) : null}
          </>

          :
            null
        }
      </FormGroup>
    );
  }
}



TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  classname: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  disabled: PropTypes.bool,
  displayError: PropTypes.bool,
  errorMessage: PropTypes.string,
};

TextInput.defaultProps = {
  label: "",
  value: "",
  defaultValue: "",
  placeholder: "Type text here",
  className: "primary",
  type: "text",
  disabled: false,
  displayError: true,
  errorMessage: "",
};

export default TextInput
