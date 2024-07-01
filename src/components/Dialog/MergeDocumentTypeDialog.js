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

import { mergeDocumentTypes, resetActiveDocumentTypes, setMergeDialogVisibility } from '../../redux/slices/document/documentType';
import FormProvider from '../hook-form/FormProvider';
import { RHFAutocomplete, RHFTextField } from '../hook-form';

function MergeDocumentTypeDialog() {
  const dispatch = useDispatch();
  const { mergeDialogVisibility, documentType, activeDocumentTypes } = useSelector((state) => state.documentType);

  const handleCloseDialog = () => {
    dispatch(setMergeDialogVisibility(false));
    reset();
  };

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      docTypes: []
    }),
    []
  );

  const MergeSchema = Yup.object().shape({
    docTypes: Yup.array().min(1,'Please select at least one option!').nullable().required(),
  });

  const methods = useForm({
    resolver: yupResolver(MergeSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    try {
      const typeIds = data?.docTypes.map(doc => doc._id);
      await dispatch(mergeDocumentTypes(documentType._id, typeIds));
      await dispatch(resetActiveDocumentTypes());
      await dispatch(setMergeDialogVisibility(false));
      reset();
      enqueueSnackbar('Document types merged successfully');
    } catch (err) {
      enqueueSnackbar('Failed merging', { variant: 'error' });
      console.error(err.message);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={mergeDialogVisibility} onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{ pb: 1, pt: 2 }}>Merge Document Types</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
        <DialogContent dividers sx={{ pt: 3 }}>
          <RHFAutocomplete
            multiple
            disableCloseOnSelect
            filterSelectedOptions
            name="docTypes"
            label="Document Types*"
            options={activeDocumentTypes.filter((type)=> type._id !==documentType._id && type?.docCategory?._id === documentType?.docCategory?._id)}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            getOptionLabel={(option) => `${option.name || ''}`}
            renderOption={(props, option) => (
              <li {...props} key={option?._id}>{`${option.name || ''}`}</li>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton loading={isSubmitting} type='submit' variant='contained'>Merge</LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

MergeDocumentTypeDialog.propTypes = {
  mergeDialogVisibility: PropTypes.bool,
  documentType: PropTypes.object,
  documentTypes: PropTypes.array
};

export default MergeDocumentTypeDialog;
