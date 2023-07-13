import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Grid } from '@mui/material';
import ViewFormField from '../../ViewForms/ViewFormField';
import DialogLabel from '../DialogLabel';
import DialogLink from '../DialogLink';
import { DIALOGS, FORMLABELS as DIALOGLABELS } from '../../../../constants/default-constants';
import { FORMLABELS } from '../../../../constants/document-constants';
import FormLabel from '../../DocumentForms/FormLabel';

DialogCustomer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  customer: PropTypes.object,
  onClick: PropTypes.func,
};

export default function DialogCustomer({ customer, open, onClose, onClick }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogLabel onClick={onClose} content={DIALOGLABELS._def.CUSTOMER} />
      <Grid item container sx={{ px: 2, pt: 2 }}>
        <ViewFormField sm={12} heading={FORMLABELS.CUSTOMER.NAME} param={customer?.name} />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.TRADING_NAME}
          param={customer?.tradingName}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.PHONE}
          param={customer?.mainSite?.phone}
        />
        <ViewFormField sm={6} heading={FORMLABELS.CUSTOMER.FAX} param={customer?.mainSite?.fax} />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.EMAIL}
          param={customer?.mainSite?.email}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.SITE_NAME}
          param={customer?.mainSite?.name}
        />
        <FormLabel content={DIALOGLABELS.ADDRESS} />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.ADDRESS.STREET}
          param={customer?.mainSite?.address?.street}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.ADDRESS.SUBURB}
          param={customer?.mainSite?.address?.suburb}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.ADDRESS.CITY}
          param={customer?.mainSite?.address?.city}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.ADDRESS.REGION}
          param={customer?.mainSite?.address?.region}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.ADDRESS.POSTCODE}
          param={customer?.mainSite?.address?.postcode}
        />
        <ViewFormField
          sm={12}
          heading={FORMLABELS.CUSTOMER.ADDRESS.COUNTRY}
          param={customer?.mainSite?.address?.country}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.BILLING}
          param={
            customer?.primaryBillingContact &&
            `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
          }
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.CUSTOMER.TECHNICAL}
          param={
            customer?.primaryTechnicalContact &&
            `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
          }
        />
      </Grid>
      <Grid item container sx={{ px: 2, pb: 3 }}>
        <FormLabel content={DIALOGLABELS.HOWICK} />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.ACCOUNT}
          param={customer?.accountManager?.firstName}
          secondParam={customer?.accountManager?.lastName}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.PROJECT}
          param={customer?.projectManager?.firstName}
          secondParam={customer?.projectManager?.lastName}
        />
        <ViewFormField
          sm={6}
          heading={FORMLABELS.SUPPORT}
          param={customer?.supportManager?.firstName}
          secondParam={customer?.supportManager?.lastName}
        />
      </Grid>
      <DialogLink onClick={onClick} content={DIALOGS.CUSTOMER} />
    </Dialog>
  );
}
