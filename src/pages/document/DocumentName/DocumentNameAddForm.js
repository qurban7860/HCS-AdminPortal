import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField , Container} from '@mui/material';
// ROUTES
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// slice
import { addDocumentName, setDocumentNameFormVisibility , setDocumentNameEditFormVisibility , getDocumentNames  } from '../../../redux/slices/document/documentName';
import { addMachineDocument, setMachineDocumentFormVisibility, setMachineDocumentEditFormVisibility  } from '../../../redux/slices/document/machineDocument';
import { setCustomerDocumentFormVisibility, setCustomerDocumentEditFormVisibility } from '../../../redux/slices/document/customerDocument';

// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import FormProvider, {RHFTextField,RHFSwitch} from '../../../components/hook-form';
import FormHeading from '../../components/FormHeading';
import AddFormButtons from '../../components/AddFormButtons';
import Cover from '../../components/Cover'
// ----------------------------------------------------------------------
DocumentNameAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentNameAddForm({currentDocument}) {
  const { documentName, documentNames } = useSelector((state) => state.documentName);
  const { customerDocumentEdit } = useSelector((state) => state.customerDocument);
  const { machineDocumentEdit } = useSelector((state) => state.machineDocument);

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
 // a note can be archived.  
  const AddDocumentNameSchema = Yup.object().shape({
    name: Yup.string().min(2).required("Name Field is required!"),
    description: Yup.string().max(10000),
    isActive : Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddDocumentNameSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const onSubmit = async (data) => {
      try{
        await dispatch(addDocumentName(data));
        // dispatch(getDocumentNames())
        dispatch(setDocumentNameFormVisibility(false))
        if( machineDocumentEdit || customerDocumentEdit){
          dispatch(setMachineDocumentEditFormVisibility(true))
          dispatch(setCustomerDocumentEditFormVisibility(true))
        }else{
          dispatch(setMachineDocumentFormVisibility(true))
          dispatch(setCustomerDocumentFormVisibility(true))
        }
        reset();
      } catch(error){
        enqueueSnackbar('Document Save failed!');
        console.error(error);
      }
  };

  const toggleCancel = () => 
  {
    // navigate(PATH_DOCUMENT.documentName.list);
    dispatch(setDocumentNameFormVisibility(false))
    dispatch(setMachineDocumentFormVisibility(true))
    dispatch(setCustomerDocumentFormVisibility(true))
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }} >
            <Stack spacing={2}>
              <FormHeading heading='New Document Name'/>
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="description" label="Description" minRows={8} multiline />
              <RHFSwitch name="isActive" labelPlacement="start" label={ <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } />
            </Stack>  
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
