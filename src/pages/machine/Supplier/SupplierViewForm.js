import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getSupplier, getSuppliers, setSupplierEditFormVisibility } from '../../../redux/slices/products/supplier';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';

import SupplierEditForm from './SupplierEditForm';

import Iconify from '../../../components/iconify/Iconify';




// ----------------------------------------------------------------------


SupplierViewForm.propTypes = {
  currentSupplier: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function SupplierViewForm({ currentSupplier = null }) {

  // const { suppliers } = useSelector((state) => state.supplier);

  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    dispatch(setSupplierEditFormVisibility(true));
    navigate(PATH_MACHINE.supplier.supplieredit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { suppliers } = useSelector((state) => state.supplier);
  const { id } = useParams();
  const supplier = suppliers;

  // const supplier = suppliers?.find((supp)=>supp?._id === id);
  const dispatch = useDispatch()
  useLayoutEffect(() => {
    if(id != null){
      dispatch(getSupplier(id));
    }
  }, [dispatch, id]);

  // const  handleEdit = async () => {
  //   await dispatch(getSuppliers(currentSupplier._id));
  //   // dispatch(setEditFormVisibility(true));
  // };

  const defaultValues = useMemo(
    () => (
      {
        name:supplier?.name || 'N/A',
        contactName:supplier?.contactName || 'N/A',
        contactTitle: supplier?.contactTitle || 'N/A',
        phone: supplier?.phone || 'N/A',
        email: supplier?.email || 'N/A',
        fax: supplier?.fax || 'N/A',
        website: supplier?.website || 'N/A',
        street: supplier?.address?.street || 'N/A',
        suburb: supplier?.address?.suburb || 'N/A',
        city: supplier?.address?.city || 'N/A',
        region: supplier?.address?.region || 'N/A',
        country: supplier?.address?.country || 'N/A',
        createdAt: supplier?.createdAt || '',
        updatedAt: supplier?.updatedAt || '',
        
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSupplier, supplier]
    );
    

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
            Name
          </Typography>

          <Typography variant="body2">{defaultValues.name ? defaultValues.name : 'N/A'}</Typography>

        </Grid>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Contact Name
          </Typography>

          <Typography variant="body2">{defaultValues.contactName ? defaultValues.contactName : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Contact Title
          </Typography>

          <Typography variant="body2">{defaultValues.contactTitle ? defaultValues.contactTitle : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Phone
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.phone : 'N/A'}</Typography>

        </Grid> 

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Email
          </Typography>

          <Typography variant="body2">{defaultValues.email ? defaultValues.email : 'N/A'}</Typography>

        </Grid>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Fax
          </Typography>

          <Typography variant="body2">{defaultValues.fax ? defaultValues.fax : 'N/A'}</Typography>

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
        <Grid container spacing={0} sx={{ mb: 5}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                Created by: Naveed, {fDate(defaultValues.createdAt)}, 192.168.10.101
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Updated by: Naveed, {fDate(defaultValues.updatedAt)}, 192.168.10.101
            </Typography>
            </Grid>
        </Grid>

      </Grid>
    </Card>
  );
}
