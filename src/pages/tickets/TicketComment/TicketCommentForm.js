import React, { useMemo } from 'react';
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
import { addComment, updateComment } from '../../../redux/slices/ticket/ticketComments/ticketComment';
import { commentSchema } from './schema'
import { handleError } from '../../../utils/errorHandler';

export default function TicketCommentForm({ commentData, handleEdit }) {
    const { id } = useParams();
    const { user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const defaultValues = useMemo(() => ({
        comment: commentData?.comment || '<p></p>',
        isInternal: typeof commentData?.isInternal === 'boolean' ? commentData.isInternal : true,
    }), [commentData])

    const methods = useForm({
        resolver: yupResolver(commentSchema),
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        setValue,
        watch,
        formState: { isSubmitting },
    } = methods;

    const { comment } = watch();

    const onSubmit = async (data) => {
        try {
            if (commentData?._id) {
                await dispatch(updateComment(id, commentData?._id, data));
                await handleEdit();
                enqueueSnackbar('Comment Uppdated successfully', { variant: 'success' });
            } else {
                await dispatch(addComment(id, data));
                enqueueSnackbar('Comment saved successfully', { variant: 'success' });
            }
            reset();
        } catch (error) {
            enqueueSnackbar(handleError(error), { variant: 'error' });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" spacing={2}>
                {!commentData?._id && <CustomAvatar
                    src={user?.photoURL}
                    alt={user?.displayName}
                    name={user?.displayName}
                />}
                <Stack sx={{ width: '100%' }}>
                    <RHFEditorV2 name="comment" allowMention placeholder="Add a comment..." />
                    <RadioGroup
                        row
                        name="isInternal"
                        value={watch('isInternal') ? 'internal' : 'customer'}
                        onChange={(e) => {
                            const isInternalSelected = e.target.value === 'internal';
                            methods.setValue('isInternal', isInternalSelected);
                        }}
                    >
                        <FormControlLabel
                            value="internal"
                            control={<Radio />}
                            label="Internal Note"
                        />
                        <FormControlLabel
                            value="customer"
                            control={<Radio />}
                            label="Note to Customer"
                        />
                    </RadioGroup>

                    <Stack spacing={1} direction="row" >
                        <LoadingButton
                            type="submit"
                            disabled={isSubmitting || comment?.trim() === '<p></p>' || comment?.trim() === ''}
                            loading={isSubmitting}
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ width: 'fit-content' }}
                        >
                            {commentData?._id ? 'Update' : 'Save'}
                        </LoadingButton>
                        {commentData?._id && <Button
                            type="button"
                            variant="text"
                            size="small"
                            sx={{ width: 'fit-content' }}
                            disabled={isSubmitting || comment?.trim() === '<p></p>' || comment?.trim() === ''}
                            onClick={() => {
                                reset();
                                setValue('comment', '<p></p>')
                                if (handleEdit) {
                                    handleEdit();
                                }
                            }}
                        >
                            {commentData?._id ? 'Cancel' : 'Discard'}
                        </Button>}
                    </Stack>
                </Stack>
            </Stack>
        </FormProvider >
    )
}

TicketCommentForm.propTypes = {
    commentData: PropTypes.object,
    handleEdit: PropTypes.func,
};