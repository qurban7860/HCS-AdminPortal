import { useMemo } from 'react';
// @mui
import { Card, Grid } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// import { fDate } from 'src/utils/formatTime';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import {
  setNoteEditFormVisibility,
  getNote,
  deleteNote,
  setNoteViewFormVisibility,
} from '../../../redux/slices/customer/customerNote';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
// constants

export default function NoteViewForm() {
  const { note, isLoading } = useSelector((state) => state.customerNote);
  const { customer } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      await dispatch(deleteNote(customer._id, note._id));
      enqueueSnackbar("Note Deleted Successfully");
      dispatch(setNoteViewFormVisibility(false));
    } catch (err) {
      enqueueSnackbar("Note Deletion Failed", { variant: `error` });
      console.log('Error:', err);
    }
  }

  const handleEdit = async () => {
    await dispatch(getNote(customer._id, note._id));
    dispatch(setNoteViewFormVisibility(false));
    dispatch(setNoteEditFormVisibility(true));
  }

  const defaultValues = useMemo(
    () => ({
      id: note?._id || '',
      site_name:note.site === null || note.site === undefined ? '' : note.site.name,
      contact_firstName:note.contact === undefined || note.contact === null ? '': note.contact.firstName,
      contact_lastName: note.contact === undefined || note.contact === null ? '': note.contact.lastName,
      note: note?.note || '',
      isActive: note.isActive,
      createdAt: note?.createdAt || '',
      createdByFullName: note?.createdBy?.name || '',
      createdIP: note?.createdIP || '',
      updatedAt: note?.updatedAt || '',
      updatedByFullName: note?.updatedBy?.name || '',
      updatedIP: note?.updatedIP || '',
    }),
    [note]
  );
  
  return (
    <Grid item md={12} >
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} backLink={()=> dispatch(setNoteViewFormVisibility(false))} handleEdit={handleEdit} onDelete={onDelete} />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Site" param={defaultValues?.site_name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Contact" param={defaultValues?.contact_firstName}
          secondParam={defaultValues?.contact_lastName !== '' ? defaultValues.contact_lastName : ''}
        />
        <ViewFormField isLoading={isLoading} sm={12} heading="Note" param={defaultValues?.note} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
    </Grid>
  );
}
