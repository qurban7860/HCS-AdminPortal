import React, { useState } from 'react';
import { Paper, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import TicketHistory from './TicketHistory';
import TicketWorkLogs from './TicketWorkLogs';
import TicketComments from './TicketComment/TicketComments';

export default function TicketTabs() {

  const [tab, setTab] = useState('Comments');
  const handleTab = (t) => setTab(t);

  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 1.5 }}>
        <LoadingButton
          value="Comments"
          onClick={() => handleTab('Comments')}
          variant={tab === 'Comments' ? 'contained' : 'text'}
          color="primary"
          size="small"
          sx={{ width: 'fit-content', mr: 2 }}
        >
          Comments
        </LoadingButton>
        <LoadingButton
          value="History"
          onClick={() => handleTab('History')}
          color="primary"
          variant={tab === 'History' ? 'contained' : 'text'}
          size="small"
          sx={{ width: 'fit-content', mr: 2 }}
        >
          History
        </LoadingButton>
        <LoadingButton
          value="Work Logs"
          onClick={() => handleTab('Work Logs')}
          variant={tab === 'Work Logs' ? 'contained' : 'text'}
          color="primary"
          size="small"
          sx={{ width: 'fit-content' }}
        >
          Work Log
        </LoadingButton>
      </Box>
      {tab === 'Comments' && <TicketComments />}
      {tab === 'History' && <TicketHistory />}
      {tab === 'Work Logs' && <TicketWorkLogs />}
    </Paper>
  );
};

