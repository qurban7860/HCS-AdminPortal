import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Card, Grid, Divider } from '@mui/material';
// slices
import { getOpenTicketRequestTypes } from '../../../redux/slices/ticket/ticketSettings/ticketRequestTypes';
// hooks
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { PATH_SUPPORT } from '../../../routes/paths';
import PieChart from '../../../components/Charts/PieChart';
import { getPeriodValueAndUnit } from './utils/Constant';

export default function TicketOpenRequestTypeViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openTicketRequestTypes } = useSelector((state) => state.ticketRequestTypes);

  const [openRequestTypeData, setOpenRequestTypeData] = useState({ series: [], labels: [], colors: [] });
  const [totalOpenRequestTypes, setTotalOpenRequestTypes] = useState(0);

  useLayoutEffect(() => {
    dispatch(getOpenTicketRequestTypes());
  }, [dispatch]);

  useEffect(() => {
    if (openTicketRequestTypes && openTicketRequestTypes.countsByField) {
      const typeCounts = {};
      const typeColors = {};
      let emptyRequestTypeCount = 0;

      openTicketRequestTypes.countsByField.forEach((item) => {
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

      setOpenRequestTypeData(formattedData);
      setTotalOpenRequestTypes(Object.values(typeCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setOpenRequestTypeData({ series: [], labels: [], colors: [] });
      setTotalOpenRequestTypes(0);
    }
  }, [openTicketRequestTypes]);
  
  const handlePeriodChange = (newPeriod) => {
    const { value, unit } = getPeriodValueAndUnit(newPeriod);
    dispatch(getOpenTicketRequestTypes(value, unit));
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
            <PieChart chartData={openRequestTypeData} totalIssues={totalOpenRequestTypes} isOpened title="Request Type" onPeriodChange={handlePeriodChange}/>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}