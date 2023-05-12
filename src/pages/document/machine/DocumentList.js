import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Stack, Card, Grid, Table, Button, Tooltip, TableBody, Container, IconButton, TableContainer, DialogTitle, Dialog,  TextField, Typography, InputAdornment, Accordion, AccordionSummary, AccordionDetails, Divider
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { useSettingsContext } from '../../../components/settings';
import { useTable, getComparator, emptyRows, TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedAction, TablePaginationCustom,
} from '../../../components/table';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import ConfirmDialog from '../../../components/confirm-dialog';
// sections
import { addMachineDocument, getMachineDocuments, getMachineDocument, setMachineDocumentFormVisibility, setMachineDocumentEditFormVisibility } from '../../../redux/slices/document/machineDocument';
import DocumentAddForm from './DocumentAddForm'
import DocumentEditForm from './DocumentEditForm';
import DocumentViewForm from './DocumentViewForm';
import DocumentNameAddForm from '../DocumentName/DocumentNameAddForm';
import FileCategoryAddForm from '../FileCategory/FileCategoryAddForm';


import _mock from '../../../_mock';
import EmptyContent from '../../../components/empty-content';
import { fDate,fDateTime } from '../../../utils/formatTime';



// ----------------------------------------------------------------------

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

  const { initial,error, responseMessage , machineDocuments, machineDocumentEditFormVisibility, machineDocumentFormVisibility } = useSelector((state) => state.machineDocument);
  const { fileCategories, fileCategory, fileCategoryFormVisibility } = useSelector((state) => state.fileCategory);
  console.log("fileCategoryFormVisibility : ",fileCategoryFormVisibility)
  const { documentName, documentNames, documentNameFormVisibility } = useSelector((state) => state.documentName);
  const { machine } = useSelector((state) => state.machine);
  const toggleChecked = async () => 
    {
      dispatch(setMachineDocumentFormVisibility(!machineDocumentFormVisibility));    
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

useLayoutEffect(() => {
  dispatch(getMachineDocuments(machine._id));
}, [dispatch, machine._id, machineDocumentEditFormVisibility ]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
 
  useEffect(() => {
    setTableData(machineDocuments);
  }, [machineDocuments, error, responseMessage ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = !machineDocuments.length && !machineDocumentFormVisibility && !machineDocumentEditFormVisibility;

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };


  return (
    <>

        <Stack spacing={2} alignItems="center" direction={{ xs: 'column', md: 'row', }} sx={{  py: 2 }} >
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={9} sx={{display: 'inline-flex',}}>
              <Grid item xs={12} sm={8}>
                {!machineDocumentFormVisibility && <TextField fullWidth value={filterName} onChange={handleFilterName} placeholder="Search..." InputProps={{ startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment> ),}}/>}
              </Grid>
              {isFiltered && (<Button color="error" sx={{ flexShrink: 0 , ml:1}} onClick={handleResetFilter} startIcon={<Iconify icon="eva:trash-2-outline" />} > Clear </Button>)}
            </Grid>
            <Grid item xs={8} sm={3}>
              <Stack alignItems="flex-end" sx={{my: "auto" }}> 
                <Button sx={{p:1}} onClick={toggleChecked} variant="contained" startIcon={!machineDocumentFormVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />}>New Machine Document</Button>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
        
                  {!machineDocumentEditFormVisibility && !documentNameFormVisibility && !fileCategoryFormVisibility && machineDocumentFormVisibility && <DocumentAddForm/>}
                  {!machineDocumentEditFormVisibility && !documentNameFormVisibility && fileCategoryFormVisibility && !machineDocumentFormVisibility && <FileCategoryAddForm/>}
                  {!machineDocumentEditFormVisibility && documentNameFormVisibility && !fileCategoryFormVisibility && !machineDocumentFormVisibility && <DocumentNameAddForm/>}

          {machineDocumentEditFormVisibility  && <DocumentEditForm/>}
        <Card sx={{mt:2}}>
          {!machineDocumentEditFormVisibility && !machineDocumentFormVisibility&& !fileCategoryFormVisibility && !documentNameFormVisibility && dataFiltered.map((setting, index) => { 
            const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
            return(
            <Accordion key={setting._id} expanded={expanded === index} onChange={handleChange(index)} sx={ {borderTop: borderTopVal}}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} onClick={()=>handleAccordianClick(index)} >
                { index !==  activeIndex ? 
                
                <Grid container spacing={0}>
                <Typography> Machine Documents</Typography>                 
                {/* <Grid item xs={12} sm={3} md={3}>
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
                <Divider /> */}
                </Grid>
                : null }
              </AccordionSummary>
              <AccordionDetails sx={{mt:-5, }}>
                <DocumentViewForm
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
// console.log(filterName)
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((setting) => setting?.techParam?.category?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
    setting?.techParam?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
    setting?.techParamValue?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
    // (setting?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
    fDate(setting?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 
    );
  }

  return inputData;
}
