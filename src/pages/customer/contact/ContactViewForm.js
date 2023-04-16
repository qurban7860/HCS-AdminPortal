import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Switch,Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ConfirmDialog from '../../../components/confirm-dialog';

import { getContacts, getContact, setContactEditFormVisibility, deleteContact } from '../../../redux/slices/customer/contact';
// Iconify
import Iconify from '../../../components/iconify';
import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';
 
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
    dispatch(setContactEditFormVisibility(true));
  };

  const onDelete = async () => {
    await dispatch(deleteContact(customer._id, currentContact._id));
    handleCloseConfirm();
    dispatch(getContacts(customer._id));
    // dispatch(getContacts());
  };

  const defaultValues = useMemo(
    () => ({
      firstName: currentContact ? currentContact.firstName : contact?.firstName || '',
      lastName: currentContact ? currentContact.lastName : contact?.lastName || '',
      title: currentContact ? currentContact.title : contact?.title || '',
      contactTypes: currentContact ? currentContact.contactTypes : contact?.contactTypes || [],
      phone: currentContact ? currentContact.phone : contact?.phone || '',
      email: currentContact ? currentContact.email : contact?.email || '',

      street: currentContact ? currentContact.address?.street : contact?.address.street || '',
      suburb: currentContact ? currentContact.address?.suburb : contact?.address.suburb || '',
      city: currentContact ? currentContact.address?.city : contact?.address.city || '',
      postcode: currentContact ? currentContact.address?.postcode : contact?.address.postcode || '',
      region: currentContact ? currentContact.address?.region : contact?.address.region || '',
      country: currentContact ? currentContact.address?.country : contact?.address.country || '',
        isActive: currentContact.isActive,
      createdAt:                currentContact?.createdAt || "",
      createdByFullname:           currentContact?.createdBy?.name || "",
      createdIP:                currentContact?.createdIP || "",
      updatedAt:                currentContact?.updatedAt || "",
      updatedByFullname:           currentContact?.updatedBy?.name || "",
      updatedIP:                currentContact?.updatedIP || "",
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

            <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Street
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.street ? defaultValues.street : ''}
            </Typography>
          </Grid>

        <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Suburb
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.suburb ? defaultValues.suburb : ''}
            </Typography>
          </Grid>

         <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              City
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.city ? defaultValues.city : ''}
            </Typography>
          </Grid>

        <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Region
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.region ? defaultValues.region : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Post Code
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.postcode ? defaultValues.postcode : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Country
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.country ? defaultValues.country : ''}
            </Typography>
          </Grid>
            
          <Grid item xs={12} sm={12} >
            <Switch sx={{mb:1}} checked = { defaultValues.isActive } disabled  />
          </Grid>
          <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
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
