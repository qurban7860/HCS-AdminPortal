import { useLayoutEffect, useMemo } from 'react';
// @mui
import { Container, Card, Grid } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
//
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { getNote, deleteNote } from '../../../redux/slices/products/machineNote';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
// constants
import { Snacks } from '../../../constants/machine-constants';
import MachineTabContainer from '../util/MachineTabContainer';

export default function NoteViewForm() {
  const { note, isLoading } = useSelector((state) => state.machineNote);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { machineId, id } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(()=>{
    if(machineId && id){
      dispatch(getNote(machineId, id));
    }
  },[ dispatch, machineId, id ])

  const onDelete = async () => {
    try {
      dispatch(deleteNote(machineId, id));
      enqueueSnackbar(Snacks.noteDeleted);
      await navigate(PATH_MACHINE.machines.notes.root(machineId));
    } catch (err) {
      enqueueSnackbar(Snacks.failedDeleteNote, { variant: `error` });
      console.log('Error:', err);
    }
  }

  const handleEdit = () => navigate(PATH_MACHINE.machines.notes.edit(machineId, id));

  const defaultValues = useMemo(
    () => ({
      note: note?.note || '',
      isActive: note?.isActive,
      createdByFullName: note?.createdBy?.name || '',
      createdAt: note?.createdAt || '',
      createdIP: note?.createdIP || '',
      updatedByFullName: note?.updatedBy?.name || '',
      updatedAt: note?.updatedAt || '',
      updatedIP: note?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note]
  );
  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='notes' />
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} 
      backLink={()=> navigate(PATH_MACHINE.machines.notes.root(machineId))} 
      handleEdit={handleEdit} onDelete={onDelete}
      disableEditButton={machine?.status?.slug==='transferred'}
      disableDeleteButton={machine?.status?.slug==='transferred'}
      />
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={12} heading="Note" param={defaultValues.note} />
        <ViewFormAudit defaultValues={defaultValues} /> 
      </Grid>
    </Card>
    </Grid>
    </Container>
  );
}
