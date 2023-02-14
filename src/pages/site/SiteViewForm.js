import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getSite, setEditFormVisibility } from '../../redux/slices/site';

// paths
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import SiteEditForm from './SiteEditForm';
// Iconify
import Iconify from '../../components/iconify';



// ----------------------------------------------------------------------


SiteViewForm.propTypes = {
  currentSite: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function SiteViewForm({ currentSite = null }) {

  const { site } = useSelector((state) => state.site);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const  handleEdit = async () => {
    await dispatch(getSite(currentSite._id));
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

        street: currentSite ? currentSite.address.street : site?.address.street || 'N/A',
        suburb: currentSite ? currentSite.address.suburb : site?.address.suburb || 'N/A',
        city: currentSite ? currentSite.address.city : site?.address.city || 'N/A',
        region: currentSite ? currentSite.address.region : site?.address.region || 'N/A',
        country: currentSite ? currentSite.address.country : site?.address.country || 'N/A',
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [site]
  );

  console.log(defaultValues);




  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <Stack alignItems="flex-end" sx={{ mt: 2 }}>
        <Button
          onClick={() => handleEdit()}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>

      </Stack>
      <Grid container>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Name
          </Typography>

          <Typography variant="body2">{defaultValues.name}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Phone
          </Typography>

          <Typography variant="body2">{defaultValues.phone}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Email
          </Typography>

          <Typography variant="body2">{defaultValues.email}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Fax
          </Typography>

          <Typography variant="body2">{defaultValues.fax}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Website
          </Typography>

          <Typography variant="body2">{defaultValues.website}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Street
          </Typography>

          <Typography variant="body2">{defaultValues.street}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Suburb
          </Typography>

          <Typography variant="body2">{defaultValues.suburb}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            City
          </Typography>

          <Typography variant="body2">{defaultValues.city}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Region
          </Typography>

          <Typography variant="body2">{defaultValues.region}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Country
          </Typography>

          <Typography variant="body2">{defaultValues.country}</Typography>

        </Grid>

      </Grid>
    </Card>
  );
}
