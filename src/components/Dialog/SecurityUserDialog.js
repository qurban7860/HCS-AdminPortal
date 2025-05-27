import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { setSecurityUserDialog, resetSecurityUser } from '../../redux/slices/securityUser/securityUser';
import { PATH_SETTING } from '../../routes/paths';
import DialogLink from './DialogLink';
import FormLabel from '../DocumentForms/FormLabel';
import ViewFormField from '../ViewForms/ViewFormField';

function SecurityUserDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { securityUser, securityUserDialog, isLoading } = useSelector((state) => state.user);
  const handleSecurityUserDialog = async () => { 
    await dispatch(resetSecurityUser())  
    await dispatch(setSecurityUserDialog(false))  
  }

  return (
    <Dialog
      disableEnforceFocus
      maxWidth="lg"
      open={securityUser && securityUserDialog}
      onClose={handleSecurityUserDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Security User</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ p:3 }}>
        <Grid item container >
          <FormLabel content='Personal Information' />
          <ViewFormField isLoading={isLoading} sm={6} heading="Full Name" param={securityUser?.name || "" } />
          <ViewFormField isLoading={isLoading} sm={6} heading="Phone" param={securityUser?.phone  || "" } />
          <ViewFormField isLoading={isLoading} sm={6} heading="email" param={securityUser?.email  || "" } />
          <ViewFormField isLoading={isLoading} sm={6} heading="Login" param={securityUser?.login  || "" } />
          <ViewFormField isLoading={isLoading} sm={6} heading="Customer" param={securityUser?.customer?.name  || "" } />
          <ViewFormField isLoading={isLoading} sm={6} heading="Contact" param={`${securityUser?.contact?.firstName || ''} ${securityUser?.contact?.lastName || ''}`} />

              <FormLabel content='Accessibility Information' />

              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Roles"
                userRolesChips={securityUser?.roles || ""}
              />

              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Data Accessibility Level"
                param={securityUser?.dataAccessibilityLevel || ""}
              />

              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Regions"
                chips={securityUser?.regions?.map(region => region?.name) || []}
              />

              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Customers"
                chips={securityUser?.customers?.map(customer => customer?.name) || []}
              />

              <ViewFormField isLoading={isLoading}
                sm={12}
                heading="Machines"
                chips={securityUser?.machines?.map(machine => machine?.name) || []}
              />

        </Grid>
      </DialogContent>
      <DialogLink
        onClose={handleSecurityUserDialog}
        onClick={() => {
          handleSecurityUserDialog();
          navigate(PATH_SETTING.security.users.view(securityUser._id));
        }}
        content="Go to Security User"
      />
    </Dialog>
  );
}


export default SecurityUserDialog;
