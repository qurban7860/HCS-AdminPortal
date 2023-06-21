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
RepairHistoryViewForm.propTypes = {
  currentRepairHistory: PropTypes.object,
};

export default function RepairHistoryViewForm({ currentSite = null }) {

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
    try{
      await dispatch(deleteSite(customer._id, currentSite._id));
      handleCloseConfirm();
      dispatch(getSites(customer._id));
      // dispatch(getContacts());
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar("Repair history delete failed!",{ variant: `error` })
      console.log("Error:", err);
    }
  };

  const  handleEdit = async () => {
    await dispatch(getSite(customer._id, currentSite._id));
    dispatch(setEditFormVisibility(true));
  };


  const defaultValues = useMemo(
    () => (
      {
        id: currentSite ? currentSite._id : site?._id || '',
        name: currentSite ? currentSite.name : site?.name || '',
        customer: currentSite ? currentSite.name : site?.tradingName || '',
        billingSite: currentSite ? currentSite._id : site?.accountManager || '',
        phone: currentSite ? currentSite.phone : site?.phone || '',
        email: currentSite ? currentSite.email : site?.email || '',
        fax: currentSite ? currentSite.fax : site?.fax || '',
        website: currentSite ? currentSite.website : site?.website || '',

        street: currentSite ? currentSite.address?.street : site?.address.street || '',
        suburb: currentSite ? currentSite.address?.suburb : site?.address.suburb || '',
        city: currentSite ? currentSite.address?.city : site?.address.city || '',
        region: currentSite ? currentSite.address?.region : site?.address.region || '',
        country: currentSite ? currentSite.address?.country : site?.address.country || '',
        createdAt:                currentSite?.createdAt || "",
        createdByFullName:           currentSite?.createdBy?.name || "",
        createdIP:                currentSite?.createdIP || "",
        updatedAt:                currentSite?.updatedAt || "",
        updatedByFullName:           currentSite?.updatedBy?.firstNsame || "",
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
            updatedByFname
updatedByFname         <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
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
              Country
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.country ? defaultValues.country : ''}
            </Typography>
          </Grid>

          <Grid container spacing={0} sx={{ mb:-3,  pt:4}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                created by: {defaultValues.createdByFullName} {defaultValues.createdByLname}, {fDateTime(defaultValues.createdAt)}, {defaultValues.createdIP}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              updated by: {defaultValues.updatedByFullName} {defaultValues.updatedByLname}, {fDateTime(defaultValues.updatedAt)}, {defaultValues.updatedIP}
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
