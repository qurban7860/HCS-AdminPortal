import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import { Grid } from '@mui/material';
import { StyledContainer, StyledGlobalCard } from '../../../theme/styles/default-styles';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_SUPPORT } from '../../../routes/paths';
// sections
import HowickWelcome from '../../../components/DashboardWidgets/HowickWelcome';
import { getReports } from '../../../redux/slices/ticket/ticketReports/ticketReports';
import { getOpenTicketIssueTypes } from '../../../redux/slices/ticket/ticketSettings/ticketIssueTypes';
import { getOpenTicketRequestTypes } from '../../../redux/slices/ticket/ticketSettings/ticketRequestTypes';
import PieChart from '../../../components/Charts/PieChart';
import BarChart from '../../../components/Charts/BarChart';
// styles
import { varFade } from '../../../components/animate';
// constants
import { TITLES } from '../../../constants/default-constants';

export default function SupportDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reports} = useSelector((state) => state.ticketReports);
  const { openTicketIssueTypes } = useSelector((state) => state.ticketIssueTypes);
  const { openTicketRequestTypes } = useSelector((state) => state.ticketRequestTypes);

  useLayoutEffect(() => {
    dispatch(getReports());
    dispatch(getOpenTicketIssueTypes());
    dispatch(getOpenTicketRequestTypes());
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

  // Period filter states
  const [issueTypePeriod, setIssueTypePeriod] = useState('All');
  const [requestTypePeriod, setRequestTypePeriod] = useState('All');
  const [openIssueTypePeriod, setOpenIssueTypePeriod] = useState('All');
  const [openRequestTypePeriod, setOpenRequestTypePeriod] = useState('All');
  const [statusPeriod, setStatusPeriod] = useState('All');
  const [statusTypePeriod, setStatusTypePeriod] = useState('All');

  useEffect(() => {
    if (reports) {
      // Process Issue Type Data
      const issueTypeCounts = reports.issueType?.countsByField.reduce((acc, item) => {
        acc.labels.push(item.name || 'N/A');
        acc.series.push(item.count);
        acc.colors.push(item.color || 'gray');
        return acc;
      }, { series: [], labels: [], colors: [] });
      setIssueTypeData(issueTypeCounts);
      setTotalIssueTypes(reports.issueType?.totalCount || 0);

      // Process Request Type Data
      const requestTypeCounts = reports.requestType?.countsByField.reduce((acc, item) => {
        if (item.name) {
          acc.labels.push(item.name);
          acc.series.push(item.count);
          acc.colors.push(item.color || 'gray');
        }
        return acc;
      }, { series: [], labels: [], colors: [] });

      const otherRequestCount = reports.requestType?.countsByField.find(item => item.name === null)?.count || 0;
      if (otherRequestCount > 0) {
        requestTypeCounts.labels.push('Others');
        requestTypeCounts.series.push(otherRequestCount);
        requestTypeCounts.colors.push('gray');
      }

      setRequestTypeData(requestTypeCounts);
      setTotalRequestTypes(reports.requestType?.totalCount || 0);

      // Process Status Data
      const statusCounts = reports.status?.countsByField.reduce((acc, item) => {
        if (item.name) {
          acc.labels.push(item.name);
          acc.series.push(item.count);
          acc.colors.push(item.color || 'gray');
        }
        return acc;
      }, { series: [], labels: [], colors: [] });

      const otherStatusCount = reports.status?.countsByField.find(item => item.name === null)?.count || 0;
      if (otherStatusCount > 0) {
        statusCounts.labels.push('Others');
        statusCounts.series.push(otherStatusCount);
        statusCounts.colors.push('gray');
      }

      setStatusData(statusCounts);
      setTotalStatuses(reports.status?.totalCount || 0);

      // Process Status Type Data
      const statusTypeCounts = reports.statusType?.countsByField.reduce((acc, item) => {
        if (item.name) {
          acc.labels.push(item.name);
          acc.series.push(item.count);
          acc.colors.push(item.color || 'gray');
        }
        return acc;
      }, { series: [], labels: [], colors: [] });

      const otherStatusTypeCount = reports.statusType?.countsByField.find(item => item.name === null)?.count || 0;
      if (otherStatusTypeCount > 0) {
        statusTypeCounts.labels.push('Others');
        statusTypeCounts.series.push(otherStatusTypeCount);
        statusTypeCounts.colors.push('gray');
      }

      setStatusTypeData(statusTypeCounts);
      setTotalStatusTypes(reports.statusType?.totalCount || 0);

      // Process Open Issue Type Data
      const openIssueTypeCounts = openTicketIssueTypes?.countsByField.reduce((acc, item) => {
        acc.labels.push(item.name || 'N/A');
        acc.series.push(item.count);
        acc.colors.push(item.color || 'gray');
        return acc;
      }, { series: [], labels: [], colors: [] });

      setOpenIssueTypeData(openIssueTypeCounts);
      setTotalOpenIssueTypes(openTicketIssueTypes?.countsByField.reduce((sum, item) => sum + item.count, 0) || 0);

      // Process Open Request Type Data
      const openRequestTypeCounts = openTicketRequestTypes?.countsByField.reduce((acc, item) => {
        if (item.name) {
          acc.labels.push(item.name);
          acc.series.push(item.count);
          acc.colors.push(item.color || 'gray');
        }
        return acc;
      }, { series: [], labels: [], colors: [] });

      const otherOpenRequestCount = openTicketRequestTypes?.countsByField.find(item => item.name === null)?.count || 0;
      if (otherOpenRequestCount > 0) {
        openRequestTypeCounts.labels.push('Others');
        openRequestTypeCounts.series.push(otherOpenRequestCount);
        openRequestTypeCounts.colors.push('gray');
      }
      setOpenRequestTypeData(openRequestTypeCounts);
      setTotalOpenRequestTypes(openTicketRequestTypes?.countsByField.reduce((sum, item) => sum + item.count, 0) || 0);

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
  }, [reports, openTicketIssueTypes, openTicketRequestTypes]);

  const handleIssueTypePeriodChange = (newPeriod) => {
    setIssueTypePeriod(newPeriod);
  };

  const handleRequestTypePeriodChange = (newPeriod) => {
    setRequestTypePeriod(newPeriod);
  };

  const handleOpenIssueTypePeriodChange = (newPeriod) => {
    setOpenIssueTypePeriod(newPeriod);
  };

  const handleOpenRequestTypePeriodChange = (newPeriod) => {
    setOpenRequestTypePeriod(newPeriod);
  };

  const handleStatusPeriodChange = (newPeriod) => {
    setStatusPeriod(newPeriod);
  };

  const handleStatusTypePeriodChange = (newPeriod) => {
    setStatusTypePeriod(newPeriod);
  };
  
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
              <PieChart chartData={issueTypeData} totalIssues={totalIssueTypes} title='Issue Type' onExpand={() => handleExpandGraph('issueType')} onPeriodChange={handleIssueTypePeriodChange} />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={openIssueTypeData} totalIssues={totalOpenIssueTypes} isOpened title='Issue Type' onExpand={() => handleExpandGraph('openIssueType')} onPeriodChange={handleOpenIssueTypePeriodChange} />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={requestTypeData} totalIssues={totalRequestTypes} title='Request Type' onExpand={() => handleExpandGraph('requestType')} onPeriodChange={handleRequestTypePeriodChange} />
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={openRequestTypeData} totalIssues={totalOpenRequestTypes} isOpened title='Request Type' onExpand={() => handleExpandGraph('openRequestType')} onPeriodChange={handleOpenRequestTypePeriodChange}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={statusTypeData} totalIssues={totalStatusTypes} title='Status Type' onExpand={() => handleExpandGraph('statusType')} onPeriodChange={handleStatusTypePeriodChange}/>
            </StyledGlobalCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <StyledGlobalCard sx={{ pt: 2 }} variants={varFade().inDown}>
              <PieChart chartData={statusData} totalIssues={totalStatuses} title='Status' onExpand={() => handleExpandGraph('status')} onPeriodChange={handleStatusPeriodChange}/>
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