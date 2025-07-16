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
import CustomerNotesForm from './CustomerNotesForm';
import CustomerNotesView from './CustomerNotesView';
import { getNotes } from '../../../redux/slices/customer/customerNote';

dayjs.extend(relativeTime);

export default function CustomerNotes() {
  const { customerId } = useParams();
  const dispatch = useDispatch();
  const { notes } = useSelector((state) => state.customerNotes);

  useEffect(() => {
    if (customerId) {
      dispatch(getNotes(customerId));
    }
  }, [dispatch, customerId]);


  return (
    <Box >
      <Box sx={{ p: 2, pb: 0 }}>
      <FormLabel content={FORMLABELS.COVER.CUSTOMER_NOTES} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <CustomerNotesForm />
      </Box>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          overflow: 'auto',
          p: 2,
        }}
      >
        {(Array.isArray(notes) ? notes : []).map((note, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider component="li" />}
            <ListItem alignItems="flex-start" sx={{ padding: '8px 0' }}>
              <ListItemAvatar>
                <CustomAvatar alt={note?.createdBy?.name} name={note?.createdBy?.name} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      {note?.createdBy?.name}
                    </Typography>
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                      title={dayjs(note.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                    >
                      {dayjs().diff(dayjs(note.createdAt), 'day') < 1
                        ? dayjs(note.createdAt).fromNow()
                        : dayjs(note.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <CustomerNotesView note={note} />
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
