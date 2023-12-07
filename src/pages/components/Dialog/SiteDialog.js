import { memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog, DialogTitle, Divider, DialogContent } from '@mui/material';
import { setSiteDialog } from '../../../redux/slices/customer/site';
import ViewFormField from '../ViewForms/ViewFormField';
import DialogLink from './DialogLink';

function SiteDialog({ title }) {
    const dispatch = useDispatch();
    const { siteDialog, site, isLoading } = useSelector((state) => state.site);
    const handleClose = () => { dispatch(setSiteDialog(false)) }
  return (
      <Dialog
        disableEnforceFocus
        maxWidth='sm'
        open={siteDialog}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle variant='h3' sx={{pb:1, pt:2}}>{title}</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent dividers sx={{px:3}}>
          <Grid item container>
            <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={site?.name} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Phone" param={site?.phone} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Fax" param={site?.fax} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={site?.email} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Website" param={site?.website} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Street" param={site?.address?.street} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Suburb" param={site?.address?.suburb} />
            <ViewFormField isLoading={isLoading} sm={6} heading="City" param={site?.address?.city} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Region" param={site?.address?.region}/>
            <ViewFormField isLoading={isLoading} sm={6} heading="Post Code" param={site?.address?.postcode} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Country" param={site?.address?.country} />
          </Grid>
        </DialogContent>
        <DialogLink onClose={handleClose}/>
      </Dialog>
  );
}

SiteDialog.propTypes = {
  title: PropTypes.string,
};

export default memo(SiteDialog);
