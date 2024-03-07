import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// @mui
import { Grid, Chip } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import { fDateTime } from '../../../utils/formatTime';
import { useAuthContext } from '../../../auth/useAuthContext';
import ViewPhoneComponent from '../../../components/ViewForms/ViewPhoneComponent';

import {
  getContacts,
  getContact,
  setContactEditFormVisibility,
  deleteContact,
  setContactMoveFormVisibility,
  setContactFormVisibility,
  setIsExpanded,
} from '../../../redux/slices/customer/contact';
import { setMachineTab } from '../../../redux/slices/products/machine';
import { getMachineServiceRecord, setMachineServiceRecordViewFormVisibility, setResetFlags } from '../../../redux/slices/products/machineServiceRecord';

import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { PATH_MACHINE } from '../../../routes/paths';


ContactViewForm.propTypes = {
  currentContact: PropTypes.object,
  setCurrentContactData: PropTypes.func,
};

export default function ContactViewForm({
  currentContact = null,
  setCurrentContactData,
}) {
  const { contact, isLoading } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const { isAllAccessAllowed } = useAuthContext()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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
      dispatch(setIsExpanded(false));
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
      phoneNumbers: contact ? contact.phoneNumbers : contact?.phoneNumbers || '',
      email: contact?.email || '',
      reportingTo: contact?.reportingTo || {},
      department: contact?.department?.departmentName || '',
      street: contact?.address?.street || '',
      suburb: contact?.address?.suburb || '',
      city: contact?.address?.city || '',
      postcode: contact?.address?.postcode || '',
      region: contact?.address?.region || '',
      country: contact?.address?.country || '',
      serviceRecords: contact?.serviceRecords || [],
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

  const handleSericeRecordView = async (machineId, id) => {
    await dispatch(setMachineTab('serviceRecords'));
    await navigate(PATH_MACHINE.machines.view(machineId));
    await dispatch(setResetFlags(false));
    dispatch(getMachineServiceRecord(machineId, id));
    dispatch(setMachineServiceRecordViewFormVisibility(true));
  };

  const operatorTraningsList = defaultValues?.serviceRecords?.map((item, index) => 
  (
    <Chip onClick={() => handleSericeRecordView(item?.machine, item?._id)} sx={{m:0.3}} label={`${item?.serviceRecordConfig?.docTitle || ''} | ${fDateTime(item?.serviceDate)}`} />
  ));

  return (
    <Grid sx={{mt:1}}>
      <ViewFormEditDeleteButtons moveCustomerContact={ isAllAccessAllowed && handleMoveConatct } isActive={defaultValues.isActive} handleEdit={handleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={6} heading="First Name" param={defaultValues?.firstName} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Last Name" param={defaultValues?.lastName} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Title" param={defaultValues?.title} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Contact Types" chips={defaultValues?.contactTypes} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Department" param={defaultValues?.department} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Report To" param={`${defaultValues?.reportingTo?.firstName || '' } ${defaultValues?.reportingTo?.lastName || '' }`} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Street" param={defaultValues?.street} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Suburb" param={defaultValues?.suburb} />
        <ViewFormField isLoading={isLoading} sm={6} heading="City" param={defaultValues?.city} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Region" param={defaultValues?.region} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Post Code" param={defaultValues?.postcode} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Country" param={defaultValues?.country} />
        <ViewPhoneComponent isLoading={isLoading} sm={6} heading="Phone" value={defaultValues?.phoneNumbers} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Email" param={defaultValues?.email} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Operator's Trainings" chipDialogArrayParam={operatorTraningsList} />
      </Grid>
      <ViewFormAudit defaultValues={defaultValues} />
    </Grid>
  );
}
