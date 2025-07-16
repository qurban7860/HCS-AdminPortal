import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Stack, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from '../../../auth/useAuthContext';
import FormProvider, { RHFEditorV2 } from '../../../components/hook-form';
import { CustomAvatar } from '../../../components/custom-avatar';
import { addNote, updateNote, getNotes } from '../../../redux/slices/customer/customerNote';
import { handleError } from '../../../utils/errorHandler';

export default function CustomerNotesForm({ noteData, handleEdit }) {
  const { customerId } = useParams();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NoteSchema = Yup.object().shape({
    note: Yup.string().required('Note is required').max(2000, 'Note must not exceed 2000 characters'),
    isInternal: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      note: noteData?.note || '<p></p>',
      isInternal: typeof noteData?.isInternal === 'boolean' ? noteData.isInternal : true,
    }),
    [noteData]
  );

  const methods = useForm({
    resolver: yupResolver(NoteSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { note } = watch();

  const onSubmit = async (data) => {
    try {
      if (noteData?._id) {
        await dispatch(updateNote(customerId, noteData?._id, data));
        await handleEdit();
        enqueueSnackbar('Note Uppdated successfully', { variant: 'success' });
      } else {
        await dispatch(addNote(customerId, data));
        enqueueSnackbar('Note saved successfully', { variant: 'success' });
      }
      await dispatch(getNotes(customerId));
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        {!noteData?._id && <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName} />}
        <Stack sx={{ width: '100%' }}>
          <RHFEditorV2 name="note" allowMention placeholder="Add a Note..." />
          <RadioGroup
            row
            name="isInternal"
            value={watch('isInternal') ? 'internal' : 'customer'}
            onChange={(e) => {
              const isInternalSelected = e.target.value === 'internal';
              methods.setValue('isInternal', isInternalSelected);
            }}
          >
            <FormControlLabel value="internal" control={<Radio />} label="Internal Note" />
            <FormControlLabel value="customer" control={<Radio />} label="Note to Customer" />
          </RadioGroup>

          <Stack spacing={1} direction="row">
            <LoadingButton
              type="submit"
              disabled={isSubmitting || note?.trim() === '<p></p>' || note?.trim() === ''}
              loading={isSubmitting}
              variant="contained"
              color="primary"
              size="small"
              sx={{ width: 'fit-content' }}
            >
              {noteData?._id ? 'Update' : 'Save'}
            </LoadingButton>
            {noteData?._id && (
              <Button
                type="button"
                variant="text"
                size="small"
                sx={{ width: 'fit-content' }}
                disabled={isSubmitting || note?.trim() === '<p></p>' || note?.trim() === ''}
                onClick={() => {
                  reset();
                  setValue('note', '<p></p>');
                  if (handleEdit) {
                    handleEdit();
                  }
                }}
              >
                {noteData?._id ? 'Cancel' : 'Discard'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

CustomerNotesForm.propTypes = {
  noteData: PropTypes.object,
  handleEdit: PropTypes.func,
};
