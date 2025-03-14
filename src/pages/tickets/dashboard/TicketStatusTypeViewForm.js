import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Card, Grid, Divider } from '@mui/material';
// slices
import { getTickets } from '../../../redux/slices/ticket/tickets';
// hooks
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { PATH_SUPPORT } from '../../../routes/paths';
import PieChart from '../../../components/Charts/PieChart';

export default function TicketStatusTypeViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets } = useSelector((state) => state.tickets);

  const [statusTypeData, setStatusTypeData] = useState({ series: [], labels: [], colors: [] });
  const [totalStatusTypes, setTotalStatusTypes] = useState(0);
  const [period, setPeriod] = useState('All'); 

  useLayoutEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  useEffect(() => {
    if (tickets && tickets.data && tickets.data.length > 0) {
      const typeCounts = {};
      const typeColors = {};
      let emptyStatusTypeCount = 0;
      let filteredTickets = tickets.data;

      if (period !== 'All') {
        const now = new Date();
        if (period === 'Daily') {
          const last30Days = new Date(now);
          last30Days.setDate(now.getDate() - 30);
          filteredTickets = tickets.data.filter((ticket) => new Date(ticket.createdAt) >= last30Days);
        } else if (period === 'Monthly') {
          const last12Months = new Date(now);
          last12Months.setMonth(now.getMonth() - 12);
          filteredTickets = tickets.data.filter((ticket) => new Date(ticket.createdAt) >= last12Months);
        } else if (period === 'Yearly') {
          const last5Years = new Date(now);
          last5Years.setFullYear(now.getFullYear() - 5);
          filteredTickets = tickets.data.filter((ticket) => new Date(ticket.createdAt) >= last5Years);
        }
      }

      filteredTickets.forEach((ticket) => {
        const statusTypeKey = ticket.status?.statusType?.name;
        const statusTypeColor = ticket.status?.statusType?.color || 'gray';

        if (statusTypeKey) {
          typeCounts[statusTypeKey] = (typeCounts[statusTypeKey] || 0) + 1;
          typeColors[statusTypeKey] = statusTypeColor;
        } else {
          emptyStatusTypeCount += 1;
        }
      });

      if (emptyStatusTypeCount > 0) {
        typeCounts.Other = (typeCounts.Other || 0) + emptyStatusTypeCount;
        typeColors.Other = 'gray';
      }

      const formatData = (counts, colors) =>
        Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .reduce(
            (acc, [key, value]) => {
              acc.labels.push(key);
              acc.series.push(value);
              acc.colors.push(colors[key]);
              return acc;
            },
            { series: [], labels: [], colors: [] }
          );

      setStatusTypeData(formatData(typeCounts, typeColors));
      setTotalStatusTypes(Object.values(typeCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setStatusTypeData({ series: [], labels: [], colors: [] });
      setTotalStatusTypes(0);
    }
  }, [tickets, period]); 

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };
  
  let chartTitle = 'Status Type'; 
  if (period === 'Daily') {
    chartTitle = 'Status Type [30 days]';
  } else if (period === 'Monthly') {
    chartTitle = 'Status Type [12 months]';
  } else if (period === 'Yearly') {
    chartTitle = 'Status Type [5 years]';
  }

  return (
    <Container maxWidth={false} sx={{ height: 'auto' }}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Status Type" icon="material-symbols:list-alt-outline" />
      </Card>
      <Card sx={{ p: 2, pt: 0 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Grid item xs={12} sm={6}>
            <ViewFormEditDeleteButtons
              backLink={() => navigate(PATH_SUPPORT.ticketDashboard.root)}
            />
          </Grid>
        </Grid>
        <Divider sx={{ paddingTop: 1 }} />
        <Grid container>
          <Grid item xs={12}>
            <PieChart chartData={statusTypeData} totalIssues={totalStatusTypes} title={chartTitle} onPeriodChange={handlePeriodChange} />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}