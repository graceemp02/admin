/** @format */

import { useState, useContext, useMemo, useEffect } from 'react';
import Paper from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { CustomerContext } from '../CustomerContext';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import { useNavigate } from 'react-router-dom';

function Customers() {
  // alert('Customer is called')
  const { updateCustomers } = useContext(UpdateCustomersContext);
  const { customerID, setCustomerID } = useContext(CustomerContext);
  const [customers, setCustomers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(() => customerID);
  const [query, setQuery] = useState('');
  const token = localStorage.getItem('authToken')
const navigate = useNavigate()
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get("secureCustomers.php", {
        cancelToken: source.token,
        headers: { Authorization: token },
      })
      .then((result) => {
        if(result.data.error === "Expired token"){
         localStorage.clear();
         setCustomerID(null);
         navigate("/login");
        }
        setCustomers(result.data);
        if (!customerID) {
          setCustomerID(result.data[0]?.id);
          setSelectedIndex(result.data[0]?.id);
          localStorage.setItem("admin_client", result.data[0]?.id);
        } else {
          setCustomerID(customerID);
          setSelectedIndex(customerID);
          localStorage.setItem("admin_client", customerID);
        }
      })
      .catch((error) => console.log(error));
    return () => {
      source.cancel();
    };
  }, [updateCustomers]);

  const handleListItemClick = (e, index) => {
    e.preventDefault();
    setCustomerID(index);
    setSelectedIndex(index);
    localStorage.setItem('admin_client', index);
  };
  const filteredCustomers = useMemo(() => {
    return customers.filter(item => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, customers]);
  return (
    <div style={{ height: { xs: 'auto', sm: '50%' }, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'relative',
        }}>
        <Typography
          width={'50%'}
          fontWeight={'bold'}
          display={'inline'}
          sx={{
            textDecoration: 'Underline',
            color: 'black',
            mb: 0.5,
            ml: 0.2,
            fontSize: '3.1vh!important',
          }}>
          CUSTOMERS
        </Typography>
        <TextField
          value={query}
          autoFocus
          variant='filled'
          onChange={e => setQuery(e.target.value)}
          label='Search Customer'
          className='cSearch'
          sx={{
            height: '100% !important',
            width: '45%',
            fontSize: '2vh',
          }}
        />
      </div>
      <Paper
        sx={{
          marginBottom: '15px',
          flex: 1,
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: '1vh',
          display: 'flex',
          padding: 0,
        }}>
        {filteredCustomers.length > 0 ? (
          <List
            component='nav'
            aria-label='customers'
            sx={{
              flex: 1,
              minHeight: 'auto',
              maxHeight: { xs: '300px', sm: '42vh' },
              overflow: 'auto',
              borderRadius: '1vh',
            }}>
            {filteredCustomers.map(row => {
              return (
                <>
                  <ListItemButton
                    key={row.id.toString()}
                    sx={{ padding: '0.3rem 1rem' }}
                    divider={filteredCustomers.length - 1 === row.id ? false : true}
                    selected={selectedIndex === row.id}
                    onClick={event => handleListItemClick(event, row.id)}>
                    <ListItemText primary={row.name} sx={{ m: 0, fontSize: '2vh !important' }} />
                  </ListItemButton>
                </>
              );
            })}
          </List>
        ) : (
          <Typography sx={{ textAlign: 'center', fontSize: '2vh', margin: '3vh', width: '100%' }}>
            No Customer Found
          </Typography>
        )}
      </Paper>
    </div>
  );
}
export default Customers;
