 export default function Card({ img, title, price, rating }) {
  return (
    <div className="card">
      <div className="img-box">
        <img src={img} alt="" />
        <span className="fav">❤</span>
      </div>

      <h4>{title}</h4>
      <p className="price">₹{price} for 2 nights</p>
      <span className="rating">⭐ {rating}</span>
    </div>
  );
}
