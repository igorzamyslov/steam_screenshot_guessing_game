// import Button from 'react-bootstrap/Button';
import "./style.css";

const OptionButton = (props) => {
  let { answer, chosenAnswer, correctAnswer, className, ...otherProps } = props;
  // init/update className
  // todo: remove it?
  if (!className) {
    className = "";
  } else {
    className += " ";
  }
  // check if button should be blinking
  if ([chosenAnswer, correctAnswer].includes(answer)) {
    className += " blink";
    if (answer === correctAnswer) {
      className += " correct";
    } else {
      className += " incorrect";
    }
  }
  return (
    <button className={"nice-button " + className} {...otherProps}>
      {answer.appName}
    </button>
  );
};

export default OptionButton;
