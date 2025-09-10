import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import { API_URL } from "../config";   // ✅ config.js se backend URL import

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/newcollections`)   // ✅ localhost ki jagah API_URL
      .then((response) => response.json())
      .then((data) => setNew_collection(data))
      .catch((err) => console.error("Error fetching new collections:", err));
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price * 100}
            old_price={item.old_price * 100}
          />
        ))}
      </div>
    </div>
  )
}

export default NewCollections;
