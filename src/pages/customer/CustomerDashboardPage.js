
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';

import { _appInvoices, _appManagers } from '../../_mock/arrays';
// sections
import {
  AppNewInvoice,
  AppTopRelated,
  AppAreaInstalled,
  AppCurrentDownload,
} from '../../sections/@dashboard/general/app';
// assets
import CustomerDashboardNavbar from './util/CustomerDashboardNavbar';

// ----------------------------------------------------------------------

export default function CustomerDashboardPage() {
 
  const theme = useTheme();

  return (
    <Container maxWidth={false}>
      <Grid container spacing={3}>
        <CustomerDashboardNavbar />

        <Grid item xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Current Machines"
            chart={{
              colors: [
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
              ],
              series: [
                { label: 'FRAMA', value: 10 },
                { label: 'Decoiler', value: 6 },
                { label: 'Rivet Cutter', value: 4 },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Sites"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                {
                  year: '2019',
                  data: [
                    { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                    { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12} lg={8}>
          <AppNewInvoice
            title="New Site"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Managers" list={_appManagers} />
        </Grid>
      </Grid>
    </Container>
  );
}
