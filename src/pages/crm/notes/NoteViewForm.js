import { useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Container, Card, Grid } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// import { fDate } from 'src/utils/formatTime';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import {
  getNote,
  resetNote,
  deleteNote,
} from '../../../redux/slices/customer/customerNote';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
import { PATH_CRM } from '../../../routes/paths';

export default function NoteViewForm() {
  const { customer } = useSelector((state) => state.customer);
  const { note, isLoading } = useSelector((state) => state.customerNote);

  const { enqueueSnackbar } = useSnackbar();
  const { customerId, id } = useParams() 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{ 
    if( id && customerId ){
      dispatch(getNote(customerId, id))
    }
    // return ()=>{ dispatch(resetNote())}
  },[ dispatch, id, customerId])

  const onDelete = async () => {
    try {
      await dispatch(deleteNote(customerId, id));
      enqueueSnackbar("Note archived Successfully");
      if(customerId ) navigate(PATH_CRM.customers.notes.root(customerId));
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log('Error:', err);
    }
  }

  const handleEdit = async () => navigate(PATH_CRM.customers.notes.edit(customerId, id));

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
    <Container maxWidth={false} >
    <Grid item md={12} >
      <CustomerTabContainer currentTabValue='notes' />
      <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons isActive={defaultValues.isActive} backLink={()=> { if(customerId) navigate(PATH_CRM.customers.notes.root(customerId))}} handleEdit={customer?.isArchived ? undefined : handleEdit} onDelete={customer?.isArchived ? undefined : onDelete} />
        <Grid container sx={{mt:2}}>
          <ViewFormField isLoading={isLoading} sm={6} heading="Site" param={defaultValues?.site_name} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Contact" param={`${defaultValues?.contact_firstName} ${defaultValues?.contact_lastName}`}/>
          <ViewFormField isLoading={isLoading} sm={12} heading="Note" param={defaultValues?.note} />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Card>
    </Grid>
    </Container>
  );
}
