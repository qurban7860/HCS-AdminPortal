import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useAuthContext } from '../../../auth/useAuthContext';
import { deleteComment } from '../../../redux/slices/ticket/ticketComments/ticketComment';
import TicketCommentForm from './TicketCommentForm'
import { handleError } from '../../../utils/errorHandler';
import ConfirmDialog from '../../../components/confirm-dialog';
import Markdown from '../../../components/markdown';

export default function TicketCommentView({ comment }) {
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const { userId } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();


    const onDelete = async () => {
        try {
            await dispatch(deleteComment(id, comment?._id));
            enqueueSnackbar('Comment deleted successfully', { variant: 'success' });
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
                    <TicketCommentForm commentData={comment} handleEdit={handleEdit} />
                ) : (
                    <>
                        <Typography component="span" variant="body2" color="text.primary">
                            <Markdown children={comment?.comment || ''} />
                            <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }} >
                                {comment.isInternal ? '(InternalNote)' : '(CustomerNote)'}
                            </Typography>

                            {comment.updatedAt !== comment.createdAt && (
                                <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }} > (Edited) </Typography>
                            )}
                        </Typography>

                        {
                            comment?.createdBy?._id === userId && (
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Button size="small" color="primary" onClick={handleEdit} sx={{ minWidth: 'unset', px: 1 }} > Edit </Button>
                                    <Button size="small" color="error" onClick={handleDelete} sx={{ minWidth: 'unset', px: 1 }} > Delete </Button>
                                </Stack>
                            )
                        }
                    </>
                )
                }
            </>
            <ConfirmDialog
                open={isDelete}
                onClose={handleDelete}
                title="Delete Comment"
                content="Are you sure you want to delete this comment?"
                action={
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Delete
                    </Button>
                }
            />
        </ >
    )
}

TicketCommentView.propTypes = {
    comment: PropTypes.object,
};