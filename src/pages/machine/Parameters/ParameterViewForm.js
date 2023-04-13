import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getTechparam } from '../../../redux/slices/products/machineTechParam';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../components/ViewFormAudit';

// Iconify

import { fDate } from '../../../utils/formatTime';
import ParameterEditForm from './ParameterEditForm';

import Iconify from '../../../components/iconify/Iconify';
import FormProvider, {
    RHFSelect,
    RHFAutocomplete,
    RHFTextField,
    RHFSwitch,
  } from '../../../components/hook-form';



// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export default function ParameterViewForm() {


  const [editFlag, setEditFlag] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const dispatch = useDispatch()
  const { techparam } = useSelector((state) => state.techparam);
  const navigate = useNavigate();

  const toggleEdit = () => {
    navigate(PATH_MACHINE.parameters.parameteredit(true));
  }

useLayoutEffect(()=>{
    dispatch(getTechparam(techparam._id));
},[dispatch,techparam._id])


  

  const defaultValues = useMemo(
    () => (
      {
        name:techparam?.name || '',
        code: techparam?.code || '',
        description:techparam?.description || '',
        category: techparam?.category?.name || '', 
        isActive: techparam?.isActive,
        createdByFullname:        techparam?.createdBy?.name || "",
        createdAt:                techparam?.createdAt || "",
        createdIP:                techparam?.createdIP || "",
        updatedByFullname:        techparam?.updatedBy?.name || "",
        updatedAt:                techparam?.updatedAt || "",
        updatedIP:                techparam?.updatedIP || "",
       
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ techparam]
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
          <Grid item xs={12} sm={6} sx={{ pt:2 }}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Name
              </Typography>
              <Typography variant="body2">{defaultValues.name ? defaultValues.name : ''}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ pt:2 }}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Code
              </Typography>
              <Typography variant="body2">{defaultValues.code ? defaultValues.code : ''}</Typography>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ pt:2 }}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Description
              </Typography>
              <Typography variant="body2">{defaultValues.description ? defaultValues.description : ''}</Typography>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ pt:2 }}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Tech Param Category Name
              </Typography>
              <Typography variant="body2">{defaultValues?.category || ""}</Typography>
          </Grid>
      </Grid>

        <Grid item xs={12} sm={12} >
         <Switch sx={{mb:1}} checked = { defaultValues.isActive } disabled  />
        </Grid>

        <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
    </Card>
  );
}
