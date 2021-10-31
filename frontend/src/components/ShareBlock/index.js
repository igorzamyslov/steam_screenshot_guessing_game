import "./style.css";

import { Github } from "react-bootstrap-icons";
import { Share } from "react-bootstrap-icons";
import { Twitter } from "react-bootstrap-icons";

const openUrl = (url) => () => {
  window.open(url, "_blank");
};

const ShareBlock = (props) => {
  let { fill } = props;
  return (
    <div>
      <button className="share-button">
        <Share /> Share
      </button>
      <button
        className="share-button"
        onClick={openUrl(
          "https://github.com/igorzamyslov/steam_screenshot_guessing_game"
        )}
      >
        <Github /> Code
      </button>
      <button className="share-button">
        <Twitter /> Twitter
      </button>
    </div>
  );
};

export default ShareBlock;
