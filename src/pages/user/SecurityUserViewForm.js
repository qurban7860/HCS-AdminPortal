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
  getSecurityUsers,
  deleteSecurityUser,
  sendUserInvite,
  getSecurityUser,
  changeUserStatus,
} from '../../redux/slices/securityUser/securityUser';
import { getBlockedCustomer } from '../../redux/slices/securityConfig/blockedCustomers';
import { getBlockedUser } from '../../redux/slices/securityConfig/blockedUsers';
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
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../../components/iconify';
import FormLabel from '../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function SecurityUserViewForm() {
  const [disableEditButton, setDisableEditButton] = useState(false);
  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');
  const { securityUser, isLoading} = useSelector((state) => state.user);
  const { blockedCustomer } = useSelector((state) => state.blockedCustomer);
  const { blockedUser } = useSelector((state) => state.blockedUser);
  const userId = localStorage.getItem('userId');
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(setCustomerDialog(false))
    dispatch(setContactDialog(false))
    dispatch(getBlockedCustomer(securityUser?.customer?._id))
    dispatch(getBlockedUser(securityUser?._id))
  },[dispatch, securityUser]);


  useEffect(() => {
    if (userId) {
      if (isSuperAdmin || userId === id) {
        setDisableEditButton(false);
      } else {
        setDisableEditButton(true);
      }
    }
  }, [id, userId, isSuperAdmin]);
  
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

  const handleEdit = () => {
    navigate(PATH_SECURITY.users.edit(securityUser._id));
  };

  const handleCustomerDialog = (event) =>{
    event.preventDefault();  
    dispatch(setCustomerDialog(true))
  }
  
  const handleContactDialog = (event) =>{
    event.preventDefault();  
    dispatch(setContactDialog(true))
  }

  const handleUpdatePassword = () => {
    navigate(PATH_SECURITY.users.userPassword);
  };

  const userStatus = {
    locked:new Date(securityUser?.lockUntil).getTime() > new Date().getTime(),
    lockedBy:securityUser?.lockedBy,
    lockedUntil:securityUser?.lockUntil
  }

  const handleChangeUserStatus = async (lockUntil) => {
    if (securityUser?._id) {
      try {
        await dispatch(changeUserStatus(securityUser._id, !userStatus?.locked, lockUntil));
        await dispatch(getSecurityUser(securityUser._id));
        enqueueSnackbar(`User ${userStatus?.locked?"Unlocked":"Locked"} Successfully`);
      } catch (error) {
        enqueueSnackbar("Something went wrong!", { variant: `error` });
        console.log('Error:', error);
      }
    }
  };

  const handleUserInvite = async () => {
    if (securityUser?._id) {
      try {
        await dispatch(sendUserInvite(securityUser._id));
        enqueueSnackbar('Invitation sent successfully!');
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
      contact: securityUser?.contact || null,
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
            handleUserInvite={securityUser?.invitationStatus && handleUserInvite}
            handleUpdatePassword={handleUpdatePassword}
            onDelete={onDelete}
            isInviteLoading={isLoading}
            disablePasswordButton={!isSuperAdmin}
            disableDeleteButton={!isSuperAdmin}
            disableEditButton={disableEditButton}
            backLink={() => navigate(PATH_SECURITY.users.list)}
            isActive={defaultValues.isActive}
            multiAuth={defaultValues?.multiFactorAuthentication} 
            currentEmp={defaultValues?.currentEmployee}
            userStatus={userStatus}
            onUserStatusChange={handleChangeUserStatus}
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
          <Grid container sx={{display:{ md:'flex', sm: 'block' }, justifyContent:{md: 'space-between'}}} >
          <Grid  item md={6} sm={12} xs={12} sx={{p:.5}}>
            <Grid  sx={{border: '1px solid lightgrey', borderRadius:2, px:1.5, pt:1.5, height: {md: '100%'}}}>
            <FormLabel content='Personal Information' />
              <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Full Name"
                  objectParam={
                    defaultValues?.name && (
                      <>
                        {defaultValues?.name}
                        {blockedUser.length > 0 &&
                          <StyledTooltip title="User is Blocked" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                            <Iconify color="#FF0000" sx={{height: '24px', width: '24px', verticalAlign:"middle", ml:1 }} icon="mdi:ban" />
                          </StyledTooltip>
                        }
                      </>
                    )
                  }
              />
              <ViewFormField isLoading={isLoading} sm={12} heading="Phone" param={defaultValues?.phone} />
              <ViewFormField isLoading={isLoading} sm={12} heading="email" param={defaultValues?.email} />
              <ViewFormField isLoading={isLoading} sm={12} heading="Login" param={defaultValues?.login} />
              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Customer"
                objectParam={
                  defaultValues?.customer && (
                    <Link onClick={handleCustomerDialog} href="#" underline="none">
                      {defaultValues?.customer}
                      {blockedCustomer.length > 0 &&
                        <StyledTooltip title="Customer is Blocked" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                          <Iconify color="#FF0000" sx={{height: '24px', width: '24px', verticalAlign:"middle", ml:1 }} icon="ooui:block" />
                        </StyledTooltip>
                      }
                      {!securityUser?.customer?.isActive &&
                        <StyledTooltip title="Customer is Inactive" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                          <Iconify color="#FF0000" sx={{height: '24px', width: '24px', verticalAlign:"middle", ml:1 }} icon="mdi:ban" />
                        </StyledTooltip>
                      }
                    </Link>)}
              />
              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Contact"
                objectParam={
                  defaultValues?.contact && (
                    <Link onClick={handleContactDialog} href="#" underline="none">
                      {defaultValues?.contact?.firstName || ''} {defaultValues?.contact?.lastName || ''}
                      {!defaultValues?.contact?.isActive &&
                        <StyledTooltip title="Contact is Inactive" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                          <Iconify color="#FF0000" sx={{height: '24px', width: '24px', verticalAlign:"middle", ml:1 }} icon="mdi:ban" />
                        </StyledTooltip>
                      }
                    </Link>)}
              />
            </Grid>
            </Grid>

            <Grid item md={6} sm={12} xs={12} sx={{p:.5}}>
              <Grid  sx={{border: '1px solid lightgrey', borderRadius:2, px:1.5, pt:1.5, height: {md: '100%'} }}>
              <FormLabel content='Accessibility Information' />
              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Roles"
                userRolesChips={defaultValues?.roles}
              />
              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Regions"
                arrayParam={defaultValues?.regions}
              />
              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Countries"
                chipLabel='country_name'
                arrayParam={defaultValues?.countries}
              />
              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Customers"
                arrayParam={defaultValues?.customers}
              />
              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Machines"
                arrayParam={defaultValues?.machines}
              />
            </Grid>
            </Grid>
          </Grid>
          {/* <ViewFormField /> */}
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
