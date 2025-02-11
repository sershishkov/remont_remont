'use client';
import { usePathname } from 'next/navigation';
import { worker_role } from '@/constants/constants';

import React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Footer() {
  const pathname = usePathname();
  const pathStarts = pathname.split('/')[1];
  const isShowFooter = !worker_role.includes(pathStarts);

  return (
    <Grid
      container
      id='footer'
      sx={{ display: isShowFooter ? 'block' : 'none' }}
    >
      <Grid
        container
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Grid>
          <Typography variant='h6'>Ремонт любой сложности для ОСББ</Typography>
        </Grid>
      </Grid>

      <Grid
        container
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Grid component={Link} href='tel:+380502279650'>
          <Typography variant='h6'>+380502279650</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Footer;
