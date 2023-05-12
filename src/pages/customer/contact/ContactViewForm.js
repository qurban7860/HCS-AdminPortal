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
import ViewFormField from '../../components/ViewFormField';
import ViewFormSwitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

 
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
      firstName:                currentContact ? currentContact.firstName : contact?.firstName || '',
      lastName:                 currentContact ? currentContact.lastName : contact?.lastName || '',
      title:                    currentContact ? currentContact.title : contact?.title || '',
      contactTypes:             currentContact ? currentContact.contactTypes : contact?.contactTypes || [],
      phone:                    currentContact ? currentContact.phone : contact?.phone || '',
      email:                    currentContact ? currentContact.email : contact?.email || '',
      street:                   currentContact ? currentContact.address?.street : contact?.address.street || '',
      suburb:                   currentContact ? currentContact.address?.suburb : contact?.address.suburb || '',
      city:                     currentContact ? currentContact.address?.city : contact?.address.city || '',
      postcode:                 currentContact ? currentContact.address?.postcode : contact?.address.postcode || '',
      region:                   currentContact ? currentContact.address?.region : contact?.address.region || '',
      country:                  currentContact ? currentContact.address?.country : contact?.address.country || '',
      isActive:                 currentContact.isActive,
      createdAt:                currentContact?.createdAt || "",
      createdByFullName:        currentContact?.createdBy?.name || "",
      createdIP:                currentContact?.createdIP || "",
      updatedAt:                currentContact?.updatedAt || "",
      updatedByFullName:        currentContact?.updatedBy?.name || "",
      updatedIP:                currentContact?.updatedIP || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentContact, contact]
  );

  return (
    <Grid >

          <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
          <Grid container >
          <ViewFormField sm={6} heading='First Name'    param={defaultValues.firstName ?    defaultValues.firstName : ''} isActive={defaultValues.isActive}/>
          <ViewFormField sm={6} heading='Last Name'     param={defaultValues.lastName  ?    defaultValues.lastName : ''}/>
          <ViewFormField sm={6} heading='Title'         param={defaultValues.title ?        defaultValues.title : ''}/>
          <ViewFormField sm={6} heading='Contact Types' param={defaultValues.contactTypes ? defaultValues.contactTypes.toString() : ''}/>
          <ViewFormField sm={6} heading='Phone'         param={defaultValues.phone ?        defaultValues.phone : ''}/>
          <ViewFormField sm={6} heading='Email'         param={defaultValues.email ?        defaultValues.email : ''}/>
          <ViewFormField sm={6} heading='Street'        param={defaultValues.street ?       defaultValues.street : ''}/>
          <ViewFormField sm={6} heading='Suburb'        param={defaultValues.suburb ?       defaultValues.suburb : ''}/>
          <ViewFormField sm={6} heading='City'          param={defaultValues.city ?         defaultValues.city : ''}/>
          <ViewFormField sm={6} heading='Region'        param={defaultValues.region ?       defaultValues.region : ''}/>
          <ViewFormField sm={6} heading='Post Code'     param={defaultValues.postcode ?     defaultValues.postcode : ''}/>
          <ViewFormField sm={6} heading='Country'       param={defaultValues.country ?      defaultValues.country : ''}/>
          </Grid>
          <ViewFormSwitch isActive={defaultValues.isActive}/>
            <ViewFormAudit defaultValues={defaultValues}/>
      </Grid>
  );
}
