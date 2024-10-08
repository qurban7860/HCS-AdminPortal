import PropTypes from 'prop-types';
import { useMemo } from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import {  
  getMachineServiceRecord,
  sendEmail,
  setSendEmailDialog,
} from '../../redux/slices/products/machineServiceRecord';
import { MachineServiceRecordPDF } from '../../pages/machine/serviceRecords/MachineServiceRecordPDF';
import FormProvider from '../hook-form/FormProvider';

import { RHFTextField } from '../hook-form';

SendEmailDialog.propTypes = {
  fileName: PropTypes.string,
};

function SendEmailDialog({ fileName }) {
    
  const dispatch = useDispatch();
  const { machineServiceRecord, machineServiceRecordCheckItems, sendEmailDialog } = useSelector((state) => state.machineServiceRecord);
  const handleCloseDialog = ()=>{ 
    dispatch(setSendEmailDialog(false)) 
    reset();
  }
  
  const { enqueueSnackbar } = useSnackbar();
  
  const defaultValues = useMemo(
    () => ({
      email: '',
      pdf: null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const SendEmailSchema = Yup.object().shape({
    email: Yup.string().nullable().email("Invalid email address").required("Email is required"),
  });


  const methods = useForm({
    resolver: yupResolver(SendEmailSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  
  const onSubmit = async (data) => {    
    try {
      const PDFBlob = await ReactPDF.pdf(<MachineServiceRecordPDF machineServiceRecord={machineServiceRecord} machineServiceRecordCheckItems={machineServiceRecordCheckItems}/>).toBlob();
      const file = new File([PDFBlob], fileName, { type: PDFBlob.type });
      data.id = machineServiceRecord?._id;
      data.pdf = file; 
      await dispatch(sendEmail(machineServiceRecord?.machine?._id, data));
      enqueueSnackbar("Email Sent Successfully");  
      reset();
      // dispatch(getMachineServiceRecord(machineServiceRecord?.machine?._id, machineServiceRecord?._id))
      handleCloseDialog();
    } catch (err) {
      enqueueSnackbar("Failed Email Send", { variant: 'error' });
      console.error(err.message);
    }
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={sendEmailDialog} onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Send Email</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
        <DialogContent dividers sx={{pt:3}}><RHFTextField name="email" label="Email"/></DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton loading={isSubmitting} type='submit' variant='contained'>Send</LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default SendEmailDialog;
