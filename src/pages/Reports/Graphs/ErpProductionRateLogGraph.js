import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Grid, Skeleton, Box } from '@mui/material';
import LogChartStacked from '../../../components/machineLogs/LogStackedChart';
import { TableNoData } from '../../../components/table';

const ErpProductionRateLogGraph = ({ timePeriod, customer, graphLabels, dateFrom, dateTo, efficiency }) => {
  const [graphData, setGraphData] = useState([]);
  const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);

  useEffect(() => {
    if (machineLogsGraphData) {
      const convertedData = machineLogsGraphData.map((item) => ({
        ...item,
        _id: timePeriod === 'Monthly' ? item._id.replace(/^Sep /, 'Sept ') : item._id,
      }));
      setGraphData(convertedData);
    }
  }, [machineLogsGraphData, timePeriod]);

  const processGraphData = (skipZeroValues, withEfficiencyLine) => {
    if (!graphData || graphData.length === 0) {
      return null;
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

    const efficiencyData = labels.map(label => {
      const item = dataMap.get(label);
      if (item && efficiency > 0) {
        return (((item.componentLength || 0) + (item.waste || 0)) / efficiency) * 100;
      }
      return 0;
    });

    if (withEfficiencyLine && efficiency > 0) {
      const combinedLength = producedLength.map((length, index) => length + wasteLength[index]);
      return {
        categories: labels,
        series: [
          { name: 'Total Length (m)', data: combinedLength },
          { name: 'Efficiency (%)', data: efficiencyData },
        ],
      };
    }

    return {
      categories: labels,
      series: [
        { name: 'Produced Length (m)', data: producedLength },
        { name: 'Waste Length (m)', data: wasteLength },
      ],
    };
  };

  const isNotFound = !isLoading && !graphData.length;

  return (
    <Grid item xs={12} sm={12} md={12} lg={10} xl={6} sx={{ mt: 3 }}>
      <Card sx={{ p: 4, boxShadow: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Production Rate Over Time
        </Typography>

        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
        ) : (
          <>
            {graphData?.length > 0 ? (
              <LogChartStacked 
                processGraphData={(skipZero) => processGraphData(skipZero, true)} 
                graphLabels={graphLabels} 
                isLoading={isLoading} 
                withEfficiencyLine={efficiency > 0} 
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
  timePeriod: PropTypes.oneOf(['Hourly', 'Daily', 'Weekly', 'Monthly']).isRequired, 
  customer: PropTypes.object,
  graphLabels: PropTypes.object,
  dateFrom: PropTypes.instanceOf(Date),
  dateTo: PropTypes.instanceOf(Date),
  efficiency: PropTypes.number.isRequired,
};