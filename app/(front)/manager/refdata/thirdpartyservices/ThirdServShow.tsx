'use client';
import React, { useState, useEffect } from 'react';

import { get__all, delete__one } from '@/lib/actions/refdata.actions';

import Link from '@mui/material/Link';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import MySelectAutoCompl from '@/components/common/MySelectAutoCompl';
import MySelectMultipleAutoCompl from '@/components/common/MySelectMultipleAutoCompl';
import MySpinner from '@/components/common/MySpinner';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const initState = {
  unit: '',
  thirdPartyServiceGroup: [],
};

const headerFields = [
  'Наименование',
  'ед.изм',
  'Цена вход',
  'Группы сторонних сервисов',
];

const tableFields = [
  'thirdPartyServiceName',
  'unit',
  'priceBuyRecommend',
  'thirdPartyServiceGroup',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arrToShow = (enteredArr: any) => {
  const localArr = JSON.parse(JSON.stringify(enteredArr));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedArr = localArr.map((currentItem: any) => {
    let arrToString = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentItem.thirdPartyServiceGroup.forEach((element: any) => {
      arrToString += `${element.thirdPartyServiceGroupName}, `;
    });

    return {
      _id: currentItem._id,
      thirdPartyServiceName: currentItem.thirdPartyServiceName,
      unit: currentItem.unit.unitName,
      priceBuyRecommend: currentItem.priceBuyRecommend,
      thirdPartyServiceGroup: arrToString,
    };
  });
  return transformedArr;
};

export default function ThirdServShow({
  currentURL,
  tableHeader,
}: {
  readonly currentURL: string;
  readonly tableHeader: string;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const [formData, setFormData] = useState(initState);
  const [countTotalItems, setCountTotalItems] = useState(0);
  const [arr__Units, setArr__Units] = useState([]);
  const [arr__ThirdPartyServiceGroups, setArr__ThirdPartyServiceGroups] =
    useState([]);

  const [searchText, setSearchText] = useState('');
  const [totalResults, setTotalResults] = useState([]);
  const [resultFetch, setResultFetch] = useState([]);

  const { unit, thirdPartyServiceGroup } = formData;

  useEffect(() => {
    const myGetAll = async () => {
      const getTotalItems = await get__all(
        { page: '0', limit: '0', filter: '' },
        currentURL
      );
      const units = await get__all(
        { page: '0', limit: '0', filter: '' },
        '/manager/refdata/unit'
      );
      const thirdpartyserviceGroup = await get__all(
        { page: '0', limit: '0', filter: '' },
        '/manager/refdata/thirdpartyservice-group'
      );

      setArr__Units(units.items);
      setArr__ThirdPartyServiceGroups(thirdpartyserviceGroup.items);

      setCountTotalItems(getTotalItems.total);
      setTotalResults(arrToShow(getTotalItems.items));
      setResultFetch(arrToShow(getTotalItems.items));
    };
    myGetAll();
  }, [currentURL]);

  useEffect(() => {
    setSearchText('');
    const searchInput = document.getElementById('searchText');
    searchInput?.focus();
  }, []);

  const onChangeSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
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

  const handleSearch = async () => {
    const filtered_items = await get__all(
      {
        page: '0',
        limit: '0',
        filter: searchText,

        unit: unit,
        thirdPartyServiceGroup: thirdPartyServiceGroup,
      },
      currentURL
    );

    setResultFetch(arrToShow(filtered_items?.items));
  };
  const handleRestart = () => {
    setResultFetch(totalResults);
    setFormData(initState);
    setSearchText('');
  };

  const deleteHanler = async (_id: string) => {
    await delete__one(_id, currentURL);
    const all_items = await get__all(
      { page: '0', limit: '0', filter: '' },
      currentURL
    );
    setResultFetch(arrToShow(all_items.items));
    setFormData(initState);
    setSearchText('');
  };

  return (
    <Grid
      container
      alignItems='center'
      direction='column'
      sx={{
        // border: '1px solid red',
        padding: matches ? '0 5rem' : '3rem 0.5rem',
        width: '100%',
        margin: 'auto',
      }}
    >
      <Grid
        container
        alignItems='center'
        justifyContent='space-between'
        direction={matches ? 'row' : 'column'}
        spacing={1}
        sx={{ width: '100%' }}
      >
        <Grid
          sx={{
            flex: 1,
            // border: '1px solid yellow',
            width: matches ? undefined : '100%',
          }}
        >
          <TextField
            margin='normal'
            focused
            fullWidth
            id='searchText'
            name='searchText'
            label='Строка поиска'
            type='search'
            value={searchText ?? ''}
            onChange={onChangeSearch}
          />
        </Grid>

        <Grid container alignItems='center'>
          <Grid sx={{ width: 120 }}>
            <MySelectAutoCompl
              selectName={`unit`}
              selectLabel={`Ед.изм`}
              fieldToShow={`unitName`}
              handleChangeSelects={handleChangeSelects}
              selectedOption={unit ?? ''}
              arrToSelect={arr__Units}
            />
          </Grid>

          <Grid sx={{ width: 200 }}>
            <MySelectMultipleAutoCompl
              selectName={`thirdPartyServiceGroup`}
              selectLabel={`Группы сторонних сервисов`}
              fieldToShow={`thirdPartyServiceGroupName`}
              handleChangeMultipleSelects={handleChangeSelects}
              selectedOptions={thirdPartyServiceGroup ?? []}
              arrToSelect={arr__ThirdPartyServiceGroups}
            />
          </Grid>
        </Grid>
        <Grid container alignItems='center'>
          <Grid>
            <Typography align='center'>{`Найдено:${resultFetch?.length}`}</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleSearch}>
              <SearchIcon color='success' />
            </IconButton>
          </Grid>
          <Grid>
            <IconButton onClick={handleRestart}>
              <RestartAltIcon color='error' />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>

      {!resultFetch || resultFetch?.length === 0 ? (
        <MySpinner />
      ) : (
        <Grid sx={{ width: '100%' }}>
          <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
            <Table
              stickyHeader
              sx={{
                width: '100%',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={
                      headerFields.length ? headerFields.length : undefined
                    }
                    sx={{ textAlign: 'center' }}
                  >
                    {`${tableHeader} `}
                  </TableCell>
                  <TableCell colSpan={2}>{` Всего ${
                    countTotalItems ?? 0
                  }`}</TableCell>
                </TableRow>
                <TableRow>
                  {headerFields.length > 0 &&
                    headerFields.map((item) => (
                      <TableCell align='center' key={item}>
                        {item}
                      </TableCell>
                    ))}

                  <TableCell style={{ width: 25 }} align='center'>
                    edit
                  </TableCell>
                  <TableCell style={{ width: 25 }} align='center'>
                    delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultFetch.length > 0 &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  resultFetch.map((row: any) => (
                    <TableRow key={row._id}>
                      {tableFields.length > 0 &&
                        tableFields.map((item) => (
                          <TableCell align='center' key={item}>
                            {row[item]}
                          </TableCell>
                        ))}

                      <TableCell align='center'>
                        <IconButton
                          component={Link}
                          href={`${currentURL}/${row._id}`}
                        >
                          <EditIcon color='primary' />
                        </IconButton>
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={() => deleteHanler(row._id)}>
                          <DeleteForeverIcon color='error' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </Grid>
  );
}
