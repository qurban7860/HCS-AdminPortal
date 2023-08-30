import { memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog } from '@mui/material';
import { setSiteDialog } from '../../../redux/slices/customer/site';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';

function SiteDialog({ title }) {
    const dispatch = useDispatch();
    const { siteDialog, site } = useSelector((state) => state.site);
    const handleClose = () => { dispatch(setSiteDialog(false)) }
  return (
<Dialog
        open={siteDialog}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content={title} onClick={handleClose} />
        <Grid item container sx={{ p: 2 }}>
          <ViewFormField sm={12} heading="Name" param={site?.name} />
          <ViewFormField sm={6} heading="Phone" param={site?.phone} />
          <ViewFormField sm={6} heading="Fax" param={site?.fax} />
          <ViewFormField sm={6} heading="Email" param={site?.email} />
          <ViewFormField sm={6} heading="Website" param={site?.website} />
          <ViewFormField
            sm={6}
            heading="Street"
            param={site?.address?.street}
          />
          <ViewFormField
            sm={6}
            heading="Suburb"
            param={site?.address?.suburb}
          />
          <ViewFormField sm={6} heading="City" param={site?.address?.city} />
          <ViewFormField
            sm={6}
            heading="Region"
            param={site?.address?.region}
          />
          <ViewFormField
            sm={6}
            heading="Post Code"
            param={site?.address?.postcode}
          />
          <ViewFormField
            sm={6}
            heading="Country"
            param={site?.address?.country}
          />
        </Grid>
      </Dialog>
  );
}

SiteDialog.propTypes = {
  title: PropTypes.string,
};

export default memo(SiteDialog);
