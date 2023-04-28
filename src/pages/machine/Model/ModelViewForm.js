import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button, Switch } from '@mui/material';
// redux
import { setMachinemodelsEditFormVisibility, updateMachineModel } from '../../../redux/slices/products/model';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';
import ModelEditForm from './ModelEditForm';

import Iconify from '../../../components/iconify/Iconify';
import FormProvider, {
    RHFSelect,
    RHFAutocomplete,
    RHFTextField,
    RHFSwitch,
  } from '../../../components/hook-form';
  import ViewFormAudit from '../../components/ViewFormAudit';



// ----------------------------------------------------------------------


ModelViewForm.propTypes = {
  currentMachinemodel: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ModelViewForm({ currentMachinemodel = null }) {


  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    dispatch(setMachinemodelsEditFormVisibility(true));
    navigate(PATH_MACHINE.machineModel.modeledit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { machinemodel } = useSelector((state) => state.machinemodel);

  const { id } = useParams();

  const dispatch = useDispatch()


  const defaultValues = useMemo(
    () => (
      {
        name:machinemodel?.name || '',
        description:machinemodel?.description || '',
        displayOrderNo: machinemodel?.displayOrderNo || '',
        category: machinemodel?.category || '',
        isActive: machinemodel?.isActive,
        createdByFullname:        machinemodel?.createdBy?.name || "",
        createdAt:                machinemodel?.createdAt || "",
        createdIP:                machinemodel?.createdIP || "",
        updatedByFullname:        machinemodel?.updatedBy?.name || "",
        updatedAt:                machinemodel?.updatedAt || "",
        updatedIP:                machinemodel?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMachinemodel, machinemodel]
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

          <Typography variant="body2">{defaultValues.name ? defaultValues.name : ''}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Description
          </Typography>

          <Typography variant="body2">{defaultValues.description ? defaultValues.description : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Category Name
            </Typography>

            <Typography variant="body2">{defaultValues?.category?.name || " "}</Typography>

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
