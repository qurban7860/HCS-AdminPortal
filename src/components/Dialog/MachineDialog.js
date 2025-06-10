import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { PATH_MACHINE } from '../../routes/paths';
import DialogLink from './DialogLink';
import FormLabel from '../DocumentForms/FormLabel';
import { setMachineDialog, resetMachineForDialog, resetMachine } from '../../redux/slices/products/machine';
import ViewFormField from '../ViewForms/ViewFormField';

function MachineDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { machineForDialog, machineDialog, isLoading } = useSelector((state) => state.machine);
  const handleMachineDialog = ()=>{ dispatch(setMachineDialog(false)); dispatch(resetMachineForDialog());  }

  return (
    <Dialog
      disableEnforceFocus
      maxWidth="lg"
      open={ machineForDialog && machineDialog }
      onClose={ handleMachineDialog }
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Machine</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{width:"1000px", px:3}}>
        <Grid container>
          <ViewFormField sm={6} variant='h4' heading="Serial No" var param={machineForDialog?.serialNo} isLoading={isLoading} />
          <ViewFormField sm={6} heading="Machine Model" param={machineForDialog?.machineModel?.name} isLoading={isLoading}/>
          <ViewFormField sm={12} variant='h4' heading="Name" param={machineForDialog?.name} isLoading={isLoading}/>
          <ViewFormField sm={12} heading="Supplier" param={machineForDialog?.supplier?.name} isLoading={isLoading}/>
          <ViewFormField
            sm={6}
            heading="Installation Site"
            param={machineForDialog?.instalationSite?.name} isLoading={isLoading}
          />
          <ViewFormField sm={6} heading="Billing Site" param={machineForDialog?.billingSite?.name} isLoading={isLoading} />
          <ViewFormField sm={12} heading="Nearby Milestone" param={machineForDialog?.siteMilestone} isLoading={isLoading}/>
        </Grid>
        <Grid container>
          <FormLabel content="Howick Resources" />
          <ViewFormField isLoading={isLoading}
            sm={6} heading="Account Manager" customerContacts={machineForDialog?.accountManager}
          />
          <ViewFormField isLoading={isLoading}
            sm={6} heading="Project Manager" customerContacts={machineForDialog?.projectManager}
          />
          <ViewFormField isLoading={isLoading} 
            sm={6} heading="Suppport Manager" customerContacts={machineForDialog?.supportManager}
          />
        </Grid>
      </DialogContent>
      <DialogLink
        onClose={handleMachineDialog}
        onClick={() => {
            if( machineForDialog?._id){
              dispatch(resetMachine());
              navigate(PATH_MACHINE.machines.view(machineForDialog?._id)); 
              dispatch(setMachineDialog(false)); 
            }
          }}
        content="Go to machine"
      />
    </Dialog>
  );
}

export default MachineDialog;
