import { BsTriangleFill } from "react-icons/bs";
import "./SliderCard.css";

const SliderCard = ({ src, name, price, percentage, fullname }) => {
  const rounded_pecentage = Number.parseFloat(percentage);

  return (
    <div className="slider-card">
      <div className="header">
        <div className="name">{name}</div>
        <div
          className={`change-indicator ${
            rounded_pecentage > 0 ? "gain" : "loss"
          }`}
        >
          <div className="icon">
            <BsTriangleFill />
          </div>
          <div>{Number.parseFloat(percentage).toFixed(2)}%</div>
        </div>
      </div>
      <div className="body">
        <div className="img-wrapper">
          <img src={src} alt={name} />
        </div>
        <div className="details-wrapper">
          <div className="fullname">{fullname}</div>
          <div className="price">
            {price === 0 ? (
              <p>Loading...</p>
            ) : (
              Number.parseFloat(price).toFixed(2)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderCard;
