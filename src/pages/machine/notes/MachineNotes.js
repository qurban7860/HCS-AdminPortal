import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Paper, Button, List, ListItem, ListItemAvatar, ListItemText, Divider, Box, Stack, Typography, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from '../../../auth/useAuthContext';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/document-constants';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { CustomAvatar } from '../../../components/custom-avatar';
import { getNotes, addNote, updateNote, deleteNote, resetNotes } from '../../../redux/slices/products/machineNote';
import ConfirmDialog from '../../../components/confirm-dialog';
import { getActiveSPContacts } from '../../../redux/slices/customer/contact';
import { fDateTime } from '../../../utils/formatTime';

dayjs.extend(relativeTime);

const NoteSchema = Yup.object().shape({
  note: Yup.string()
    .required('Note is required')
    .max(2000, 'Note must not exceed 2000 characters'),
  isInternal: Yup.boolean(),
});

const MachineNotes = () => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editValue, setEditValue] = useState('');
  // const [editIsInternal, setEditIsInternal] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { machineId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { user: currentUser } = useAuthContext();

  const { error, notes, isLoading } = useSelector((state) => state.machineNote);
  const { activeSpContacts } = useSelector((state) => state.contact);

  useEffect(() => {
    if (machineId) {

      dispatch(getNotes(machineId));
      dispatch(getActiveSPContacts());
    }
    return () => {
      dispatch(resetNotes());
    };
  }, [dispatch, machineId]);

  const methods = useForm({
    resolver: yupResolver(NoteSchema),
    defaultValues: {
      note: '',
      isInternal: false,
    },
  });

  const { reset, handleSubmit, watch, formState: { isSubmitting } } = methods;

  const noteValue = watch('note');

  const onSubmit = async (data) => {
    try {
      await dispatch(addNote(machineId, data.note));
      reset();
      enqueueSnackbar("Note saved successfully", { variant: 'success' });
      dispatch(getNotes({ machineId }));
    } catch (err) {
      enqueueSnackbar(error || "Failed to save note", { variant: 'error' });
    }
  };

  const handleSaveEdit = async (nID) => {
    try {
      await dispatch(
        updateNote(machineId, nID, {
          note: editValue
        })
      );
      setEditingNoteId(null);
      setEditValue('');
      enqueueSnackbar("Note updated successfully", { variant: 'success' });
      dispatch(getNotes({ machineId }));
    } catch (err) {
      enqueueSnackbar(error || "Failed to update note", { variant: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteNote(machineId, noteToDelete?._id));
      setOpenConfirmDelete(false);
      setNoteToDelete(null);
      enqueueSnackbar("Note deleted successfully", { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(error || "Failed to delete note", { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (note) => {
    setEditingNoteId(note._id);
    setEditValue(note.note);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditValue('');
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setOpenConfirmDelete(true);
  };

  return (
    <>
      <Paper sx={{ width: '100%', p: 2 }}>
        <>
          <FormLabel content={FORMLABELS.NOTES.HEADER} />
          <Box sx={{ py: 4 }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="row" spacing={2}>
                <CustomAvatar
                  src={currentUser?.photoURL}
                  alt={currentUser?.displayName}
                  name={currentUser?.displayName}
                />
                <Stack sx={{ width: '100%' }}>
                  <RHFTextField
                    name="note"
                    placeholder="Add a note..."
                    multiline
                    rows={2}
                    inputProps={{ maxLength: 2000 }}
                    helperText={`${noteValue?.length || 0}/2000 characters`}
                    FormHelperTextProps={{ sx: { textAlign: 'right' } }}
                  />
                  {!!noteValue?.trim() && (
                    <Stack spacing={1} direction="row" sx={{ mt: -2 }}>
                      <LoadingButton
                        type="submit"
                        disabled={isLoading}
                        loading={isSubmitting}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ width: 'fit-content' }}
                      >
                        Save
                      </LoadingButton>
                      <Button
                        type="button"
                        variant="text"
                        size="small"
                        sx={{ width: 'fit-content' }}
                        onClick={() => reset()}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </FormProvider>

            <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 500, overflow: 'auto', mt: 1.5 }}>
              {(Array.isArray(notes) ? notes : []).map((item, index) => (
                <React.Fragment key={item._id || index}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem alignItems="flex-start" sx={{ padding: '8px 0' }}>
                    <ListItemAvatar>
                      <CustomAvatar alt={item?.createdBy?.name} name={item?.createdBy?.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ mr: 1 }}>
                            {item?.createdBy?.name}
                          </Typography>
                          <Typography
                            sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                            title={dayjs(item.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                          >
                            {dayjs().diff(dayjs(item.updatedAt), 'day') < 1
                              ? dayjs(item.createdAt).fromNow()
                              : dayjs(item.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          {editingNoteId === item._id ? (
                            <Stack >
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                inputProps={{ maxLength: 2000 }}
                                helperText={`${editValue.length}/2000 characters`}
                                FormHelperTextProps={{ sx: { textAlign: 'right' } }}
                              />
                              {/* <Stack display="flex" alignItems="start" sx={{ position: 'absolute', transform: 'translateY(185%)' }}>
                                  <Switch
                                    label="Internal"
                                    checked={editIsInternal}
                                    onChange={() => setEditIsInternal(!editIsInternal)}
                                  />
                                </Stack> */}
                              <Stack direction="row" spacing={1} sx={{ mt: -2 }} >
                                <LoadingButton
                                  onClick={() => handleSaveEdit(item._id)}
                                  disabled={!editValue.trim()}
                                  loading={isLoading}
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  sx={{ width: 'fit-content' }}
                                >
                                  Update
                                </LoadingButton>
                                <Button
                                  variant="text"
                                  size="small"
                                  sx={{ width: 'fit-content' }}
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            </Stack>
                          ) : (
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {item.note}
                                {item?.isInternal && (
                                  <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                    (Internal)
                                  </Typography>
                                )}
                                {item.updatedAt !== item.createdAt && item.createdBy?._id !== item.updatedBy?._id && (
                                  <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 2, fontStyle: 'italic' }}>
                                    (edited at {fDateTime(item.updatedAt)} by <b>{item?.updatedBy?.name || ""}</b>)
                                  </Typography>
                                )}
                              </Typography>
                              {(item?.updatedBy?._id === currentUser?.userId || activeSpContacts.some((contact) => contact._id === currentUser?.contact)) && (
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditClick(item)}
                                    sx={{ minWidth: 'unset', px: 1 }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteClick(item)}
                                    sx={{ minWidth: 'unset', px: 1 }}
                                  >
                                    Delete
                                  </Button>
                                </Stack>
                              )}
                            </>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Box>
        </>
      </Paper >
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => {
          setOpenConfirmDelete(false);
          setNoteToDelete(null);
        }}
        title="Delete Note"
        content="Are you sure you want to delete this note?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            loading={isDeleting}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
};

export default MachineNotes;
