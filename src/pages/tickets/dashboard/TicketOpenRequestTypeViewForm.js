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

export default function TicketOpenRequestTypeViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets } = useSelector((state) => state.tickets);

  const [openRequestTypeData, setOpenRequestTypeData] = useState({ series: [], labels: [], colors: [] });
  const [totalOpenRequestTypes, setTotalOpenRequestTypes] = useState(0);
  const [period, setPeriod] = useState('All'); 

  useLayoutEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  useEffect(() => {
    if (tickets && tickets.data && tickets.data.length > 0) {
      const openRequestTypeCounts = {};
      const openRequestTypeColors = {};
      let emptyOpenRequestTypeCount = 0;
      let filteredTickets = tickets.data;

      if (period !== 'All') {
        const now = new Date();
        if (period === '1 Month') {
          const last1Month = new Date(now);
          last1Month.setMonth(now.getMonth() - 1);
          filteredTickets = tickets.data.filter((ticket) => new Date(ticket.createdAt) >= last1Month);
        } else if (period === '1 Year') {
          const last1Year = new Date(now);
          last1Year.setFullYear(now.getFullYear() - 1);
          filteredTickets = tickets.data.filter((ticket) => new Date(ticket.createdAt) >= last1Year);
        }
      }

      filteredTickets = filteredTickets.filter((ticket) => ticket.isActive);

      filteredTickets.forEach((ticket) => {
        const requestTypeKey = ticket.requestType?.name;
        const requestTypeColor = ticket.requestType?.color || 'gray';

        if (requestTypeKey) {
          openRequestTypeCounts[requestTypeKey] = (openRequestTypeCounts[requestTypeKey] || 0) + 1;
          openRequestTypeColors[requestTypeKey] = requestTypeColor;
        } else {
          emptyOpenRequestTypeCount += 1;
        }
      });

      if (emptyOpenRequestTypeCount > 0) {
        openRequestTypeCounts.Other = (openRequestTypeCounts.Other || 0) + emptyOpenRequestTypeCount;
        openRequestTypeColors.Other = 'gray';
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

      setOpenRequestTypeData(formatData(openRequestTypeCounts, openRequestTypeColors));
      setTotalOpenRequestTypes(Object.values(openRequestTypeCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setOpenRequestTypeData({ series: [], labels: [], colors: [] });
      setTotalOpenRequestTypes(0);
    }
  }, [tickets, period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };
  
  return (
    <Container maxWidth={false} sx={{ height: 'auto' }}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Request Type" icon="material-symbols:list-alt-outline" />
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
            <PieChart chartData={openRequestTypeData} totalIssues={totalOpenRequestTypes} isOpened title="Request Type" onPeriodChange={handlePeriodChange} />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}