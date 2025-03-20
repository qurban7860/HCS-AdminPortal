// react
import { useEffect } from 'react';
// @mui
import { Card, Container, Box, Typography } from '@mui/material';

// routes
import { useParams } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import MachineTabContainer from '../util/MachineTabContainer';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import MachineStatsCounters from './MachineStatsCounters';
import { getMachineDashboardStatistics } from '../../../redux/slices/products/machineDashboard';
import { STATS_CONFIG } from './constants';

// ----------------------------------------------------------------------

export default function MachineDashboard() {
  const { dashboardStatistics, isLoading, error } = useSelector((state) => state.machineDashboard);
  const dispatch = useDispatch();
  const { machineId } = useParams();

  useEffect(() => {
    if (machineId) {
      dispatch(getMachineDashboardStatistics(machineId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineId]);

  const hasAnyError = Object.values(error).some(Boolean);

  const renderContent = () => {
    if (hasAnyError) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', py: 5 }}>
          <Typography variant="body1" color="text.secondary">
            {Object.values(error).find(Boolean) || 'No statistics available for this machine.'}
          </Typography>
        </Box>
      );
    }

    return (
      <MachineStatsCounters 
        stats={dashboardStatistics} 
        displayConfig={STATS_CONFIG}
        loadingStates={isLoading}
      />
    );
  };

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="dashboard" />

      <Card
        sx={{
          minHeight: '500px',
          width: '100%',
          p: '1rem',
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <FormLabel content="Machine Dashboard" />

        <Box
          sx={{
            mt: 3,
            mb: 4,
            height: '100%',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderContent()}
        </Box>
      </Card>
    </Container>
  );
}
