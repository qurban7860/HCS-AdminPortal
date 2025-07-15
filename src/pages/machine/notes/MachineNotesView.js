import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useAuthContext } from '../../../auth/useAuthContext';
import { deleteNote } from '../../../redux/slices/products/machineNote';
import MachineNotesForm from './MachineNotesForm';
import { handleError } from '../../../utils/errorHandler';
import ConfirmDialog from '../../../components/confirm-dialog';
import Markdown from '../../../components/markdown';

export default function MachineNotesView({ note }) {
  const { machineId } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { userId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const onDelete = async () => {
    try {
      await dispatch(deleteNote(machineId, note?._id));
      enqueueSnackbar('Note deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: 'error' });
    }
  };

  const handleEdit = async () => setIsEdit(!isEdit);
  const handleDelete = async () => setIsDelete(!isDelete);

  return (
    <>
      <>
        {isEdit ? (
          <MachineNotesForm noteData={note} handleEdit={handleEdit} />
        ) : (
          <>
            <Typography component="span" variant="body2" color="text.primary">
              <Markdown children={note?.note || ''} />
              <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                {note.isInternal ? '(InternalNote)' : '(CustomerNote)'}
              </Typography>

              {note.updatedAt !== note.createdAt && (
                <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                  {' '}
                  (Edited){' '}
                </Typography>
              )}
            </Typography>

            {note?.createdBy?._id === userId && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button size="small" color="primary" onClick={handleEdit} sx={{ minWidth: 'unset', px: 1 }}>
                  {' '}
                  Edit{' '}
                </Button>
                <Button size="small" color="error" onClick={handleDelete} sx={{ minWidth: 'unset', px: 1 }}>
                  {' '}
                  Delete{' '}
                </Button>
              </Stack>
            )}
          </>
        )}
      </>
      <ConfirmDialog
        open={isDelete}
        onClose={handleDelete}
        title="Delete Note"
        content="Are you sure you want to delete this Note?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}

MachineNotesView.propTypes = {
  note: PropTypes.object,
};
