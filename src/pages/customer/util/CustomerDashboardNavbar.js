// @mui
import { Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// _mock_
import CustomerWidget from './CustomerWidget';

import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

export default function CustomerDashboardNavbar() {

  const navigate = useNavigate();


  const handleAddCustomer = () => {
    navigate(PATH_DASHBOARD.customer.new);
  };

  const handleSearchCustomer = () => {
    navigate(PATH_DASHBOARD.customer.list);
  };

  const handleSearchSite = () => {
    navigate(PATH_DASHBOARD.site.list);
  };

  const handleSearchContact = () => {
    navigate(PATH_DASHBOARD.contact.list);
  };

  return (
    <>

          <Grid item xs={12} sm={6} md={3}>
              <CustomerWidget
                title="Add Customer"
                color="primary"
                icon="eva:plus-fill"
                onClick={handleAddCustomer}
                sx={{ '&:hover': { opacity: 0.72 }, 
              }}

              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <CustomerWidget
                title="Search Customer"
                color="primary"
                icon="eva:search-fill"
                onClick={handleSearchCustomer}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <CustomerWidget
                title="Search Sites"
                color="info"
                icon="eva:search-fill"
                onClick={handleSearchSite}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <CustomerWidget
                title="Search Contacts"
                color="success"
                icon="eva:search-fill"
                onClick={handleSearchContact}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
    </>
  );
}
