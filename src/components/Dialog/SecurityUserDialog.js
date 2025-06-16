import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { setSecurityUserDialog, resetDialogSecurityUser } from '../../redux/slices/securityUser/securityUser';
import { PATH_SETTING } from '../../routes/paths';
import DialogLink from './DialogLink';
import FormLabel from '../DocumentForms/FormLabel';
import ViewFormField from '../ViewForms/ViewFormField';

function SecurityUserDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dialogSecurityUser, securityUserDialog, isLoadingDialogUser } = useSelector((state) => state.user);
  const handleSecurityUserDialog = async () => {
    await dispatch(resetDialogSecurityUser())
    await dispatch(setSecurityUserDialog(false))
  }

  return (
    <Dialog
      disableEnforceFocus
      maxWidth="lg"
      open={dialogSecurityUser && securityUserDialog}
      onClose={handleSecurityUserDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle variant='h3' sx={{ pb: 1, pt: 2 }}>Security User</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid item container >
          <FormLabel content='Personal Information' />
          <ViewFormField isLoading={isLoadingDialogUser} sm={6} heading="Full Name" param={dialogSecurityUser?.name || ""} />
          <ViewFormField isLoading={isLoadingDialogUser} sm={6} heading="Phone" param={dialogSecurityUser?.phone || ""} />
          <ViewFormField isLoading={isLoadingDialogUser} sm={6} heading="email" param={dialogSecurityUser?.email || ""} />
          <ViewFormField isLoading={isLoadingDialogUser} sm={6} heading="Login" param={dialogSecurityUser?.login || ""} />
          <ViewFormField isLoading={isLoadingDialogUser} sm={6} heading="Customer" param={dialogSecurityUser?.customer?.name || ""} />
          <ViewFormField isLoading={isLoadingDialogUser} sm={6} heading="Contact" param={`${dialogSecurityUser?.contact?.firstName || ''} ${dialogSecurityUser?.contact?.lastName || ''}`} />

          <FormLabel content='Accessibility Information' />

          <ViewFormField isLoading={isLoadingDialogUser}
            sm={12}
            heading="Roles"
            userRolesChips={dialogSecurityUser?.roles || ""}
          />

          <ViewFormField isLoading={isLoadingDialogUser}
            sm={12}
            heading="Data Accessibility Level"
            param={dialogSecurityUser?.dataAccessibilityLevel || ""}
          />

          <ViewFormField isLoading={isLoadingDialogUser}
            sm={12}
            heading="Regions"
            arrayParam={dialogSecurityUser?.regions || []}
          />

          <ViewFormField isLoading={isLoadingDialogUser}
            sm={12}
            heading="Customers"
            arrayParam={dialogSecurityUser?.customers || []}
          />

          <ViewFormField isLoading={isLoadingDialogUser}
            sm={12}
            heading="Machines"
            machineConnectionArrayChip={dialogSecurityUser?.machines || []}
          />

        </Grid>
      </DialogContent>
      <DialogLink
        onClose={handleSecurityUserDialog}
        onClick={() => {
          handleSecurityUserDialog();
          navigate(PATH_SETTING.security.users.view(dialogSecurityUser._id));
        }}
        content="Go to Security User"
      />
    </Dialog>
  );
}


export default SecurityUserDialog;
