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
import SiteListTableRow from './ToolsInstalled/SiteListTableRow';
import SiteListTableToolbar from './ToolsInstalled/SiteListTableToolbar';
import { getSites, deleteSite, getSite,setFormVisibility } from '../../redux/slices/customer/site';
import SiteAddForm from './ToolsInstalled/SiteAddForm';
import SiteEditForm from './ToolsInstalled/SiteEditForm';

import _mock from '../../_mock';
import SiteViewForm from './ToolsInstalled/SiteViewForm';
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

export default function MachineServiceHistoryList() {
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

  const toggleChecked = async () => 
    {
      dispatch(setFormVisibility(!siteAddFormVisibility));    
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
    if(!siteAddFormVisibility && !siteEditFormVisibility){
      dispatch(getSites(customer._id));
    }
  }, [dispatch, customer, siteAddFormVisibility, siteEditFormVisibility]); // checked is also included

  useEffect(() => {
    if (initial) {
      // if (sites && !error) {
      //   enqueueSnackbar(responseMessage);
      // } else {
      //   enqueueSnackbar(error, { variant: `error` });
      // }   
      setTableData(sites);
    }
  }, [sites, error, responseMessage, enqueueSnackbar, initial]);



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
      <Container maxWidth={false}>

        {!siteEditFormVisibility && <Stack alignItems="flex-end" sx={{ mt: 3, padding: 2 }}>
          <Button
              // alignItems 
              onClick={toggleChecked}

              variant="contained"
              startIcon={!siteAddFormVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />}
            >
              New Site
            </Button>

        </Stack>}
        
        <Card>

          {siteEditFormVisibility && <SiteEditForm/>}

          {siteAddFormVisibility && !siteEditFormVisibility && <SiteAddForm/>}

          {!siteAddFormVisibility && !siteEditFormVisibility && sites.map((site, index) => (

            <Accordion key={site._id} expanded={expanded === index} onChange={handleChange(index)} sx={index !==0 ? {borderTop: '1px solid lightGray'}: ""}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} onClick={()=>handleAccordianClick(index)} >
                { index !==  activeIndex ? 
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} >
                    <Typography variant="body2" >
                    {site.name} 
                    </Typography>
                  </Grid>
                  {site.address && <Grid item xs={12} sm={8}>
                    <Typography variant="body2" >
                    {Object.values(site.address)?.join(", ")}
                    </Typography>
                  </Grid>}
                </Grid>
                : null }
              </AccordionSummary>
              <AccordionDetails sx={{mt:-5}}>
                <SiteViewForm
                currentSite={site}
                />
              </AccordionDetails>
            </Accordion>
            
          ))} 

          {isNotFound && <EmptyContent title="No Data"/>}
            
          {/* </Block> */}
          {/* <Block title="Controlled">
            {_accordions.map((item, index) => (
              <Accordion
                key={item.value}
                disabled={index === 3}
                expanded={controlled === item.value}
                onChange={handleChangeControlled(item.value)}
              >
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Typography variant="subtitle1" sx={{ width: '33%', flexShrink: 0 }}>
                    {item.heading}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{item.subHeading}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.detail}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Block> */}


           {/* <SiteListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <SiteListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          /> */}
        </Card>
      </Container>

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
