import "./style.css";

import { Github } from "react-bootstrap-icons";
import { Share } from "react-bootstrap-icons";
import { Twitter } from "react-bootstrap-icons";

const openUrl = (url) => () => {
  window.open(url, "_blank");
};

const ShareBlock = (props) => {
  let handleShare = () => {
    let linkToShare = window.location.href + "&shared=true";
    console.log(linkToShare);
    navigator.clipboard.writeText(linkToShare);
    alert("Link copied!");
  };

  let handleTwitter = () => {
    alert("Under development!");
  };

  return (
    <div>
      <button className="share-button" onClick={handleShare}>
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
      <button className="share-button" onClick={handleTwitter}>
        <Twitter /> Twitter
      </button>
    </div>
  );
};

export default ShareBlock;
