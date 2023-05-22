import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// slices
import { getNote } from '../../../redux/slices/customer/note';
// import { getUsers } from '../../../redux/slices/securityUser/securityUser';
import { getSites } from '../../../redux/slices/customer/site';
import { getContacts } from '../../../redux/slices/customer/contact';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import NoteEditForm from './NoteEditForm';

// ----------------------------------------------------------------------

export default function NoteEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customer);


  const { id } = useParams(); 
  // console.log(id);


  const { note } = useSelector((state) => state.note);

  useLayoutEffect(() => {
    dispatch(getNote(id));
    // dispatch(getUsers());
    dispatch(getSites(customer._id));
    dispatch(getContacts(customer._id));
  }, [dispatch, id, customer._id]);

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          // heading="Edit Note"
          // links={[
          //   { name: 'Dashboard', href: PATH_DASHBOARD.root },
          //   {
          //     name: 'Note',
          //     href: PATH_DASHBOARD.note.list,
          //   },
          //   { name: note?.name },
          // ]}
        />

        <NoteEditForm/>
      </Container>
    </>
  );
}
