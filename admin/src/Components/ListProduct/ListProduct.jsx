import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    const res = await fetch('http://localhost:4000/allproducts');
    const data = await res.json();
    setAllProducts(data);
  };

  const handleRemove = async (id) => {
    await fetch(`http://localhost:4000/deleteproduct/${id}`, {
      method: 'DELETE',
    });
    fetchInfo(); // Refresh the product list
  };

  useEffect(() => {
    fetchInfo();
  }, []);
   const remove_product = async (id)=>{
    console.log("Removing product with ID:", id); 
    await fetch('http://localhost:4000/removeproduct',{
        method:'POST',
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
        },
        body:JSON.stringify({id:id})
    })
    await fetchInfo();
}
  return ( <>
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main listproduct-format-header">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div key={index} className="listproduct-format-main">
            <img
              src={product.image}
              alt={product.name}
              className="listproduct-product-icon"
            />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img 
  onClick={() => remove_product(product._id)}  // use "_id" if MongoDB
  className="listproduct-remove-icon"
  src={cross_icon}
  alt="Remove"
/>

          </div>
        ))}
      </div>
    </div>
    <hr/>
    </>
  );
};

export default ListProduct;
