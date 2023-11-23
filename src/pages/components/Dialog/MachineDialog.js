import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Dialog, DialogContent, Skeleton } from '@mui/material';
import { PATH_MACHINE } from '../../../routes/paths';
import DialogLink from './DialogLink';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import FormLabel from '../DocumentForms/FormLabel';
import { setMachineDialog } from '../../../redux/slices/products/machine';
import ViewFormFieldWithSkelton from '../ViewForms/ViewFormFieldWithSkelton';

function MachineDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { machineForDialog, machineDialog, isLoading } = useSelector((state) => state.machine);
  const handleMachineDialog = ()=>{ dispatch(setMachineDialog(false)) }

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
      <DialogContent dividers sx={{width:"1000px"}}>
        <Grid container>
          <ViewFormFieldWithSkelton sm={6} variant='h4' heading="Serial No" var param={machineForDialog?.serialNo} isLoading={isLoading} />
          <ViewFormFieldWithSkelton sm={6} variant='h4' heading="Name" param={machineForDialog?.name} isLoading={isLoading}/>
          <ViewFormFieldWithSkelton sm={6} heading="Supplier" param={machineForDialog?.supplier?.name} isLoading={isLoading}/>
          <ViewFormFieldWithSkelton sm={6} heading="Machine Model" param={machineForDialog?.machineModel?.name} isLoading={isLoading}/>
          <ViewFormFieldWithSkelton
            sm={6}
            heading="Installation Site"
            param={machineForDialog?.instalationSite?.name} isLoading={isLoading}
          />
          <ViewFormFieldWithSkelton sm={6} heading="Billing Site" param={machineForDialog?.billingSite?.name} isLoading={isLoading} />
          <ViewFormFieldWithSkelton sm={12} heading="Nearby Milestone" param={machineForDialog?.siteMilestone} isLoading={isLoading}/>
        </Grid>
        <Grid container>
          <FormLabel content="Howick Resources" />
          <ViewFormFieldWithSkelton isLoading={isLoading}
            sm={6}
            heading="Account Manager"
            param={machineForDialog?.accountManager?.firstName}
            secondParam={machineForDialog?.accountManager?.lastName}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading}
            sm={6}
            heading="Project Manager"
            param={machineForDialog?.projectManager?.firstName}
            secondParam={machineForDialog?.projectManager?.lastName}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading} 
            sm={6}
            heading="Suppport Manager"
            param={machineForDialog?.supportManager?.firstName}
            secondParam={machineForDialog?.supportManager?.lastName}
          />
        </Grid>
      </DialogContent>
      <DialogLink
        onClose={handleMachineDialog}
        onClick={() => {navigate(PATH_MACHINE.machines.view(machineForDialog?._id)); dispatch(setMachineDialog(false)); }}
        content="Go to machine"
      />
    </Dialog>
  );
}

export default MachineDialog;
