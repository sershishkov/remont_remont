import React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Loading from '@/app/loading';

export default function MySpinner() {
  return (
    <Grid
      container
      direction={`column`}
      justifyContent={`flex-start`}
      alignItems={`center`}
    >
      <Grid>
        <Typography variant='h6'>
          Если долго крутиться - то пока в базе ничего нет
        </Typography>
      </Grid>
      <Grid>
        <Loading />
      </Grid>
    </Grid>
  );
}
