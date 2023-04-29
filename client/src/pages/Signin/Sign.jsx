import React, { useCallback, useEffect, useState } from 'react';
import "./Sign.scss";
import axios from "axios";
import { Link } from 'react-router-dom';


const Sign = () => {
  const [error, setError] = useState(null);
  const [allClients, setAllClients] = useState([]);
  const clients = allClients.map(option =>( 
    { 
      /*id:option.id,*/
      email: option.attributes.email,
      password: option.attributes.password
    }
  ));
  const [userData, setuserData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  // Function to register a new user
  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setuserData((prevData) => ({ ...prevData, [name]: value }));
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/clients")
      .then(({ data }) => {
        setAllClients(data.data);
        console.log(data.data);
      })
      .catch((error) => setError(error));
  
    }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const existingClient = clients.find(client => client.email === email || client.password === password);
    if (!existingClient) {
      alert("Your account has been added")
    await axios
      .post("http://localhost:1337/api/clients", { data: userData })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        setError(error);
      });
    }
    else{
      alert("this email already exist,please change the email/password")
    }
  };
  
  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }
  


  return (
    <div className="sign-container">
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" required onChange={handleInputChange} value={userData.email}/>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required onChange={handleInputChange} value={userData.username}/>
        </div>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" required onChange={handleInputChange} value={userData.fullName}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required onChange={handleInputChange} value={userData.password}/>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="text" id="phone" name="phone" required onChange={handleInputChange} value={userData.phone}/>
        </div>
        <Link className='link' to="/Login">Already have an account ? Log-in</Link>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Sign;