import PropTypes from 'prop-types';
// import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// @mui
// import { LoadingButton } from '@mui/lab';
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
import { fDate, fDateTime } from '../../../utils/formatTime';

// global
// import { CONFIG } from '../../config-global';
// routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// components
// import { getNotes, getNote } from '../../redux/slices/note';
import {
  getNotes,
  deleteNote,
  getNote,
  setNoteEditFormVisibility,
} from '../../../redux/slices/customer/note';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { useSnackbar } from '../../../components/snackbar';

NoteViewForm.propTypes = {
  currentNote: PropTypes.object,
};
export default function NoteViewForm({ currentNote = null }) {
  const { note } = useSelector((state) => state.note);
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = async () => {
    await dispatch(getNote(customer._id, currentNote._id));
    dispatch(setNoteEditFormVisibility(true));
  };

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteNote(customer._id, currentNote._id));
      handleCloseConfirm();
      dispatch(getNotes(customer._id));
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('Notes delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const defaultValues = useMemo(
    () => ({
      id: currentNote?._id || '',
      site_name:
        currentNote.site === null || currentNote.site === undefined ? '' : currentNote.site.name,
      contact_firstName:
        currentNote.contact === undefined || currentNote.contact === null
          ? ''
          : currentNote.contact.firstName,
      contact_lastName:
        currentNote.contact === undefined || currentNote.contact === null
          ? ''
          : currentNote.contact.lastName,
      note: currentNote?.note || '',
      isActive: currentNote.isActive,
      createdAt: currentNote?.createdAt || '',
      createdByFullName: currentNote?.createdBy?.name || '',
      createdIP: currentNote?.createdIP || '',
      updatedAt: currentNote?.updatedAt || '',
      updatedByFullName: currentNote?.updatedBy?.name || '',
      updatedIP: currentNote?.updatedIP || '',
    }),
    [currentNote]
  );
  return (
    <>
      <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive}/>
        <ViewFormField sm={6} heading="Site" param={defaultValues?.site_name} />
        <ViewFormField
          sm={6}
          heading="Contact"
          param={defaultValues?.contact_firstName}
          secondParam={defaultValues?.contact_lastName !== '' ? defaultValues.contact_lastName : ''}
        />
        <ViewFormField sm={12} heading="Note" param={defaultValues?.note} />
        <ViewFormField />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </>
  );
}
