import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Switch , Card, Grid, Stack, Typography, Button } from '@mui/material';
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
import ViewFormAudit from '../../components/ViewFormAudit';

// ----------------------------------------------------------------------

SupplierViewForm.propTypes = {
  currentSupplier: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function SupplierViewForm({ currentSupplier = null }) {

  // const { suppliers } = useSelector((state) => state.supplier);

  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    // dispatch(setSupplierEditFormVisibility(true));
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
        name:supplier?.name || '',
        contactName:supplier?.contactName || '',
        contactTitle: supplier?.contactTitle || '',
        phone: supplier?.phone || '',
        email: supplier?.email || '',
        fax: supplier?.fax || '',
        website: supplier?.website || '',
        street: supplier?.address?.street || '',
        suburb: supplier?.address?.suburb || '',
        city: supplier?.address?.city || '',
        region: supplier?.address?.region || '',
        country: supplier?.address?.country || '',
        isActive: supplier.isActive ,
        createdByFullname:        supplier?.createdBy?.name || "",
        createdAt:                supplier?.createdAt || "",
        createdIP:                supplier?.createdIP || "",
        updatedByFullname:        supplier?.updatedBy?.name || "",
        updatedAt:                supplier?.updatedAt || "",
        updatedIP:                supplier?.updatedIP || "",
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

          <Typography variant="body2">{defaultValues.name ? defaultValues.name : ""}</Typography>

        </Grid>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Contact Name
          </Typography>

          <Typography variant="body2">{defaultValues.contactName ? defaultValues.contactName : ""}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Contact Title
          </Typography>

          <Typography variant="body2">{defaultValues.contactTitle ? defaultValues.contactTitle : ""}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Phone
          </Typography>

          <Typography variant="body2">{defaultValues.phone ? defaultValues.phone : ""}</Typography>

        </Grid> 

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Email
          </Typography>

          <Typography variant="body2">{defaultValues.email ? defaultValues.email : ""}</Typography>

        </Grid>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Fax
          </Typography>

          <Typography variant="body2">{defaultValues.fax ? defaultValues.fax : ""}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Website
          </Typography>

          <Typography variant="body2">{defaultValues.website ? defaultValues.website : ""}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Street
          </Typography>

          <Typography variant="body2">{defaultValues.street }</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Suburb
          </Typography>

          <Typography variant="body2">{defaultValues.suburb }</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            City
          </Typography>

          <Typography variant="body2">{defaultValues.city }</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Region
          </Typography>

          <Typography variant="body2">{defaultValues.region}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Country
          </Typography>
          <Typography variant="body2">{defaultValues.country}</Typography>
        </Grid>

        <Grid item xs={12} sm={12} >
          <Switch sx={{mb:1}} checked = { defaultValues.isActive } disabled  />
        </Grid>

        <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>

      </Grid>
    </Card>
  );
}
