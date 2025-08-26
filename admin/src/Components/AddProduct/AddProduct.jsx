import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
  name: "",
  image: "",
  category: "women",
  new_price: "",
  old_price: ""
});

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };
  const changeHandler = (e) => {
  setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
}
   

// From image_797d00.png
const Add_Product = async ()=>{
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();

// From image_798005.png (and implied continuation from image_797d00.png)
    formData.append('product', image);

// From image_798067.png (and implied continuation from image_798005.png)
    await fetch('http://localhost:4000/upload',{
        method: 'POST',
        headers:{
            Accept: 'application/json',
        },
        body:formData,
    }).then((resp) => resp.json()).then((data)=>{responseData=data})

// From image_798486.png
    if(responseData.success)
{
    product.image = responseData.image_url;
    console.log(product);
    await fetch('http://localhost:4000/addproduct',{
        method: 'POST',
        headers:{
            Accept: 'application/json',
            'Content-Type':'application/json',
        },
        body:JSON.stringify(product),
    }).then((resp)=>resp.json()).then((data)=>{
    data.success?alert("Product Added"):alert("Failed")
})
}
}
  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input type="text" value={productDetails.new_price} onChange={changeHandler} name="new_price" placeholder='Type' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className='addproduct-thumbnail-img'
            alt="Upload preview"
          />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  );
};

export default AddProduct;
