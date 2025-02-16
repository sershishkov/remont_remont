'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  item__get_one,
  item__edit,
  get__all,
  item__add,
} from '@/lib/actions/refdata.actions';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import MySelectAutoCompl from '@/components/common/MySelectAutoCompl';

import { I_Worker, I_StoreHouse } from '@/interfaces/refdata';

const currentURL = '/accountant/refdata/storehouse';

const initState = {
  storeHouseName: '',
  address: '',
  responsiblePerson: '',
};

function StoreHouseAddEdit({
  id,
  mode,
  title,
}: Readonly<{ id?: string; mode: string; title: string }>) {
  const route = useRouter();

  const [formData, setFormData] = useState(initState);
  const [arr__Workers, setArr__Workers] = useState<I_Worker[]>([]);

  const { storeHouseName, address, responsiblePerson } = formData;

  useEffect(() => {
    const inputFocus = document.getElementById('storeHouseName');
    inputFocus?.focus();
  }, []);

  useEffect(() => {
    const myGetAll = async () => {
      const all__Workers = await get__all(
        { page: '0', limit: '0', filter: '' },
        '/accountant/refdata/workers'
      );

      setArr__Workers(all__Workers.items);
    };

    myGetAll();
  }, []);

  useLayoutEffect(() => {
    if (id) {
      const myGetOne = async () => {
        const item: I_StoreHouse = await item__get_one({ _id: id }, currentURL);

        if (item) {
          setFormData({
            storeHouseName: item.storeHouseName ?? '',
            address: item.address ?? '',
            responsiblePerson: item.responsiblePerson?._id.toString() ?? '',
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
      storeHouseName,
      address,
      responsiblePerson,
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

  const handleChangeSelects = (
    targetName: string,
    targetValue: string | string[]
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [targetName]: targetValue,
    }));
  };

  const onClickAddItem = (link: string) => {
    route.push(`${link}`);
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
          name='storeHouseName'
          label='Название склада'
          type='text'
          id='storeHouseName'
          value={storeHouseName ?? ''}
          onChange={onChange}
        />
      </Grid>
      <Grid>
        <TextField
          margin='normal'
          required
          fullWidth
          name='address'
          label='Адрес'
          type='text'
          id='address'
          value={address ?? ''}
          onChange={onChange}
        />
      </Grid>

      <Grid sx={{ mb: 2 }}>
        <Stack
          direction='row'
          spacing={2}
          // direction={{ xs: 'column', sm: 'row' }}
        >
          <MySelectAutoCompl
            selectName={`responsiblePerson`}
            selectLabel={`Ответственный кладовщик`}
            fieldToShow={`lastName`}
            handleChangeSelects={handleChangeSelects}
            selectedOption={responsiblePerson ?? ''}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            arrToSelect={arr__Workers ?? []}
          />

          <IconButton
            onClick={() => onClickAddItem('/accountant/refdata/workers/add')}
          >
            <AddIcon color='success' sx={{ fontSize: 30 }} />
          </IconButton>
        </Stack>
      </Grid>

      <Grid>
        <Button
          type='submit'
          fullWidth
          disabled={!storeHouseName || !address || !responsiblePerson}
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
        >
          Сохранить
        </Button>
      </Grid>
    </Grid>
  );
}

export default StoreHouseAddEdit;
