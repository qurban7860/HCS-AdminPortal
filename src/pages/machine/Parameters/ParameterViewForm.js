import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getTechparam, deleteTechparams } from '../../../redux/slices/products/machineTechParam';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';

import Iconify from '../../../components/iconify/Iconify';
import FormProvider, {
    RHFSelect,
    RHFAutocomplete,
    RHFTextField,
    RHFSwitch,
  } from '../../../components/hook-form';

  import ViewFormAudit from '../../components/ViewFormAudit';
  import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
  import ViewFormField from '../../components/ViewFormField';
  import ViewFormSWitch from '../../components/ViewFormSwitch';


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
    navigate(PATH_MACHINE.machines.settings.machineParameters.edit(techparam._id));
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
        createdByFullName:        techparam?.createdBy?.name || "",
        createdAt:                techparam?.createdAt || "",
        createdIP:                techparam?.createdIP || "",
        updatedByFullName:        techparam?.updatedBy?.name || "",
        updatedAt:                techparam?.updatedAt || "",
        updatedIP:                techparam?.updatedIP || "",
       
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ techparam]
    );

    const onDelete = () => {
      try{
      dispatch(deleteTechparams(id));
      navigate(PATH_MACHINE.machines.settings.machineParameters.list);
      } catch (err) {
        // if(err.Message){
        //   enqueueSnackbar(err.Message,{ variant: `error` })
        // }else if(err.message){
        //   enqueueSnackbar(err.message,{ variant: `error` })
        // }else{
        //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
        // }
        enqueueSnackbar("Parameter value delete failed!",{ variant: `error` })
        console.log("Error:", err);
      }
    }

  return (
    <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
      <Grid container>
          <ViewFormField sm={12}  isActive={defaultValues.isActive}/>
          <ViewFormField sm={6}   heading='Category Name'        param={defaultValues?.category}/>
          <ViewFormField sm={6}   heading='Name'        param={defaultValues?.name} />
          <ViewFormField sm={6}   heading='Code'        param={defaultValues?.code}/>
          <ViewFormField sm={12}   heading='Description'        param={defaultValues?.description}/>
        {/* <ViewFormSWitch  isActive={defaultValues.isActive} /> */}
      </Grid>

        <Grid item container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
    </Card>
  );
}
