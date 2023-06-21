/** @format */
import { styled } from '@mui/material/styles';

import {
  Button,
  createTheme,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MyDialog from '../dialogs/MyDialog';

import { useEffect, useMemo, useState, useContext } from 'react';
import { Box } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
import { CustomerContext } from '../CustomerContext';

let theme = createTheme();

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
let gRows = [];

const headStyle = {
  color: 'black',
  fontWeight: 'bold',
};
const Customers = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const [showUser, setShowUser] = useState({ status: false });
  const { updateCustomers, setUpdateCustomers } = useContext(UpdateCustomersContext);
  const [del, setDel] = useState({ id: null, name: '' });
  const [rows, setRows] = useState(gRows);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [query, setQuery] = useState('');
  const token = localStorage.getItem("authToken");
  const { setCustomerID } = useContext(CustomerContext);


  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get("secureCustomers.php", {
        cancelToken: source.token,
        headers: { Authorization: token },
      })
      .then((result) => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        setRows(result.data);
      })
      .catch((error) => console.log(error));
    return () => {
      source.cancel();
    };
  }, [updateCustomers]);
  const handleDel = async id => {
    let formData = new FormData();
    formData.append('toDel', id);
    await axios
      .post('delCustomer.php', formData,{headers:{Authorization:token}})
      .then(result => {
         if (result.data.error === "Expired token") {
           localStorage.clear();
           setCustomerID(null);
           navigate("/login");
         }
        setUpdateCustomers(pre => !pre);
        setShowUser({ status: false });
      })
      .catch(error => console.log(error));
  };
  const filteredRows = useMemo(() => {
    return rows.filter(item => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, rows]);

  const handleShow = index => {
    let user = filteredRows[index];
    setShowUser({
      status: true,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      cName: user.cName,
      cEmail: user.cEmail,
    });
  };
  const handleEdit = index => {
    let user = filteredRows[index];
    navigate('/clients/edit', { state: user });
  };

  return (
    <div className='centerTable'>
      <Paper sx={{ p: 2, width: '95%', pt: 0, overflow: 'auto', maxHeight: '93vh' }}>
        {showUser.status ? (
          <>
            <div
              style={{
                borderBottom: '1px solid black',
                background: 'white',
                position: 'sticky',
                height: '8vh',
                // marginTop: '5px',
                zIndex: '1',
                top: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <Typography
                pl={1}
                display={'inline'}
                sx={{
                  fontSize: '2.3vh',

                  fontWeight: 'bold',
                  color: 'black',
                }}>
                Customer Detail
              </Typography>
              <div style={{ display: 'flex' }}>
                <Button
                  onClick={() => setShowUser({ status: false })}
                  variant='contained'
                  sx={{ fontSize: '1vh' }}>
                  Back to List
                </Button>
                <Divider orientation='vertical' flexItem sx={{ marginInline: '5px' }} />
                <Button
                  type='submit'
                  onClick={() => {
                    setDel({ id: showUser.id, name: showUser.name });
                    return setOpenDialog(true);
                  }}
                  variant='contained'
                  color='error'
                  sx={{ marginInline: '5px', fontSize: '1vh' }}>
                  Delete
                </Button>
              </div>
            </div>
            <Table sx={{ fontSize: '1.7vh' }}>
              <TableRow>
                <TableCell sx={headStyle}>Full Name</TableCell>
                <TableCell>{showUser.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={headStyle}>Email</TableCell>
                <TableCell>{showUser.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={headStyle}>Phone</TableCell>
                <TableCell>{showUser.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={headStyle}>Company Name</TableCell>
                <TableCell>{showUser.cName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', borderBottom: 0 }}>
                  Company Email
                </TableCell>
                <TableCell sx={{ borderBottom: 0 }}>{showUser.cEmail}</TableCell>
              </TableRow>
            </Table>
          </>
        ) : (
          <>
            <div
              style={{
                background: 'white',
                position: 'sticky',
                height: '8vh',
                zIndex: '1',
                top: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <Typography
                pl={1}
                display={'inline'}
                sx={{
                  fontSize: '2.3vh',
                  textDecoration: 'Underline',
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                CUSTOMERS
              </Typography>
              <TextField
                display={isMobile ? 'none' : 'none'}
                value={query}
                variant='outlined'
                onChange={e => setQuery(e.target.value)}
                label='Search Customer'
                sx={{
                  display: isMobile ? 'none' : '',
                  bgcolor: 'white',
                  p: '0 !important',
                }}
              />
              <Button
                onClick={() => navigate('/clients/new')}
                variant='contained'
                color='success'
                sx={{ maxWidth: 200 }}>
                Create New Customer
              </Button>
            </div>
            <Table sx={{ fontSize: '1.65vh' }}>
              <TableHead
                sx={{
                  outline: '1px solid black',
                  position: 'sticky',
                  top: '8.1vh',
                  background: 'white',
                  zIndex: 1,
                  borderRadius: '.3em',
                }}>
                <TableRow sx={headStyle}>
                  <TableCell>Ser</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell sx={{ display: isMobile ? 'none' : '' }}>Email</TableCell>
                  <TableCell sx={{ display: isMobile ? 'none' : '' }}>Cell No</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ marginTop: '10vh' }}>
                {filteredRows.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell sx={{ display: isMobile ? 'none' : '' }}>{row.email}</TableCell>
                    <TableCell sx={{ display: isMobile ? 'none' : '' }}>{row.phone}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'flex-start',
                        }}>
                        <Button
                          onClick={() => handleShow(index)}
                          variant='contained'
                          color='success'
                          sx={{ marginInline: 0.5, height: '20px', width: '50px', mb: '5px' }}>
                          Show
                        </Button>
                        <Button
                          variant='contained'
                          onClick={() => handleEdit(index)}
                          sx={{ marginInline: 0.5, height: '20px', width: '50px', mb: '5px' }}>
                          Edit
                        </Button>
                        {!isMobile && (
                          <Divider orientation='vertical' flexItem sx={{ marginInline: '5px' }} />
                        )}
                        <Button
                          onClick={() => {
                            setDel({ id: row.id, name: row.name });
                            return setOpenDialog(true);
                          }}
                          variant='contained'
                          color='error'
                          sx={{ marginInline: 0.5, height: '20px', width: '50px' }}>
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            {filteredRows.length === 0 && (
              <Typography sx={{ textAlign: 'center', fontSize: '2vh', margin: '4vh' }}>
                No Customer with entered name.
              </Typography>
            )}
          </>
        )}
      </Paper>
      {openDialog && (
        <MyDialog
          title='Alert'
          des={`Are you sure you want to delete ${del.name}?`}
          actions={[
            {
              onClick: () => {
                handleDel(del.id);
                return setOpenDialog(false);
              },
              color: 'error',
              text: 'Delete',
            },
            { onClick: () => setOpenDialog(false), color: 'primary', text: 'Cancel' },
          ]}
        />
      )}
    </div>
  );
};

export default Customers;
