/** @format */
import { Box, Button, Fab, Paper, Stack, TextField, Typography } from '@mui/material';
import Customers from '../components/Customers.jsx';
import Machines from '../components/machines';
import { useContext, useRef, useState, useEffect } from 'react';
import MyDialog from '../dialogs/MyDialog';
import { AddPhotoAlternate } from '@mui/icons-material';
import { MachineContext } from '../MachineContext';
import { CustomerContext } from '../CustomerContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdvertismentPage() {
  const [validateMsg, setValidateMsg] = useState('');
  const adTimeRef = useRef();
  const [dialog, setDialog] = useState({ status: false, msg: '', title: '' });
  const { machineID } = useContext(MachineContext);
  const { customerID, setCustomerID } = useContext(CustomerContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [adImg, setAdImg] = useState();
  const [imgUpdate, setImgUpdate] = useState(false);
  function validateImg() {
    var fileInput = document.getElementById('img');
    var fileSize = fileInput.files[0].size;
    var fileType = fileInput.files[0].type;
    var image = new Image();
    image.src = URL.createObjectURL(fileInput.files[0]);
    image.onload = function () {
      var width = this.width;
      var height = this.height;
      if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
        alert('Please upload a JPEG or PNG image.');
        fileInput.value = '';
        return false;
      }
      if (fileSize > 5 * 1024 * 1024) {
        alert('Please upload an image smaller than 5MB.');
        fileInput.value = '';
        return false;
      }
      if (width !== height) {
        setValidateMsg(
          'Warning! Please upload a square image next time for better result in Client View.'
        );
        return true;
      }
      if (width < 1024 || height < 1024) {
        setValidateMsg(
          'Warning! Please upload an image with dimensions greater than 1024x1024 next time for better result in Client View.'
        );
        return true;
      }
    };
  }
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get(`advertisment.php?cid=${customerID}&api=${machineID}`,
       { cancelToken: source.token,headers:{Authorization:token} })
      .then(res => {
        if (res.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        res.data.path
          ? setAdImg(axios.defaults.baseURL + 'client/' + res.data.path)
          : setAdImg(null);
        adTimeRef.current.value = res.data.time;
      })
      .catch(err => console.log(err));
    return () => {
      source.cancel();
    };
  }, [machineID, imgUpdate]);
  const imgRef = useRef(null);

  const imgForSingleMachine = async () => {
    if (imgRef.current.files[0]) {
      let fd = new FormData();
      fd.append('fileToUpload', imgRef.current.files[0]);
      fd.append('cid', customerID);
      fd.append('api', machineID);
      await axios
        .post('advertisment.php', fd,{headers: { Authorization: token }})
        .then(result => {
          if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
          const res = result.data.res;
          res === 'true'
            ? setDialog({
                msg: `Image is uploaded successfully for only selected machine.<br> ${validateMsg}`,
                title: validateMsg === '' ? 'SUCCESS' : 'WARNING',
                status: true,
              })
            : setDialog({
                msg: res,
                title: 'FAILURE',
                status: true,
              });
        })
        .catch(err => console.log(err));
      setImgUpdate(pre => !pre);
      imgRef.current.value = null;
    }
  };
  const imgForAllMachine = async () => {
    if (imgRef.current.files[0]) {
      let fd = new FormData();
      fd.append('fileToUpload', imgRef.current.files[0]);
      fd.append('cid', customerID);
      await axios
        .post('advertisment.php', fd,{headers: { Authorization: token }})
        .then(result => {
          if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
          const res = result.data.res;
          res === 'true'
            ? setDialog({
                msg: `Image is uploaded successfully for all machines.<br> ${validateMsg}`,
                title: validateMsg === '' ? 'SUCCESS' : 'WARNING',
                status: true,
              })
            : setDialog({
                msg: res,
                title: 'FAILURE',
                status: true,
              });
        })
        .catch(err => console.log(err));
      setImgUpdate(pre => !pre);
      imgRef.current.value = null;
    }
  };
  const timeForSingleMachine = async () => {
    let fd = new FormData();
    fd.append('time', adTimeRef.current.value);
    fd.append('api', machineID);
    await axios
      .post('advertisment.php', fd,{headers: { Authorization: token }})
      .then(result => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        const res = result.data.res;
        res === 'true'
          ? setDialog({
              msg: 'Time is Updated for only Selected Machine.',
              title: 'SUCCESS',
              status: true,
            })
          : setDialog({
              msg: res,
              title: 'FAILURE',
              status: true,
            });
      })
      .catch(err => console.log(err));
  };
  const timeForAllMachine = async () => {
    let fd = new FormData();
    fd.append('time', adTimeRef.current.value);
    fd.append('cid', customerID);
    await axios
      .post('advertisment.php', fd,{headers: { Authorization: token }})
      .then(result => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        const res = result.data.res;
        res === 'true'
          ? setDialog({
              msg: 'Time is Updated for all Machines.',
              title: 'SUCCESS',
              status: true,
            })
          : setDialog({
              msg: res,
              title: 'FAILURE',
              status: true,
            });
      })
      .catch(err => console.log(err));
  };
  return (
    <Stack gap={1} direction={{ xs: 'column', sm: 'row' }}>
      <div>
        <Customers />
        <Machines />
      </div>
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <Typography
          fontWeight={'bold'}
          sx={{
            textDecoration: 'Underline',
            textAlign: 'center',
            color: 'black',
            mb: 0.5,

            fontSize: '3.3vh!important',
          }}>
          ADVERTISMENT
        </Typography>
        <Paper sx={{ flexGrow: 1, p: 1 }}>
          <Stack sx={{ justifyContent: 'space-between' }} direction={{ xs: 'column', sm: 'row' }}>
            <Box sx={{ flex: 1, order: { xs: 2, sm: 1 } }}>
              <div
                style={{
                  border: '2px solid black',
                  borderRadius: '1vh',
                  padding: '1vh',
                  marginBottom: '.3vh',
                }}>
                <Typography fontWeight='bold' fontSize='2.5vh'>
                  Upload Image:
                </Typography>
                <u>Note:</u>
                <ul style={{ marginLeft: '50px' }}>
                  <li>
                    <Typography fontSize='2vh'>Size of image should not exceed 2MB.</Typography>
                  </li>
                  <li>
                    <Typography fontSize='2vh'>
                      Image must be with .jpg or .png extension.
                    </Typography>
                  </li>
                  <li>
                    <Typography fontSize='2vh'>
                      File Must be in Squre Dimensions(i.e. aspect ratio 1/1)
                    </Typography>
                  </li>
                  <li>
                    <Typography fontSize='2vh'>
                      Recomended dimensions of image are 1024 by 1024.
                    </Typography>
                  </li>
                </ul>
                <form onSubmit={e => e.preventDefault()}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: '2vh 0',
                    }}>
                    <Paper
                      elevation={10}
                      sx={{
                        width: 'fit-content',
                        p: '1vh',

                        paddingInline: '1.5vh',
                      }}>
                      <input
                        required
                        accept='image/*'
                        ref={imgRef}
                        id='img'
                        type='file'
                        style={{ width: '80%' }}
                        onChange={validateImg}
                      />
                      <label htmlFor='img'>
                        <Fab component='span'>
                          <AddPhotoAlternate />
                        </Fab>
                      </label>
                    </Paper>
                  </div>
                  <Typography sx={{ display: 'inline', fontSize: '2vh', fontWeight: 'bold' }}>
                    Upload For:
                  </Typography>
                  <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    onClick={imgForSingleMachine}
                    sx={{ marginInline: '2vh' }}>
                    Selected Machine
                  </Button>
                  <Button
                    type='submit'
                    color='success'
                    variant='contained'
                    size='large'
                    onClick={imgForAllMachine}
                    sx={{ m: '1vh', ml: '1.5vh' }}>
                    All Machines
                  </Button>
                </form>
              </div>
              <div style={{ border: '2px solid black', borderRadius: '1vh', padding: '1vh' }}>
                <Typography fontWeight='bold' fontSize='2.5vh'>
                  Advertising Time:
                </Typography>
                <form onSubmit={e => e.preventDefault()}>
                  <div style={{ margin: '2vh 0', display: 'flex', justifyContent: 'center' }}>
                    <TextField
                      required
                      label='Enter Time in Seconds'
                      InputLabelProps={{ shrink: true }}
                      inputRef={adTimeRef}
                      type='number'
                    />
                  </div>

                  <Typography sx={{ display: 'inline', fontSize: '2vh', fontWeight: 'bold' }}>
                    Update For:
                  </Typography>
                  <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    sx={{ marginInline: '2vh' }}
                    onClick={timeForSingleMachine}>
                    Selected Machine
                  </Button>
                  <Button
                    type='submit'
                    color='success'
                    variant='contained'
                    size='large'
                    onClick={timeForAllMachine}
                    sx={{ m: '1vh', ml: '1.5vh' }}>
                    All Machines
                  </Button>
                </form>
              </div>
            </Box>
            <Box
              sx={{
                order: { xs: 1, sm: 2 },
                flex: 1,
                border: '2px solid black',
                borderRadius: '1vh',
                marginInline: { xs: 0, sm: 1 },
                marginBlock: { xs: 1, sm: 0 },
                overflow: 'hidden',
                height: 'fit-content',
              }}>
              {adImg ? (
                <img alt='Advertisment' width='100%' src={adImg} />
              ) : (
                <Typography fontSize='2.5vh' textAlign='center'>
                  Image is not Uploaded for Selected Machine.
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
        {dialog.status && (
          <MyDialog
            title={dialog.title}
            des={dialog.msg}
            actions={[
              { onClick: () => setDialog({ status: false }), color: 'primary', text: 'OK' },
            ]}
          />
        )}
      </div>
    </Stack>
  );
}

export default AdvertismentPage;
