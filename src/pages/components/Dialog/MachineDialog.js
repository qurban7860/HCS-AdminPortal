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
  
/* eslint-disable */
// useEffect(() => {
//     if(connectedMachine && handleConnectedMachine){
//       setCurrentMachine(connectedMachine);
//     }else{
//       setCurrentMachine(machine);
//     }
//   }, [handleConnectedMachine, connectedMachine]);
/* eslint-enable */

  return (
    <Dialog
      disableEnforceFocus
      maxWidth="lg"
      open={openMachine}
      onClose={handleCloseMachine}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogLabel onClick={() => handleCloseMachine()} content="Machine" />
      <DialogContent dividers>
        <Grid container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={6} heading="Serial No" param={machine?.serialNo} />
          <ViewFormField sm={6} heading="Name" param={machine?.name} />
          <ViewFormField
            sm={6}
            heading="Previous Machine Serial No"
            param={machine?.parentSerialNo}
          />
          <ViewFormField sm={6} heading="Previous Machine" param={`${machine?.parentSerialNo} ${machine?.parentMachine?.name ? '-' : ''} ${machine?.parentMachine?.name ? machine?.parentMachine?.name : ''}`} />
          <ViewFormField sm={6} heading="Supplier" param={machine?.supplier?.name} />
          <ViewFormField sm={6} heading="Machine Model" param={machine?.machineModel?.name} />
          {/* <ViewFormField sm={6} heading="Status"                      param={currentMachine?.status?.name} /> */}
          {/* <ViewFormField sm={6} heading="Work Order / Perchase Order" param={currentMachine?.workOrderRef} /> */}
          {/* <ViewFormField sm={12} heading="Customer"                   param={currentMachine?.customer?.name }/> */}
          <ViewFormField
            sm={6}
            heading="Installation Site"
            param={machine?.instalationSite?.name}
          />
          <ViewFormField sm={6} heading="Billing Site" param={machine?.billingSite?.name} />
          <ViewFormField sm={12} heading="Nearby Milestone" param={machine?.siteMilestone} />
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
            param={machine?.accountManager?.firstName}
            secondParam={machine?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={machine?.projectManager?.firstName}
            secondParam={machine?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={machine?.supportManager?.firstName}
            secondParam={machine?.supportManager?.lastName}
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
