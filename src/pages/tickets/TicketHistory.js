/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { Box, Chip, Typography, Divider, List, ListItem, ListItemAvatar, ListItemText, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../constants/default-constants';
import { getHistories } from '../../redux/slices/ticket/ticketHistories/ticketHistory';
import { CustomAvatar } from '../../components/custom-avatar';

const TicketHistory = () => {
  const dispatch = useDispatch();
  const { histories, isLoading } = useSelector((state) => state.ticketHistories);

  const { ticket } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (ticket?._id) {
      dispatch(getHistories(ticket?._id));
    }
  }, [ticket?._id, dispatch]);

  const getLightBackgroundColor = (color) => {
    if (!color) return 'rgba(0, 0, 0, 0.1)';
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const computedColor = window.getComputedStyle(div).color;
    document.body.removeChild(div);

    const rgb = computedColor.match(/\d+/g);
    if (!rgb) return 'rgba(0, 0, 0, 0.1)';

    const [r, g, b] = rgb.map(Number);
    return `rgba(${r + (255 - r) * 0.7}, ${g + (255 - g) * 0.7}, ${b + (255 - b) * 0.7}, 1)`;
  };

  return (
    <>
      <FormLabel content={FORMLABELS.COVER.TICKET_HISTORY} />
      <Box>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : histories.length > 0 ? (
          <List
            sx={{ width: '100%', bgcolor: 'background.paper', }}
          >
            {histories.map((history, index) => (
              <React.Fragment key={history._id}>
                {index > 0 && <Divider component="li" />}
                <ListItem alignItems="flex-start" sx={{ padding: '8px 0' }}>
                  <ListItemAvatar>
                    <CustomAvatar
                      src={history?.updatedBy?.photoURL}
                      alt={history?.updatedBy?.name}
                      name={history?.updatedBy?.name}
                      sx={{ mt: -1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ mr: 1 }}>
                          {history?.updatedBy?.name}
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          title={dayjs(history.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                        >
                          {dayjs().diff(dayjs(history.createdAt), 'day') < 1
                            ? dayjs(history.createdAt).fromNow()
                            : dayjs(history.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        {(history?.previousStatus?._id || history?.newStatus?._id) && <Typography variant="subtitle2">
                          Status:
                          <span
                            style={{
                              backgroundColor: getLightBackgroundColor(history.previousStatus?.color),
                              color: history.previousStatus?.color || 'black',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              marginLeft: '4px',
                            }}>
                            {history.previousStatus?.name || 'None'}
                          </span>
                          →
                          <span
                            style={{
                              backgroundColor: getLightBackgroundColor(history.newStatus?.color),
                              color: history.newStatus?.color || 'black',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {history.newStatus?.name || 'None'}
                          </span>
                        </Typography>}
                        {(history?.previousPriority?._id || history?.newPriority?._id) && <Typography variant="subtitle2">
                          Priority:
                          <span
                            style={{
                              backgroundColor: getLightBackgroundColor(history.previousPriority?.color),
                              color: history.previousPriority?.color || 'black',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              marginLeft: '4px',
                            }}>
                            {history.previousPriority?.name || 'None'}
                          </span>
                          →
                          <span
                            style={{
                              backgroundColor: getLightBackgroundColor(history.newPriority?.color),
                              color: history.newPriority?.color || 'black',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {history.newPriority?.name || 'None'}
                          </span>
                        </Typography>}
                        {(history?.previousReporter?._id || history?.newReporter?._id) && <Typography variant="subtitle2" color="textSecondary">
                          Reporter: {history.previousReporter?.name || 'None'} →{' '}
                          {history.newReporter?.name || 'None'}
                        </Typography>}
                        {(history?.previousAssignees?.length > 0 || history?.newAssignees?.length > 0) &&
                          <Typography variant="subtitle2" color="textSecondary">
                            Assignee: {history?.previousAssignees?.length > 0 ? history?.previousAssignees?.map(a =>
                              <Chip size='small' label={a?.name} sx={{ m: 0.3, backgroundColor: '#fae8e6', borderRadius: '5px' }} />
                            ) : 'None'} →{' '} {history?.newAssignees?.length > 0 ? history?.newAssignees?.map(a =>
                              <Chip size='small' label={a?.name} sx={{ m: 0.3, backgroundColor: '#e6fae7', borderRadius: '5px' }} />
                            ) : 'None'}
                          </Typography>
                        }
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
            No ticket histories available.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default TicketHistory;

