import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import { Table, Button, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import { getServiceReportTemplates, deleteServiceReportTemplate,   ChangeRowsPerPage,
  ChangePage,
  setFilterBy, setFilterList } from '../../../redux/slices/products/serviceReportTemplate';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';
// sections
import ServiceReportTemplateListTableRow from './ServiceReportTemplateListTableRow';
import ServiceReportTemplateListTableToolbar from './ServiceReportTemplateListTableToolbar';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import { FORMLABELS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'reportTitle', label: 'Template Name', align: 'left' },
  { id: 'reportType', label: 'Service Type', align: 'left' },
  { id: 'status', visibility: 'md1', label: 'Status', align: 'left' },
  { id: 'docVersionNo', visibility: 'md1', label: 'Version No.', align: 'left' },
  { id: 'verifications', visibility: 'md1', label: 'Approvals', align: 'left' },
  { id: 'machineModel.name', visibility: 'md1', label: 'Machine Model', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];


// ----------------------------------------------------------------------

export default function ServiceReportTemplateList() {
  const {
    dense,
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const { serviceReportTemplates, filterBy, filterList, page, rowsPerPage, isLoading, error, initial, responseMessage } = useSelector( (state) => state.serviceReportTemplate );
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterListBy, setFilterListBy] = useState(filterList);
  
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useLayoutEffect(() => {
    dispatch(getServiceReportTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(serviceReportTemplates);
    }
  }, [serviceReportTemplates, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterListBy,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };
  
  const debouncedVerified = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterList(value))
  }, 500))

  const handleFilterListBy = (event) => {
    debouncedVerified.current(event.target.value);
    setFilterListBy(event.target.value)
    setPage(0);
  };

  useEffect(() => {
      debouncedSearch.current.cancel();
      debouncedVerified.current.cancel();
  }, [debouncedSearch, debouncedVerified]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    await dispatch(deleteServiceReportTemplate(id));
    try {
      dispatch(getServiceReportTemplates());
      setSelected([]);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleViewRow = (id) => {
    navigate(PATH_MACHINE.machineSettings.serviceReportsTemplate.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CONFIGS} icon="material-symbols:list-alt-outline" setting />
        </StyledCardContainer>

        <TableCard>
          <ServiceReportTemplateListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            filterListBy={filterListBy}
            onFilterListBy={handleFilterListBy}
            onResetFilter={handleResetFilter}
          />
          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction

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
            /> */}

            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ServiceReportTemplateListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          // onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        </TableCard>
      </Container>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to Archive <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterListBy }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if(filterListBy ==='active' )
    inputData = inputData.filter((config)=> config.isActive === true );
  else if(filterListBy ==='inActive' )
    inputData = inputData.filter((config)=> config.isActive === false );
  

  if (filterName.includes('.*') ){
    inputData = inputData.filter(
      (serviceConfig) =>
    (serviceConfig?.category?.name === null || serviceConfig?.category?.name === undefined) || 
    (serviceConfig?.machineModel?.name === null || serviceConfig?.machineModel?.name === undefined))
  }else {
    inputData = inputData.filter(
      (serviceConfig) =>
        serviceConfig?.reportType?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        serviceConfig?.reportTitle?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        serviceConfig?.status?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        serviceConfig?.docVersionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        serviceConfig?.verifications?.length?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        serviceConfig?.category?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        serviceConfig?.machineModel?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 || 
        fDate(serviceConfig?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
