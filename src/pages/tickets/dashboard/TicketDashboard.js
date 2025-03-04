import { useEffect, useLayoutEffect, useState } from 'react';
// @mui
import { Grid } from '@mui/material';
import { StyledContainer, StyledGlobalCard } from '../../../theme/styles/default-styles';
import { useDispatch, useSelector } from '../../../redux/store';
// sections
import HowickWelcome from '../../../components/DashboardWidgets/HowickWelcome';
import { getTickets } from '../../../redux/slices/ticket/tickets';
import PieChart from '../../../components/Charts/PieChart';
// styles
import { varFade } from '../../../components/animate';
// constants
import { TITLES } from '../../../constants/default-constants';

export default function TicketDashboard() {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);

  useLayoutEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const [issueTypeData, setIssueTypeData] = useState({ series: [], labels: [], colors: [] });
  const [statusData, setStatusData] = useState({ series: [], labels: [], colors: [] });
  const [totalIssueTypes, setTotalIssueTypes] = useState(0);
  const [totalStatuses, setTotalStatuses] = useState(0);

  useEffect(() => {
    if (tickets && tickets.data && tickets.data.length > 0) {
      const typeCounts = {};
      const typeColors = {};
      const statusCounts = {};
      const statusColors = {};

      tickets.data.forEach((ticket) => {
        const issueKey = ticket.issueType?.name;
        const issueColor = ticket.issueType?.color || 'gray';
        const statusKey = ticket.status?.name;
        const statusColor = ticket.status?.color || 'gray';

        if (issueKey) {
          typeCounts[issueKey] = (typeCounts[issueKey] || 0) + 1;
          typeColors[issueKey] = issueColor;
        }
        if (statusKey) {
          statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
          statusColors[statusKey] = statusColor;
        }
      });

      const sortedIssueTypes = Object.entries(typeCounts)
        .sort(([, a], [, b]) => b - a)
        .reduce(
          (acc, [key, value]) => {
            acc.labels.push(key);
            acc.series.push(value);
            acc.colors.push(typeColors[key]);
            return acc;
          },
          { series: [], labels: [], colors: [] }
        );

      setIssueTypeData(sortedIssueTypes);
      setTotalIssueTypes(sortedIssueTypes.series.reduce((acc, val) => acc + val, 0));

      const sortedStatuses = Object.entries(statusCounts)
        .sort(([, a], [, b]) => b - a)
        .reduce(
          (acc, [key, value]) => {
            acc.labels.push(key);
            acc.series.push(value);
            acc.colors.push(statusColors[key]);
            return acc;
          },
          { series: [], labels: [], colors: [] }
        );

      setStatusData(sortedStatuses);
      setTotalStatuses(sortedStatuses.series.reduce((acc, val) => acc + val, 0));
    } else {
      setIssueTypeData({ series: [], labels: [], colors: [] });
      setStatusData({ series: [], labels: [], colors: [] });
      setTotalIssueTypes(0);
      setTotalStatuses(0);
    }
  }, [tickets]);

  return (
    <StyledContainer maxWidth={false}>
      <Grid container>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} mb={-3}>
            <HowickWelcome title={TITLES.SUPPORT_SERV} description={TITLES.WELCOME_DESC} />
          </Grid>
         <Grid item xs={12} sm={12} md={6} lg={6}>
          <StyledGlobalCard sx={{ py: 3, mb: 3}} variants={varFade().inDown}>
            <PieChart chartData={issueTypeData} totalIssues={totalIssueTypes} title="Support Tickets Issue Types" />
          </StyledGlobalCard>
         </Grid>
         <Grid item xs={12} sm={12} md={6} lg={6}>
          <StyledGlobalCard sx={{ py: 3, mb: 3}} variants={varFade().inDown}>
            <PieChart chartData={statusData} totalIssues={totalStatuses} title="Support Tickets Statuses" />
          </StyledGlobalCard>
         </Grid>
        </Grid>     
      </Grid>
    </StyledContainer>
  );
}
