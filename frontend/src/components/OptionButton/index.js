import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import './style.css';

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

  updateBlink = (prevProps, props) => {
    const { blink: prevBlink } = prevProps;
    const { blink, blinkClass } = this.props;
    if (!prevBlink && blink) {
      // create blinking interval
      if (props.answer.correct) {
          this.blinkInterval = setInterval(() => {
              this.setState({ blinkClass: this.state.blinkClass ? "" : blinkClass })
          }, 300)
      }
    } else if (prevBlink && !blink) {
      // remove blinking interval
      clearInterval(this.blinkInterval);
    }
  };

  render() {
    const { answer, className, ...otherProps } = this.props;
    const { blinkClass } = this.state;
    return (
      <Button
        className={["option-btn", className, blinkClass].join(" ")}
        {...otherProps}
      >
        {answer.appName}
      </Button>
    );
  }
}

export default OptionButton;
