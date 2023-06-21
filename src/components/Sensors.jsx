/** @format */
import { Typography } from '@mui/material';
import IndoorSensors from './IndoorSensors';
import OutdoorSensors from './OutdoorSensors';
import InspectionDate from './InspectionDate';

function Sensors() {
  return (
    <>
      <Typography
        align='left'
        pl={2}
        fontWeight={'bold'}
        sx={{ textDecoration: 'Underline', color: 'black', mb: '.1vh', fontSize: '3.3vh' }}>
        SENSORS
      </Typography>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <IndoorSensors />
        <OutdoorSensors />
        <InspectionDate />
      </div>
    </>
  );
}
export default Sensors;
