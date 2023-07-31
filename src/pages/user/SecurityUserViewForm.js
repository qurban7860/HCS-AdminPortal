import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
// @mui
import { Card, Grid, Typography, Link, Dialog, Button, Chip } from '@mui/material';
import ConfirmDialog from '../../components/confirm-dialog';
// routes
import { PATH_MACHINE, PATH_DASHBOARD, PATH_CUSTOMER, PATH_SECURITY } from '../../routes/paths';
// slices
import {
  getLoggedInSecurityUser,
  getSecurityUser,
  getSecurityUsers,
  deleteSecurityUser,
  setSecurityUserEditFormVisibility,
} from '../../redux/slices/securityUser/securityUser';
import { getCustomer } from '../../redux/slices/customer/customer';
import { getContact } from '../../redux/slices/customer/contact';
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../components/Defaults/Cover';
import { useAuthContext } from '../../auth/useAuthContext';
import FormProvider, { RHFSwitch, RHFTextField, RHFMultiSelect } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';
import palette from '../../theme';
import DialogLabel from '../components/Dialog/DialogLabel';
import DialogLink from '../components/Dialog/DialogLink';
import LogoAvatar from '../../components/logo-avatar/LogoAvatar';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import FormLabel from '../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function SecurityUserViewForm() {
  const regEx = /^[^2]*/;
  const userId = localStorage.getItem('userId');
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [disableEditButton, setDisableEditButton] = useState(false);
  // const [isSuperAdmin, setSuperAdmin] = useState(false);

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

  const { securityUser, loggedInUser, initial } = useSelector((state) => state.user);
  const { customer } = useSelector((state) => state.customer);
  const { contact } = useSelector((state) => state.contact);

  const [openContact, setOpenContact] = useState(false);
  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);

  const [openCustomer, setOpenCustomer] = useState(false);
  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const { user } = useAuthContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      dispatch(getSecurityUser(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (loggedInUser) {
      // disable edit button
      if (isSuperAdmin || loggedInUser._id === id) {
        setDisableEditButton(false);
      } else {
        setDisableEditButton(true);
      }
    }
  }, [id, loggedInUser, isSuperAdmin]);
  // disableDeleteButton, setDisableDeleteButton
  useEffect(() => {
    batch(() => {
      if (securityUser && securityUser?.customer && securityUser?.customer?._id) {
        dispatch(getCustomer(securityUser?.customer?._id));
      }
      if (securityUser && securityUser?.contact && securityUser?.contact?._id) {
        dispatch(getContact(securityUser?.customer?._id, securityUser?.contact?._id));
      }
    });
  }, [dispatch, securityUser]);

  useEffect(() => {
    
  }, [dispatch, securityUser]);

  const handleEdit = () => {
    dispatch(setSecurityUserEditFormVisibility(true));
    navigate(PATH_SECURITY.users.edit(securityUser._id));
  };

  const handleUpdatePassword = () => {
    // dispatch(setSecurityUserEditFormVisibility(true));
    navigate(PATH_SECURITY.users.userPassword);
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteSecurityUser(id));
      dispatch(getSecurityUsers());
      navigate(PATH_SECURITY.users.list);
    } catch (error) {
      // if (error.Message) {
      //   enqueueSnackbar(error.Message, { variant: `error` });
      // } else if (error.message) {
      //   enqueueSnackbar(error.message, { variant: `error` });
      // } else {
      //   enqueueSnackbar('Something went wrong!', { variant: `error` });
      // }
      enqueueSnackbar('User delete failed!', { variant: `error` });
      console.log('Error:', error);
    }
  };

  const handleViewCustomer = (Id) => {
    navigate(PATH_CUSTOMER.view(Id));
  };
  const handlePassword = () => {
    navigate(PATH_SECURITY.users.userPassword);
  };

  const defaultValues = useMemo(
    () => ({
      customer: securityUser?.customer?.name || '',
      contact: `${securityUser?.contact?.firstName ? securityUser?.contact?.firstName : ''} ${securityUser?.contact?.lastName ? securityUser?.contact?.lastName : ''}` ,
      name: securityUser?.name || '',
      phone: securityUser?.phone || '',
      email: securityUser?.email || '',
      login: securityUser?.login || '',
      roles: securityUser?.roles,
      regions: securityUser?.regions || [],
      countries: securityUser?.regions ? securityUser.regions.flatMap(region => region.countries) : [],
      customers: securityUser?.customers || [],
      machines: securityUser?.machines || [],
      isActive: securityUser?.isActive,
      createdByFullName: securityUser?.createdBy?.name,
      createdAt: securityUser?.createdAt,
      createdIP: securityUser?.createdIP,
      updatedByFullName: securityUser?.updatedBy?.name,
      updatedAt: securityUser?.updatedAt,
      updatedIP: securityUser?.updatedIP,
    }),
    [securityUser]
  );
  return (
    <>
      <Grid sx={{ p: 3, mt: -3 }}>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
          <Cover
            name={defaultValues.name}
            photoURL={defaultValues.name === 'HOWICK LTD.' ? <LogoAvatar /> : <CustomAvatar />}
            icon="ph:users-light"
          />
        </Card>
        <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons
            handleEdit={handleEdit}
            handleUpdatePassword={handleUpdatePassword}
            onDelete={onDelete}
            disablePasswordButton={!isSuperAdmin}
            disableDeleteButton={!isSuperAdmin}
            disableEditButton={disableEditButton}
          />
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
          <Grid container>
            <ViewFormField sm={12} isActive={defaultValues.isActive} />
            <ViewFormField
              sm={6}
              heading="Customer"
              objectParam={
                defaultValues?.customer && (
                  <Link onClick={handleOpenCustomer} href="#" underline="none">
                    {defaultValues?.customer}
                  </Link>
                )
              }
            />
            {/* <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} /> */}
            <ViewFormField
              sm={6}
              heading="Contact"
              objectParam={
                defaultValues?.contact && (
                  <Link onClick={handleOpenContact} href="#" underline="none">
                    {defaultValues?.contact}
                  </Link>
                )
              }
            />
            {/* <ViewFormField sm={6} heading="Contact" param={defaultValues?.contact} /> */}
            <ViewFormField sm={6} heading="Full Name" param={defaultValues?.name} />
            <ViewFormField sm={6} heading="Phone" param={defaultValues?.phone} />
            <ViewFormField sm={12} heading="email" param={defaultValues?.email} />
            <ViewFormField sm={6} heading="Login" param={defaultValues?.login} />
            <ViewFormField
              sm={6}
              heading="Roles"
              userRolesChips={defaultValues?.roles}
            />
            <ViewFormField
              sm={12}
              heading="Regions"
              arrayParam={defaultValues?.regions}
            />
            <ViewFormField
              sm={12}
              heading="Countries"
              chipLabel='country_name'
              arrayParam={defaultValues?.countries}
            />
            <ViewFormField
              sm={12}
              heading="Customers"
              arrayParam={defaultValues?.customers}
            />
            <ViewFormField
              sm={12}
              heading="Machines"
              arrayParam={defaultValues?.machines}
            />
          </Grid>
          <ViewFormField />
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
      </Grid>
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Customer" onClick={() => handleCloseCustomer()} />
        <Grid container sx={{ p: 2 }}>
          <ViewFormField sm={12} heading="Name" param={customer?.name} />
          <ViewFormField sm={6} heading="Trading Name" param={customer?.tradingName} />
          <ViewFormField sm={6} heading="Phone" param={customer?.mainSite?.phone} />
          <ViewFormField sm={6} heading="Fax" param={customer?.mainSite?.fax} />
          <ViewFormField sm={6} heading="Email" param={customer?.mainSite?.email} />
          <ViewFormField sm={6} heading="Site Name" param={customer?.mainSite?.name} />
          <FormLabel content="Address Information" />
          <ViewFormField sm={6} heading="Street" param={customer?.mainSite?.address?.street} />
          <ViewFormField sm={6} heading="Suburb" param={customer?.mainSite?.address?.suburb} />
          <ViewFormField sm={6} heading="City" param={customer?.mainSite?.address?.city} />
          <ViewFormField sm={6} heading="Region" param={customer?.mainSite?.address?.region} />
          <ViewFormField sm={6} heading="Post Code" param={customer?.mainSite?.address?.postcode} />
          <ViewFormField sm={12} heading="Country" param={customer?.mainSite?.address?.country} />
          <ViewFormField
            sm={6}
            heading="Primary Biling Contact"
            param={
              customer?.primaryBillingContact &&
              `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
            }
          />
          <ViewFormField
            sm={6}
            heading="Primary Technical Contact"
            param={
              customer?.primaryTechnicalContact &&
              `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
            }
          />
        </Grid>
        <Grid container sx={{ px: 2, pb: 3 }}>
          <FormLabel content="Howick Resources" />
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={customer?.accountManager?.firstName}
            secondParam={customer?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={customer?.projectManager?.firstName}
            secondParam={customer?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={customer?.supportManager?.firstName}
            secondParam={customer?.supportManager?.lastName}
          />
        </Grid>
        <DialogLink content=" Go to customer" onClick={() => handleViewCustomer(customer._id)} />
      </Dialog>
      <Dialog
        open={openContact}
        onClose={handleCloseContact}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Contact" onClick={() => handleCloseContact()} />
        <Grid container sx={{ px: 2, py: 2 }}>
          <ViewFormField
            sm={6}
            heading="First Name"
            param={contact?.firstName && contact?.firstName}
          />
          <ViewFormField
            sm={6}
            heading="Last Name"
            param={contact?.lastName && contact?.lastName}
          />
          <ViewFormField sm={6} heading="Title" param={contact?.title && contact?.title} />
          <ViewFormField
            sm={6}
            heading="Contact Types"
            param={contact?.contactTypes && contact?.contactTypes.toString()}
          />
          <ViewFormField sm={6} heading="Phone" param={contact?.phone && contact?.phone} />
          <ViewFormField sm={6} heading="Email" param={contact?.email && contact?.email} />
          <FormLabel content="Address Information" />
          <ViewFormField
            sm={6}
            heading="Street"
            param={contact?.address?.street && contact?.address?.street}
          />
          <ViewFormField
            sm={6}
            heading="Suburb"
            param={contact?.address?.suburb && contact?.address?.suburb}
          />
          <ViewFormField
            sm={6}
            heading="City"
            param={contact?.address?.city && contact?.address?.city}
          />
          <ViewFormField
            sm={6}
            heading="Region"
            param={contact?.address?.region && contact?.address?.region}
          />
          <ViewFormField
            sm={6}
            heading="Post Code"
            param={contact?.address?.postcode && contact?.address?.postcode}
          />
          <ViewFormField
            sm={6}
            heading="Country"
            param={contact?.address?.country && contact?.address?.country}
          />
          <ViewFormField />
        </Grid>
      </Dialog>
    </>
  );
}
