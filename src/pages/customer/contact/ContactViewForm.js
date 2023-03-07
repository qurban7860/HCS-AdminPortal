import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ConfirmDialog from '../../../components/confirm-dialog';

import { getContacts, getContact, setEditFormVisibility, deleteContact } from '../../../redux/slices/contact';
// Iconify
import Iconify from '../../../components/iconify';
import { fDate,fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

ContactViewForm.propTypes = {
  currentContact: PropTypes.object,
};

export default function ContactViewForm({ currentContact = null }) {

  const { contact } = useSelector((state) => state.contact);

  const { customer } = useSelector((state) => state.customer);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

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

  const handleEdit = async () => {
    await dispatch(getContact(customer._id, currentContact._id));
    dispatch(setEditFormVisibility(true));
  };

  const onDelete = async () => {
    await dispatch(deleteContact(customer._id, currentContact._id));
    handleCloseConfirm();
    dispatch(getContacts(customer._id));
    // dispatch(getContacts());
  };

  const defaultValues = useMemo(
    () => ({
      firstName: currentContact ? currentContact.firstName : contact?.firstName || 'N/A',
      lastName: currentContact ? currentContact.lastName : contact?.lastName || 'N/A',
      title: currentContact ? currentContact.title : contact?.title || 'N/A',
      contactTypes: currentContact ? currentContact.contactTypes : contact?.contactTypes || [],
      phone: currentContact ? currentContact.phone : contact?.phone || 'N/A',
      email: currentContact ? currentContact.email : contact?.email || 'N/A',
      createdAt: currentContact?.createdAt || "",
      createdBy: currentContact?.createdBy || "",
      createdIP: currentContact?.createdIP || "",
      updatedAt: currentContact?.updatedAt || "",
      updatedBy: currentContact?.updatedBy || "",
      updatedIP: currentContact?.updatedIP || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentContact, contact]
  );

  return (
    <Grid sx={{ p: 2, mt:-4 }}>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4 }}>


        <Button
          onClick={() => handleEdit()}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          variant="outlined"
          color="error"
          startIcon={<Iconify icon="eva:trash-2-fill" />}
        >
          Delete
        </Button>

      </Stack>

        <Grid container>
            <Grid item xs={12} sm={6} sx={{pt:2}}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                First Name
              </Typography>
              <Typography variant="body2">
              {defaultValues.firstName ? defaultValues.firstName : ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{pt:2}}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Last Name
              </Typography>
              <Typography variant="body2">
              {defaultValues.lastName  ? defaultValues.lastName : ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{pt:2}}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Title
              </Typography>
              <Typography variant="body2">
              {defaultValues.title ? defaultValues.title : ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{pt:2}}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Contact Types
              </Typography>
              <Typography variant="body2">
              {defaultValues.contactTypes ? defaultValues.contactTypes.toString() : ''}
              </Typography>
            </Grid>

          <Grid item xs={12} sm={6} sx={{pt:2}}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Phone
              </Typography>
              <Typography variant="body2">
              {defaultValues.phone ? defaultValues.phone : ''}
              </Typography>
            </Grid>
          
            <Grid item xs={12} sm={6} sx={{pt:2}}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Email
              </Typography>
              <Typography variant="body2">
              {defaultValues.email ? defaultValues.email : ''}
              </Typography>
            </Grid>

          <Grid container spacing={0} sx={{ mb:-3,  pt:4}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                created by: {defaultValues.createdBy}, {fDateTime(defaultValues.createdAt)}, {defaultValues.createdIP}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              updated by: {defaultValues.updatedBy}, {fDateTime(defaultValues.updatedAt)}, {defaultValues.updatedIP}
            </Typography>
            </Grid>
          </Grid>
          <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content="Are you sure want to delete?"
            action={
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            }
          />

            </Grid>
            </Grid>
  );
}
