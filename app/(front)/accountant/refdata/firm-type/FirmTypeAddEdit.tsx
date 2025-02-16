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

const currentURL = '/accountant/refdata/firm-type';

const initState = {
  firmTypeLongName: '',
  firmTypeShortName: '',
};

function FirmTypeAddEdit({
  id,
  mode,
  title,
}: Readonly<{ id?: string; mode: string; title: string }>) {
  const route = useRouter();

  const [formData, setFormData] = useState(initState);

  const { firmTypeLongName, firmTypeShortName } = formData;

  useEffect(() => {
    const inputFocus = document.getElementById('firmTypeLongName');
    inputFocus?.focus();
  }, []);

  useEffect(() => {
    if (id) {
      const myGetOne = async () => {
        const item = await item__get_one({ _id: id }, currentURL);

        if (item) {
          setFormData({
            firmTypeLongName: item.firmTypeLongName!,
            firmTypeShortName: item.firmTypeShortName!,
          });
        }
      };
      myGetOne();
    }
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const created__Data = {
      firmTypeLongName,
      firmTypeShortName,
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
      <Grid className='item item-heading'>
        <Typography variant='h3' align='center'>
          {title}
        </Typography>
      </Grid>
      <Grid>
        <TextField
          margin='normal'
          required
          fullWidth
          name='firmTypeLongName'
          label='Полное название'
          type='text'
          id='firmTypeLongName'
          value={firmTypeLongName ?? ''}
          onChange={onChange}
        />
      </Grid>
      <Grid>
        <TextField
          margin='normal'
          // multiline
          maxRows={4}
          fullWidth
          name='firmTypeShortName'
          label='Сокращенное название'
          type='text'
          id='firmTypeShortName'
          value={firmTypeShortName ?? ''}
          onChange={onChange}
        />
      </Grid>

      <Grid>
        <Button
          type='submit'
          fullWidth
          disabled={
            firmTypeLongName.length === 0 || firmTypeShortName.length === 0
          }
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
        >
          Сохранить
        </Button>
      </Grid>
    </Grid>
  );
}

export default FirmTypeAddEdit;
