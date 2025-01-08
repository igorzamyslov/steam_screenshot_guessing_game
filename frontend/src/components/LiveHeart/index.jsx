import "./style.css";

// import { ReactComponent as FullHeart } from "@/assets/heart-fill.svg";
// import { ReactComponent as EmptyHeart } from "@/assets/heart.svg";

const LiveHeart = (props) => {
  let { fill } = props;
  if (fill) {
    return 0
  } else {
    return 1 
  }
};

export default LiveHeart;
