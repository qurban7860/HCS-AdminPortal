import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// slices
import { getNote } from '../../../redux/slices/customer/note';
import { getSites } from '../../../redux/slices/customer/site';
import { getContacts } from '../../../redux/slices/customer/contact';

import { useSettingsContext } from '../../../components/settings';
// sections
import NoteEditForm from './NoteEditForm';

// ----------------------------------------------------------------------

export default function NoteEdit() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customer);
  const { id } = useParams(); 
  const { note } = useSelector((state) => state.note);
  useLayoutEffect(() => {
    dispatch(getNote(id));
    dispatch(getSites(customer._id));
    dispatch(getContacts(customer._id));
  }, [dispatch, id, customer._id]);

  return (
    <>
      <Container maxWidth={false }>
        <NoteEditForm/>
      </Container>
    </>
  );
}
