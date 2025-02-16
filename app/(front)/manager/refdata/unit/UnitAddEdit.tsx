'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  item__get_one,
  item__edit,
  item__add,
} from '@/lib/actions/refdata.actions';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const currentURL = '/manager/refdata/unit';

export default function UnitAddEdit({
  id,
  mode,
  title,
}: Readonly<{ id?: string; mode: string; title: string }>) {
  const route = useRouter();

  const [unitName, setUnitName] = useState<string>('');

  useEffect(() => {
    const inputFocus = document.getElementById('unitName');
    inputFocus?.focus();
  }, []);

  useEffect(() => {
    if (id) {
      const myGetOne = async () => {
        const myData = await item__get_one({ _id: id }, currentURL);
        setUnitName(myData.unitName);
      };
      myGetOne();
    }
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitName(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const created__Data = {
      unitName,
    };

    if (mode === 'add') {
      await item__add(created__Data, currentURL, route);
    } else if (mode === 'edit') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      created__Data._id = id;
      await item__edit(created__Data, currentURL, route);
    }
  };

  return (
    <Grid component='form' onSubmit={onSubmit} container direction='column'>
      <Grid>
        <Typography variant='h3' align='center'>
          {title}
        </Typography>
      </Grid>
      <Grid>
        <TextField
          margin='normal'
          required
          fullWidth
          name='unitName'
          label='Единица измерения'
          type='text'
          id='unitName'
          value={unitName ?? ''}
          onChange={onChange}
        />
      </Grid>

      <Grid>
        <Button
          type='submit'
          fullWidth
          disabled={unitName.length === 0}
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
        >
          Сохранить
        </Button>
      </Grid>
    </Grid>
  );
}
