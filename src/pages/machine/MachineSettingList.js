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
  Accordion, AccordionSummary, AccordionDetails, Divider
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

import { setSettingEditFormVisibility , setSettingFormVisibility , updateSetting , saveSetting , getSettings , getSetting } from '../../redux/slices/products/machineTechParamValue';
import { getTechparamcategories } from '../../redux/slices/products/machineTechParamCategory';
import { getTechparams } from '../../redux/slices/products/machineTechParam';

import SettingAddForm from './MachineTechParamValue/SettingAddForm'
import SettingEditForm from './MachineTechParamValue/SettingEditForm';

import _mock from '../../_mock';
import SettingViewForm from './MachineTechParamValue/SettingViewForm';
import EmptyContent from '../../components/empty-content';
import { fDate,fDateTime } from '../../utils/formatTime';



// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Site', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'website', label: 'Website', align: 'left' },
  { id: 'isverified', label: 'Disabled', align: 'left' },
  { id: 'created_at', label: 'Created At', align: 'left' },
  { id: 'action', label: 'Actions', align: 'left' },

];

const _accordions = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Site ${index + 1}`,
  subHeading: _mock.text.title(index),
  detail: _mock.text.description(index),
}));

// ----------------------------------------------------------------------

export default function MachineSettingList() {
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

  const { techparamsByCategory } = useSelector((state) => state.techparam);

  const { techparamcategories } = useSelector((state) => state.techparamcategory);

  const { initial,error, responseMessage , settings, settingEditFormVisibility, formVisibility } = useSelector((state) => state.machineSetting);
  const { machine } = useSelector((state) => state.machine);
  // const toggleChecked = async () => 
  //   {
  //     dispatch(setFormVisibility(!siteAddFormVisibility));    
  //   };
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


useLayoutEffect(() => {
  // if(!formVisibility && !settingEditFormVisibility){
  dispatch(getSettings(machine._id));
  // }
}, [dispatch, machine._id, settingEditFormVisibility ]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

 
  useEffect(() => {
    if (initial) {
      if (settings && !error) {
        enqueueSnackbar(responseMessage);
      } else {
        enqueueSnackbar(error, { variant: `error` });
      }   
      setTableData(settings);
    }
  }, [settings, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = !settings.length && !formVisibility && !settingEditFormVisibility;

  return (
    <>
      {/* <Helmet>
        <title> Machine Setting: List | Machine ERP </title>
      </Helmet> */}


        {/* {!siteEditFormVisibility && <Stack alignItems="flex-end" sx={{ mt: 3, padding: 2 }}>
          <Button
              // alignItems 
              onClick={toggleChecked}

              variant="contained"
              startIcon={!siteAddFormVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />}
            >
              New Setting
            </Button>

        </Stack>} */}
        {/* <SettingAddForm/> */}
        

          {!settingEditFormVisibility && <SettingAddForm/>}
          {settingEditFormVisibility && <SettingEditForm/>}
        <Card sx={{mt:3}}>
          {!formVisibility && !settingEditFormVisibility && settings.map((setting, index) => { 
            const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
            return(
            <Accordion key={setting._id} expanded={expanded === index} onChange={handleChange(index)} sx={ {borderTop: borderTopVal}}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} onClick={()=>handleAccordianClick(index)} >
                { index !==  activeIndex ? 
                
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={3} md={3}>
                    {setting?.techParam?.category?.name || ""}
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    {setting?.techParam?.name || "" }
                  </Grid>
                  <Grid item xs={12} sm={3} md={4}>
                    {setting?.techParamValue || "" }
                  </Grid>
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body2" >
                    {fDate(setting?.createdAt || "")}
                    </Typography>
                  </Grid>
                <Divider />
                </Grid>
                : null }
              </AccordionSummary>
              <AccordionDetails sx={{mt:-5, }}>
                <SettingViewForm
                currentSetting={setting}
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
