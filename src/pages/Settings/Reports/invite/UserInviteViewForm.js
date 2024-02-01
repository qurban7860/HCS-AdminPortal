import { useMemo, useEffect } from 'react';
// @mui
import { Card, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// hooks
import { useSelector } from 'react-redux';
import { PATH_PAGE, PATH_SETTING } from '../../../../routes/paths';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';

export default function UserInviteViewForm() {
  const { userInvite, isLoading } = useSelector((state) => state.userInvite);
  const navigate = useNavigate();
  const defaultValues = useMemo(
    () => ({
      username:userInvite?.receiverInvitationUser?.name|| '', 
      useremail:userInvite?.receiverInvitationEmail|| '', 
      sender:userInvite?.senderInvitationUser?.name || '', 
      code:userInvite?.inviteCode|| '', 
      expiry:userInvite?.inviteExpireTime|| '', 
      status:userInvite?.invitationStatus || '',
      isActive:userInvite?.isActive,
      createdAt:userInvite?.createdAt || '',
      updatedAt:userInvite?.updatedAt || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userInvite]
  );

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

  useEffect(() => {
    if(!isSuperAdmin){
      navigate(PATH_PAGE.page403)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, isSuperAdmin]);
  
  return (
    <Container maxWidth={false}>
      <Card sx={{mb: 3, height: 160, position: 'relative'}}>
        <Cover name="User Invite Detail" icon="ph:users-light" generalSettings />
      </Card>
      <Grid item md={12} mt={2}>
        <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons 
          isActive={defaultValues.isActive} 
          backLink={() => navigate(PATH_SETTING.invite.list)}
          settingPage
        />
          <Grid container sx={{mt:2}}>
            <ViewFormField isLoading={isLoading} sm={6} heading="Inveted User" param={defaultValues.username} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Inveted User Email" param={defaultValues.useremail} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Invited By " param={defaultValues.sender} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Status " param={defaultValues.status} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Invitation Time " param={fDate(defaultValues.createdAt)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Expiry Time " param={fDate(defaultValues.expiry)} />
          </Grid>
        </Card>
      </Grid>
    </Container>
  );
}
