import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
// @mui
import { Card, Grid, Link, Button } from '@mui/material';
import ConfirmDialog from '../../components/confirm-dialog';
// routes
import { PATH_SECURITY } from '../../routes/paths';
// slices
import {
  getSecurityUser,
  getSecurityUsers,
  deleteSecurityUser,
  sendUserInvite,
  setSecurityUserEditFormVisibility,
} from '../../redux/slices/securityUser/securityUser';
import { getCustomer , setCustomerDialog } from '../../redux/slices/customer/customer';
import { getContact , setContactDialog } from '../../redux/slices/customer/contact';
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../components/Defaults/Cover';
import { useSnackbar } from '../../components/snackbar';
import LogoAvatar from '../../components/logo-avatar/LogoAvatar';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import CustomerDialog from '../components/Dialog/CustomerDialog';
import ContactDialog from '../components/Dialog/ContactDialog';

// ----------------------------------------------------------------------

export default function SecurityUserViewForm() {
  const [disableEditButton, setDisableEditButton] = useState(false);
  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

  const { securityUser, loggedInUser } = useSelector((state) => state.user);

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(setCustomerDialog(false))
    dispatch(setContactDialog(false))
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
  const handleCustomerDialog = () =>{dispatch(setCustomerDialog(true))}
  const handleContactDialog = () =>{dispatch(setContactDialog(true))}

  const handleUpdatePassword = () => {
    navigate(PATH_SECURITY.users.userPassword);
  };

  const handleUserInvite = async () => {
    if (securityUser._id) {
      try {
        dispatch(await sendUserInvite(securityUser._id));
        enqueueSnackbar('Invite sent successfully!');
      } catch (error) {
        if (error.Message) {
          enqueueSnackbar(error.Message, { variant: `error` });
        } else if (error.message) {
          enqueueSnackbar(error.message, { variant: `error` });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: `error` });
        }
        console.log('Error:', error);
      }
    }
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteSecurityUser(id));
      dispatch(getSecurityUsers());
      navigate(PATH_SECURITY.users.list);
    } catch (error) {
      enqueueSnackbar('User delete failed!', { variant: `error` });
      console.log('Error:', error);
    }
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
      currentEmployee: securityUser?.currentEmployee || false,
      multiFactorAuthentication: securityUser?.multiFactorAuthentication,
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
            handleUserInvite={handleUserInvite}
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
            <ViewFormField sm={12} isActive={defaultValues.isActive} multiAuth={defaultValues?.multiFactorAuthentication} currentEmp={defaultValues?.currentEmployee}  />
            <ViewFormField
              sm={6}
              heading="Customer"
              objectParam={
                defaultValues?.customer && (
                  <Link onClick={handleCustomerDialog} href="#" underline="none">
                    {defaultValues?.customer}
                  </Link>
                )
              }
            />
            <ViewFormField
              sm={6}
              heading="Contact"
              objectParam={
                defaultValues?.contact && (
                  <Link onClick={handleContactDialog} href="#" underline="none">
                    {defaultValues?.contact}
                  </Link>
                )
              }
            />
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
      
      <CustomerDialog />

      <ContactDialog />
      
    </>
  );
}
