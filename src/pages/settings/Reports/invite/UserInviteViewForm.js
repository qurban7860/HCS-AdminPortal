import { useMemo, useState } from 'react';
// @mui
import { Card, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// hooks
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { PATH_SETTING } from '../../../../routes/paths';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { cancelUserInvite, getUserInvite, resendUserInvite } from '../../../../redux/slices/securityUser/invite';

export default function UserInviteViewForm() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { userInvite, isLoading } = useSelector((state) => state.userInvite);
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      username: userInvite?.name || '',
      useremail: userInvite?.receiverInvitationEmail || userInvite?.email || '',
      sender: userInvite?.senderInvitationUser?.name || '',
      code: userInvite?.inviteCode || '',
      expiry: userInvite?.inviteExpireTime || '',
      status: userInvite?.invitationStatus || '',
      customerName: userInvite?.customer?.name || '',
      contactName: userInvite?.contact ? `${userInvite.contact.firstName} ${userInvite.contact.lastName}` : '',
      isActive: userInvite?.isActive,
      createdAt: userInvite?.createdAt || '',
      updatedAt: userInvite?.updatedAt || '',
    }),
    [userInvite]
  );

  const handleCancelInvite = async () => {
    try {
      await dispatch(cancelUserInvite(userInvite?._id));
      enqueueSnackbar('Invitation cancelled successfully');
      navigate(PATH_SETTING.invite.list);
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to cancel invitation', { variant: 'error' });
    }
  };

  const handleResendInvite = async () => {
    try {
      await dispatch(resendUserInvite(userInvite?._id));
      enqueueSnackbar('Invitation resent successfully');
      await dispatch(getUserInvite(userInvite?._id));
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to resend invitation', { variant: 'error' });
    }
  };
  
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="User Invite Detail" />
      </StyledCardContainer>
      <Grid item md={12} mt={2}>
        <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons 
          isActive={defaultValues.isActive} 
          backLink={() => navigate(PATH_SETTING.invite.list)}
          settingPage
          invitationStatus={defaultValues.status}
          onCancelInvite={handleCancelInvite}
          onResendInvite={handleResendInvite}
        />
          <Grid container sx={{mt:2}}>
            <ViewFormField isLoading={isLoading} sm={6} heading="Invited User" param={defaultValues.username} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Invited User Email" param={defaultValues.useremail} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Invited By " param={defaultValues.sender} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Customer" param={defaultValues.customerName} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Contact" param={defaultValues.contactName} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Status " param={defaultValues.status} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Invitation Time " param={fDate(defaultValues.createdAt)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Expiry Time " param={fDate(defaultValues.expiry)} />
          </Grid>
        </Card>
      </Grid>
    </Container>
  );
}
