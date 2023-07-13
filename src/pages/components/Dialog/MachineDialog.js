import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog, DialogContent } from '@mui/material';
import Iconify from '../../../components/iconify';
import { PATH_MACHINE } from '../../../routes/paths';
import DialogLink from './DialogLink';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import FormLabel from '../DocumentForms/FormLabel';

function MachineDialog({ openMachine, handleCloseMachine, handleConnectedMachine=false }) {
  const navigate = useNavigate();
  const { machine, connectedMachine } = useSelector((state) => state.machine);
  const [currentMachine, setCurrentMachine] = useState(machine);
  useEffect(() => {
    if(connectedMachine && handleConnectedMachine){
      setCurrentMachine(connectedMachine);
    }else{
      setCurrentMachine(machine);
    }
  }, [handleConnectedMachine, connectedMachine]);

  return (
    <Dialog
      disableEnforceFocus
      maxWidth="md"
      open={openMachine}
      onClose={handleCloseMachine}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogLabel onClick={() => handleCloseMachine()} content="Machine" />
      <DialogContent dividers>
        <Grid container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={6} heading="Serial No" param={currentMachine?.serialNo} />
          <ViewFormField sm={6} heading="Name" param={currentMachine?.name} />
          <ViewFormField
            sm={6}
            heading="Previous Machine Serial No"
            param={currentMachine?.parentSerialNo}
          />
          <ViewFormField sm={6} heading="Previous Machine" param={currentMachine?.parentMachine?.name} />
          <ViewFormField sm={6} heading="Supplier" param={currentMachine?.supplier?.name} />
          <ViewFormField sm={6} heading="Machine Model" param={currentMachine?.machineModel?.name} />
          {/* <ViewFormField sm={6} heading="Status"                      param={currentMachine?.status?.name} /> */}
          {/* <ViewFormField sm={6} heading="Work Order / Perchase Order" param={currentMachine?.workOrderRef} /> */}
          {/* <ViewFormField sm={12} heading="Customer"                   param={currentMachine?.customer?.name }/> */}
          <ViewFormField
            sm={6}
            heading="Installation Site"
            param={currentMachine?.instalationSite?.name}
          />
          <ViewFormField sm={6} heading="Billing Site" param={currentMachine?.billingSite?.name} />
          <ViewFormField sm={12} heading="Nearby Milestone" param={currentMachine?.siteMilestone} />
          {/* <Grid item xs={12} sm={12} sx={{ px:2,py:1, overflowWrap: "break-word", }}>
        <Typography  variant="overline" sx={{ color: 'text.disabled' }}> Description </Typography>
        {currentMachine?.description && <Typography variant="body1" component="p" >
            {descriptionExpanded ? currentMachine?.description : `${currentMachine?.description.slice(0, 90)}...`}{currentMachine?.description?.length > 90 && (
            <Button onClick={handleDescriptionExpandedToggle} color="primary">
              {descriptionExpanded ? 'See Less' : 'See More'}
            </Button>)}
        </Typography>}
      </Grid> */}
        </Grid>
        <Grid item sx={{ px: 2, pb: 3 }}>
          <FormLabel content="Howick Resources" />
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={currentMachine?.accountManager?.firstName}
            secondParam={currentMachine?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={currentMachine?.projectManager?.firstName}
            secondParam={currentMachine?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={currentMachine?.supportManager?.firstName}
            secondParam={currentMachine?.supportManager?.lastName}
          />
        </Grid>
      </DialogContent>
      <DialogLink
        onClick={() => navigate(PATH_MACHINE.machines.view(currentMachine._id))}
        content="Go to machine"
      />
    </Dialog>
  );
}

MachineDialog.propTypes = {
  openMachine: PropTypes.bool,
  handleCloseMachine: PropTypes.func,
  handleConnectedMachine: PropTypes.bool
};

export default MachineDialog;
