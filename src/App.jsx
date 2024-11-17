import React, { useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";

export const App = () => {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState([]);
  const debounceValue = useDebounce(userInput, 500);

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(
        `https://dummyjson.com/products/search?q=${debounceValue}`
      );
      const result = await data.json();
      setData(result.products);
    };
    

    userInput ? getData() : setData([]);
  }, [debounceValue]);

  const handleChange = ({ target }) => {
    setUserInput(target.value);
  };

  return (
    <div>
      Buscar: <input type="text" value={userInput} onChange={handleChange} />
      <div className="products">
        {userInput.length > 0 &&
          data.map((product, idx) => (
            <div key={`image-${idx}`}>
              <p>{product.brand}</p>
              <img src={product.thumbnail} height={140} width={180} />
            </div>
          ))}
      </div>
    </div>
  );
};
export default App
