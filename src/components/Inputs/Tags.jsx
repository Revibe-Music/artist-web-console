import React, {Component} from 'react';
import classNames from "classnames";
import PropTypes from "prop-types";
import TagsInput from "react-tagsinput";
import { FormGroup, Row, Col} from "reactstrap";

class Tags extends Component {

  constructor(props) {
      super(props);
      this.state = {
        inputColor: "#2b3553"
      }
  }

  render() {
    return (
      <FormGroup>
        <label style={{color: "white"}}>{this.props.label}</label>
        <TagsInput
          onlyUnique={this.props.onlyUnique}
          inputProps={{
              placeholder: this.props.placeholder,
              disabled: this.props.disabled,
              onFocus: () => this.setState({inputColor: "#7248BD"}),
              onBlur: () => {
                this.setState({inputColor: "#2b3553"})
                if(this.props.onBlur) {
                  this.props.onBlur()
                }
              }
          }}
          renderLayout={(tagComponents, inputComponent) => (
            <div style={{border: `1px solid ${this.state.inputColor}`, fontSize: "0.75rem",  borderRadius: "0.4285rem", marginBottom: "5px",paddingTop: "7px",paddingBottom: "7px", transition: "color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out"}}>
              <Row>
                <Col xs="6" md="4">
                  {inputComponent}
                </Col>
                <Col xs="6" md="8">
                  {tagComponents}
              </Col>
              </Row>
            </div>
          )}
          onChange={tags => this.props.onChange(tags)}
          tagProps={{ className: "react-tagsinput-tag primary", disabled: this.props.disabled }}
          value={this.props.value}
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



Tags.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onlyUnique: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  displayError: PropTypes.bool,
  errorMessage: PropTypes.string,
};

Tags.defaultProps = {
  label: "",
  value: "",
  defaultValue: "",
  placeholder: "Type text here",
  onlyUnique: true,
  disabled: false,
  displayError: true,
  errorMessage: "",
};

export default Tags
