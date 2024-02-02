import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { getDocumentHistory, setDocumentVersionEditDialogVisibility, updateDocumentVersionNo } from '../../redux/slices/document/document';
import FormProvider from '../hook-form/FormProvider';

import { RHFTextField } from '../hook-form';

function UpdateDocumentVersionDialog() {
    
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  
  const { documentHistory, documentVersionEditDialogVisibility } = useSelector((state) => state.document);

  const handleCloseDialog = ()=>{ 
    dispatch(setDocumentVersionEditDialogVisibility(false));
    reset();
  }

  const defaultValues = useMemo(
    () => ({
      updatedVersion: documentHistory?.documentVersions?.length > 0 ? documentHistory?.documentVersions[0]?.versionNo : '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const SendEmailSchema = Yup.object().shape({
    updatedVersion: Yup.string().required("Version is required"),
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
      await dispatch(updateDocumentVersionNo(documentHistory?._id, data));
      await dispatch(getDocumentHistory(documentHistory?._id))
      await handleCloseDialog();
      await reset();
      enqueueSnackbar("Version updated successfully");  
    } catch (err) {
      enqueueSnackbar(`Failed: ${err.message}`, { variant: 'error' });
      console.error(err.message);
    }
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={documentVersionEditDialogVisibility} onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Update Version</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
        <DialogContent dividers sx={{pt:3}}><RHFTextField type="number" name="updatedVersion" label="Version"/></DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton loading={isSubmitting} type='submit' variant='contained'>Update</LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default UpdateDocumentVersionDialog;
