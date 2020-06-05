import React, {Component} from 'react';
import classNames from "classnames";
import PropTypes from "prop-types";

import {default as ReactSelect} from "react-select";
import { FormGroup, Label, Input} from "reactstrap";

class Select extends Component {

  constructor(props) {
      super(props);
  }

  onBlur = () => {
    if(this.props.onBlur) {
      this.props.onBlur()
    }
  }

  render() {
    return (
      <FormGroup>
        <label style={{color: "white"}}>{this.props.label}</label>
          <ReactSelect
            value={this.props.value ? this.props.value : undefined}
            className={this.props.className}
            classNamePrefix="react-select"
            placeholder={this.props.placeholder}
            closeMenuOnSelect={this.props.closeMenuOnSelect}
            isMulti={this.props.isMulti}
            isDisabled={this.props.disabled}
            onChange={option => this.props.onChange(option)}
            onBlur={this.onBlur}
            options={this.props.options}
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



Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  classname: PropTypes.string,
  classNamePrefix: PropTypes.string,
  isMulti: PropTypes.bool,
  options: PropTypes.array,
  closeMenuOnSelect: PropTypes.bool,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  displayError: PropTypes.bool,
  errorMessage: PropTypes.string,
};

Select.defaultProps = {
  label: "",
  value: "",
  defaultValue: "",
  placeholder: "Type text here",
  className: "react-select primary",
  classNamePrefix: "react-select",
  isMulti: false,
  closeMenuOnSelect: true,
  disabled: false,
  displayError: true,
  errorMessage: "",
};

export default Select
