import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Grid, Skeleton, Box } from '@mui/material';
import LogLineBarChart from '../../../components/machineLogs/LogLineBarChart';
import LogChartStacked from '../../../components/machineLogs/LogStackedChart';
import { TableNoData } from '../../../components/table';
import { convertValue } from '../../../utils/convertUnits';

const ErpProductionRateLogGraph = ({ timePeriod, customer, graphLabels, dateFrom, dateTo, efficiency, machineSerialNo, unitType = 'Metric' }) => {
  const [graphData, setGraphData] = useState([]);
  const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);

  useEffect(() => {
    if (machineLogsGraphData) {
      const convertedData = machineLogsGraphData.map((item) => {
        const componentLength = parseFloat(convertValue(item.componentLength, 'mm', unitType)?.convertedValue || 0);
        const waste = parseFloat(convertValue(item.waste, 'mm', unitType)?.convertedValue || 0);
          return {
            ...item,
            componentLength,
            waste,
            _id: timePeriod === 'Monthly' ? item._id.replace(/^Sep /, 'Sept ') : item._id,
          };
      });
  
      setGraphData(convertedData);
    } else {
      setGraphData([]);
    }
  }, [machineLogsGraphData, timePeriod, unitType]);

  const processGraphData = (skipZeroValues) => {
    if (!Array.isArray(graphData) || graphData.length === 0) {
      return { categories: [], series: [] };
    }

    const dataMap = new Map();
    graphData.forEach((item) => dataMap.set(item._id, item));

    const labels = [];
    const current = new Date(dateFrom);
    const end = new Date(dateTo);
    const pad = (n) => n.toString().padStart(2, '0');

    const addLabel = (label) => {
      if (!labels.includes(label)) labels.push(label);
    };

    if (timePeriod === 'Hourly') {
      current.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      while (current <= end) {
        const label = `${pad(current.getMonth() + 1)}/${pad(current.getDate())} ${pad(current.getHours())}`;
        if (dataMap.has(label) || !skipZeroValues) addLabel(label);
        current.setHours(current.getHours() + 1);
      }
    }

    const producedLength = labels.map(label => dataMap.get(label)?.componentLength || 0);
    const wasteLength = labels.map(label => dataMap.get(label)?.waste || 0);
    const unitLabel = unitType === 'Imperial' ? 'in' : 'm';

    const series = [
      { name: `Produced Length (${unitLabel})`, data: producedLength },
      { name: `Waste Length (${unitLabel})`, data: wasteLength },
    ];

    if (efficiency) {
      const efficiencyLine = labels.map((label, i) => {
        const total = producedLength[i] + wasteLength[i];
        return total > 0 ? (total / efficiency) * 100 : null;
      });
      series.push({ name: 'Efficiency Line (%)', type: 'line', data: efficiencyLine });
    }

    return {
      categories: labels,
      series
    };
  };

  const getGraphTitle = () => {
    let titlePrefix = '';
    switch (timePeriod) {
      case 'Hourly':
        titlePrefix = 'Hourly Production Graph';
        break;
      default:
        titlePrefix = 'Production Graph';
    }
    return `${titlePrefix} for Machine ${machineSerialNo || ''}`;
  };

  const isNotFound = !isLoading && !graphData.length;

  return (
    <Grid item xs={12} sm={12} md={12} lg={10} xl={6} sx={{ mt: 3 }}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', mb: -1, mt: -1 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Meterage Production
          </Typography>
        </Box>

        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
        ) : (
          <>
            {graphData?.length > 0 ? (
              <LogLineBarChart 
                processGraphData={(skipZero) => processGraphData(skipZero)} 
                graphLabels={graphLabels} 
                isLoading={isLoading} 
                machineSerialNo={getGraphTitle()}
                efficiency={efficiency}
                unitType={unitType}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
                <TableNoData isNotFound={isNotFound} />
              </Box>
            )}
          </>
        )}
      </Card>
    </Grid>
  );
};

export default ErpProductionRateLogGraph;

ErpProductionRateLogGraph.propTypes = {
  timePeriod: PropTypes.oneOf(['Hourly']).isRequired,
  customer: PropTypes.object,
  graphLabels: PropTypes.object,
  dateFrom: PropTypes.instanceOf(Date),
  dateTo: PropTypes.instanceOf(Date),
  efficiency: PropTypes.number,
  machineSerialNo: PropTypes.string,
  unitType: PropTypes.oneOf(['Metric', 'Imperial']),
};