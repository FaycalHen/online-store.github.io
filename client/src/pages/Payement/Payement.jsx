import React, { useEffect, useState } from 'react';
import "./Payement.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetCart } from '../../Redux/CartReducer';
import axios from 'axios';
import useFetch from '../../hooks/useFetch';

const Payement = () => {
  const user = useSelector((state) => state.cart.current);
  const productB = useSelector((state) => state.cart.products);
  console.log(productB)
  const timestamp = new Date().toISOString();
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [allproducts,setproducts]=useState([]);
  const client = user.map(option =>( 
    { 
      id:option.id,
      email: option.email,
      password: option.password,
      username:option.username,
      fullName:option.fullName,
      phone:option.phone,
      admin:option.admin,
    }
  ));
  const prod = productB.map(option =>( 
    { 
      id:option.id,
      quantity:option.quantity,
      price:option.price,
    }
  ));
  const clientID = client[0].id;
  console.log(prod)
  const {data,loading,errore} = useFetch(
    `/clients/${clientID}?populate=products`
    );
  console.log(data)
  const recipe = data?.attributes.products.data.map(product =>( 
    { 
      id:product.id,
      price: product.attributes.price,
      title: product.attributes.title,
      
    }
  ));
  console.log(recipe)
  const totalPrice = () => {
    let total = 0;
    productB.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  };
    let P=0;  
    allproducts.map((produit)=>{
      productB.find(item=>item.id === produit.id)
      ?P += produit.attributes.price-produit.attributes.BuyP
      :<span></span>
    });
    
  console.log(P)
  const historicData={
    recipe: totalPrice(),
    added: timestamp,
    userId:clientID,
    profit:P,
  };
  
  console.log(historicData)
  
  const handleSubmit = async (e) => {
    
    console.log(clientID)
    e.preventDefault();
    if(prod.length===0){
      alert("im sorry your cart is empty, try to add something")
      navigate('/')
    }
    else{
    for (let i = 0; i < prod.length; i++) {
    const existing=recipe.find(produit => produit.id === prod[i].id)  
    console.log(existing)   
    if(!existing){
    await axios
      .put(`http://localhost:1337/api/clients/${clientID}`, { data: {
        products: { 
          connect: [prod[i].id],
        }
      }})
      .then((response) => {
        console.log(response);
        dispatch(resetCart())
      })
      .catch((error) => {
        setError(error);
      });
    }
    }
    totalPrice();
    dispatch(resetCart())
    }
    await axios
      .post(`http://localhost:1337/api/historiques`, { data: historicData })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        setError(error);
      });
    alert("your payement was succefull")
    navigate('/')  
  };
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/products")
      .then(({ data }) => {
        setproducts(data.data);
        console.log(data.data);
      })
      .catch((error) => setError(error));
    
    }, []);

  
  return (
      <div className="paiment-container">
      <h1>Payment</h1>
      <form onSubmit={handleSubmit}>
          <div className="wrap">
            <div className="left">
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" required />
              </div>
              <div className="form-group">
                <label htmlFor="codepostal">Postal Code</label>
                <input type="text" id="codepostal" name="codepostal" required />
              </div>
              <div className="form-group">
                <label htmlFor="adresse">Adresse</label>
                <input type="text" id="adresse" name="adresse" required />
              </div>
            </div>
            <div className="right">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="text" id="phone" name="phone" required />
              </div>
              <div className="form-group">
                <label htmlFor="cardname">Cardholder Name</label>
                <input type="text" id="cardname" name="cardname" required />
              </div>
              <div className="form-group">
                <label htmlFor="cardnum">Card Number</label>
                <input type="text" id="cardnum" name="cardnum" required />
              </div>
              <div className="form-group">
                <label htmlFor="ex">Expire Month</label>
                <input type="text" id="ex" name="ex" required />
              </div>
              <div className="form-group">
                <label htmlFor="exy">Expire Year</label>
                <input type="text" id="exy" name="exy" required />
              </div>
              </div>
          </div>
        <button type="submit" onClick={()=>{
          
        }}>Purchase</button>
      </form>
        
    </div>
  )
}
export default Payement