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
  const [requestTypeData, setRequestTypeData] = useState({ series: [], labels: [], colors: [] });
  const [statusData, setStatusData] = useState({ series: [], labels: [], colors: [] });
  const [statusTypeData, setStatusTypeData] = useState({ series: [], labels: [], colors: [] });
  const [machineData, setMachineData] = useState({ series: [], labels: [], colors: [] });
  const [totalIssueTypes, setTotalIssueTypes] = useState(0);
  const [totalRequestTypes, setTotalRequestTypes] = useState(0);
  const [totalStatuses, setTotalStatuses] = useState(0);
  const [totalStatusTypes, setTotalStatusTypes] = useState(0);
  const [totalMachines, setTotalMachines] = useState(0);

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
      const machineCounts = {};
      const machineColors = {};
      let emptyRequestTypeCount = 0;
      let emptyStatusCount = 0;
      let emptyStatusTypeCount = 0;

      tickets.data.forEach((ticket) => {
        const issueKey = ticket.issueType?.name;
        const issueColor = ticket.issueType?.color || 'gray';
        const requestTypeKey = ticket.requestType?.name;
        const requestTypeColor = ticket.requestType?.color || 'gray';
        const statusKey = ticket.status?.name;
        const statusColor = ticket.status?.color || 'gray';
        const statusTypeKey = ticket.status?.statusType?.name;
        const statusTypeColor = ticket.status?.statusType?.color || 'gray';
        const machineKey = ticket.machine?.serialNo;
        const machineColor = ticket.machine?.color || 'gray'; 

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
        if (machineKey) {
          machineCounts[machineKey] = (machineCounts[machineKey] || 0) + 1;
          machineColors[machineKey] = machineColor;
        }
      });
      
      if (emptyRequestTypeCount > 0) {
        requestTypeCounts.Other = (requestTypeCounts.Other || 0) + emptyRequestTypeCount;
        requestTypeColors.Other = "gray";
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

      setMachineData(formatData(machineCounts, machineColors));
      setTotalMachines(Object.values(machineCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setIssueTypeData({ series: [], labels: [], colors: [] });
      setRequestTypeData({ series: [], labels: [], colors: [] });
      setStatusData({ series: [], labels: [], colors: [] });
      setStatusTypeData({ series: [], labels: [], colors: [] });
      setMachineData({ series: [], labels: [], colors: [] });
      setTotalIssueTypes(0);
      setTotalRequestTypes(0);
      setTotalStatuses(0);
      setTotalStatusTypes(0);
      setTotalMachines(0);
    }
  }, [tickets]);

  return (
    <StyledContainer maxWidth={false}>
      <Grid container>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} mb={-3}>
            <HowickWelcome title={TITLES.SUPPORT_SERV} description={TITLES.WELCOME_DESC} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={issueTypeData} totalIssues={totalIssueTypes} title="Issue Type" />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={statusData} totalIssues={totalStatuses} title="Status" />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={statusTypeData} totalIssues={totalStatusTypes} title="Status Type" />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={requestTypeData} totalIssues={totalRequestTypes} title="Request Type" />
            </StyledGlobalCard>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={machineData} totalIssues={totalMachines} title="Machine" />
            </StyledGlobalCard>
          </Grid> */}
        </Grid>
      </Grid>
    </StyledContainer>
  );
}