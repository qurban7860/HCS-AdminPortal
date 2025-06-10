import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/default-constants';
import { CustomAvatar } from '../../../components/custom-avatar';
import TicketCommentForm from './TicketCommentForm';
import TicketCommentView from './TicketCommentView';
import { getComments } from '../../../redux/slices/ticket/ticketComments/ticketComment';

dayjs.extend(relativeTime);

export default function TicketComments() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { comments, isLoading } = useSelector((state) => state.ticketComments);

  useEffect(() => {
    if (id) {
      dispatch(getComments({ id }));
    }
  }, [dispatch, id]);


  return (
    <Box >
      <FormLabel content={FORMLABELS.COVER.TICKET_COMMENTS} />
      <Box sx={{ mt: 1 }}>
        <TicketCommentForm />
      </Box>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
      >
        {comments.map((comment, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider component="li" />}
            <ListItem alignItems="flex-start" sx={{ padding: '8px 0' }}>
              <ListItemAvatar>
                <CustomAvatar alt={comment?.createdBy?.name} name={comment?.createdBy?.name} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      {comment?.createdBy?.name}
                    </Typography>
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                      title={dayjs(comment.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                    >
                      {dayjs().diff(dayjs(comment.createdAt), 'day') < 1
                        ? dayjs(comment.createdAt).fromNow()
                        : dayjs(comment.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <TicketCommentView comment={comment} />
                  </Box>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};
