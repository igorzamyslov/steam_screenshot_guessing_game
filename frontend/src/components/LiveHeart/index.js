import "./style.css";
import { ReactComponent as FullHeart } from '../../assets/heart-fill.svg';
import { ReactComponent as EmptyHeart } from '../../assets/heart.svg';

const LiveHeart = (props) => {
  let { fill } = props;
  if(fill){
    return <FullHeart className="live-heart"/>
  } else {
    return <EmptyHeart className="live-heart"/>
  }
};

export default LiveHeart;
