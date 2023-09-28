import { useMemo } from 'react';
// @mui
import { Card, Grid, Tooltip } from '@mui/material';
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
} from '../../../redux/slices/products/machineNote';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
// constants
import { Snacks } from '../../../constants/machine-constants';

export default function NoteViewForm() {
  const { note } = useSelector((state) => state.machineNote);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      dispatch(deleteNote(machine._id, note._id));
      enqueueSnackbar(Snacks.noteDeleted);
      dispatch(setNoteViewFormVisibility(false));
    } catch (err) {
      enqueueSnackbar(Snacks.failedDeleteNote, { variant: `error` });
      console.log('Error:', err);
    }
  }

  const handleEdit = async () => {
    dispatch(getNote(machine._id, note._id));
    dispatch(setNoteViewFormVisibility(false));
    dispatch(setNoteEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      note: note?.note || '',
      isActive: note?.isActive || '',
      createdByFullName: note?.createdBy?.name || '',
      createdAt: note?.createdAt || '',
      createdIP: note?.createdIP || '',
      updatedByFullName: note?.updatedBy?.name || '',
      updatedAt: note?.updatedAt || '',
      updatedIP: note?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note, machine]
  );
  return (
    // needs cleanup
    <>
    {/* <DocumentCover content={defaultValues?.displayName} backLink="true"  generalSettings /> */}
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive}  backLink={()=> dispatch(setNoteViewFormVisibility(false))} handleEdit={handleEdit} onDelete={onDelete} />
      {/* <Grid display="inline-flex">
        <Tooltip>
          <ViewFormField isActive={defaultValues.isActive} />
        </Tooltip>
      </Grid> */}
      <Grid container>
        <ViewFormField sm={12} heading="Note" param={defaultValues.note} />
        <ViewFormAudit defaultValues={defaultValues} /> 
      </Grid>
    </Card>
    </Grid>
    </>
  );
}
