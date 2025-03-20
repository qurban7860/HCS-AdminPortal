import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Card, Grid, Divider } from '@mui/material';
// slices
import { getReportTicketStatusTypes } from '../../../redux/slices/ticket/ticketSettings/ticketStatusTypes';
// hooks
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { PATH_SUPPORT } from '../../../routes/paths';
import PieChart from '../../../components/Charts/PieChart';
import { getPeriodValueAndUnit } from './utils/Constant';

export default function TicketStatusTypeViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketStatusTypes } = useSelector((state) => state.ticketStatusTypes);

  const [statusTypeData, setStatusTypeData] = useState({ series: [], labels: [], colors: [] });
  const [totalStatusTypes, setTotalStatusTypes] = useState(0);

  useLayoutEffect(() => {
    dispatch(getReportTicketStatusTypes());
  }, [dispatch]);

  useEffect(() => {
    if (ticketStatusTypes && ticketStatusTypes.countsByField) {
      const typeCounts = {};
      const typeColors = {};
      let emptyStatusTypeCount = 0;

      ticketStatusTypes.countsByField.forEach((item) => {
        const statusTypeKey = item.name;
        const statusTypeColor = item.color || 'gray';

        if (statusTypeKey) {
          typeCounts[statusTypeKey] = (typeCounts[statusTypeKey] || 0) + item.count;
          typeColors[statusTypeKey] = statusTypeColor;
        } else {
          emptyStatusTypeCount += item.count;
        }
      });

      if (emptyStatusTypeCount > 0) {
        typeCounts.Other = (typeCounts.Other || 0) + emptyStatusTypeCount;
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

      setStatusTypeData(formattedData);
      setTotalStatusTypes(Object.values(typeCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setStatusTypeData({ series: [], labels: [], colors: [] });
      setTotalStatusTypes(0);
    }
  }, [ticketStatusTypes]);

  const handlePeriodChange = (newPeriod) => {
    const { value, unit } = getPeriodValueAndUnit(newPeriod);
    dispatch(getReportTicketStatusTypes(value, unit));
  };

  return (
    <Container maxWidth={false} sx={{ height: 'auto' }}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Status Type" icon="material-symbols:list-alt-outline" />
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
            <PieChart chartData={statusTypeData} totalIssues={totalStatusTypes} title="Status Type" onPeriodChange={handlePeriodChange} />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}