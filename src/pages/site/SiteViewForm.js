import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getSite, setEditFormVisibility } from '../../redux/slices/customer/site';

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
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSite, site]
  );

  return (
    <Card sx={{ px: 5 }}>
      <Stack alignItems="flex-end" sx={{ mt: 2, mb: -4 }}>
        <Button
          onClick={() => handleEdit()}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>

      </Stack>
      <Grid container>


        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Name
          </Typography>

          <Typography variant="body2">{defaultValues.name ? defaultValues.name : ''}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Phone
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.phone : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Fax
          </Typography>

          <Typography variant="body2">{defaultValues.fax ? defaultValues.fax : ''}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Email
          </Typography>

          <Typography variant="body2">{defaultValues.email ? defaultValues.email : ''}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Website
          </Typography>

          <Typography variant="body2">{defaultValues.website ? defaultValues.website : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Street
          </Typography>

          <Typography variant="body2">{defaultValues.street ? defaultValues.street : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Suburb
          </Typography>

          <Typography variant="body2">{defaultValues.suburb ? defaultValues.suburb : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            City
          </Typography>

          <Typography variant="body2">{defaultValues.city ? defaultValues.city : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Region
          </Typography>

          <Typography variant="body2">{defaultValues.region ? defaultValues.region : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Country
          </Typography>

          <Typography variant="body2">{defaultValues.country ? defaultValues.country : ''}</Typography>

        </Grid>

      </Grid>
    </Card>
  );
}
