import React, { useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import './App.css';

export const App = () => {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceValue = useDebounce(userInput, 800);

  useEffect(() => {
    if (!debounceValue) {
      setData([]);
      return;
    }

    console.log("Fetching data for:", debounceValue);

    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${debounceValue}`
        );
        if (!response.ok) throw new Error("Error al obtener datos del API");
        const result = await response.json();
        setData(result.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (debounceValue) {
      getData();
    }
  }, [debounceValue]);

  const handleChange = ({ target }) => {
    setUserInput(target.value);
  };

  return (
    <div className="container">
      <h1>Buscador de Productos</h1>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={userInput}
        onChange={handleChange}
        className="search-input"
      />
      {loading && <p className="loading">Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && userInput.length > 0 && data.length === 0 && (
        <p className="no-results">No se encontraron productos.</p>
      )}
      <div className="products">
        {data.map((product) => (
          <div className="product" key={product.id}>
            <img
              src={product.thumbnail}
              alt={`Imagen de ${product.title}`}
              className="product-image"
            />
            <h3>{product.title}</h3>
            <p>Precio: ${product.price.toFixed(2)}</p>
            <p>Calificación: {product.rating} / 5</p>
            <p>Marca: {product.brand}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default App
