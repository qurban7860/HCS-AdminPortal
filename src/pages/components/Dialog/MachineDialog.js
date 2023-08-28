import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Dialog, DialogContent } from '@mui/material';
import { PATH_MACHINE } from '../../../routes/paths';
import DialogLink from './DialogLink';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import FormLabel from '../DocumentForms/FormLabel';
import { setMachineDialog } from '../../../redux/slices/products/machine';

function MachineDialog({ machineData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { machine, machineDialog } = useSelector((state) => state.machine);
  const handleMachineDialog = ()=>{ dispatch(setMachineDialog(false)) }
  const [machineValue, setMachineValue] = useState({})
  useEffect(()=>{
    if(typeof machineData === 'object' && machineData){
      setMachineValue(machineData)
    }else{
      setMachineValue(machine)
    }
  },[machine, machineData, machineDialog])
  return (
    <Dialog
      disableEnforceFocus
      maxWidth="lg"
      open={ machineDialog }
      onClose={ handleMachineDialog }
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogLabel onClick={ handleMachineDialog } content="Machine" />
      <DialogContent dividers>
        <Grid container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={6} heading="Serial No" param={machineValue?.serialNo} />
          <ViewFormField sm={6} heading="Name" param={machineValue?.name} />
          <ViewFormField sm={6} heading="Supplier" param={machineValue?.supplier?.name} />
          <ViewFormField sm={6} heading="Machine Model" param={machineValue?.machineModel?.name} />
          <ViewFormField
            sm={6}
            heading="Installation Site"
            param={machineValue?.instalationSite?.name}
          />
          <ViewFormField sm={6} heading="Billing Site" param={machineValue?.billingSite?.name} />
          <ViewFormField sm={12} heading="Nearby Milestone" param={machineValue?.siteMilestone} />
        </Grid>
        <Grid container sx={{ px: 2, pb: 3 }}>
          <FormLabel content="Howick Resources" />
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={machineValue?.accountManager?.firstName}
            secondParam={machineValue?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={machineValue?.projectManager?.firstName}
            secondParam={machineValue?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={machineValue?.supportManager?.firstName}
            secondParam={machineValue?.supportManager?.lastName}
          />
        </Grid>
      </DialogContent>
      <DialogLink
        onClick={() => navigate(PATH_MACHINE.machines.view(machineValue?._id))}
        content="Go to machine"
      />
    </Dialog>
  );
}

MachineDialog.propTypes = {
  machineData: PropTypes.object,
};

export default MachineDialog;
