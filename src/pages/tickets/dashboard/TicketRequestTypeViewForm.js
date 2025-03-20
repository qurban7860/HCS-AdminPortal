import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Card, Grid, Divider } from '@mui/material';
// slices
import { getReportTicketRequestTypes } from '../../../redux/slices/ticket/ticketSettings/ticketRequestTypes';
// hooks
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { PATH_SUPPORT } from '../../../routes/paths';
import PieChart from '../../../components/Charts/PieChart';
import { getPeriodValueAndUnit } from './utils/Constant';

export default function TicketRequestTypeViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketRequestTypes } = useSelector((state) => state.ticketRequestTypes);

  const [requestTypeData, setRequestTypeData] = useState({ series: [], labels: [], colors: [] });
  const [totalRequestTypes, setTotalRequestTypes] = useState(0);

  useLayoutEffect(() => {
    dispatch(getReportTicketRequestTypes());
  }, [dispatch]);

  useEffect(() => {
    if (ticketRequestTypes && ticketRequestTypes.countsByField) {
      const typeCounts = {};
      const typeColors = {};
      let emptyRequestTypeCount = 0;

      ticketRequestTypes.countsByField.forEach((item) => {
        const requestTypeKey = item.name;
        const requestTypeColor = item.color || 'gray';

        if (requestTypeKey) {
          typeCounts[requestTypeKey] = (typeCounts[requestTypeKey] || 0) + item.count;
          typeColors[requestTypeKey] = requestTypeColor;
        } else {
          emptyRequestTypeCount += item.count;
        }
      });

      if (emptyRequestTypeCount > 0) {
        typeCounts.Other = (typeCounts.Other || 0) + emptyRequestTypeCount;
        typeColors.Other = 'gray';
      }

      const formattedData = Object.entries(typeCounts)
        .reduce(
          (acc, [key, value]) => {
            acc.labels.push(key);
            acc.series.push(value);
            acc.colors.push(typeColors[key]);
            return acc;
          },
          { series: [], labels: [], colors: [] }
        );

      setRequestTypeData(formattedData);
      setTotalRequestTypes(Object.values(typeCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setRequestTypeData({ series: [], labels: [], colors: [] });
      setTotalRequestTypes(0);
    }
  }, [ticketRequestTypes]);

  const handlePeriodChange = (newPeriod) => {
    const { value, unit } = getPeriodValueAndUnit(newPeriod);
    dispatch(getReportTicketRequestTypes(value, unit));
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
            <PieChart chartData={requestTypeData} totalIssues={totalRequestTypes} title="Request Type" onPeriodChange={handlePeriodChange}/>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}