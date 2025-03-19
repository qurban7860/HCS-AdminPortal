import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Card, Grid, Divider } from '@mui/material';
// slices
import { getReportTicketStatuses } from '../../../redux/slices/ticket/ticketSettings/ticketStatuses';
// hooks
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { PATH_SUPPORT } from '../../../routes/paths';
import PieChart from '../../../components/Charts/PieChart';
import { getPeriodValueAndUnit } from './utils/Constant';

export default function TicketStatusViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketStatuses } = useSelector((state) => state.ticketStatuses);

  const [statusData, setStatusData] = useState({ series: [], labels: [], colors: [] });
  const [totalStatuses, setTotalStatuses] = useState(0);

  useLayoutEffect(() => {
    dispatch(getReportTicketStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (ticketStatuses && ticketStatuses.countsByField) {
      const statusCounts = {};
      const statusColors = {};
      let emptyStatusCount = 0;

      ticketStatuses.countsByField.forEach((item) => {
        const statusKey = item.name;
        const statusColor = item.color || 'gray';

        if (statusKey) {
          statusCounts[statusKey] = (statusCounts[statusKey] || 0) + item.count;
          statusColors[statusKey] = statusColor;
        } else {
          emptyStatusCount += item.count;
        }
      });

      if (emptyStatusCount > 0) {
        statusCounts.Other = (statusCounts.Other || 0) + emptyStatusCount;
        statusColors.Other = 'gray';
      }

      const formattedData = Object.entries(statusCounts)
        .reduce(
          (acc, [key, value]) => {
            acc.labels.push(key);
            acc.series.push(value);
            acc.colors.push(statusColors[key]);
            return acc;
          },
          { series: [], labels: [], colors: [] }
        );

      setStatusData(formattedData);
      setTotalStatuses(Object.values(statusCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setStatusData({ series: [], labels: [], colors: [] });
      setTotalStatuses(0);
    }
  }, [ticketStatuses]);

  const handlePeriodChange = (newPeriod) => {
    const { value, unit } = getPeriodValueAndUnit(newPeriod);
    dispatch(getReportTicketStatuses(value, unit));
  };

  return (
    <Container maxWidth={false} sx={{ height: 'auto' }}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Status" icon="material-symbols:list-alt-outline" />
      </Card>
      <Card sx={{ p: 2, pt: 0 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Grid item xs={12} sm={6}>
            <ViewFormEditDeleteButtons backLink={() => navigate(PATH_SUPPORT.supportDashboard.root)} />
          </Grid>
        </Grid>
        <Divider sx={{ paddingTop: 1 }} />
        <Grid container>
          <Grid item xs={12}>
            <PieChart chartData={statusData} totalIssues={totalStatuses} title="Status" onPeriodChange={handlePeriodChange} />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}