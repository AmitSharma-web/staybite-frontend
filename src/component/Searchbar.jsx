export default function SearchBar() {
  return (
    <div className="search-wrapper">
      <div className="search-box">
        <div>
          <small>Where</small>
          <p>Search destinations</p>
        </div>

        <div>
          <small>When</small>
          <p>Add dates</p>
        </div>

        <div>
          <small>Who</small>
          <p>Add guests</p>
        </div>

        <button className="search-btn">🔍</button>
      </div>
    </div>
  );
}
