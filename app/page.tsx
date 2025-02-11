import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { weCanDo } from '@/constants/description_weCanDo';

export default function Home() {
  return (
    <Grid container direction='column' spacing={4}>
      <Grid>
        <Typography variant='h3' align='center'>
          Ремонт ОСББ
        </Typography>
        <Typography variant='h5' align='center'>
          Наша компания осуществляет услуги по ремонтам для ОСББ, так же мы
          работаем с физическими лицами
        </Typography>
      </Grid>

      <Grid>
        <Typography variant='h5' align='center'>
          Основные наши направления:
        </Typography>
      </Grid>

      {weCanDo.map((item) => (
        <Grid key={item.workName}>
          <Typography variant='h6' align='center'>
            {item.workName}
          </Typography>
          <List>
            <Grid container direction='column' alignItems='center'>
              {item.works.map((work) => (
                <Grid key={work}>
                  <ListItem>
                    <Typography variant='body2'>{work}</Typography>
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </List>
        </Grid>
      ))}
    </Grid>
  );
}
