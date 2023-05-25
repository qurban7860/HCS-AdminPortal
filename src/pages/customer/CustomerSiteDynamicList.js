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
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  DialogTitle,
  Dialog,
  Typography,
  Accordion, AccordionSummary, AccordionDetails, Avatar, CardActionArea
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CustomAvatar } from '../../components/custom-avatar';
import LogoAvatar from '../../components/logo-avatar/LogoAvatar';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import ConfirmDialog from '../../components/confirm-dialog';
// sections
import SiteListTableRow from './site/SiteListTableRow';
import SiteListTableToolbar from './site/SiteListTableToolbar';
import { getSites, deleteSite, getSite,setSiteFormVisibility, setSiteEditFormVisibility } from '../../redux/slices/customer/site';
import SiteAddForm from './site/SiteAddForm';
import SiteEditForm from './site/SiteEditForm';
import CommaJoinField from '../components/CommaJoinField';
import _mock from '../../_mock';
import SiteViewForm from './site/SiteViewForm';
import EmptyContent from '../../components/empty-content';



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

export default function CustomerSiteList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const [controlled, setControlled] = useState(false);
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();
  const { sites, isLoading, error, initial, responseMessage, siteEditFormVisibility, siteAddFormVisibility } = useSelector((state) => state.site);
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
    }
  }));

  const AccordionSummaryCustom = styled((props) => (
    <AccordionSummary {...props} />
  ))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .07)' : 'rgba(255, 255, 255, .07)',
    borderBottom: `solid 1px ${theme.palette.divider}`,
    minHeight: 56
  }));

  const AccordionDetailsCustom = styled((props) => (
    <AccordionDetails {...props} />
  ))(({ theme }) => ({
    padding: theme.spacing(1),
    // borderTop: `solid 1px ${theme.palette.divider}`,

  }))

  const toggleChecked = async () =>
    {
      dispatch(setSiteFormVisibility(!siteAddFormVisibility));
    };

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleAccordianClick = (accordianIndex) => {
   if(accordianIndex === activeIndex ){
    setActiveIndex(null)
   }else{
    setActiveIndex(accordianIndex)
   }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // console.log("Expended : ",expanded)
  };

  useEffect(() => {
    if(!siteAddFormVisibility && !siteEditFormVisibility){
      dispatch(getSites(customer._id));
    }
  }, [dispatch, customer, siteAddFormVisibility, siteEditFormVisibility]); // checked is also included

  useEffect(() => {
    if (initial) {
      if (sites && !error) {
        enqueueSnackbar(responseMessage);
      } else {
        enqueueSnackbar(error, { variant: `error` });
      }
      setTableData(sites);
    }
  }, [sites, error, responseMessage, enqueueSnackbar, initial]);
// console.log("sites", sites);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 60 : 80;
  const isFiltered = filterName !== '' || !!filterStatus.length;
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
        </Stack>
      )}
        <Box
          sx={{
            display: 'block',
            alignItems: 'center',
            py: 2,
          }}
          >
          {siteEditFormVisibility && <SiteEditForm />}
          {siteAddFormVisibility && !siteEditFormVisibility && <SiteAddForm />}
          {!siteAddFormVisibility &&
            !siteEditFormVisibility &&
            sites.map((site, index) => {
              const borderTopVal = index !== 0 ? '0px solid white' : '';
              return (
                <Accordion
                  key={site._id}
                  expanded={expanded === index}
                  onChange={handleChange(index)}
                  sx={{
                    padding: '0px',
                    borderTop: borderTopVal,
                    borderBottom: '0px solid white',
                    boxShadow: 'none',
                    borderRadius: '0px',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    onClick={() => handleAccordianClick(index)}
                    // expandIcon={<Avatar alt={site.name} src={site.logo} sx={{ m: 1 }} />}
                    >
                    <Grid container xs={12} lg={4}>
                      {index !== activeIndex ? (
                        <Card sx={{ display: 'block', width: 'auto' }}>
                          <CardActionArea>
                            <Box lg={4} sx={{ display: 'inline-flex' }}>
                              <Box justifyContent="flex-start" sx={{ width: '200px' }}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {site.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    {site.email ? site.email : <br />}
                                  </Typography>
                                </CardContent>
                              </Box>
                              <Box lg={4}>
                                <CardMedia
                                  component="img"
                                  sx={{ width: 151, display: 'flex', justifyContent: 'flex-end' }}
                                  image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                                  alt="customer's site photo was here"
                                />
                              </Box>
                            </Box>
                          </CardActionArea>
                        </Card>
                      ) : null}
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetailsCustom
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    aria-controls="panel1a-content"
                    >
                    <Grid container lg={12} justifyContent="flex-start" alignItems="flex-start">
                      <Grid item lg={4}>
                        <Card sx={{ width: 'auto', height: '100%', m: 2}}>
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              sx={{ height:'100%', display: 'block' }}
                              image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                              alt="customer's site photo was here"
                            />
                          </CardActionArea>
                        </Card>
                      </Grid>
                      <Grid item lg={8}>
                        <SiteViewForm currentSite={site} />
                      </Grid>
                    </Grid>
                  </AccordionDetailsCustom>
                </Accordion>
              );
            })}
          <TableNoData isNotFound={isNotFound} />
        </Box>
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
