import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Grid } from '@mui/material';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import DialogLabel from '../../../../components/Dialog/DialogLabel';
import DialogLink from '../../../../components/Dialog/DialogLink';
import { DIALOGS, FORMLABELS as DIALOGLABELS } from '../../../../../constants/default-constants';
import { FORMLABELS } from '../../../../../constants/document-constants';
import FormLabel from '../../../../components/DocumentForms/FormLabel';

DialogMachine.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  machine: PropTypes.object,
  onClick: PropTypes.func,
};

export default function DialogMachine({ open, onClose, machine, onClick }) {
  return (
    <Dialog
      disableEnforceFocus
      maxWidth="md"
      open={open}
      onClose={onClose}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogLabel onClick={onClose} content={DIALOGLABELS._def.MACHINE} />

      <Grid container sx={{ px: 2, pt: 2 }}>
        <ViewFormField sm={6} heading={FORMLABELS.MACHINE.SERIALNO} param={machine?.serialNo} />
        <ViewFormField sm={6} heading={FORMLABELS.MACHINE.NAME} param={machine?.name} />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.MACHINE.PREVIOUS_SN}
          param={machine?.parentSerialNo}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.MACHINE.PREVIOUS_MACHINE}
          param={machine?.parentMachine?.name}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.MACHINE.SUPPLIER}
          param={machine?.supplier?.name}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.MACHINE.MACHINE_MODEL}
          param={machine?.machineModel?.name}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.MACHINE.INSTALLATION_SITE}
          param={machine?.instalationSite?.name}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.MACHINE.BILLING_SITE}
          param={machine?.billingSite?.name}
        />
        <ViewFormField
          sm={12}
          heading={FORMLABELS.MACHINE.NEARBY_MILESTONE}
          param={machine?.siteMilestone}
        />
      </Grid>
      <Grid item sx={{ px: 2, pb: 3 }}>
        <FormLabel content={DIALOGLABELS.HOWICK} />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.ACCOUNT}
          param={machine?.accountManager?.firstName}
          secondParam={machine?.accountManager?.lastName}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.PROJECT}
          param={machine?.projectManager?.firstName}
          secondParam={machine?.projectManager?.lastName}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.SUPPORT}
          param={machine?.supportManager?.firstName}
          secondParam={machine?.supportManager?.lastName}
        />
      </Grid>

      <DialogLink onClick={onClick} content={DIALOGS.MACHINE} />
    </Dialog>
  );
}
