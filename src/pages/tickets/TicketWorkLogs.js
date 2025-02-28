// TicketWorkLogs.js
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
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
import FormLabel from '../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../constants/default-constants';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { CustomAvatar } from '../../components/custom-avatar';
import {
  addWorkLog,
  deleteWorkLog,
  getWorkLogs,
  resetWorkLogs,
  updateWorkLog,
} from '../../redux/slices/ticket/ticketWorkLogs/ticketWorkLog'; 
import ConfirmDialog from '../../components/confirm-dialog';

dayjs.extend(relativeTime);

const WorkLogSchema = Yup.object().shape({
  timeSpent: Yup.string()
    .matches(
      /^(?:(\d+w)\s*)?(?:(\d+d)\s*)?(?:(\d+h)\s*)?(?:(\d+m)\s*)?$/,
      'Time Spent must be in the correct format: 2w 4d 6h 45m'
    )
    .test(
      'isValidFormat',
      'Invalid format. Use: 2w 4d 6h 45m',
      (value) => {
        if (!value) return false; 
        return /^(\d+w)?\s*(\d+d)?\s*(\d+h)?\s*(\d+m)?$/.test(value.trim());
      }
    )
    .required('Time Spent is required'),
    notes: Yup.string().max(300, 'Notes must not exceed 300 characters'),
});

const TicketWorkLogs = ({ currentUser }) => {
  const [editingWorkLogId, setEditingWorkLogId] = useState(null);
  const [editTimeSpent, setEditTimeSpent] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [workLogToDelete, setWorkLogToDelete] = useState(null);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { error, workLogs, isLoading } = useSelector((state) => state.ticketWorkLogs); 

  useEffect(() => {
    let controller;
    if (id) {
      dispatch(getWorkLogs({ id })); 
    }

    return () => {
      if (controller) {
        controller.abort();
      }
      dispatch(resetWorkLogs()); 
    };
  }, [dispatch, id]);

  const methods = useForm({
    resolver: yupResolver(WorkLogSchema),
    defaultValues: {
      timeSpent: '',
      notes: '',
    },
  });

  const { reset, handleSubmit, watch, formState: { isSubmitting, errors } } = methods;
  const timeSpentValue = watch('timeSpent')
  const noteValue = watch('notes'); 
  
  const onSubmit = async (data) => {
    await dispatch(addWorkLog(id, data.timeSpent || "", data.notes || ""));
    reset();
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    } else {
      enqueueSnackbar('Work Log saved successfully', { variant: 'success' });
      dispatch(getWorkLogs({ id })); 
    }
  };
  
  const handleSaveEdit = async (workLogId) => {
    await dispatch(updateWorkLog(id, workLogId, { timeSpent: editTimeSpent, notes: editNotes }));
    setEditingWorkLogId(null);
    setEditTimeSpent('');
    setEditNotes('');
    if (error) enqueueSnackbar(error, { variant: 'error' });
    else enqueueSnackbar('Work Log updated successfully', { variant: 'success' });
  };
  
  const handleConfirmDelete = async () => {
    await dispatch(deleteWorkLog(id, workLogToDelete?._id)); 
    setOpenConfirmDelete(false);
    setWorkLogToDelete(null);
    if (error) enqueueSnackbar(error, { variant: 'error' });
    else enqueueSnackbar('Work Log deleted successfully', { variant: 'success' });
  };

  const handleEditClick = (workLog) => {
    setEditingWorkLogId(workLog._id);
    setEditTimeSpent(workLog.timeSpent);
    setEditNotes(workLog.notes);
  };

  const handleCancelEdit = () => {
    setEditingWorkLogId(null);
    setEditTimeSpent('');
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
        {workLogs.length === 0 ? (
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" spacing={2}>
              <CustomAvatar
                src={currentUser?.photoURL}
                alt={currentUser?.displayName}
                name={currentUser?.displayName}
              />
              <Stack sx={{ width: '100%' }}>
                <RHFTextField
                  name="timeSpent"
                  label="Time Spent" 
                  error={!!errors.timeSpent} 
                  helperText={errors.timeSpent?.message || "Use the format: 2w 4d 6h 45m (weeks, days, hours, minutes)"}
                  sx={{ mb: 1 }} 
                />
                <RHFTextField
                  name="notes"
                  label="Notes" 
                  multiline
                  rows={2}
                  inputProps={{ maxLength: 300 }}
                  helperText={`${noteValue?.length || 0}/300 characters`}
                  FormHelperTextProps={{ sx: { textAlign: 'right' } }}
                />
                {(timeSpentValue || noteValue) && (
                  <Stack spacing={1} direction="row" >
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
                  </Stack> )}
              </Stack>
            </Stack>
          </FormProvider>
          ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto', mt: -2 }}>
            {workLogs.map((item, index) => ( 
              <React.Fragment key={index}>
                {index > 0 && <Divider component="li" />}
                <ListItem alignItems="flex-start" sx={{ padding: '8px 0' }}>
                  <ListItemAvatar>
                    <CustomAvatar alt={item?.createdBy?.name} name={item?.createdBy?.name} sx={{ mt: -1 }}/>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                          {dayjs().diff(dayjs(item.createdAt), 'day') < 1
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
                              <RHFTextField
                                name="timeSpent"
                                label="Time Spent"
                                value={editTimeSpent}
                                onChange={(e) => setEditTimeSpent(e.target.value)}
                                error={!/^(?:(\d+w)\s*)?(?:(\d+d)\s*)?(?:(\d+h)\s*)?(?:(\d+m)\s*)?$/.test(editTimeSpent.trim())}
                                helperText={!/^(?:(\d+w)\s*)?(?:(\d+d)\s*)?(?:(\d+h)\s*)?(?:(\d+m)\s*)?$/.test(editTimeSpent.trim()) ? "Invalid format. Use: 2w 4d 6h 45m" : "" || "Use the format: 2w 4d 6h 45m (weeks, days, hours, minutes)"}
                                sx={{ mb: 1 }}
                              />
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
                        <Typography component="span" variant="body2" color="text.primary">
                          {item.notes} 
                          {item.updatedAt !== item.createdAt && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ color: 'text.secondary', ml: 1 }}
                            >
                              (edited)
                            </Typography>
                          )}
                        </Typography>
                        {item?.createdBy?._id === currentUser?.userId && (
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
      )}
      </Box>
        <ConfirmDialog
         open={openConfirmDelete}
         onClose={() => setOpenConfirmDelete(false)}
         title="Delete WorkLog"
         content="Are you sure you want to delete this workLog?"
         action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>}
       />
    </>
  );
};

TicketWorkLogs.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default TicketWorkLogs;