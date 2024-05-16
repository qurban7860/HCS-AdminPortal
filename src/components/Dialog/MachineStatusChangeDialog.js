import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { Box, Grid, Dialog, DialogContent,  Divider, Stepper, Step, TextField, Button,  StepLabel, StepContent, DialogActions } from '@mui/material';
import { PATH_MACHINE } from '../../routes/paths';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import { changeMachineStatus, getMachine, setMachineStatusChangeDialog } from '../../redux/slices/products/machine';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { useSnackbar } from '../snackbar';
import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFDatePicker } from '../hook-form';
import { machineTransferSchema } from '../../pages/schemas/machine'
import { Snacks } from '../../constants/machine-constants';
import { fDate } from '../../utils/formatTime';
import FormLabel from '../DocumentForms/FormLabel';
import { future5yearDate, pastDate} from '../../pages/machine/util';

function MachineStatusChangeDialog() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();

  const { machine, machineStatusChangeDialog } = useSelector((state) => state.machine);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);

  useEffect(()=> {
    dispatch(getActiveMachineStatuses(cancelTokenSource))
    return ()=>{  
      // cancelTokenSource.cancel()
      dispatch(getMachine(machine?._id))
      dispatch(resetActiveMachineStatuses())
      dispatch(setMachineStatusChangeDialog(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch ])


  const statusChangeSchema = Yup.object().shape({
    status: Yup.object().shape({name: Yup.string()}).nullable().required("Status is required"),
    date: Yup.date().typeError('Date Should be Valid').max(future5yearDate,`Date field must be at earlier than ${fDate(future5yearDate)}`)
    .min(pastDate,`Date field must be at after than ${fDate(pastDate)}`).required('Date is required').nullable().label('Date'),
  });

  const methods = useForm({
    resolver: yupResolver(statusChangeSchema),
    defaultValues: {
      date: null,
      status: null,
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleMachineDialog = async()=>{ 
    await dispatch(setMachineStatusChangeDialog(false))
    reset();
  }

  const onSubmit = async (data) => {
      try {
        const response = await dispatch(changeMachineStatus(machine?._id, data));
        enqueueSnackbar(Snacks.machineStatusSuccess);
        handleMachineDialog()
        reset();
      } catch (error) {
        enqueueSnackbar( Snacks.machineStatusFailed, { variant: `error` });
        console.error(error);
      }
  };

  return (
    <Dialog
      disableEnforceFocus
      fullWidth
      maxWidth='sm'
      open={ machineStatusChangeDialog }
      onClose={ handleMachineDialog }
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogLabel content="Change Machine Status" onClick={ handleMachineDialog } />
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ p:2 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns='repeat(1, 1fr)'>
                <RHFAutocomplete
                  name="status"
                  label="Status*"
                  options={activeMachineStatuses.filter((st) => st?.slug !== 'intransfer')}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                />
                <RHFDatePicker inputFormat='dd/MM/yyyy' name="date" label="Date*" />
            </Box> 
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleMachineDialog}>Cancel</Button>
        <Button variant='contained' onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MachineStatusChangeDialog;
