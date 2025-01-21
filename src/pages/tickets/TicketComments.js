/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box,
  Stack,
  Typography,
  TextField,
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
import { addComment, deleteComment, getComments, resetComments, updateComment } from '../../redux/slices/ticket/ticketComments/ticketComment';
import ConfirmDialog from '../../components/confirm-dialog';

dayjs.extend(relativeTime);

const CommentSchema = Yup.object().shape({
  comment: Yup.string()
    .required('Comment is required')
    .max(300, 'Comment must not exceed 300 characters'),
});

const TicketComments = ({ currentUser, ticketData }) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);


  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { error, comments, isLoading } = useSelector(
    (state) => state.ticketComments
  );

  useEffect(() => {
    let controller;
    
    if (ticketData?._id) {
      dispatch(
        getComments({
          id: ticketData?._id,
        })
      );
    }
  
    return () => {
      if (controller) {
        controller.abort();
      }
      dispatch(resetComments());
    };
  }, [dispatch, ticketData]);

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues: {
      comment: '',
    },
  });

  const { reset, handleSubmit, watch, formState: { isSubmitting } } = methods;

  const commentValue = watch('comment');

  const onSubmit = async (data) => {
    await dispatch(
      addComment({
        id: ticketData?._id,
        params: {
          comment: data.comment,
        },
      })
    );
    reset();
    if (error) enqueueSnackbar(error, { variant: 'error' });
    else enqueueSnackbar("Comment saved successfully", { variant: 'success' });
  };

  const handleSaveEdit = async (editCommentId) => {
    await dispatch(
      updateComment(ticketData?._id, editCommentId, {
        comment: editValue,
      })
    );
    setEditingCommentId(null);
    setEditValue('');
    if (error) enqueueSnackbar(error, { variant: 'error' });
    else enqueueSnackbar("Comment updated successfully", { variant: 'success' });
  };

  const handleConfirmDelete = async () => {
    await dispatch(
      deleteComment(ticketData?._id, commentToDelete?._id, {
        isArchived: true,
      })
    );
    setOpenConfirmDelete(false);
    setCommentToDelete(null);
    if (error) enqueueSnackbar(error, { variant: 'error' });
    else enqueueSnackbar("Comment deleted successfully", { variant: 'success' });
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditValue(comment.comment);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditValue('');
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setOpenConfirmDelete(true);
  };

  return (
    <>
      <Paper sx={{ width: '100%', p: 2 }}>
        <FormLabel content={FORMLABELS.COVER.TICKET_COMMENTS} />
        <Box sx={{ py: 2 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" spacing={2}>
              <CustomAvatar
                src={currentUser?.photoURL}
                alt={currentUser?.displayName}
                name={currentUser?.displayName}
              />
              <Stack sx={{ width: '100%' }}>
                <RHFTextField
                  name="comment"
                  placeholder="Add a comment..."
                  multiline
                  rows={2}
                  inputProps={{ maxLength: 300 }}
                  helperText={`${commentValue?.length || 0}/300 characters`}
                  FormHelperTextProps={{ sx: { textAlign: 'right' } }}
                />
                {!!commentValue?.trim() && (
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

          <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto' }}>
            {comments.map((item, index) => (
              <React.Fragment key={index}>
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
                          {dayjs().diff(dayjs(item.createdAt), 'day') < 1
                            ? dayjs(item.createdAt).fromNow()
                            : dayjs(item.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        {editingCommentId === item._id ? (
                          <Stack spacing={2}>
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              inputProps={{ maxLength: 300 }}
                              helperText={`${editValue.length}/300 characters`}
                            />
                            <Stack direction="row" spacing={1}>
                              <LoadingButton
                                type="submit"
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
                            {item.comment}
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
        </Box>
      </Paper>
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        title="Delete Comment"
        content="Are you sure you want to delete this comment?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
};

TicketComments.propTypes = {
  ticketData: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default TicketComments;
