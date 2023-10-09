import PropTypes from 'prop-types';
import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Grid } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';

import {
  getContacts,
  getContact,
  setContactEditFormVisibility,
  deleteContact,
  setContactMoveFormVisibility,
  setContactFormVisibility,
} from '../../../redux/slices/customer/contact';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';


ContactViewForm.propTypes = {
  currentContact: PropTypes.object,
  setCurrentContactData: PropTypes.func,
  setIsExpanded: PropTypes.func,
};

export default function ContactViewForm({
  currentContact = null,
  setIsExpanded,
  setCurrentContactData,
}) {
  const { contact } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin'); 

  const handleEdit = async () => {
    await dispatch(getContact(customer?._id, contact?._id));
    dispatch(setContactMoveFormVisibility(false));
    dispatch(setContactEditFormVisibility(true));
  };

  const handleMoveConatct = async () => {
    dispatch(setContactFormVisibility(false))
    dispatch(setContactFormVisibility(false))
    dispatch(setContactEditFormVisibility(false))
    dispatch(setContactMoveFormVisibility(true))
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteContact(customer?._id, contact?._id));
      setIsExpanded(false);
      enqueueSnackbar('Contact deleted Successfully!');
      dispatch(getContacts(customer?._id));
    } catch (err) {
      enqueueSnackbar('Contact delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const defaultValues = useMemo(
    () => ({
      firstName: contact?.firstName || '',
      lastName: contact?.lastName || '',
      title: contact?.title || '',
      contactTypes: contact?.contactTypes || [],
      phone: contact?.phone || '',
      email: contact?.email || '',
      street: contact?.address?.street || '',
      suburb: contact?.address?.suburb || '',
      city: contact?.address?.city || '',
      postcode: contact?.address?.postcode || '',
      region: contact?.address?.region || '',
      country: contact?.address?.country || '',
      isActive: contact?.isActive,
      createdAt: contact?.createdAt || '',
      createdByFullName: contact?.createdBy?.name || '',
      createdIP: contact?.createdIP || '',
      updatedAt: contact?.updatedAt || '',
      updatedByFullName: contact?.updatedBy?.name || '',
      updatedIP: contact?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contact]
  );
  return (
    <Grid sx={{mt:1}}>
      <ViewFormEditDeleteButtons moveCustomerContact={ isSuperAdmin && handleMoveConatct } isActive={defaultValues.isActive} handleEdit={handleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField sm={6} heading="First Name" param={defaultValues?.firstName} />
        <ViewFormField sm={6} heading="Last Name" param={defaultValues?.lastName} />
        <ViewFormField sm={6} heading="Title" param={defaultValues?.title} />
        <ViewFormField sm={6} heading="Contact Types" chips={defaultValues?.contactTypes} />
        <ViewFormField sm={6} heading="Phone" param={defaultValues?.phone} />
        <ViewFormField sm={6} heading="Email" param={defaultValues?.email} />
        <ViewFormField sm={6} heading="Street" param={defaultValues?.street} />
        <ViewFormField sm={6} heading="Suburb" param={defaultValues?.suburb} />
        <ViewFormField sm={6} heading="City" param={defaultValues?.city} />
        <ViewFormField sm={6} heading="Region" param={defaultValues?.region} />
        <ViewFormField sm={6} heading="Post Code" param={defaultValues?.postcode} />
        <ViewFormField sm={6} heading="Country" param={defaultValues?.country} />
        <ViewFormField />
      </Grid>
      <ViewFormAudit defaultValues={defaultValues} />
    </Grid>
  );
}
