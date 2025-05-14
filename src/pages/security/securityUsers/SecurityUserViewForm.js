import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
// @mui
import { Card, Grid, Link, Button } from '@mui/material';
import ConfirmDialog from '../../../components/confirm-dialog';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// slices
import {
  deleteSecurityUser,
  archiveSecurityUser,
  sendUserInvite,
  getSecurityUser,
  changeUserStatus,
  setChangePasswordByAdminDialog,
} from '../../../redux/slices/securityUser/securityUser';
import { getBlockedCustomer } from '../../../redux/slices/securityConfig/blockedCustomers';
import { getBlockedUser } from '../../../redux/slices/securityConfig/blockedUsers';
import { getCustomer, setCustomerDialog } from '../../../redux/slices/customer/customer';
import { getContact, setContactDialog } from '../../../redux/slices/customer/contact';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { useSnackbar } from '../../../components/snackbar';
import { StyledCardContainer, StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { ICONS } from '../../../constants/icons/default-icons';
import ChangePasswordByAdminDialog from '../../../components/Dialog/ChangePasswordByAdminDialog';

// ----------------------------------------------------------------------

export default function SecurityUserViewForm() {

  const { securityUser, isLoading } = useSelector((state) => state.user);
  const { blockedCustomer } = useSelector((state) => state.blockedCustomer);
  const { blockedUser } = useSelector((state) => state.blockedUser);

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
  }, [dispatch, securityUser]);

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
    navigate(PATH_SETTING.security.users.edit(securityUser._id));
  };

  const handleCustomerDialog = (event) => {
    event.preventDefault();
    dispatch(setCustomerDialog(true))
  }

  const handleContactDialog = (event) => {
    event.preventDefault();
    dispatch(setContactDialog(true))
  }

  const handleUpdatePassword = () => {
    dispatch(setChangePasswordByAdminDialog(true))
  };

  const userStatus = {
    locked: new Date(securityUser?.lockUntil).getTime() > new Date().getTime(),
    lockedBy: securityUser?.lockedBy,
    lockedUntil: securityUser?.lockUntil
  }

  const handleChangeUserStatus = async (lockUntil) => {
    if (securityUser?._id) {
      try {
        await dispatch(changeUserStatus(securityUser._id, !userStatus?.locked, lockUntil));
        await dispatch(getSecurityUser(securityUser._id));
        enqueueSnackbar(`User ${userStatus?.locked ? "Unlocked" : "Locked"} Successfully`);
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
        enqueueSnackbar(error, { variant: `error` });
        console.log('Error:', error);
      }
    }
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteSecurityUser(id, { isArchived: true }));
      await navigate(PATH_SETTING.security.root);
      // await dispatch(getSecurityUsers());
    } catch (error) {
      enqueueSnackbar('User Delete failed!', { variant: `error` });
      console.log('Error:', error);
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(archiveSecurityUser(id, { isArchived: true }));
    } catch (error) {
      enqueueSnackbar('User Archive failed!', { variant: `error` });
      console.log('Error:', error);
    }
  };

  const onRestore = async () => {
    try {
      await dispatch(archiveSecurityUser(id, { isArchived: false }));
    } catch (error) {
      enqueueSnackbar('User Restore failed!', { variant: `error` });
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
      modules: securityUser?.modules || [],
      dataAccessibilityLevel: securityUser?.dataAccessibilityLevel || '',
      regions: securityUser?.regions || [],
      countries: securityUser?.regions ? securityUser.regions.flatMap(region => region.countries) : [],
      customers: securityUser?.customers || [],
      machines: securityUser?.machines || [],
      isActive: securityUser?.isActive,
      formerEmployee: securityUser?.contact?.formerEmployee || false,
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
        <StyledCardContainer>
          <Cover name={defaultValues.name} />
        </StyledCardContainer>
        <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons
            handleEdit={securityUser?.isArchived ? undefined : handleEdit}
            handleUserInvite={(securityUser?.invitationStatus && !securityUser?.isArchived) ? handleUserInvite : undefined}
            handleUpdatePassword={securityUser?.isArchived ? undefined : handleUpdatePassword}
            isLoading={isLoading}
            onArchive={securityUser?.isArchived ? undefined : onArchive}
            onRestore={securityUser?.isArchived ? onRestore : undefined}
            // onDelete={ securityUser?.isArchived ? onDelete : undefined }
            isInviteLoading={isLoading}
            backLink={() => navigate(PATH_SETTING.security.root)}
            isActive={defaultValues.isActive}
            multiAuth={defaultValues?.multiFactorAuthentication}
            formerEmployee={defaultValues?.formerEmployee}
            userStatus={userStatus}
            onUserStatusChange={securityUser?.isArchived ? undefined : handleChangeUserStatus}
            securityUserPage
          />
          <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Archive"
            content="Are you sure want to archive?"
            action={
              <Button variant="contained" color="error" onClick={onArchive}>
                Archive
              </Button>
            }
          />
          <Grid container sx={{ display: { md: 'flex', sm: 'block' }, justifyContent: { md: 'space-between' } }} >
            <Grid item md={6} sm={12} xs={12} sx={{ p: .5 }}>
              <Grid sx={{ border: '1px solid lightgrey', borderRadius: 2, px: 1.5, pt: 1.5, height: { md: '100%' } }}>
                <FormLabel content='Personal Information' />
                <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Full Name"
                  node={
                    defaultValues?.name && (
                      <>
                        {defaultValues?.name}
                        {blockedUser.length > 0 &&
                          <StyledTooltip title="User is Blocked" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                            <Iconify color="#FF0000" sx={{ height: '24px', width: '24px', verticalAlign: "middle", ml: 1 }} icon="mdi:ban" />
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
                  node={
                    defaultValues?.customer && (
                      <Link onClick={handleCustomerDialog} href="#" underline="none">
                        {defaultValues?.customer}
                        {blockedCustomer.length > 0 &&
                          <StyledTooltip title="Customer is Blocked" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                            <Iconify color="#FF0000" sx={{ height: '24px', width: '24px', verticalAlign: "middle", ml: 1 }} icon="ooui:block" />
                          </StyledTooltip>
                        }
                        {!securityUser?.customer?.isActive &&
                          <StyledTooltip title="Customer is Inactive" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                            <Iconify color="#FF0000" sx={{ height: '24px', width: '24px', verticalAlign: "middle", ml: 1 }} icon="mdi:ban" />
                          </StyledTooltip>
                        }
                      </Link>)}
                />
                <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Contact"
                  node={
                    <>
                      {defaultValues?.contact?.firstName && <StyledTooltip
                        placement="top"
                        title={defaultValues?.contact?.formerEmployee ? ICONS.FORMEREMPLOYEE.heading : ICONS.NOTFORMEREMPLOYEE.heading}
                        disableFocusListener tooltipcolor={defaultValues?.contact?.formerEmployee ? ICONS.FORMEREMPLOYEE.color : ICONS.NOTFORMEREMPLOYEE.color}
                        color={defaultValues?.contact?.formerEmployee ? ICONS.FORMEREMPLOYEE.color : ICONS.NOTFORMEREMPLOYEE.color}
                      >
                        <Iconify icon={ICONS.FORMEREMPLOYEE.icon} sx={{ mr: 1, height: 20, width: 20 }} />
                      </StyledTooltip>}
                      {defaultValues?.contact && (
                        <Link onClick={handleContactDialog} href="#" underline="none">
                          {defaultValues?.contact?.firstName || ''} {defaultValues?.contact?.lastName || ''}
                          {!defaultValues?.contact?.isActive &&
                            <StyledTooltip title="Contact is Inactive" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                              <Iconify color="#FF0000" sx={{ height: '24px', width: '24px', verticalAlign: "middle", ml: 1 }} icon="mdi:ban" />
                            </StyledTooltip>
                          }
                        </Link>)
                      }
                    </>
                  }
                />
              </Grid>
            </Grid>

            <Grid item md={6} sm={12} xs={12} sx={{ p: .5 }}>
              <Grid sx={{ border: '1px solid lightgrey', borderRadius: 2, px: 1.5, pt: 1.5, height: { md: '100%' } }}>
                <FormLabel content='Accessibility Information' />

                <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Roles"
                  userRolesChips={defaultValues?.roles}
                />

                <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Data Accessibility Level"
                  param={defaultValues?.dataAccessibilityLevel}
                />

                <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Modules"
                  chips={defaultValues?.modules}
                />

                <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Regions"
                  arrayParam={defaultValues?.regions}
                />

                <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Customers"
                  arrayParam={defaultValues?.customers}
                />

                <ViewFormField isLoading={isLoading}
                  sm={12}
                  heading="Machines"
                  machineConnectionArrayChip={defaultValues?.machines}
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
      <ChangePasswordByAdminDialog />

    </>
  );
}
