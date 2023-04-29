import React from 'react';
import "./Likes.scss";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useSelector } from "react-redux";
import { removeLike} from "../../Redux/CartReducer";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const Likes = () => {
  const products = useSelector((state) => state.cart.like);
  const dispatch = useDispatch();
  console.log(products)
  return (
    <div>
      <Navbar/>
      <div className="centerl">
      <h1>Products Liked</h1>
      {products?.map((item) => (
        <div className="item" key={item.id}>
          <img src={process.env.REACT_APP_UPLOAD_URL + item.img} alt="" />
          <div className="details">
            <h1>{item.title}</h1>
            <p>{item.description?.substring(0,100)}</p>
            <div className="price">
               {item.price}DA {item.btnState}
            </div>
          </div>
          <DeleteOutlinedIcon
            className="delete"
            onClick={() => dispatch(removeLike(item.id))}
          />
          
        </div>
      ))}
      </div>
      <Footer/>
    </div>
  )
}

export default Likes