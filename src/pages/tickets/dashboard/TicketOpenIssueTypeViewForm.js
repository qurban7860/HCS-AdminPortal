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

export default function TicketOpenIssueTypeViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets } = useSelector((state) => state.tickets);

  const [openIssueTypeData, setOpenIssueTypeData] = useState({ series: [], labels: [], colors: [] });
  const [totalOpenIssueTypes, setTotalOpenIssueTypes] = useState(0);
  const [period, setPeriod] = useState('All'); 

  useLayoutEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  useEffect(() => {
    if (tickets && tickets.data && tickets.data.length > 0) {
      const openTypeCounts = {};
      const openTypeColors = {};
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
        const issueKey = ticket.issueType?.name;
        const issueColor = ticket.issueType?.color || 'gray';

        if (ticket.isActive && issueKey) {
          openTypeCounts[issueKey] = (openTypeCounts[issueKey] || 0) + 1;
          openTypeColors[issueKey] = issueColor;
        }
      });

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

      setOpenIssueTypeData(formatData(openTypeCounts, openTypeColors));
      setTotalOpenIssueTypes(Object.values(openTypeCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setOpenIssueTypeData({ series: [], labels: [], colors: [] });
      setTotalOpenIssueTypes(0);
    }
  }, [tickets, period]); 

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <Container maxWidth={false} sx={{ height: 'auto' }}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
      <Cover name="Issue Type" icon="material-symbols:list-alt-outline" />
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
            <PieChart chartData={openIssueTypeData} totalIssues={totalOpenIssueTypes} isOpened title="Issue Type" onPeriodChange={handlePeriodChange}  />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}