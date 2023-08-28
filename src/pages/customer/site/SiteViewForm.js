import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Grid, Button, Dialog } from '@mui/material';
// redux
import {
  deleteSite,
  getSite,
  getSites,
  setSiteEditFormVisibility,
} from '../../../redux/slices/customer/site';
import { useSnackbar } from '../../../components/snackbar';

// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import ConfirmDialog from '../../../components/confirm-dialog';
import GoogleMaps from '../../../assets/GoogleMaps';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

SiteViewForm.propTypes = {
  currentSite: PropTypes.object,
  handleMap: PropTypes.func,
  setIsExpanded: PropTypes.func,
};
export default function SiteViewForm({ currentSite = null, handleMap, setIsExpanded }) {
  const { site } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteSite(customer?._id, currentSite?._id));
      // handleCloseConfirm();
      dispatch(getSites(customer?._id));
      enqueueSnackbar('Site deleted Successfully!');
      setIsExpanded(false);
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log(err);
    }
  };

  const handleEdit = async () => {
    await dispatch(getSite(customer?._id, currentSite?._id));
    dispatch(setSiteEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      id: currentSite ? currentSite?._id : site?._id || '',
      name: currentSite ? currentSite.name : site?.name || '',
      customer: currentSite ? currentSite.name : site?.tradingName || '',
      billingSite: currentSite ? currentSite?._id : site?.accountManager || '',
      phone: currentSite ? currentSite.phone : site?.phone || '',
      email: currentSite ? currentSite.email : site?.email || '',
      fax: currentSite ? currentSite.fax : site?.fax || '',
      website: currentSite ? currentSite.website : site?.website || '',
      lat: currentSite ? currentSite.lat : site?.lat || '',
      long: currentSite ? currentSite.long : site?.long || '',
      street: currentSite ? currentSite.address?.street : site?.address.street || '',
      suburb: currentSite ? currentSite.address?.suburb : site?.address.suburb || '',
      city: currentSite ? currentSite.address?.city : site?.address.city || '',
      postcode: currentSite ? currentSite.address?.postcode : site?.address.postcode || '',
      region: currentSite ? currentSite.address?.region : site?.address.region || '',
      country: currentSite ? currentSite.address?.country : site?.address.country || '',
      primaryBillingContact: currentSite?.primaryBillingContact || null,
      primaryTechnicalContact: currentSite?.primaryTechnicalContact || null,
      isActive: currentSite?.isActive,
      createdAt: currentSite?.createdAt || '',
      createdByFullName: currentSite?.createdBy?.name || '',
      createdIP: currentSite?.createdIP || '',
      updatedAt: currentSite?.updatedAt || '',
      updatedByFullName: currentSite?.updatedBy?.name || '',
      updatedIP: currentSite?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSite, site]
  );

  return (
    <Grid>
      <Grid container justifyContent="flex-end" sx={{ pr: '1rem' }}>
        <ViewFormEditDeleteButtons
          handleEdit={handleEdit}
          onDelete={onDelete}
          sites
          mainSite={customer.mainSite?._id === site?._id}
          handleMap={handleMap}
        />
      </Grid>
      {/* <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4 }}>
        <Button onClick={() => handleEdit()} variant="outlined" startIcon={<Iconify icon="eva:edit-fill" />} >
          Edit
        </Button>
        <Button onClick={() => { handleOpenConfirm(); handleClosePopover(); }} variant="outlined" color="error" startIcon={<Iconify icon="eva:trash-2-fill" />} >
          Delete
        </Button>
      </Stack> */}
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField sm={12} heading="Name" param={defaultValues?.name} />
        <ViewFormField sm={6} heading="Phone" param={defaultValues?.phone} />
        <ViewFormField sm={6} heading="Fax" param={defaultValues?.fax} />
        <ViewFormField sm={6} heading="Email" param={defaultValues?.email} />
        <ViewFormField sm={6} heading="Website" param={defaultValues?.website} />
        <ViewFormField sm={6} heading="Street" param={defaultValues?.street} />
        <ViewFormField sm={6} heading="Suburb" param={defaultValues?.suburb} />
        <ViewFormField sm={6} heading="City" param={defaultValues?.city} />
        <ViewFormField sm={6} heading="Region" param={defaultValues?.region} />
        <ViewFormField sm={6} heading="Post Code" param={defaultValues?.postcode} />
        <ViewFormField sm={6} heading="Country" param={defaultValues?.country} />
        <ViewFormField sm={6} heading="Latitude" param={defaultValues?.lat} />
        <ViewFormField sm={6} heading="Longitude" param={defaultValues?.long} />
        <Grid container>
          <ViewFormField
            sm={6}
            heading="Primary Billing Contact"
            param={defaultValues?.primaryBillingContact?.firstName}
            secondParam={defaultValues?.primaryBillingContact?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Primary Technical Contact"
            param={defaultValues?.primaryTechnicalContact?.firstName}
            secondParam={defaultValues?.primaryTechnicalContact?.lastName}
          />
        </Grid>
        <ViewFormField />
        <Dialog
          open={openPopover}
          onClose={handleClosePopover}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Grid container lg={12}>
            {defaultValues.lat && defaultValues.long ? (
              <GoogleMaps lat={defaultValues.lat} lng={defaultValues.long} />
            ) : (
              <ViewFormField
                sm={6}
                heading="No Site Locations Available"
              />)}
          </Grid>
          {/* {defaultValues.lat && defaultValues.long && (
            <Grid container lg={12}>
              <GoogleMaps
                lat={defaultValues.lat ? defaultValues.lat : 0}
                lng={defaultValues.long ? defaultValues.long : 0}
              />
            </Grid>
          )} */}
        </Dialog>
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
        {/* <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Delete"
          content="Are you sure want to delete?"
          action={
            <Button variant="contained" color="error" onClick={onDelete}>
              Delete
            </Button>
          }
        /> */}
      </Grid>
    </Grid>
  );
}
