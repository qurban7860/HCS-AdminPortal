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
import MachineNotesForm from './MachineNotesForm';
import MachineNotesView from './MachineNotesView';
import { getNotes } from '../../../redux/slices/products/machineNote';

dayjs.extend(relativeTime);

export default function MachineNotes() {
  const { machineId } = useParams();
  const dispatch = useDispatch();
  const { notes } = useSelector((state) => state.machineNotes);

  useEffect(() => {
    if (machineId) {
      dispatch(getNotes(machineId));
    }
  }, [dispatch, machineId]);


  return (
    <Box >
      <Box sx={{ p: 2, pb: 0 }}>
      <FormLabel content={FORMLABELS.COVER.TICKET_COMMENTS} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <MachineNotesForm />
      </Box>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          overflow: 'auto',
          p: 2,
        }}
      >
        {notes.map((note, index) => (
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
                    <MachineNotesView note={note} />
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
