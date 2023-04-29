
import {React, useState} from 'react';
import "./Product.scss";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BalanceIcon from '@mui/icons-material/Balance';
import useFetch from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { useParams ,Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart,addToWishlist,removeLike} from '../../Redux/CartReducer';
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import FavoriteIcon from '@mui/icons-material/Favorite';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';


const Product =()=>{
    const id=useParams().id
    const[selectedImg,setSelectedImg] = useState("img")
    const[quantity,setQuantity] = useState(1)
    const[btnState,setbtnState]=useState(false)
    const products = useSelector((state) => state.cart.like);
    const current = useSelector((state) => state.cart.current);
    const dispatch=useDispatch()
    const navigate = useNavigate();
    const {data,loading,error} = useFetch(
        `/Products/${id}?populate=*`
        );
    
    
    const handlelike=()=>{
        setbtnState(!btnState)
    };
    console.log(btnState)
    console.log(products)
    return(
        <div>
            <Navbar/>
            <div className='product'>
            {loading
            ?"loading..."
            :(
            <>
                <div className="left">
                    <div className="images">
                        <img src={process.env.REACT_APP_UPLOAD_URL +data?.attributes?.img?.data?.attributes?.url} alt="" onClick={(e)=>setSelectedImg("img")} />
                        <img src={process.env.REACT_APP_UPLOAD_URL +data?.attributes?.img2?.data?.attributes?.url} alt="" onClick={(e)=>setSelectedImg("img2")}/>
                    </div>
                    <div className="mainImg">
                        <img src={process.env.REACT_APP_UPLOAD_URL +data?.attributes[selectedImg]?.data?.attributes?.url} alt="" />
                    </div>
                </div>
                <div className="right">
                    <h1>{data?.attributes?.title}</h1>
                    <span className='price'>{data?.attributes?.price}DA</span>
                    <p>{data?.attributes?.description}</p>
                    <div className="qnt">
                        <button onClick={()=>setQuantity((prev)=>prev === 1 ? 1 : prev-1)}>-</button>
                        {quantity}
                        <button onClick={()=>setQuantity((prev)=>prev+1)}>+</button>
                    </div>
                    
                    <button className="add" onClick={() => {
                        if (current.length === 0) {
                            navigate('/login');
                            alert("please log-in first")
                        } else {
                            dispatch(addToCart({
                                id:data.id,
                                title:data.attributes.title,
                                description:data.attributes.description,
                                price:data.attributes.price,
                                img:data.attributes.img.data.attributes.url,
                                quantity,
                                BuyP:data.attributes.BuyP,
                                Added:data.attributes.Added,
                            }));
                        }
                    }}>
                        <AddShoppingCartIcon/> 
                        ADD TO CART
                    </button>
                    <div className="link">
                        <div className="item">
                            <button onClick={()=>{
                                if (current.length === 0) {
                                    navigate('/login');
                                    alert("please log-in first")
                                }
                                else {
                                    dispatch(addToWishlist({
                                        id:data.id,
                                        title:data.attributes.title,
                                        description:data.attributes.description,
                                        price:data.attributes.price,
                                        img:data.attributes.img.data.attributes.url,
                                        btnState,
                                        }))
                                        
                                        handlelike()
                                }
                            }}>
                            {btnState ? <FavoriteIcon/>: <FavoriteBorderIcon/>}
                            ADD TO WISHLIST
                            </button>
                        </div>
                        <div className="item">
                            <Link className='item' to="/Coming"><BalanceIcon/>  COMPARE</Link>
                        </div>
                    </div>
                    <div className="info">
                        <span>Vendor: Polo</span>
                        <span>Product Type: T-Shirt</span>
                        <span>Tag: T-Shirt, Women, Top</span>
                    </div>
                    <hr />
                    <div className="info">
                        <span>DESCRIPTION</span>
                        <hr />
                        <span>ADDITIONAL INFORMATION</span>
                        <hr />
                        <span>FAQ</span>
                    </div>
                </div>
            </>)}
            </div>  
            <Footer/>  
        </div>
    )
}
export default Product;