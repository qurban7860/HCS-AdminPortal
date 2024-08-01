import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import {  
  sendEmail,
  setCompleteDialog,
  updateMachineServiceRecord,
} from '../../redux/slices/products/machineServiceRecord';
import { MachineServiceRecordPDF } from '../../pages/machine/serviceRecords/MachineServiceRecordPDF';
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
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = methods;

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
      await enqueueSnackbar("Email Sent Successfully");  
      await handleCloseDialog();
      await reset();
    } catch (err) {
      enqueueSnackbar("Failed Email Send", { variant: 'error' });
      console.error(err.message);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={completeDialog} onClose={handleCloseDialog}>
      <DialogTitle variant='h4' sx={{pb:1, pt:2}}>
          {`Are you sure you want to ${recordStatus?.label}?`}
          <Typography variant='body2'>Email will be sent to your reporting contact?</Typography>
      </DialogTitle>
      <Divider orientation="horizontal" flexItem />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
          {!isLoading?
            <DialogContent dividers sx={{pt:3}}>
              <RHFAutocomplete 
                multiple
                disableCloseOnSelect
                filterSelectedOptions
                label="Contacts"
                name="contacts"
                options={activeSpContacts}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
              />
            </DialogContent>
          :<SkeletonLine />
          }
          <DialogActions>
            <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
            <LoadingButton type='submit' disabled={isLoading} loading={isSubmitting} variant='contained'>{recordStatus?.label}</LoadingButton>
          </DialogActions>
        </FormProvider>
    </Dialog>
  );
}

export default DialogServiceRecordComplete;
