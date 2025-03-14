// react
import { useEffect } from 'react';
// @mui
import { Card, Container, Box, CircularProgress, Typography } from '@mui/material';

// routes
import { useParams } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import MachineTabContainer from '../util/MachineTabContainer';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import MachineStatsCounters from './MachineStatsCounters';
import { getMachineDashboardStatistics } from '../../../redux/slices/products/machineDashboard';

// ----------------------------------------------------------------------

// Display configuration for machine statistics
const DISPLAY_CONFIG = {
  producedLength: { label: 'Produced Length (m)' },
  wasteLength: { label: 'Waste Length (m)' },
  productionRate: { label: 'Production Rate (m/h)' },
};

// Loading state component
const LoadingState = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      py: 5,
    }}
  >
    <CircularProgress size={60} thickness={4} />
    <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
      Loading machine statistics...
    </Typography>
  </Box>
);

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

  const renderContent = () => {
    if (error || !dashboardStatistics || Object.keys(dashboardStatistics).length === 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', py: 5 }}>
          <Typography variant="body1" color="text.secondary">
            {error || 'No statistics available for this machine.'}
          </Typography>
        </Box>
      );
    }

    return (
      <MachineStatsCounters 
        stats={dashboardStatistics} 
        displayConfig={DISPLAY_CONFIG} 
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
          {isLoading ? <LoadingState /> : renderContent()}
        </Box>
      </Card>
    </Container>
  );
}
