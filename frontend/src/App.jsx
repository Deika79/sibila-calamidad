import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 👇 Cambia la URL si tu backend está en otro puerto
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener productos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Sibila Calamidad 🖤</h1>
      <h2>Tienda de camisetas y pañuelos</h2>

      {products.length === 0 ? (
        <p>No hay productos disponibles</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "2rem"
        }}>
          {products.map(prod => (
            <div key={prod.id} style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              textAlign: "center"
            }}>
              <h3>{prod.name}</h3>
              <p>Precio: {prod.price} €</p>
              <p>Stock: {prod.stock}</p>
              <button style={{
                background: "black",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}>
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
