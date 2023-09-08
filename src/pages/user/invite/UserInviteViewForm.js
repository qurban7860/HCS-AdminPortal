import { useMemo } from 'react';
// @mui
import { Card, Grid, Container } from '@mui/material';

// hooks
import { useSelector } from 'react-redux';
import { PATH_SETTING } from '../../../routes/paths';
import { Cover } from '../../components/Defaults/Cover';
import { fDate } from '../../../utils/formatTime';
import ViewFormField from '../../components/ViewForms/ViewFormField';
// components


export default function UserInviteViewForm() {
  const {userInvite} = useSelector((state) => state.userInvite);
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
  
  return (
    <Container maxWidth={false}>
      <Card sx={{mb: 3, height: 160, position: 'relative'}}>
        <Cover generalSettings="enabled" backLink={PATH_SETTING.invite.list} name="User Invite Detail" icon="ph:users-light" />
      </Card>
      <Grid item md={12} mt={2}>
        <Card sx={{ p: 2 }}>
          <Grid container>
            <ViewFormField sm={6} heading="Inveted User" param={defaultValues.username} />
            <ViewFormField sm={6} heading="Inveted User Email" param={defaultValues.useremail} />
            <ViewFormField sm={6} heading="Invited By " param={defaultValues.sender} />
            <ViewFormField sm={6} heading="Status " param={defaultValues.status} />
            <ViewFormField sm={6} heading="Invitation Time " param={fDate(defaultValues.createdAt)} />
            <ViewFormField sm={6} heading="Expiry Time " param={fDate(defaultValues.expiry)} />
          </Grid>
        </Card>
      </Grid>
    </Container>
  );
}
