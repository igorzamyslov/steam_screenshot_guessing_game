import "./style.css";

// import { ReactComponent as FullHeart } from "@/assets/heart-fill.svg";
// import { ReactComponent as EmptyHeart } from "@/assets/heart.svg";

const LiveHeart = (props) => {
  let { fill } = props;
  if (fill) {
    return <div>1</div>
  } else {
    return <div>0</div>
  }
};

export default LiveHeart;
