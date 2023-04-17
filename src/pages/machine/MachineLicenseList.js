import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Card,
  Grid,
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
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
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

import { setLicenseEditFormVisibility, setLicenseFormVisibility , updateLicense , saveLicense , getLicenses , getLicense, deleteLicense } from '../../redux/slices/products/license';
import LicenseAddForm from './License/LicenseAddForm'
import LicenseEditForm from './License/LicenseEditForm';
import LicenseViewForm from './License/LicenseViewForm';

import _mock from '../../_mock';
import EmptyContent from '../../components/empty-content';
import { fDate,fDateTime } from '../../utils/formatTime';



// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//   { id: 'name', label: 'Site', align: 'left' },
//   { id: 'email', label: 'Email', align: 'left' },
//   { id: 'website', label: 'Website', align: 'left' },
//   { id: 'isverified', label: 'Disabled', align: 'left' },
//   { id: 'created_at', label: 'Created At', align: 'left' },
//   { id: 'action', label: 'Actions', align: 'left' },

// ];

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

export default function MachineLicenseList() {
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

  const { initial,error, responseMessage , licenseEditFormVisibility ,licenses, formVisibility } = useSelector((state) => state.license);
  const { machine } = useSelector((state) => state.machine);
  const toggleChecked = async () => 
    {
      dispatch(setLicenseFormVisibility (!formVisibility));    
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
  };

 
  useEffect(() => {
    if (initial) {
      if (licenses && !error) {
        enqueueSnackbar(responseMessage);
      } else {
        enqueueSnackbar(error, { variant: `error` });
      }   
      setTableData(licenses);
    }
  }, [licenses, error, responseMessage, enqueueSnackbar, initial]);



  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = !licenses.length && !formVisibility && !licenseEditFormVisibility;

  return (
    <>
      {/* <Helmet>
        <title> Machine Tools Installed: List | Machine ERP </title>
      </Helmet> */}


        {!licenseEditFormVisibility && <Stack alignItems="flex-end" sx={{ mb: 3, px:4 }}>
          <Button
              // alignItems 
              onClick={toggleChecked}
              variant="contained"
              startIcon={!formVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />}
            >
            New License
            </Button>
        </Stack>}
        
        <Card sx={{mt:3}}>
          {formVisibility && !licenseEditFormVisibility && <LicenseAddForm/>}
          {licenseEditFormVisibility && <LicenseEditForm/>}
          {!formVisibility && !licenseEditFormVisibility && licenses.map((license, index) => { 
            const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
            return(
            <Accordion key={license._id} expanded={expanded === index} onChange={handleChange(index)} sx={{borderTop: borderTopVal}}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} onClick={()=>handleAccordianClick(index)} >
                { index !==  activeIndex ? 
                <Grid container spacing={0}>
                  
                  {/* <Grid item xs={12} sm={3} md={2}>
                    {license?.license?.name || "" }
                  </Grid> */}

                  <Grid item xs={12} sm={6} md={8}>
                    {license?.licenseDetail?.length > 100 ? license?.licenseDetail.substring(0, 100) :license?.licenseDetail}
                    {license?.licenseDetail?.length > 100 ? "..." :null}
                  </Grid>

                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body2" >
                    {fDate(license?.createdAt || "")}
                    </Typography>
                  </Grid>
                </Grid>
                : null }
              </AccordionSummary>
              <AccordionDetails sx={{mt:-5}}>
                <LicenseViewForm
                currentTool={license}
                />
              </AccordionDetails>
            </Accordion>
            
          )})} 

          {isNotFound && <EmptyContent title="No Data"/>}
            

        </Card>

      {/* <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      /> */}
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
