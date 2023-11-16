import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import { Table, Button, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import { getServiceRecordConfigs, deleteServiceRecordConfig,   ChangeRowsPerPage,
  ChangePage,
  setFilterBy, } from '../../../redux/slices/products/serviceRecordConfig';
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
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';
// sections
import ServiceRecordConfigListTableRow from './ServiceRecordConfigListTableRow';
import ServiceRecordConfigListTableToolbar from './ServiceRecordConfigListTableToolbar';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import { FORMLABELS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'docTitle', label: 'Document Title', align: 'left' },
  { id: 'recordType', label: 'Document Type', align: 'left' },
  { id: 'status', visibility: 'md1', label: 'Status', align: 'left' },
  { id: 'docVersionNo', visibility: 'md1', label: 'Version No.', align: 'left' },
  { id: 'verifications', visibility: 'md1', label: 'Approvals', align: 'left' },
  { id: 'machineModel.name', visibility: 'md1', label: 'Machine Model', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];


// ----------------------------------------------------------------------

export default function ServiceRecordConfigList() {
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

  const dispatch = useDispatch();
  // const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { serviceRecordConfigs, filterBy, page, rowsPerPage, isLoading, error, initial, responseMessage } = useSelector(
    (state) => state.serviceRecordConfig
  );

    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  // useLayoutEffect(() => {
  //   dispatch(getCustomers());
  // }, [dispatch]);

  useLayoutEffect(() => {
    dispatch(getServiceRecordConfigs());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(serviceRecordConfigs);
    }
  }, [serviceRecordConfigs, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  // const handleOpenConfirm = () => {
  //   setOpenConfirm(true);
  // };

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
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    await dispatch(deleteServiceRecordConfig(id));
    try {
      // console.log(id);
      // await dispatch(deleteSupplier(id));
      dispatch(getServiceRecordConfigs());
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

  // const handleDeleteRows = async (selectedRows, handleClose) => {
  //   // console.log(selectedRows)
  //   const deleteRows = tableData.filter((row) => !selectedRows.includes(row._id));
  //   setSelected([]);
  //   setTableData(deleteRows);

  //   if (page > 0) {
  //     if (selectedRows.length === dataInPage.length) {
  //       setPage(page - 1);
  //     } else if (selectedRows.length === dataFiltered.length) {
  //       setPage(0);
  //     } else if (selectedRows.length > dataInPage.length) {
  //       const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
  //       setPage(newPage);
  //     }
  //   }

  //   // dispatch delete supplier
  //   // await dispatch(deleteSuppliers(selectedRows));
  //   // await dispatch(getServiceRecordConfigss())
  //   handleClose();
  // };

  // const handleEditRow = (id) => {
  //   // console.log(id);
  //   navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.edit(id));
  // };

  const handleViewRow = (id) => {
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CONFIGS} backLink='' icon="material-symbols:list-alt-outline" setting="enable" />
        </StyledCardContainer>

        <TableCard>
          <ServiceRecordConfigListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />
          {!isNotFound && <TablePaginationCustom
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
                        <ServiceRecordConfigListTableRow
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

          {!isNotFound && <TablePaginationCustom
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
            Are you sure want to delete <strong> {selected.length} </strong> items?
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

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
// console.log(!'.*/.* '.includes(filterName))
  if (filterName.includes('.*') ){
    inputData = inputData.filter(
      (serviceConfig) =>
    (serviceConfig?.category?.name === null || serviceConfig?.category?.name === undefined) || 
    (serviceConfig?.machineModel?.name === null || serviceConfig?.machineModel?.name === undefined))
  }else {
    inputData = inputData.filter(
      (serviceConfig) =>
        serviceConfig?.recordType?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        serviceConfig?.docTitle?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
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
