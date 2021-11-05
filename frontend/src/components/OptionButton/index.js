// import Button from 'react-bootstrap/Button';
import "./style.css";

const OptionButton = (props) => {
  let {
    prefix,
    answer,
    chosenAnswer,
    correctAnswer,
    className,
    ...otherProps
  } = props;
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
    <button className={"nice-button button-flex-container " + className} {...otherProps}>
      <div className="prefix">{prefix}</div>
      <div className="game-name">{answer.appName}</div>
    </button>
  );
};

export default OptionButton;
