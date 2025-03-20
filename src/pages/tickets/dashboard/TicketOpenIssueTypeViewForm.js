import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Card, Grid, Divider } from '@mui/material';
// slices
import { getOpenTicketIssueTypes } from '../../../redux/slices/ticket/ticketSettings/ticketIssueTypes';
// hooks
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { PATH_SUPPORT } from '../../../routes/paths';
import PieChart from '../../../components/Charts/PieChart';
import { getPeriodValueAndUnit } from './utils/Constant';

export default function TicketOpenIssueTypeViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openTicketIssueTypes } = useSelector((state) => state.ticketIssueTypes);

  const [openIssueTypeData, setOpenIssueTypeData] = useState({ series: [], labels: [], colors: [] });
  const [totalOpenIssueTypes, setTotalOpenIssueTypes] = useState(0);

  useLayoutEffect(() => {
    dispatch(getOpenTicketIssueTypes());
  }, [dispatch]);

  useEffect(() => {
    if (openTicketIssueTypes && openTicketIssueTypes.countsByField) {
      const typeCounts = {};
      const typeColors = {};

      openTicketIssueTypes.countsByField.forEach((item) => {
        const issueKey = item.name;
        const issueColor = item.color || 'gray';

        if (issueKey) {
          typeCounts[issueKey] = (typeCounts[issueKey] || 0) + item.count;
          typeColors[issueKey] = issueColor;
        }
      });

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

      setOpenIssueTypeData(formattedData);
      setTotalOpenIssueTypes(Object.values(typeCounts).reduce((acc, val) => acc + val, 0));
    } else {
      setOpenIssueTypeData({ series: [], labels: [], colors: [] });
      setTotalOpenIssueTypes(0);
    }
  }, [openTicketIssueTypes]);

  const handlePeriodChange = (newPeriod) => {
    const { value, unit } = getPeriodValueAndUnit(newPeriod);
    dispatch(getOpenTicketIssueTypes(value, unit));
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
            <PieChart chartData={openIssueTypeData} totalIssues={totalOpenIssueTypes} isOpened title="Issue Type" onPeriodChange={handlePeriodChange} />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}