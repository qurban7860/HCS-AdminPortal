// TicketWorkLogs.js
import React, { useEffect, useState } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from '../../auth/useAuthContext';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../constants/default-constants';
import FormProvider, { RHFTextField, RHFDatePicker } from '../../components/hook-form';
import { CustomAvatar } from '../../components/custom-avatar';
import {
  addWorkLog,
  deleteWorkLog,
  getWorkLogs,
  resetWorkLogs,
  updateWorkLog,
} from '../../redux/slices/ticket/ticketWorkLogs/ticketWorkLog';
import ConfirmDialog from '../../components/confirm-dialog';
import { getActiveSPContacts } from '../../redux/slices/customer/contact';
import { fDateTime } from '../../utils/formatTime';

dayjs.extend(relativeTime);

const WorkLogSchema = Yup.object().shape({
  timeSpent: Yup.string()
    .required('Time Spent is required')
    .test(
      'isValidFormat',
      'Invalid format. Use: 2w 4d 6h 45m',
      (value) => {
        if (!value) return true;
        return /^(\d+w)?\s*(\d+d)?\s*(\d+h)?\s*(\d+m)?$/.test(value.trim());
      }
    )
    .matches(
      /^(?:(\d+w)\s*)?(?:(\d+d)\s*)?(?:(\d+h)\s*)?(?:(\d+m)\s*)?$/,
      'Time Spent must be in the correct format: 2w 4d 6h 45m'
    ),
  workDate: Yup.mixed().label("Work Date").nullable().notRequired(),
  notes: Yup.string().max(300, 'Notes must not exceed 300 characters'),
});

