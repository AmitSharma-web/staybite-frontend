  import Card from "./Card";

  export default function ListingRow({ title }) {
    return (
      <section className="row">
        <h2>{title} ›</h2>

        <div className="card-row">
          <Card
            img="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            title="Flat in Sahibzada Ajit Singh Nagar"
            price="6,527"
            rating="5.0"
          />

          <Card
            img="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            title="Apartment in Zirakpur"
            price="5,798"
            rating="4.9"
          />

          <Card
            img="https://images.unsplash.com/photo-1523217582562-09d0def993a6"
            title="Premium PG Room"
            price="6,420"
            rating="5.0"
          />
        </div>
          <div className="card-row">
          <Card
            img="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            title="Flat in Sahibzada Ajit Singh Nagar"
            price="6,527"
            rating="5.0"
          />

          <Card
            img="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            title="Apartment in Zirakpur"
            price="5,798"
            rating="4.9"
          />

          <Card
            img="https://images.unsplash.com/photo-1523217582562-09d0def993a6"
            title="Premium PG Room"
            price="6,420"
            rating="5.0"
          />
        </div>
      </section>
    );
  }
