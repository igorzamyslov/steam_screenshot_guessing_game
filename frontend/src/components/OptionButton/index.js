// import Button from 'react-bootstrap/Button';
import "./style.css";

import { Component } from "react";

class OptionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blinkClass: "",
    };
    this.blinkInterval = null;
  }

  componentDidMount() {
    this.updateBlink({}, this.props);
  }

  componentDidUpdate(prevProps) {
    this.updateBlink(prevProps, this.props);
  }

  componentWillUnmount() {
    clearInterval(this.blinkInterval);
  }

  updateBlink(prevProps, props) {
    const { blink: prevBlink } = prevProps;
    const { blink, blinkClass } = props;
    if (!prevBlink && blink) {
      // create blinking interval
      this.blinkInterval = setInterval(() => {
        this.setState({ blinkClass: this.state.blinkClass ? "" : blinkClass });
      }, 300);
    } else if (prevBlink && !blink) {
      // remove blinking interval
      clearInterval(this.blinkInterval);
    }
  }

  render() {
    const {
      label,
      className,
      blink,
      blinkClass: _,
      ...otherProps
    } = this.props;
    const { blinkClass } = this.state;
    return (
      <button
        className={["option-btn", className, blinkClass].join(" ")}
        {...otherProps}
      >
        {label}
      </button>
    );
  }
}

export default OptionButton;
