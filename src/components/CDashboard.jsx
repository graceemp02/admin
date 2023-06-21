/** @format */

import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import Logo from '../assests/logo.png';
import { MachineContext } from '../MachineContext';
import axios from 'axios';
import { CustomerContext } from '../CustomerContext';
import { useNavigate } from 'react-router-dom';

function CDashboard() {
  const [res, setRes] = useState({});
  const [display, setDisplay] = useState('flex');
  const { machineID } = useContext(MachineContext);
  const token = localStorage.getItem("authToken");
  const { setCustomerID } = useContext(CustomerContext);
  const navigate = useNavigate();


  useEffect(() => {
    let intervalId; 
    const fetchData = async () => {
      await axios
        .get("dashboard.php", {
          params: { api: machineID },
          headers: { Authorization: token },
        })
        .then((result) => {
          if (result.data.error === "Expired token") {
            localStorage.clear();
            setCustomerID(null);
            navigate("/login");
          }
          const newData = result.data;
          if (JSON.stringify(newData) !== JSON.stringify(res)) {
            setRes(newData);
            setDisplay(newData.humHdnStatus ? "flex" : "none");
          }
        })
        .catch((error) => console.log(error));
    };
    fetchData();
    intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [machineID, res]);

  const circleStyle = {
    width: '2.7vh',
    height: '2.7vh',
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography
        fontWeight={'bold'}
        align='left'
        pl={2}
        variant='h4'
        sx={{ textDecoration: 'Underline', color: 'black', mb: 0.5, fontSize: '3.3vh!important' }}>
        DASHBOARD
      </Typography>
      <div
        style={{
          flex: 1,
          display: 'flex',
          borderRadius: '1vh',
          backgroundColor: 'white',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '.75em',
          minHeight: '94%',
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'black' }}>
              AQI
            </Typography>
            <div>{res.aqi}%</div>
          </div>
          <div className='centerIcon'>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'black' }}>
              FAN
            </Typography>
            <div className='iconsDiv'>
              <CircleIcon sx={circleStyle} htmlColor={res.fan1 > 0 ? '#00c853' : ''} />
              <CircleIcon sx={circleStyle} htmlColor={res.fan2 > 0 ? '#00c853' : ''} />
            </div>
          </div>
          <div className='centerIcon'>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'black' }}>
              UCV
            </Typography>
            <div className='iconsDiv'>
              <CircleIcon sx={circleStyle} htmlColor={res.uvc1 > 0 ? '#00c853' : ''} />
              <CircleIcon sx={circleStyle} htmlColor={res.uvc2 > 0 ? '#00c853' : ''} />
            </div>
          </div>
          <div className='centerIcon'>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'black' }}>
              OSA
            </Typography>
            <div className='iconsDiv'>
              <CircleIcon sx={circleStyle} htmlColor={res.osa1 > 0 ? '#00c853' : ''} />
              <CircleIcon sx={circleStyle} htmlColor={res.osa2 > 0 ? '#00c853' : ''} />
            </div>
          </div>
          <div className='centerIcon'>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'black' }}>
              C/H
            </Typography>
            <div className='iconsDiv'>
              <CircleIcon sx={circleStyle} htmlColor={res.ch1 > 0 ? 'blue' : ''} />
              <CircleIcon sx={circleStyle} htmlColor={res.ch2 > 0 ? 'red' : ''} />
            </div>
          </div>
          <div>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'black' }}>
              Temp
            </Typography>
            <div>{res.temp}°F</div>
          </div>
        </div>
        <div>
          <Typography
            sx={{ textShadow: '1px 10px 10px rgb(0 0 0 / 50%)', fontSize: '40vh' }}
            lineHeight={'1em'}
            fontWeight='900'
            className={`color${res.letter}`}>
            {res.letter ? res.letter : <CircularProgress color='inherit' size={300} />}
          </Typography>
        </div>
        <div>
          <Typography
            color={'black'}
            variant={'h5'}
            lineHeight={1}
            sx={{ fontSize: '2.8vh', mb: '10px' }}>
            {res.letter === 'A'
              ? 'HEALTHY '
              : res.letter === 'B'
              ? 'SAFE '
              : res.letter === 'C'
              ? 'FAIR '
              : res.letter === 'D'
              ? 'POOR '
              : res.letter === 'F'
              ? 'DANGER '
              : '... '}
            INDOOR AIR QUALITY
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div style={{ width:'20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <CircleIcon sx={circleStyle} className={res.humInd1 ? res.humInd1 : 'gray'} />
                <CircleIcon sx={circleStyle} className={res.humInd2 ? res.humInd2 : 'gray'} />
                <CircleIcon sx={circleStyle} className={res.humInd3 ? res.humInd3 : 'gray'} />
                <CircleIcon sx={circleStyle} className={res.humInd4 ? res.humInd4 : 'gray'} />
                <CircleIcon sx={circleStyle} className={res.humInd5 ? res.humInd5 : 'gray'} />
              </div>
              <Box sx={{ display: { display }, flexDirection: 'column' }}>
                <CircleIcon sx={circleStyle} className={res.humHdnInd1 ? res.humHdnInd1 : 'gray'} />
                <CircleIcon sx={circleStyle} className={res.humHdnInd2 ? res.humHdnInd2 : 'gray'} />
                <CircleIcon sx={circleStyle} className={res.humHdnInd3 ? res.humHdnInd3 : 'gray'} />
                <CircleIcon sx={circleStyle} className={res.humHdnInd4 ? res.humHdnInd4 : 'gray'} />
              </Box>
            </div>
            <Typography variant='body2'>Humidity</Typography>
          </div>
          <div style={{ width:'20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircleIcon sx={circleStyle} className={res.voc1 ? res.voc1 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.voc2 ? res.voc2 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.voc3 ? res.voc3 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.voc4 ? res.voc4 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.voc5 ? res.voc5 : 'gray'} />
            <Typography variant='body2'>VOC</Typography>
          </div>
          <div style={{ width:'20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircleIcon sx={circleStyle} className={res.co2_1 ? res.co2_1 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.co2_2 ? res.co2_2 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.co2_3 ? res.co2_3 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.co2_4 ? res.co2_4 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.co2_5 ? res.co2_5 : 'gray'} />
            <Typography variant='body2'>
              CO<sub>2</sub>
            </Typography>
          </div>
          <div style={{ width:'20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircleIcon sx={circleStyle} className={res.pm25_1 ? res.pm25_1 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.pm25_2 ? res.pm25_2 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.pm25_3 ? res.pm25_3 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.pm25_4 ? res.pm25_4 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.pm25_5 ? res.pm25_5 : 'gray'} />
            <Typography variant='body2'>PM2.5</Typography>
          </div>
          <div style={{ width:'20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircleIcon
              sx={circleStyle}
              className={res.pm10_1 ? res.pm10_1 : ''}
              htmlColor={res.pm10_1}
            />
            <CircleIcon sx={circleStyle} className={res.pm10_2 ? res.pm10_2 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.pm10_3 ? res.pm10_3 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.pm10_4 ? res.pm10_4 : 'gray'} />
            <CircleIcon sx={circleStyle} className={res.pm10_5 ? res.pm10_5 : 'gray'} />
            <Typography variant='body2'>PM10</Typography>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            height: ' 100px',
            alignItems: 'center',
          }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt={'Logo'} width='60px' />{' '}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography fontWeight={'bold'} color={'black'} fontSize='1.3em' variant={'body1'}>
              {res.machine}
            </Typography>
            <Typography
              fontWeight={'bold'}
              color={'black'}
              fontSize='1.3em'
              mt={0.5}
              variant={'body1'}>
              {res.customer}
            </Typography>
            <Typography color={'black'} variant={'body1'} fontSize='.84em' mt={0.5}>
              Next Inspection Date: {res.date}
            </Typography>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              height: '100%',
            }}>
            <Button
              disabled
              sx={{
                width: '6em',
                height: '3vh',
                mb: '5px',
                bgcolor: '#2196f3 !important',
                color: '#fff !important',
                opacity: '0.5',
                fontSize: '1.5vh',
                textTransform: 'capitalize',
              }}
              variant='contained'
              size='small'>
              Time
            </Button>
            <Button
              disabled
              sx={{
                width: '6em',
                height: '3vh',
                mb: '5px',
                bgcolor: '#2196f3 !important',
                color: '#fff !important',
                opacity: '.5',
                fontSize: '1.5vh',
                textTransform: 'capitalize',
              }}
              className='disabledButton'
              width={100}
              variant='contained'
              size='small'>
              Machines
            </Button>
            <Button
              disabled
              sx={{
                width: '6em',
                height: '3vh',
                bgcolor: '#2196f3 !important',
                color: '#fff !important',
                opacity: '.5',
                fontSize: '1.5vh',
                textTransform: 'capitalize',
              }}
              variant='contained'
              size='small'>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CDashboard;
