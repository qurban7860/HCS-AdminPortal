import {  useLayoutEffect } from 'react';
import {  useParams } from 'react-router-dom';
// @mui
import {  Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { getCheckItem } from '../../../redux/slices/products/machineCheckItems';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// components
// import Iconify from '../../../components/iconify/Iconify';
// import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
// import { useSettingsContext } from '../../../components/settings';
// sections
import { Cover } from '../../components/Defaults/Cover';
import CheckItemViewForm from './CheckItemViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function CheckItemView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getCheckItem(id));
  }, [id, dispatch]);

  const { checkItem } = useSelector((state) => state.checkItems);

  return (
    <>
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover
            name={checkItem?.name}
            setting
            backLink={PATH_MACHINE.machines.settings.checkItems.list}
            titleLength={30}
          />
        </Card>
        <CheckItemViewForm />
      </Container>
    </>
  );
}