const TicketWorkLogs = () => {
  const [editingWorkLogId, setEditingWorkLogId] = useState(null);
  const [editTimeSpent, setEditTimeSpent] = useState('');
  const [editWorkDate, setEditWorkDate] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [workLogToDelete, setWorkLogToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user: currentUser } = useAuthContext();
  const { ticket } = useSelector((state) => state.tickets);
  const { error, workLogs, isLoading } = useSelector((state) => state.ticketWorkLogs);
  const { activeSpContacts } = useSelector((state) => state.contact);

  useEffect(() => {
    let controller;
    if (ticket?._id) {
      dispatch(getWorkLogs({ id: ticket?._id }));
      dispatch(getActiveSPContacts());
    }
    return () => {
      if (controller) {
        controller.abort();
      }
      dispatch(resetWorkLogs());
    };
  }, [dispatch, ticket?._id]);

  const methods = useForm({
    resolver: yupResolver(WorkLogSchema),
    defaultValues: {
      timeSpent: '',
      workDate: null,
      notes: '',
    },
  });

  const { reset, handleSubmit, watch, formState: { isSubmitting, errors } } = methods;
  const timeSpentValue = watch('timeSpent');
  const workDateValue = watch('workDate');
  const noteValue = watch('notes');

  const onSubmit = async (data) => {
    await dispatch(addWorkLog(ticket?._id, data.timeSpent || "", data.workDate || null, data.notes || ""));
    reset();
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    } else {
      enqueueSnackbar('Work Log saved successfully', { variant: 'success' });
      dispatch(getWorkLogs({ id: ticket?._id }));
    }
  };

  const handleSaveEdit = async (workLogId) => {
    await dispatch(updateWorkLog(ticket?._id, workLogId, { timeSpent: editTimeSpent, workDate: editWorkDate, notes: editNotes }));
    setEditingWorkLogId(null);
    setEditTimeSpent('');
    setEditWorkDate(null);
    setEditNotes('');
    if (error) enqueueSnackbar(error, { variant: 'error' });
    else enqueueSnackbar('Work Log updated successfully', { variant: 'success' });
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteWorkLog(ticket?._id, workLogToDelete?._id));
    setOpenConfirmDelete(false);
    setWorkLogToDelete(null);
    if (error) enqueueSnackbar(error, { variant: 'error' });
    else enqueueSnackbar('Work Log deleted successfully', { variant: 'success' });
  };

  const handleEditClick = (workLog) => {
    setEditingWorkLogId(workLog._id);
    setEditTimeSpent(workLog.timeSpent);
    setEditWorkDate(workLog.workDate);
    setEditNotes(workLog.notes);
  };

  const handleCancelEdit = () => {
    setEditingWorkLogId(null);
    setEditTimeSpent('');
    setEditWorkDate(null);
    setEditNotes('');
  };

  const handleDeleteClick = (workLog) => {
    setWorkLogToDelete(workLog);
    setOpenConfirmDelete(true);
  };

  return (
    <>
      <FormLabel content={FORMLABELS.COVER.TICKET_WORKLOG} />
      <Box sx={{ py: 2 }}>
        {/* {workLogs.length === 0 ? ( */}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" spacing={2}>
            <CustomAvatar
              src={currentUser?.photoURL}
              alt={currentUser?.displayName}
              name={currentUser?.displayName}
            />
            <Stack sx={{ width: '100%' }}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField
                  name="timeSpent"
                  label="Time Spent"
                  error={!!errors.timeSpent}
                  helperText={errors.timeSpent?.message || 'Use the format: 2w 4d 6h 45m (weeks, days, hours, minutes)'}
                  sx={{ mb: 1 }}
                />
                <RHFDatePicker label="Work Date" name="workDate" sx={{ mb: 1 }} />
              </Box>
              <RHFTextField
                name="notes"
                label="Notes"
                multiline
                rows={2}
                inputProps={{ maxLength: 300 }}
                helperText={`${noteValue?.length || 0}/300 characters`}
                FormHelperTextProps={{ sx: { textAlign: 'right' } }}
              />
              {(timeSpentValue || workDateValue || noteValue) && (
                <Stack spacing={1} direction="row">
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
        {/* ) : ( */}
        <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto' }}>
          {(Array.isArray(workLogs) ? workLogs : []).map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider component="li" />}
              <ListItem alignItems="flex-start" sx={{ padding: '8px 0' }}>
                <ListItemAvatar>
                  <CustomAvatar alt={item?.createdBy?.name} name={item?.createdBy?.name} sx={{ mt: -1 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>
                        {item?.createdBy?.name}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>
                        (logged {item?.timeSpent})
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
                      {editingWorkLogId === item._id ? (
                        <FormProvider methods={methods} key={item._id}>
                          <Stack spacing={2}>
                            <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                            >
                              <RHFTextField
                                name="timeSpent"
                                label="Time Spent"
                                value={editTimeSpent}
                                onChange={(e) => setEditTimeSpent(e.target.value)}
                                error={!/^(?:(\d+w)\s*)?(?:(\d+d)\s*)?(?:(\d+h)\s*)?(?:(\d+m)\s*)?$/.test(editTimeSpent.trim())}
                                helperText={!/^(?:(\d+w)\s*)?(?:(\d+d)\s*)?(?:(\d+h)\s*)?(?:(\d+m)\s*)?$/.test(editTimeSpent.trim()) ? "Invalid format. Use: 2w 4d 6h 45m" : "" || "Use the format: 2w 4d 6h 45m (weeks, days, hours, minutes)"}
                                sx={{ mt: 1 }}
                              />
                              <RHFDatePicker
                                label="Work Date"
                                name="workDate"
                                value={editWorkDate}
                                onChange={(newValue) => setEditWorkDate(newValue)}
                                sx={{ mt: 1 }}
                              />
                            </Box>
                            <RHFTextField
                              name="notes"
                              label="Notes"
                              multiline
                              rows={2}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              inputProps={{ maxLength: 300 }}
                              helperText={`${editNotes.length}/300 characters`}
                              FormHelperTextProps={{ sx: { textAlign: 'right' } }}
                            />
                            <Stack direction="row" spacing={1}>
                              <LoadingButton
                                type="submit"
                                onClick={() => handleSaveEdit(item._id)}
                                // disabled={!editTimeSpent}
                                disabled={!editTimeSpent.trim().match(/^(?:(\d+w)\s*)?(?:(\d+d)\s*)?(?:(\d+h)\s*)?(?:(\d+m)\s*)?$/)}
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
                        </FormProvider>
                      ) : (
                        <>
                          {(item.workDate || item.notes) && (
                            <Typography component="span" variant="body2" color="text.primary">
                              {item.workDate && (
                                <>
                                  {dayjs(item.workDate).format('DD/MM/YYYY')}
                                  {item.notes && <br />}
                                </>
                              )}
                              {item.notes && (
                                <>
                                  <span style={{ backgroundColor: '#f0f0f0', padding: '2px 5px', borderRadius: '3px' }}>
                                    {item.notes}
                                  </span>
                                  {item.updatedAt !== item.createdAt &&
                                    item.createdBy?._id !== item.updatedBy?._id && (
                                      <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 2, fontStyle: 'italic' }}>
                                        (edited at {fDateTime(item.updatedAt)} by{' '}
                                        <b>{item?.updatedBy?.name || ''}</b>)
                                      </Typography>
                                    )}
                                </>
                              )}
                            </Typography>
                          )}
                          {(item?.updatedBy?._id === currentUser?.userId ||
                            activeSpContacts.some(
                              (contact) => contact._id === currentUser?.contact
                            )) && (
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
        {/* )} */}
      </Box>
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        title="Delete WorkLog"
        content="Are you sure you want to delete this workLog?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
};

export default TicketWorkLogs;