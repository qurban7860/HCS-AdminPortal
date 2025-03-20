import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
// @mui
import { Grid } from '@mui/material';
import { StyledContainer, StyledGlobalCard } from '../../../theme/styles/default-styles';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_SUPPORT } from '../../../routes/paths';
// sections
import HowickWelcome from '../../../components/DashboardWidgets/HowickWelcome';
import { getTickets } from '../../../redux/slices/ticket/tickets';
import { getReportTicketIssueTypes, getOpenTicketIssueTypes } from '../../../redux/slices/ticket/ticketSettings/ticketIssueTypes';
import { getReportTicketRequestTypes, getOpenTicketRequestTypes } from '../../../redux/slices/ticket/ticketSettings/ticketRequestTypes';
import { getReportTicketStatusTypes } from '../../../redux/slices/ticket/ticketSettings/ticketStatusTypes';
import { getReportTicketStatuses } from '../../../redux/slices/ticket/ticketSettings/ticketStatuses';
import PieChart from '../../../components/Charts/PieChart';
import BarChart from '../../../components/Charts/BarChart';
import { getPeriodValueAndUnit } from './utils/Constant';
// styles
import { varFade } from '../../../components/animate';
// constants
import { TITLES } from '../../../constants/default-constants';

export default function SupportDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets } = useSelector((state) => state.tickets);
  const { openTicketIssueTypes, ticketIssueTypes } = useSelector((state) => state.ticketIssueTypes);
  const { openTicketRequestTypes, ticketRequestTypes } = useSelector((state) => state.ticketRequestTypes);
  const { ticketStatusTypes } = useSelector((state) => state.ticketStatusTypes);
  const { ticketStatuses } = useSelector((state) => state.ticketStatuses);

  useLayoutEffect(() => {
    const date = new Date();
    dispatch(getTickets({createdAt: { $gte: new Date(date.setMonth(date.getMonth() - 1)) }}));
    dispatch(getOpenTicketIssueTypes());
    dispatch(getOpenTicketRequestTypes());
    dispatch(getReportTicketIssueTypes());
    dispatch(getReportTicketRequestTypes());
    dispatch(getReportTicketStatusTypes());
    dispatch(getReportTicketStatuses());
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
    // Process Issue Type Data
    const issueTypeCounts = ticketIssueTypes?.countsByField
      ? ticketIssueTypes.countsByField.reduce((acc, item) => {
          acc.labels.push(item.name || 'N/A');
          acc.series.push(item.count);
          acc.colors.push(item.color || 'gray');
          return acc;
        }, { series: [], labels: [], colors: [] })
      : { series: [], labels: [], colors: [] };
  
    setIssueTypeData(issueTypeCounts);
    setTotalIssueTypes(ticketIssueTypes?.totalCount || 0);
  
    // Process Request Type Data
    const requestTypeCounts = ticketRequestTypes?.countsByField
      ? ticketRequestTypes.countsByField.reduce((acc, item) => {
          if (item.name) {
            acc.labels.push(item.name);
            acc.series.push(item.count);
            acc.colors.push(item.color || 'gray');
          }
          return acc;
        }, { series: [], labels: [], colors: [] })
      : { series: [], labels: [], colors: [] };
  
    const otherRequestCount = ticketRequestTypes?.countsByField?.find(item => item.name === null)?.count || 0;
    if (otherRequestCount > 0 && requestTypeCounts.labels) {
      requestTypeCounts.labels.push('Others');
      requestTypeCounts.series.push(otherRequestCount);
      requestTypeCounts.colors.push('gray');
    }
  
    setRequestTypeData(requestTypeCounts);
    setTotalRequestTypes(ticketRequestTypes?.totalCount || 0);
  
    // Process Status Data
    const statusCounts = ticketStatuses?.countsByField
      ? ticketStatuses.countsByField.reduce((acc, item) => {
          if (item.name) {
            acc.labels.push(item.name);
            acc.series.push(item.count);
            acc.colors.push(item.color || 'gray');
          }
          return acc;
        }, { series: [], labels: [], colors: [] })
      : { series: [], labels: [], colors: [] };
  
    const otherStatusCount = ticketStatuses?.countsByField?.find(item => item.name === null)?.count || 0;
    if (otherStatusCount > 0 && statusCounts.labels) {
      statusCounts.labels.push('Others');
      statusCounts.series.push(otherStatusCount);
      statusCounts.colors.push('gray');
    }
  
    setStatusData(statusCounts);
    setTotalStatuses(ticketStatuses?.totalCount || 0);
  
    // Process Status Type Data
    const statusTypeCounts = ticketStatusTypes?.countsByField
      ? ticketStatusTypes.countsByField.reduce((acc, item) => {
          if (item.name) {
            acc.labels.push(item.name);
            acc.series.push(item.count);
            acc.colors.push(item.color || 'gray');
          }
          return acc;
        }, { series: [], labels: [], colors: [] })
      : { series: [], labels: [], colors: [] };
  
    const otherStatusTypeCount = ticketStatusTypes?.countsByField?.find(item => item.name === null)?.count || 0;
    if (otherStatusTypeCount > 0 && statusTypeCounts.labels) {
      statusTypeCounts.labels.push('Others');
      statusTypeCounts.series.push(otherStatusTypeCount);
      statusTypeCounts.colors.push('gray');
    }
  
    setStatusTypeData(statusTypeCounts);
    setTotalStatusTypes(ticketStatusTypes?.totalCount || 0);
  
    // Process Open Issue Type Data
    const openIssueTypeCounts = openTicketIssueTypes?.countsByField
      ? openTicketIssueTypes.countsByField.reduce((acc, item) => {
          acc.labels.push(item.name || 'N/A');
          acc.series.push(item.count);
          acc.colors.push(item.color || 'gray');
          return acc;
        }, { series: [], labels: [], colors: [] })
      : { series: [], labels: [], colors: [] };
  
    setOpenIssueTypeData(openIssueTypeCounts);
    setTotalOpenIssueTypes(openTicketIssueTypes?.countsByField?.reduce((sum, item) => sum + item.count, 0) || 0);
  
    // Process Open Request Type Data
    const openRequestTypeCounts = openTicketRequestTypes?.countsByField
      ? openTicketRequestTypes.countsByField.reduce((acc, item) => {
          if (item.name) {
            acc.labels.push(item.name);
            acc.series.push(item.count);
            acc.colors.push(item.color || 'gray');
          }
          return acc;
        }, { series: [], labels: [], colors: [] })
      : { series: [], labels: [], colors: [] };
  
    const otherOpenRequestCount = openTicketRequestTypes?.countsByField?.find(item => item.name === null)?.count || 0;
    if (otherOpenRequestCount > 0 && openRequestTypeCounts.labels) {
      openRequestTypeCounts.labels.push('Others');
      openRequestTypeCounts.series.push(otherOpenRequestCount);
      openRequestTypeCounts.colors.push('gray');
    }
  
    setOpenRequestTypeData(openRequestTypeCounts);
    setTotalOpenRequestTypes(openTicketRequestTypes?.countsByField?.reduce((sum, item) => sum + item.count, 0) || 0);

    // --- Bar Chart Ticket Created VS Resolved ---
    const dateCounts = {};
    if (tickets && Array.isArray(tickets)) {
      tickets.forEach((ticket) => {
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

      const last30Days = Array.from(
        new Set([
          ...Object.keys(dateCounts),
          ...Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
          }),
        ])
      ).sort();


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
      setTicketBarChartData({ series: [], labels: [] });
    }
    
  }, [openTicketIssueTypes, openTicketRequestTypes, ticketIssueTypes, ticketRequestTypes, ticketStatusTypes, ticketStatuses, tickets]);

  const handlePeriodChange = useCallback((newPeriod, chartType) => {
    const { value, unit } = getPeriodValueAndUnit(newPeriod);
    switch (chartType) {
      case 'issueType':
        dispatch(getReportTicketIssueTypes(value, unit));
        break;
      case 'requestType':
        dispatch(getReportTicketRequestTypes(value, unit));
        break;
      case 'openIssueType':
        dispatch(getOpenTicketIssueTypes(value, unit));
        break;
      case 'openRequestType':
        dispatch(getOpenTicketRequestTypes(value, unit));
        break;
      case 'status':
        dispatch(getReportTicketStatuses(value, unit));
        break;
      case 'statusType':
        dispatch(getReportTicketStatusTypes(value, unit));
        break;
      default:
        break;
    }
  }, [dispatch]);
  
  const handleExpandGraph = async (graph) => {
    if (graph === 'issueType') {
      navigate(PATH_SUPPORT.supportDashboard.issueType);
    } else if (graph === 'requestType') {
      navigate(PATH_SUPPORT.supportDashboard.requestType);
    } else if (graph === 'openIssueType') {
      navigate(PATH_SUPPORT.supportDashboard.openIssueType);
    } else if (graph === 'openRequestType') {
      navigate(PATH_SUPPORT.supportDashboard.openRequestType);
    } else if (graph === 'statusType') {
      navigate(PATH_SUPPORT.supportDashboard.statusType);
    } else if (graph === 'status') {
      navigate(PATH_SUPPORT.supportDashboard.status);
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
              <PieChart chartData={issueTypeData} totalIssues={totalIssueTypes} title='Issue Type' onExpand={() => handleExpandGraph('issueType')} onPeriodChange={(newPeriod) => handlePeriodChange(newPeriod, 'issueType')} />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={openIssueTypeData} totalIssues={totalOpenIssueTypes} isOpened title='Issue Type' onExpand={() => handleExpandGraph('openIssueType')} onPeriodChange={(newPeriod) => handlePeriodChange(newPeriod, 'openIssueType')} />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={requestTypeData} totalIssues={totalRequestTypes} title='Request Type' onExpand={() => handleExpandGraph('requestType')} onPeriodChange={(newPeriod) => handlePeriodChange(newPeriod, 'requestType')} />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={openRequestTypeData} totalIssues={totalOpenRequestTypes} isOpened title='Request Type' onExpand={() => handleExpandGraph('openRequestType')} onPeriodChange={(newPeriod) => handlePeriodChange(newPeriod, 'openRequestType')}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={statusTypeData} totalIssues={totalStatusTypes} title='Status Type' onExpand={() => handleExpandGraph('statusType')} onPeriodChange={(newPeriod) => handlePeriodChange(newPeriod, 'statusType')}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={statusData} totalIssues={totalStatuses} title='Status' onExpand={() => handleExpandGraph('status')} onPeriodChange={(newPeriod) => handlePeriodChange(newPeriod, 'status')}/>
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