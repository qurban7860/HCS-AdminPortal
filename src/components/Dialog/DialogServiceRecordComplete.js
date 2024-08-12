import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions, TextField, Typography, Alert, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import {  
  getMachineServiceRecord,
  sendEmail,
  setCompleteDialog,
  updateMachineServiceRecord,
} from '../../redux/slices/products/machineServiceRecord';
import FormProvider from '../hook-form/FormProvider';
import { RHFAutocomplete, RHFTextField } from '../hook-form';
import { useAuthContext } from '../../auth/useAuthContext';
import SkeletonLine from '../skeleton/SkeletonLine';

DialogServiceRecordComplete.propTypes = {
  recordStatus: PropTypes.object
};

function DialogServiceRecordComplete({recordStatus}) {
  const dispatch = useDispatch();
  const { machineServiceRecord, completeDialog } = useSelector((state) => state.machineServiceRecord);
  const { activeContacts, activeSpContacts, isLoading } = useSelector((state) => state.contact);
  const { user } = useAuthContext();

  // const [recordStatus, setRecordStatus]= useState(null);
  // useEffect(() => {
  //   if(machineServiceRecord.status==="DRAFT"){
  //     setRecordStatus({label:'Complete', value:'SUBMITTED'});
  //   }else if(machineServiceRecord.status==="SUBMITTED"){
  //     setRecordStatus({label:'Approve', value:'APPROVED'});
  //   }
    
  // }, [machineServiceRecord]);
  
  const handleCloseDialog = ()=>{ 
    dispatch(setCompleteDialog(false));
    reset();
  }
  
  const { enqueueSnackbar } = useSnackbar();
  
  const defaultValues = {
    contacts: []
  };

  const CompleteServiceRecordSchema = Yup.object().shape({
    contacts: Yup.array().nullable().required()
  });

  const methods = useForm({
    resolver: yupResolver(CompleteServiceRecordSchema),
    defaultValues
  });

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = methods;

  const {contacts} =watch();

  useEffect(()=>{
    const userContact = activeSpContacts.find((spc)=> spc._id === user.contact);
    setValue('contacts',activeSpContacts.filter((spc)=> spc._id === userContact.reportingTo));
  },[setValue, user, activeSpContacts])
  
  const onSubmit = async (data) => {    
    try {

      const params = {
        emails:data?.contacts.map((ct)=> ct?.email) || [],
        status:recordStatus?.value || '',
        serviceId: machineServiceRecord?.serviceId || ''
      }
      
      await dispatch(updateMachineServiceRecord(machineServiceRecord?.machine?._id, machineServiceRecord?._id, params))
      await enqueueSnackbar(`Service Record ${recordStatus?.value==="APPROVED"?"Approved":"Completed"} Successfully!`);  
      await handleCloseDialog();
      await reset();
      await dispatch(getMachineServiceRecord(machineServiceRecord?.machine?._id, machineServiceRecord?._id));
    } catch (err) {
      enqueueSnackbar(`Failed ${recordStatus?.value==="APPROVED"?"Approving":"Completing"} Service Record `, { variant: 'error' });
      console.error(err.message);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={completeDialog} onClose={handleCloseDialog}>
      <DialogTitle variant='h4' sx={{pb:1, pt:2}}>
          {`Are you sure you want to ${recordStatus?.label?.toLowerCase()}?`}
      </DialogTitle>
      <Divider orientation="horizontal" flexItem />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
          <DialogContent dividers>
            <Stack spacing={2} pt={3}>
              {!isLoading?
                <RHFAutocomplete 
                multiple
                // disableCloseOnSelect
                filterSelectedOptions
                label="Notify Contacts"
                name="contacts"
                options={activeSpContacts}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                />
                :<SkeletonLine />
              }
              {contacts?.length>0 && <Alert severity="info" variant='filled'>Email will be sent to selected contacts?</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
            <LoadingButton type='submit' disabled={isLoading} loading={isSubmitting} variant='contained'>{recordStatus?.label}</LoadingButton>
          </DialogActions>
        </FormProvider>
    </Dialog>
  );
}

export default DialogServiceRecordComplete;
