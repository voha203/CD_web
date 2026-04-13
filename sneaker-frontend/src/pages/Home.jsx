import { useEffect, useState } from "react";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setProducts(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Shop Sneaker</h1>

      {products.length === 0 ? (
        <p>Đang tải...</p>
      ) : (
        products.map(p => (
          <div key={p.id}>
            {p.name} - {p.price}
          </div>
        ))
      )}
    </div>
  );
}

export default Home;