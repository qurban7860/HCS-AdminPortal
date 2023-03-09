import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getLicense, getLicenses, setLicenseEditFormVisibility } from '../../../redux/slices/license';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';

import LicenseEditForm from './LicenseEditForm';

import Iconify from '../../../components/iconify/Iconify';




// ----------------------------------------------------------------------


LicenseViewForm.propTypes = {
  currentSupplier: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function LicenseViewForm({ currentLicense = null }) {

  // const { suppliers } = useSelector((state) => state.supplier);

  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    dispatch(setLicenseEditFormVisibility(true));
    navigate(PATH_MACHINE.license.Llcenseedit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { license } = useSelector((state) => state.license);
  const { id } = useParams();
  const license = licenses;

  // const supplier = suppliers?.find((supp)=>supp?._id === id);
  // console.log(suppliers, "muzna")
  const dispatch = useDispatch()
  useLayoutEffect(() => {
    if(id != null){
      dispatch(getLicense(id));
    }
  }, [dispatch, id]);

  // const  handleEdit = async () => {
  //   await dispatch(getSuppliers(currentSupplier._id));
  //   // dispatch(setEditFormVisibility(true));
  //   console.log(currentSupplier) 
  // };

  const defaultValues = useMemo(
    () => (
      {
        license:license?.license|| 'N/A',
        version:license?.version|| 'N/A',
        type:license?.type|| 'N/A',
        D_name:license?.D_name|| 'N/A',
        device_G:license?.device_G|| 'N/A',
        production:license?.production|| 'N/A',
        waste:license?.waste|| 'N/A',
        contactName:license?.contactName || 'N/A',
        contactTitle: license?.contactTitle || 'N/A',
        phone: license?.phone || 'N/A',
        email: license?.email || 'N/A',
        website: license?.website || 'N/A',
        street: license?.address?.street || 'N/A',
        suburb: license?.address?.suburb || 'N/A',
        city: license?.address?.city || 'N/A',
        region: license?.address?.region || 'N/A',
        country: license?.address?.country || 'N/A',
        createdAt: license?.createdAt || '',
        updatedAt: license?.updatedAt || '',
        
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLicense, license]
    );
    
    // console.log(supplier,"Testing",defaultValues)

  return (
    <Card sx={{ px: 5 }}>
      <Stack alignItems="flex-end" sx={{ mt: 2, mb: -4 }}>
        <Button
          onClick={() => { 
              toggleEdit(); 
          }}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>

      </Stack>
      <Grid container>

        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            License Key
          </Typography>

          <Typography variant="body2">{defaultValues.license ? defaultValues.license : 'N/A'}</Typography>

        </Grid>
        // License Detail
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Version
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.contactName : 'N/A'}</Typography>

        </Grid>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Type
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.contactName : 'N/A'}</Typography>

        </Grid>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Device Name
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.contactName : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Device GUID
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.contactName : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Production
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.contactName : 'N/A'}</Typography>

        </Grid>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Waste
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.contactName : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
             Updated At
            </Typography>

            <Typography variant="body2">{fDate(defaultValues.updatedAt)}</Typography>
            
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Contact Name
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.contactName : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Contact Title
          </Typography>

          <Typography variant="body2">{defaultValues.fax ? defaultValues.contactTitle : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Phone
          </Typography>

          <Typography variant="body2">{defaultValues.email ? defaultValues.phone : 'N/A'}</Typography>

        </Grid> 

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Email
          </Typography>

          <Typography variant="body2">{defaultValues.email ? defaultValues.email : 'N/A'}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Website
          </Typography>

          <Typography variant="body2">{defaultValues.website ? defaultValues.website : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Street
          </Typography>

          <Typography variant="body2">{defaultValues.street ? defaultValues.street : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Suburb
          </Typography>

          <Typography variant="body2">{defaultValues.suburb ? defaultValues.suburb : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            City
          </Typography>

          <Typography variant="body2">{defaultValues.city ? defaultValues.city : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Region
          </Typography>

          <Typography variant="body2">{defaultValues.region ? defaultValues.region : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Country
          </Typography>

          <Typography variant="body2">{defaultValues.country ? defaultValues.country : 'N/A'}</Typography>

        </Grid>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
             Created At
            </Typography>

            <Typography variant="body2">{fDate(defaultValues.createdAt)}</Typography>
            
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
             Updated At
            </Typography>

            <Typography variant="body2">{fDate(defaultValues.updatedAt)}</Typography>
            
        </Grid>

      </Grid>
    </Card>
  );
}
