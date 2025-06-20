import PropTypes from 'prop-types';
import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
// @mui
import { Grid, Chip } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import { fDateTime } from '../../../utils/formatTime';
import { useAuthContext } from '../../../auth/useAuthContext';
import ViewPhoneComponent from '../../../components/ViewForms/ViewPhoneComponent';
import { getContact, getContacts, resetContact, deleteContact, setIsExpanded, setCardActiveIndex } from '../../../redux/slices/customer/contact';
import { setMachineTab } from '../../../redux/slices/products/machine';
import { getMachineServiceReport, setResetFlags } from '../../../redux/slices/products/machineServiceReport';
import { getContactUsers, resetContactUsers, getDialogSecurityUser, setSecurityUserDialog } from '../../../redux/slices/securityUser/securityUser';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { PATH_MACHINE, PATH_CRM } from '../../../routes/paths';
import SecurityUserDialog from '../../../components/Dialog/SecurityUserDialog';
import { useBoolean } from '../../../hooks/useBoolean';

ContactViewForm.propTypes = {
  currentContact: PropTypes.object,
  setCurrentContactData: PropTypes.func,
  isCustomerContactPage: PropTypes.bool,
};

export default function ContactViewForm({
  currentContact = null,
  setCurrentContactData,
  isCustomerContactPage,
}) {
  const { contact, isLoading } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);

  const { isAllAccessAllowed } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();
  const { customerId, id } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (customerId && id) {
      dispatch(getContact(customerId, id));
      dispatch(setIsExpanded(true));
      dispatch(setCardActiveIndex(id));
      dispatch(getContactUsers(id));
    }
    return () => {
      dispatch(resetContact());
      dispatch(setIsExpanded(false));
      dispatch(setCardActiveIndex(null));
      // dispatch(resetContactUsers());
    }
  }, [dispatch, customerId, id])

  const handleEdit = () => navigate(PATH_CRM.customers.contacts.edit(customerId, id));
  const handleMoveConatct = () => navigate(PATH_CRM.customers.contacts.move(customerId, id));
  const backLink = () => navigate(PATH_CRM.customers.contacts.root(customerId, id));

  const onArchive = async () => {
    try {
      await dispatch(deleteContact(customerId, id));
      dispatch(setIsExpanded(false));
      enqueueSnackbar('Contact Archived Successfully!');
      await dispatch(getContacts(customerId))
      navigate(PATH_CRM.customers.contacts.root(customerId))
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
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
      serviceReports: contact?.serviceReports || [],
      isActive: contact?.isActive,
      formerEmployee: contact?.formerEmployee,
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

  const handleSericeReportView = async (machineId, Id) => {
    await dispatch(setMachineTab('serviceReports'));
    await navigate(PATH_MACHINE.machines.serviceReports.view(machineId, Id));
    await dispatch(getMachineServiceReport(machineId, Id));
    await dispatch(setResetFlags(false));
  };

  const operatorTraningsList = defaultValues?.serviceReports?.map((item, index) =>
  (
    <Chip onClick={() => handleSericeReportView(item?.machine, item?._id)} sx={{ m: 0.3 }} label={`${item?.serviceReportTemplate?.reportTitle || ''} | ${fDateTime(item?.serviceDate)}`} />
  ));

  const handleViewUser = (_user) => {
    dispatch(getDialogSecurityUser(_user?._id));
    dispatch(setSecurityUserDialog(true));
  };

  return (
    <Grid sx={{ mt: 1 }}>

      <ViewFormEditDeleteButtons 
        showContactUsers
        moveCustomerContact={!customer?.isArchived && isAllAccessAllowed && handleMoveConatct}
        handleEdit={customer?.isArchived ? undefined : handleEdit}
        onArchive={customer?.isArchived ? undefined : onArchive}
        backLink={isCustomerContactPage && !customer?.isArchived ? backLink : undefined}
        isActive={defaultValues.isActive}
        formerEmployee={defaultValues.formerEmployee}
        handleViewUser={handleViewUser}
      />

      <SecurityUserDialog />

      <Grid container>
        <ViewFormField isLoading={isLoading} sm={6} heading="First Name" param={defaultValues?.firstName} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Last Name" param={defaultValues?.lastName} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Title" param={defaultValues?.title} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Contact Types" chips={defaultValues?.contactTypes} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Department" param={defaultValues?.department} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Report To" param={`${defaultValues?.reportingTo?.firstName || ''} ${defaultValues?.reportingTo?.lastName || ''}`} />
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
