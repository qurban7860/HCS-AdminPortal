import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { Box, Grid, Dialog, DialogContent,  Divider, Stepper, Step, TextField, Button,  StepLabel, StepContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
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
  const [ updateConnectedMachines, setUpdateConnectedMachines ] = useState(false);
  const [ dateLabel, setDateLabel ] = useState('Date');

  useEffect(()=> {
    dispatch(getActiveMachineStatuses(cancelTokenSource))
    return ()=>{  
      // cancelTokenSource.cancel()
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
      date: new Date(),
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
        data.updateConnectedMachines = updateConnectedMachines;
        const response = await dispatch(changeMachineStatus(machine?._id, data));
        enqueueSnackbar(Snacks.machineStatusSuccess);
        dispatch(getMachine(machine?._id));
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
                  getOptionDisabled={(option) =>
                    option._id === machine?.status?._id
                  }

                  onChange={(option, newValue)=>
                    { 
                      setValue('status',newValue);

                      if(newValue?.name?.toUpperCase()==='ASSEMBLY'){
                        setDateLabel('Manufacture Date')
                      }else if(newValue?.name?.toUpperCase()==='FREIGHT'){
                        setDateLabel('Shipping Date')
                      }else if(newValue?.name?.toUpperCase()==='COMMISSIONED'){
                        setDateLabel('Installation Date')
                      }else if(newValue?.name?.toUpperCase()==='DECOMMISSIONED'){
                        setDateLabel('Decommissioned Date')
                      }else {
                        setDateLabel('Date')
                      }
                    } 

                  }
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                />
                <RHFDatePicker inputFormat='dd/MM/yyyy' name="date" label={`${dateLabel} *`} />
            </Box> 
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="space-between">
          <Grid item>
            <FormControlLabel control={<Checkbox checked={updateConnectedMachines} 
              onChange={(event, value)=>setUpdateConnectedMachines(value)} /> } label="Update Connected Machines" />
          </Grid>
          <Grid item columnGap={1} sx={{display:'flex'}}>
            <Button variant='outlined' onClick={handleMachineDialog}>Cancel</Button>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>Save</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

export default MachineStatusChangeDialog;
