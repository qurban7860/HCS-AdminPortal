import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Link, DialogActions, Button , Dialog, DialogContent} from '@mui/material';
import Iconify from '../../../components/iconify';
import { PATH_MACHINE } from '../../../routes/paths';
import DialogLink  from './DialogLink'
import DialogLabel  from './DialogLabel'
import ViewFormField  from '../ViewFormField'
import FormLabel  from '../FormLabel'

function MachineDialog({ openMachine, handleCloseMachine }) {
  const navigate = useNavigate();
  const { machine } = useSelector((state) => state.machine);

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
      <ViewFormField sm={6} heading="Serial No" param={machine?.serialNo} />
      <ViewFormField sm={6} heading="Name" param={machine?.name} />
      <ViewFormField
        sm={6}
        heading="Previous Machine Serial No"
        param={machine?.parentSerialNo}
      />
      <ViewFormField sm={6} heading="Previous Machine" param={machine?.parentMachine?.name} />
      <ViewFormField sm={6} heading="Supplier" param={machine?.supplier?.name} />
      <ViewFormField sm={6} heading="Machine Model" param={machine?.machineModel?.name} />
      {/* <ViewFormField sm={6} heading="Status"                      param={machine?.status?.name} /> */}
      {/* <ViewFormField sm={6} heading="Work Order / Perchase Order" param={machine?.workOrderRef} /> */}
      {/* <ViewFormField sm={12} heading="Customer"                   param={machine?.customer?.name }/> */}
      <ViewFormField
        sm={6}
        heading="Installation Site"
        param={machine?.instalationSite?.name}
      />
      <ViewFormField sm={6} heading="Billing Site" param={machine?.billingSite?.name} />
      <ViewFormField sm={12} heading="Nearby Milestone" param={machine?.siteMilestone} />
      {/* <Grid item xs={12} sm={12} sx={{ px:2,py:1, overflowWrap: "break-word", }}>
        <Typography  variant="overline" sx={{ color: 'text.disabled' }}> Description </Typography>
        {machine?.description && <Typography variant="body1" component="p" >
            {descriptionExpanded ? machine?.description : `${machine?.description.slice(0, 90)}...`}{machine?.description?.length > 90 && (
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
    <DialogLink onClick={() => navigate(PATH_MACHINE.machines.view(machine._id))} content="Go to machine" />
  </Dialog>
  );
}

MachineDialog.propTypes = {
  openMachine: PropTypes.bool,
  handleCloseMachine: PropTypes.func,
};

export default MachineDialog;
