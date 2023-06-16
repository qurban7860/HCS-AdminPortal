import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import {
  Stack,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardActionArea,
  Breadcrumbs,
  Tooltip,
  Link,
  Divider,
  List,
  ListItem,
  Drawer,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SiteCarousel from './site/util/SiteCarousel';
import { CustomAvatar } from '../../components/custom-avatar';
import LogoAvatar from '../../components/logo-avatar/LogoAvatar';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD, PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator, TableNoData } from '../../components/table';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import ConfirmDialog from '../../components/confirm-dialog';
import GoogleMaps from '../../assets/GoogleMaps';
import useResponsive from '../../hooks/useResponsive';
// sections
import SiteListTableRow from './site/SiteListTableRow';
import SiteListTableToolbar from './site/SiteListTableToolbar';
import {
  getSites,
  deleteSite,
  getSite,
  setSiteFormVisibility,
  setSiteEditFormVisibility,
} from '../../redux/slices/customer/site';
import SiteAddForm from './site/SiteAddForm';
import SiteEditForm from './site/SiteEditForm';
import CommaJoinField from '../components/CommaJoinField';
import _mock from '../../_mock';
import SiteViewForm from './site/SiteViewForm';
import EmptyContent from '../../components/empty-content';
import BreadcrumbsProducer from '../components/BreadcrumbsProducer';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Site', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'website', label: 'Website', align: 'left' },
  { id: 'isverified', label: 'Disabled', align: 'left' },
  { id: 'created_at', label: 'Created At', align: 'left' },
  { id: 'action', label: 'Actions', align: 'left' },
];

const STATUS_OPTIONS = [
  // { id: '1', value: 'Order Received' },
  // { id: '2', value: 'In Progress' },
  // { id: '3', value: 'Ready For Transport' },
  // { id: '4', value: 'In Freight' },
  // { id: '5', value: 'Deployed' },
  // { id: '6', value: 'Archived' },
];

// const STATUS_OPTIONS = [
//   { value: 'all_sites', label: 'All Sites' },
//   { value: 'deployable', label: 'All Deployable' },
//   { value: 'pending', label: 'All Pending' },
//   { value: 'archived', label: 'All Archived' },
//   { value: 'undeployable', label: 'All Undeployable' }
// ];

const _accordions = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Site ${index + 1}`,
  subHeading: _mock.text.title(index),
  detail: _mock.text.description(index),
}));

// ----------------------------------------------------------------------

export default function CustomerSiteList(defaultValues = { lat: 0, long: 0 }) {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [controlled, setControlled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useResponsive('down', 'sm');
  const dispatch = useDispatch();
  const {
    sites,
    isLoading,
    error,
    initial,
    responseMessage,
    siteEditFormVisibility,
    siteAddFormVisibility,
  } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);

  const AccordionCustom = styled((props) => (
    <Accordion disableGutters elevation={2} square {...props} />
  ))(({ theme }) => ({
    border: `solid 1px ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));

  const toggleChecked = async () => {
    dispatch(setSiteFormVisibility(!siteAddFormVisibility));
  };

  const handleExpand = (index) => {
    setIsExpanded(true);
  };

  useEffect(() => {
    if (!siteAddFormVisibility && !siteEditFormVisibility) {
      dispatch(getSites(customer._id));
    }
  }, [dispatch, customer, siteAddFormVisibility, siteEditFormVisibility]); // checked is also included

  useEffect(() => {
    if (initial) {
      setTableData(sites);
    }
  }, [sites, error, responseMessage, enqueueSnackbar, initial]);

  // conditions for rendering the contact view, edit, and add forms
  const shouldShowSiteView = isExpanded && !siteEditFormVisibility;
  const shouldShowSiteEdit = siteEditFormVisibility && !siteAddFormVisibility;
  const shouldShowSiteAdd = siteAddFormVisibility && !siteEditFormVisibility;
  const isNotFound = !sites.length && !siteAddFormVisibility && !siteEditFormVisibility;
  return (
    <>
      {!siteEditFormVisibility && (
        <Stack alignItems="flex-end" sx={{ mt: 3, padding: 2 }}>
          <Button
            // alignItems
            onClick={toggleChecked}
            variant="contained"
            startIcon={
              !siteAddFormVisibility ? (
                <Iconify icon="eva:plus-fill" />
              ) : (
                <Iconify icon="eva:minus-fill" />
              )
            }
          >
            New Site
          </Button>
          <BreadcrumbsProducer
            underline="none"
            step={1}
            name={customer.name}
            path={PATH_DASHBOARD.customer.view}
            name2="Sites"
            path2={PATH_CUSTOMER.site}
            name3={siteAddFormVisibility ? 'New Site Form' : sites[activeIndex]?.name}
            path3={PATH_DASHBOARD.customer}
          />
        </Stack>
      )}
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {siteEditFormVisibility && <SiteEditForm />}
        {siteAddFormVisibility && !siteEditFormVisibility && <SiteAddForm />}
        {!siteAddFormVisibility &&
          !siteEditFormVisibility &&
          sites.map((site, index) => {
            const borderTopVal = index !== 0 ? '0px solid white' : '';
            return (
              <>
                <Grid item xs={12} lg={4}>
                  {index !== activeIndex ? (
                    <Card sx={{ display: 'block', width: 'auto' }}>
                      <CardActionArea>
                        <Grid container> {site.name}</Grid>
                        <ListItem alignItems="flex-start" ScrollbarSize="small">
                          <Box lg={4} sx={{ display: 'inline-flex' }}>
                            <Box justifyContent="flex-start" sx={{ width: '200px' }}>
                              <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {site.name.length > 20 ? (
                                    <Tooltip title={site.name} placement="top">
                                      <span>{site.name.substring(0, 20)}...</span>
                                    </Tooltip>
                                  ) : (
                                    site.name
                                  )}
                                </Typography>
                                <Typography variant="body2">
                                  {site.email ? site.email : <br />}
                                </Typography>
                              </CardContent>
                            </Box>
                            <Box lg={4}>
                              <CardMedia
                                component="img"
                                sx={{
                                  width: 200,
                                  display: 'flex-inline',
                                  justifyContent: 'flex-end',
                                  objectFit: 'cover',
                                }}
                                image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                                alt="customer's site photo was here"
                              />
                            </Box>
                          </Box>
                        </ListItem>
                      </CardActionArea>
                    </Card>
                  ) : null}
                </Grid>
                <Grid item lg={8}>
                  <Grid container justifyContent="flex-end">
                    <Grid container>
                      <SiteViewForm currentSite={site} />
                    </Grid>
                    <Grid item lg={8} spacing={2}>
                      {!isMobile && (
                        <>
                          <Card>
                            <CardActionArea>
                              {site.lat && site.long ? (
                                <GoogleMaps
                                  lat={site.lat ? site.lat : 0}
                                  lng={site.long ? site.long : 0}
                                />
                              ) : (
                                ''
                              )}
                            </CardActionArea>
                          </Card>
                          <br />
                          <Card>
                            <CardActionArea>
                              <CardMedia
                                component={SiteCarousel}
                                image={<SiteCarousel />}
                                alt={site.name}
                              />
                            </CardActionArea>
                          </Card>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            );
          })}
        <TableNoData isNotFound={isNotFound} />
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (site) => site.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((site) => filterStatus.includes(site.status));
  }

  return inputData;
}
