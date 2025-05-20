// react
import { useEffect } from 'react';
// @mui
import {
  Card,
  Container,
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from '@mui/material';
import PropTypes from 'prop-types';
// routes
import { useParams } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import MachineTabContainer from '../util/MachineTabContainer';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { getCompleteMachineDashboardStatistics } from '../../../redux/slices/products/machineDashboard';
// import { STATS_CONFIG } from './constants';

// ----------------------------------------------------------------------

export default function MachineDashboard() {
  const { dashboardStatistics, isLoading, error } = useSelector((state) => state.machineDashboard);
  const dispatch = useDispatch();
  const { machineId } = useParams();

  useEffect(() => {
    if (machineId) {
      dispatch(getCompleteMachineDashboardStatistics(machineId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineId]);

  // Define columns for each table
  const generalColumns = [
    { id: 'label', label: 'Description' },
    { id: 'count', label: 'Count', align: 'right' },
    {
      id: 'length',
      label: 'Length (m)',
      align: 'right',
      format: (value) =>
        Number(value)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || '0.00',
    },
  ];

  const wasteColumns = [
    { id: 'label', label: 'Waste Type' },
    { id: 'count', label: 'Count', align: 'right' },
    {
      id: 'length',
      label: 'Length (m)',
      align: 'right',
      format: (value) =>
        Number(value)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || '0.00',
    },
  ];

  const totalColumns = [
    { id: 'label', label: 'Metric' },
    {
      id: 'value',
      label: 'Value',
      align: 'right',
      format: (value) =>
        typeof value === 'number'
          ? Number(value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : value,
    },
  ];

  const renderTableSkeleton = (columns, rowCount = 5) => (
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.lighter' }}>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align || 'left'}>
                <Typography variant="subtitle2">{column.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rowCount)].map((_, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  <Skeleton animation="wave" width={column.id === 'label' ? '100%' : 60} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                General Production Data
              </Typography>
              {renderTableSkeleton(generalColumns)}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Production Totals
              </Typography>
              {renderTableSkeleton(totalColumns, 4)}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Waste Analysis
              </Typography>
              {renderTableSkeleton(wasteColumns)}
            </Box>
          </Grid>
        </Grid>
      );
    }

    if (error) {
      return (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}
        >
          <Typography color="error">Error loading dashboard data</Typography>
        </Box>
      );
    }

    if (dashboardStatistics) {
      return (
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            {dashboardStatistics.generalData && (
              <DataTable
                title="General Production Data"
                data={dashboardStatistics.generalData}
                columns={generalColumns}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {dashboardStatistics.totalData && (
              <DataTable
                title="Production Totals"
                data={dashboardStatistics.totalData}
                columns={totalColumns}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {dashboardStatistics.wasteData && (
              <DataTable
                title="Waste Analysis"
                data={dashboardStatistics.wasteData}
                columns={wasteColumns}
              />
            )}
          </Grid>
        </Grid>
      );
    }

    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}
      >
        <Typography>No dashboard data available</Typography>
      </Box>
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
        {renderContent()}
      </Card>
    </Container>
  );
}

const DataTable = ({ title, data, columns }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.lighter' }}>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align || 'left'}>
                <Typography variant="subtitle2">{column.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} hover>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  {
                    // eslint-disable-next-line no-nested-ternary
                    row[column.id] === null
                      ? ''
                      : column.format
                      ? column.format(row[column.id])
                      : row[column.id]
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);
DataTable.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
};
