import PropTypes from 'prop-types';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch,
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  DialogTitle,
  Dialog,
  InputAdornment,
  Link,
} from '@mui/material';
// global
import {
  getNotes,
  deleteNote,
  getNote,
  setNoteEditFormVisibility,
} from '../../../redux/slices/products/machineNote';
import ConfirmDialog from '../../../components/confirm-dialog';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';

NoteViewForm.propTypes = {
  currentNote: PropTypes.object,
};
export default function NoteViewForm({ currentNote = null }) {
  const {
    note,
    isLoading,
    error,
    initial,
    responseMessage,
    noteEditFormVisibility,
    formVisibility,
  } = useSelector((state) => state.machinenote);
  const dispatch = useDispatch();
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  const handleEdit = async () => {
    await dispatch(getNote(machine._id, currentNote._id));
    dispatch(setNoteEditFormVisibility(true));
  };
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const onDelete = async () => {
    try {
      await dispatch(deleteNote(machine._id, currentNote._id));
      handleCloseConfirm();
      dispatch(getNotes(machine._id));
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('Note delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  const defaultValues = useMemo(
    () => ({
      note: currentNote?.note || '',
      isActive: currentNote.isActive,
      createdByFullName: currentNote?.createdBy?.name || '',
      createdAt: currentNote?.createdAt || '',
      createdIP: currentNote?.createdIP || '',
      updatedByFullName: currentNote?.updatedBy?.name || '',
      updatedAt: currentNote?.updatedAt || '',
      updatedIP: currentNote?.updatedIP || '',
    }),
    [currentNote]
  );
  return (
    <Grid sx={{ px: 2 }}>
      <ViewFormEditDeleteButtons
        disableEditButton={machine.transferredMachine}
        disableDeleteButton={machine.transferredMachine}
        handleEdit={handleEdit}
        onDelete={onDelete}
      />
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField sm={12} heading="Note" param={defaultValues?.note} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Grid>
  );
}
