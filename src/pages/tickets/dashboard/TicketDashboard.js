import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import { Grid } from '@mui/material';
import { StyledContainer, StyledGlobalCard } from '../../../theme/styles/default-styles';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_SUPPORT } from '../../../routes/paths';
// sections
import HowickWelcome from '../../../components/DashboardWidgets/HowickWelcome';
import { getTickets } from '../../../redux/slices/ticket/tickets';
import PieChart from '../../../components/Charts/PieChart';
import BarChart from '../../../components/Charts/BarChart';
// styles
import { varFade } from '../../../components/animate';
// constants
import { TITLES } from '../../../constants/default-constants';

export default function TicketDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets } = useSelector((state) => state.tickets);

  useLayoutEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const [issueTypeData, setIssueTypeData] = useState({ series: [], labels: [], colors: [] });
  const [requestTypeData, setRequestTypeData] = useState({ series: [], labels: [], colors: [] });
  const [openIssueTypeData, setOpenIssueTypeData] = useState({ series: [], labels: [], colors: [] });
  const [openRequestTypeData, setOpenRequestTypeData] = useState({ series: [], labels: [], colors: [] });
  const [statusData, setStatusData] = useState({ series: [], labels: [], colors: [] });
  const [statusTypeData, setStatusTypeData] = useState({ series: [], labels: [], colors: [] });
  const [totalIssueTypes, setTotalIssueTypes] = useState(0);
  const [totalRequestTypes, setTotalRequestTypes] = useState(0);
  const [totalOpenIssueTypes, setTotalOpenIssueTypes] = useState(0);
  const [totalOpenRequestTypes, setTotalOpenRequestTypes] = useState(0);
  const [totalStatuses, setTotalStatuses] = useState(0);
  const [totalStatusTypes, setTotalStatusTypes] = useState(0);
  const [ticketBarChartData, setTicketBarChartData] = useState({ series: [], labels: [] });

  useEffect(() => {
    if (tickets && tickets.data && tickets.data.length > 0) {
      const typeCounts = {};
      const typeColors = {};
      const requestTypeCounts = {};
      const requestTypeColors = {};
      const statusCounts = {};
      const statusColors = {};
      const statusTypeCounts = {}; 
      const statusTypeColors = {};
      let emptyRequestTypeCount = 0;
      let emptyOpenRequestTypeCount = 0;
      let emptyStatusCount = 0;
      let emptyStatusTypeCount = 0;

      const openTypeCounts = {};
      const openTypeColors = {};
      const openRequestTypeCounts = {};
      const openRequestTypeColors = {};

      tickets.data.forEach((ticket) => {
        const issueKey = ticket.issueType?.name;
        const issueColor = ticket.issueType?.color || 'gray';
        const requestTypeKey = ticket.requestType?.name;
        const requestTypeColor = ticket.requestType?.color || 'gray';
        const statusKey = ticket.status?.name;
        const statusColor = ticket.status?.color || 'gray';
        const statusTypeKey = ticket.status?.statusType?.name;
        const statusTypeColor = ticket.status?.statusType?.color || 'gray';
  
        if (issueKey) {
          typeCounts[issueKey] = (typeCounts[issueKey] || 0) + 1;
          typeColors[issueKey] = issueColor;
        }
        if (requestTypeKey) {
          requestTypeCounts[requestTypeKey] = (requestTypeCounts[requestTypeKey] || 0) + 1;
          requestTypeColors[requestTypeKey] = requestTypeColor;
        } else {
          emptyRequestTypeCount += 1;
        }
        if (statusKey) {
          statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
          statusColors[statusKey] = statusColor;
        } else {
          emptyStatusCount += 1;
        }
        if (statusTypeKey) {
          statusTypeCounts[statusTypeKey] = (statusTypeCounts[statusTypeKey] || 0) + 1;
          statusTypeColors[statusTypeKey] = statusTypeColor;
        } else {
          emptyStatusTypeCount += 1;
        }

        if (ticket.isActive) {
          if (issueKey) {
            openTypeCounts[issueKey] = (openTypeCounts[issueKey] || 0) + 1;
            openTypeColors[issueKey] = issueColor;
          }
          if (requestTypeKey) {
            openRequestTypeCounts[requestTypeKey] = (openRequestTypeCounts[requestTypeKey] || 0) + 1;
            openRequestTypeColors[requestTypeKey] = requestTypeColor;
          } else {
            emptyOpenRequestTypeCount += 1;
          }
        }
      });
      
      if (emptyRequestTypeCount > 0) {
        requestTypeCounts.Other = (requestTypeCounts.Other || 0) + emptyRequestTypeCount;
        requestTypeColors.Other = "gray";
      }
      if (emptyOpenRequestTypeCount > 0) {
        openRequestTypeCounts.Other = (openRequestTypeCounts.Other || 0) + emptyOpenRequestTypeCount;
        openRequestTypeColors.Other = "gray";
      }
      if (emptyStatusCount > 0) {
        statusCounts.Other = (statusCounts.Other || 0) + emptyStatusCount;
        statusColors.Other = "gray";
      }
      if (emptyStatusTypeCount > 0) {
        statusTypeCounts.Other = (statusTypeCounts.Other || 0) + emptyStatusTypeCount;
        statusTypeColors.Other = 'gray';
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
      
      setIssueTypeData(formatData(typeCounts, typeColors));
      setTotalIssueTypes(Object.values(typeCounts).reduce((acc, val) => acc + val, 0));
      
      setRequestTypeData(formatData(requestTypeCounts, requestTypeColors));
      setTotalRequestTypes(Object.values(requestTypeCounts).reduce((acc, val) => acc + val, 0));

      setStatusData(formatData(statusCounts, statusColors));
      setTotalStatuses(Object.values(statusCounts).reduce((acc, val) => acc + val, 0));

      setStatusTypeData(formatData(statusTypeCounts, statusTypeColors));
      setTotalStatusTypes(Object.values(statusTypeCounts).reduce((acc, val) => acc + val, 0));
      
      setOpenIssueTypeData(formatData(openTypeCounts, openTypeColors));
      setTotalOpenIssueTypes(Object.values(openTypeCounts).reduce((acc, val) => acc + val, 0));

      setOpenRequestTypeData(formatData(openRequestTypeCounts, openRequestTypeColors));
      setTotalOpenRequestTypes(Object.values(openRequestTypeCounts).reduce((acc, val) => acc + val, 0));
      
      const dateCounts = {};
      tickets.data.forEach((ticket) => {
        const createdDate = new Date(ticket?.createdAt).toISOString().split('T')[0];
        const resolved = ticket?.status?.statusType?.isResolved;
        const resolvedDate = resolved && ticket?.updatedAt ? new Date(ticket?.updatedAt).toISOString().split('T')[0] : null;

        if (!dateCounts[createdDate]) {
          dateCounts[createdDate] = { created: 0, resolved: 0 };
        }
        dateCounts[createdDate].created += 1; 
        
        if (resolved && resolvedDate) {
          if (!dateCounts[resolvedDate]) {
            dateCounts[resolvedDate] = { created: 0, resolved: 0 };
          }
          dateCounts[resolvedDate].resolved += 1; 
        }
      });

      const sortedDates = Array.from(
        new Set([
          ...Object.keys(dateCounts),
          ...Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
          }),
        ])
      ).sort();
      
      const last30Days = sortedDates.slice(-30);
      
      const barChartSeries = [
        { name: 'Created', data: last30Days.map((date) => dateCounts[date]?.created || 0) },
        { name: 'Resolved', data: last30Days.map((date) => dateCounts[date]?.resolved || 0) },
      ];
      
      const barChartLabels = last30Days.map((dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}-${month}`;
      });
      
      setTicketBarChartData({ series: barChartSeries, labels: barChartLabels });
      
    } else {
      setIssueTypeData({ series: [], labels: [], colors: [] });
      setRequestTypeData({ series: [], labels: [], colors: [] });
      setOpenIssueTypeData({ series: [], labels: [], colors: [] });
      setOpenRequestTypeData({ series: [], labels: [], colors: [] });
      setStatusData({ series: [], labels: [], colors: [] });
      setStatusTypeData({ series: [], labels: [], colors: [] });
      setTicketBarChartData({ series: [], labels: [] });
      setTotalIssueTypes(0);
      setTotalRequestTypes(0);
      setTotalOpenIssueTypes(0);
      setTotalOpenRequestTypes(0);
      setTotalStatuses(0);
      setTotalStatusTypes(0);
    }
  }, [tickets]);

  const handleExpandGraph = async (graph) => {
    if (graph === 'issueType') {
      navigate(PATH_SUPPORT.ticketDashboard.ticketIssueType);
    } else if (graph === 'requestType') {
      navigate(PATH_SUPPORT.ticketDashboard.ticketRequestType);
    } else if (graph === 'statusType') {
      navigate(PATH_SUPPORT.ticketDashboard.ticketStatusType);
    } else if (graph === 'status') {
      navigate(PATH_SUPPORT.ticketDashboard.ticketStatus);
    } 
  };

  return (
    <StyledContainer maxWidth={false}>
      <Grid container>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} mb={-3}>
            <HowickWelcome title={TITLES.SUPPORT_SERV} description={TITLES.WELCOME_DESC} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={issueTypeData} totalIssues={totalIssueTypes} title="Issue Type" onExpand={() => handleExpandGraph('issueType')}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={openIssueTypeData} totalIssues={totalOpenIssueTypes} title="Open Issue Type" onExpand={() => handleExpandGraph('issueType')}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={requestTypeData} totalIssues={totalRequestTypes} title="Request Type" onExpand={() => handleExpandGraph('requestType')}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={openRequestTypeData} totalIssues={totalOpenRequestTypes} title="Open Request Type" onExpand={() => handleExpandGraph('requestType')}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={statusTypeData} totalIssues={totalStatusTypes} title="Status Type" onExpand={() => handleExpandGraph('statusType')}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={statusData} totalIssues={totalStatuses} title="Status" onExpand={() => handleExpandGraph('status')}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <BarChart chartData={ticketBarChartData} title="Tickets Created vs Resolved" />
            </StyledGlobalCard>
          </Grid>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}