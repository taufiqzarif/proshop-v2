import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ value, text }) => {
  return (
    <div className="rating">
      {[...Array(5)].map((_, index) => {
        return (
          <span key={index}>
            {value >= index + 1 ? (
              <FaStar />
            ) : value >= index + 0.5 ? (
              <FaStarHalfAlt />
            ) : (
              <FaRegStar />
            )}
          </span>
        );
      })}
      <span className="rating-text">{text && text}</span>
    </div>
  );
};

export default Rating;
