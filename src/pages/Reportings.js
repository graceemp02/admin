/** @format */

import React, { useContext } from 'react';
import { Grid, Paper, Typography } from '@mui/material/';
import { styled } from '@mui/material/styles';
import Customers from '../components/Customers';
import Machines from '../components/machines';
import Main from '../components/reportings/Main';
import { MachineContext } from '../MachineContext';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const Reportings = () => {
  const { machineID } = useContext(MachineContext);

  return (
    <Grid container spacing={0.5} sx={{ p: 1 }}>
      <Grid item xs={12} md={4} lg={3}>
        <Customers />
        <Machines />
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        {machineID ? (
          <>
            <Typography variant='h2' fontSize='3vh' align='center' fontWeight='bold' color='black'>
              REPORTS & TRENDS
            </Typography>

            <Item sx={{ mt: 0.5 }}>
              <Main />
            </Item>
          </>
        ) : (
          <Item>
            <Typography
              sx={{
                paddingBlock: 2,
                color: 'rgba(0,0,0,0.8)',
                border: '2px solid black',
                borderRadius: 2,
              }}>
              No Machine is added for selected Customer
            </Typography>
          </Item>
        )}
      </Grid>
    </Grid>
  );
};

export default Reportings;
