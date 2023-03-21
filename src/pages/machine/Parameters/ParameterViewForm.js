import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getTechparam, updateTechparam } from '../../../redux/slices/products/parameters';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

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


StatusViewForm.propTypes = {
  currentTechparam: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function StatusViewForm({ currentTechparam = null }) {


  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    dispatch(updateTechparam(true));
    navigate(PATH_MACHINE.parameters.parameteredit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { techparam } = useSelector((state) => state.techparam);

  const { id } = useParams();

  const dispatch = useDispatch()
  

  const defaultValues = useMemo(
    () => (
      {
        name:techparam?.name || '',
        code: techparam?.code || '',
        description:techparam?.description || '',
        createdAt: techparam?.createdAt || '',
        updatedAt: techparam?.updatedAt || '',
        category: techparam?.category.name || '', 
       
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTechparam, techparam]
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
      
      <Grid container>
          <Grid container spacing={0} sx={{  mb: 1,  pt:4}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                created by: {defaultValues.createdByFname} {defaultValues.createdByLname} {fDate(defaultValues.createdAt)}, {defaultValues.createdIP}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                updated by: {defaultValues.updatedByFname} {defaultValues.updatedByLname}, {fDate(defaultValues.updatedAt)}, {defaultValues.updatedIP}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
    </Card>
  );
}
