import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import AdFooter  from '../../Components/AdFooter/AdFooter';
import AdminN from '../../Components/AdminNavbar/AdminN';
import { Link , useNavigate} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';
import { groupBy } from "lodash";

const Analytics = () => {
  const products = useSelector((state) => state.cart.products);
  const [allClients, setAllClients] = useState([]);
  const [error, setError] = useState(null);
  const [histo,sethisto]= useState([]);
  const [hehe,sethe] = useState([]);
  const today = new Date().toISOString()
  const clients = allClients.map(option =>( 
    { 
      id:option.id,
      email: option.attributes.email,
      username:option.attributes.username,
      fullName:option.attributes.fullName,
      phone:option.attributes.phone,
    }
  ));
  const dash = histo.map(option =>( 
    { 
      id:option.id,
      userId:option.attributes.userId,
      added:option.attributes.added,
      recipe:option.attributes.recipe,
      profit:option.attributes.profit,
    }
  ));
  
  console.log(dash) 
  console.log(clients)
    useEffect(() => {
      axios
        .get("http://localhost:1337/api/clients")
        .then(({ data }) => {
          setAllClients(data.data);
          console.log(data.data);
        })
        .catch((error) => setError(error));

      axios  
        .get("http://localhost:1337/api/historiques")
        .then(({ data }) => {
          sethisto(data.data);
          console.log(data.data);
        })
        .catch((error) => setError(error));
    }, []);

  console.log(today)
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const years = [...new Set(dash.map(option => new Date(option.added).getFullYear()))];
  const months = [...new Set(dash.map(option => (new Date(option.added).getMonth()+1).toString().padStart(2, "0")))];
  const monthWithNames = months
  .sort((a, b) => a - b)
  .map(m => monthNames[parseInt(m) - 1]);
  
  console.log(monthWithNames); // output the resulting month names array
  
  console.log(years)
  console.log(months)
  const total =()=>{
    let t =0 ;
    dash.map((e)=>{
      t = t + parseInt(e.recipe);
    });
    return t;
  };  
  
  const groupedData = groupBy(dash, (item) => {
    const date = new Date(item.added);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
  });
  console.log(groupedData)
  let ex;
  
  let year;
  const toP =()=>{
    let p =0 ;
    dash.map((e)=>{
      p +=parseInt(e.profit);
    });
    return p;
  };  
  let i=toP();
  console.log(i)
  return (
    <div>
      <AdminN/>
      <div className='admin'>
        <div className="left">
          <h1>Menu</h1>
          <button><Link className='link' to="/Admin"> Dashboard </Link></button>
          <button><Link className='link' to="/Admin/Analytics">Analytics </Link></button>
          <button><Link className='link' to="/Admin/Allclient">All Clients </Link></button>
          <button><Link className='link' to="/Admin/Allproducts">All Products available </Link></button>
          <button><Link className='link' to="/Admin/Addproducts">Add Products </Link></button>
        </div>
        <div className="center">
          <h2>Analytics</h2>
          <TableContainer component={Paper}>
          <Table className='table' sx={{ minWidth: 250,padding:120 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className='title' align="left">Year</TableCell>
                  <TableCell className='title' align="left">Month&nbsp;</TableCell>
                  <TableCell className='title'>id</TableCell>
                  <TableCell className='title' align="left">Added</TableCell>
                  <TableCell className='title' align="left">Name&nbsp;</TableCell>
                  <TableCell className='title' align="left">E_mail&nbsp;</TableCell>
                  <TableCell className='title' align="left">User-id&nbsp;</TableCell>
                  <TableCell className='title' align="left">Recipe&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedData).map(([group, items]) => {
                  const [year, month] = group.split("-");
                  const total = items.reduce((acc, item) => acc + parseInt(item.recipe), 0);
                  return (
                    <React.Fragment key={group}>
                      <TableRow>
                        <TableCell rowSpan={items.length} align="left">{year}</TableCell>
                        <TableCell align="left">{monthNames[parseInt(month) - 1]}</TableCell>
                        <TableCell>{items[0].id}</TableCell>
                        <TableCell align="left">{items[0].added}</TableCell>
                        {
                        ex = clients.find((client) =>client.id === items[0].userId),
                        ex
                        ?<TableCell align="left">{ex.username}</TableCell>
                        :<span></span>
                        }
                        <TableCell align="left">{ex?.email}</TableCell>
                        <TableCell align="left">{items[0].userId}</TableCell>
                        <TableCell align="left">{items[0].recipe}</TableCell>
                      </TableRow>
                      {items.slice(1).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell align="left">{monthNames[parseInt(month) - 1]}</TableCell>
                          <TableCell>{item.id}</TableCell>
                          <TableCell align="left">{item.added}</TableCell>
                          {
                          ex = clients.find((client) =>client.id === item.userId),
                          ex
                          ?
                          <TableCell align="left">{ex.username}</TableCell>
                          :<span></span>
                          }
                          {
                          ex = clients.find((client) =>client.id === item.userId),
                          ex
                          ?
                          <TableCell align="left">{ex.email}</TableCell>
                          :<span></span>
                          }
                          <TableCell align="left">{item.userId}</TableCell>
                          <TableCell align="left">{item.recipe}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={7} align="right">Month incomes:</TableCell>
                        <TableCell align="left">{total}</TableCell>
                      </TableRow>
                    </React.Fragment>
                    );
                })}
              </TableBody>
              <TableHead>
                <TableRow>  
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className='title' align="left">{total()}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Total Profits</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className='title' align="left">{toP()}</TableCell>
                </TableRow>
            </TableHead>
            </Table>
          </TableContainer>
        
        </div>
      </div>
      <AdFooter/>
    </div>
  )
}

export default Analytics