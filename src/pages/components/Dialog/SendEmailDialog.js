import PropTypes from 'prop-types';
import { useMemo } from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Dialog, DialogContent, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import DialogLabel from './DialogLabel';
import {  
  sendEmail,
  setSendEmailDialog,
} from '../../../redux/slices/products/machineServiceRecord';
import { MyDocument } from '../../machine/ServiceRecordConfig/MyDocument';
import FormProvider from '../../../components/hook-form/FormProvider';

import { RHFTextField } from '../../../components/hook-form';

SendEmailDialog.propTypes = {
  machineServiceRecord: PropTypes.object
};

function SendEmailDialog({machineServiceRecord}) {
    
  const dispatch = useDispatch();
  const { sendEmailDialog } = useSelector((state) => state.machineServiceRecord);
  const handleCloseDialog = ()=>{ dispatch(setSendEmailDialog(false)) }
  const { enqueueSnackbar } = useSnackbar();
  
  const defaultValues = useMemo(
    () => ({
      email: null,
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
    const PDFBlob = await ReactPDF.pdf(<MyDocument machineServiceRecord={machineServiceRecord} />).toBlob();
    
    try {
      const fileName = `${machineServiceRecord?.serviceRecordConfig?.docTitle}.pdf`;
      data.id = machineServiceRecord?._id;
      data.pdf = blobToFile(PDFBlob, fileName);
      await dispatch(sendEmail(machineServiceRecord?.machine?._id, data))
      handleCloseDialog();
      reset();
      enqueueSnackbar("Email Sent Successfully");
    } catch (err) {
      enqueueSnackbar("Failed Email Send", { variant: 'error' });
      console.error(err.message);
    }
  }

  const blobToFile = (blob, fileName) => {
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  return (
    <Dialog
        maxWidth="md"
        open={sendEmailDialog}
        onClose={handleCloseDialog}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Send Email" onClick={handleCloseDialog}/>
        <DialogContent dividers>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
              <Grid container rowSpacing={1} columnSpacing={1} sx={{mt:3, display:'flex', justifyContent:'flex-end'}}>
                <RHFTextField name="email" label="Email"/>
                <Grid item>
                  <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
                </Grid>
                <Grid item>
                  <LoadingButton loading={isSubmitting} type='submit' variant='contained'>Send</LoadingButton>
                </Grid>
              </Grid>         
          </FormProvider>
        </DialogContent>
        
      </Dialog>
  );
}

export default SendEmailDialog;
