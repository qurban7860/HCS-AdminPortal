import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { updateSetting, getSettings, setSettingValueDialog } from '../../redux/slices/products/machineSetting';
import FormProvider from '../hook-form/FormProvider';
import { RHFTextField } from '../hook-form';

function MachineSettingValueDialog() {
  
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { machineId } = useParams()
  const { setting, settingValueDialog } = useSelector((state) => state.machineSetting);

  const handleCloseDialog = ()=>{ 
    dispatch(setSettingValueDialog(false));
    reset();
  }
  
  const defaultValues = useMemo(
    () => ({
      techParamValue: setting?.techParamValue || '',
    }),
    [ setting ]
  );
  
  const machineSettingSchema = Yup.object().shape({
    techParamValue: Yup.string().max(200).label('Technical Parameter Value').required("Value is required"),
  });
  
  
  const methods = useForm({
    resolver: yupResolver(machineSettingSchema),
    defaultValues,
  });
  
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset({
      techParamValue: setting?.techParamValue || '',
    });
  }, [ setting, reset]);

  const onSubmit = async (data) => {    
    try {
      await dispatch( updateSetting( machineId, setting?._id, data));
      await dispatch(getSettings( machineId ));
      await handleCloseDialog();
      await reset();
      enqueueSnackbar("Value updated successfully");  
    } catch (err) {
      enqueueSnackbar(`Failed: ${err?.message}`, { variant: 'error' });
      console.error(err.message);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={ settingValueDialog } onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Update Parameter Value</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
        <DialogContent dividers sx={{pt:3}}>
          <RHFTextField name="techParamValue" label="Technical Parameter Value*" />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton loading={isSubmitting} type='submit' variant='contained'>Update</LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default MachineSettingValueDialog;
