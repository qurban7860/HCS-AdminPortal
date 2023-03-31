import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { deleteSite, getSite, getSites, setEditFormVisibility } from '../../../redux/slices/customer/site';

// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';

import { fDate,fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------
SiteViewForm.propTypes = {
  currentSite: PropTypes.object,
};

export default function SiteViewForm({ currentSite = null }) {

  const { site } = useSelector((state) => state.site);

  const { customer } = useSelector((state) => state.customer);

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
    await dispatch(deleteSite(customer._id, currentSite._id));
    handleCloseConfirm();
    dispatch(getSites(customer._id));
    // dispatch(getContacts());
  };

  const  handleEdit = async () => {
    await dispatch(getSite(customer._id, currentSite._id));
    dispatch(setEditFormVisibility(true));
  };


  const defaultValues = useMemo(
    () => (
      {
        id: currentSite ? currentSite._id : site?._id || 'N/A',
        name: currentSite ? currentSite.name : site?.name || 'N/A',
        customer: currentSite ? currentSite.name : site?.tradingName || 'N/A',
        billingSite: currentSite ? currentSite._id : site?.accountManager || 'N/A',
        phone: currentSite ? currentSite.phone : site?.phone || 'N/A',
        email: currentSite ? currentSite.email : site?.email || 'N/A',
        fax: currentSite ? currentSite.fax : site?.fax || 'N/A',
        website: currentSite ? currentSite.website : site?.website || 'N/A',
        lat: currentSite ? currentSite.lat : site?.lat || 'N/A',
        long: currentSite ? currentSite.long : site?.long || 'N/A',


        street: currentSite ? currentSite.address?.street : site?.address.street || 'N/A',
        suburb: currentSite ? currentSite.address?.suburb : site?.address.suburb || 'N/A',
        city: currentSite ? currentSite.address?.city : site?.address.city || 'N/A',
        postcode: currentSite ? currentSite.address?.postcode : site?.address.postcode || 'N/A',
        region: currentSite ? currentSite.address?.region : site?.address.region || 'N/A',
        country: currentSite ? currentSite.address?.country : site?.address.country || 'N/A',
        primaryBillingContact: currentSite?.primaryBillingContact || null,
        primaryTechnicalContact: currentSite?.primaryTechnicalContact || null,
      
        createdAt:                currentSite?.createdAt || "",
        createdByFname:           currentSite?.createdBy?.name || "",
        createdByLname:           currentSite?.createdBy?.lastName || "",
        createdIP:                currentSite?.createdIP || "",
        updatedAt:                currentSite?.updatedAt || "",
        updatedByFname:           currentSite?.updatedBy?.name || "",
        updatedByLname:           currentSite?.updatedBy?.lastName || "",
        updatedIP:                currentSite?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSite, site]
  );

  return (
    <Grid sx={{ p: 2 }}>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4 }}>
        <Button
          onClick={() => handleEdit()}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          variant="outlined"
          color="error"
          startIcon={<Iconify icon="eva:trash-2-fill" />}
        >
          Delete
        </Button>
      </Stack>
      <Grid container>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Name
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.name ? defaultValues.name : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Phone
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.phone ? defaultValues.phone : ''}
            </Typography>
          </Grid>

        <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Fax
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.fax ? defaultValues.fax : ''}
            </Typography>
          </Grid>

        <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Email
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.email ? defaultValues.email : ''}
            </Typography>
          </Grid>

        <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Website
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.website ? defaultValues.website : ''}
            </Typography>
          </Grid>

        <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Street
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.street ? defaultValues.street : ''}
            </Typography>
          </Grid>

        <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Suburb
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.suburb ? defaultValues.suburb : ''}
            </Typography>
          </Grid>

         <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              City
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.city ? defaultValues.city : ''}
            </Typography>
          </Grid>

        <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Region
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.region ? defaultValues.region : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Post Code
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.postcode ? defaultValues.postcode : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Country
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.country ? defaultValues.country : ''}
            </Typography>
          </Grid>

          {(defaultValues.lat || defaultValues.primaryTechnicalContact)&& <Grid container>

            {defaultValues.lat && <Grid item xs={12} sm={6} sx={{ pt:2 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Latitude
            </Typography>

            <Typography variant="body2">
            {defaultValues.lat ? defaultValues.lat : ''}
            </Typography>

            </Grid>}

            {defaultValues.long && <Grid item xs={12} sm={6} sx={{ pt:2 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Longitude
            </Typography>

            <Typography variant="body2">
            {defaultValues.long ? defaultValues.long : ''}
            </Typography>

            </Grid>}


            </Grid>}

          {(defaultValues.primaryBillingContact || defaultValues.primaryTechnicalContact)&& <Grid container>

            {defaultValues.primaryBillingContact && <Grid item xs={12} sm={6} sx={{ pt:2 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Primary Billing Contact
            </Typography>

            <Typography variant="body2">
            {defaultValues.primaryBillingContact?.firstName ? defaultValues.primaryBillingContact.firstName : ''} {defaultValues.primaryBillingContact?.lastName ? defaultValues.primaryBillingContact.lastName : ''}
            </Typography>

            </Grid>}

            {defaultValues.primaryTechnicalContact && <Grid item xs={12} sm={6} sx={{ pt:2 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Primary Technical Contact
            </Typography>

            <Typography variant="body2">
            {defaultValues.primaryTechnicalContact?.firstName ? defaultValues.primaryTechnicalContact.firstName : ''}  {defaultValues.primaryTechnicalContact?.lastName ? defaultValues.primaryTechnicalContact.lastName : ''}
            </Typography>

            </Grid>}


          </Grid>}

          <Grid container spacing={0} sx={{ mb:-3,  pt:4}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                created by: {defaultValues.createdByFname} {defaultValues.createdByLname}, {fDate(defaultValues.createdAt)}, {defaultValues.createdIP}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              updated by: {defaultValues.updatedByFname} {defaultValues.updatedByLname}, {fDate(defaultValues.updatedAt)}, {defaultValues.updatedIP}
            </Typography>
            </Grid>
          </Grid>
        <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content="Are you sure want to delete?"
            action={
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            }
          />

      </Grid>
    </Grid>
  );
}
