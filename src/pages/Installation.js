/** @format */

import { Grid, Paper, Typography } from '@mui/material/';
import { styled } from '@mui/material/styles';
import Customers from '../components/Customers';
import MyStepper from '../components/installation/MyStepper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const Installation = () => {
  return (
    <Grid container spacing={0.5} sx={{ p: 1 }}>
      <Grid item xs={12} md={5} lg={2.5}>
        <Item>
          <Customers />
        </Item>
      </Grid>
      <Grid item xs={12} md={7} lg={9.5}>
        <Item>
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
            Installation
          </Typography>
          <MyStepper />
        </Item>
      </Grid>
    </Grid>
  );
};

export default Installation;
