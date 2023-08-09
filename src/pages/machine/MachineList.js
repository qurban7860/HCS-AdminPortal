import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useLayoutEffect, useMemo, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { debounce } from "lodash";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Container, Table, Button, TableBody, TableContainer , Tooltip, IconButton} from '@mui/material';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import Scrollbar from '../../components/scrollbar';
import Iconify from '../../components/iconify';
import ConfirmDialog from '../../components/confirm-dialog';
import MachineListTableRow from './MachineListTableRow';
import MachineListTableToolbar from './MachineListTableToolbar';

import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';

// slice
// import { getSPContacts } from '../../redux/slices/contact';
import {
  getMachines,
  deleteMachine,
  resetMachine,
  getMachine,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../redux/slices/products/machine';
import { resetToolInstalled, resetToolsInstalled } from '../../redux/slices/products/toolInstalled';
import { resetSetting, resetSettings } from '../../redux/slices/products/machineTechParamValue';
import { resetLicense, resetLicenses } from '../../redux/slices/products/license';
import { resetNote, resetNotes } from '../../redux/slices/products/machineNote';
import {
  resetMachineDocument,
  resetMachineDocuments,
} from '../../redux/slices/document/machineDocument';

// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// asset
// util
import MachineDashboardNavbar from './util/MachineDashboardNavbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

import { useSettingsContext } from '../../components/settings';

import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------
const STATUS_OPTIONS = [
  // { id: '1', value: 'Order Received' },
  // { id: '2', value: 'In Progress' },
  // { id: '3', value: 'Ready For Transport' },
  // { id: '4', value: 'In Freight' },
  // { id: '5', value: 'Deployed' },
  // { id: '6', value: 'Archived' },
];

const TABLE_HEAD = [
  // { id: 'havePrevious', label: '', align: 'center', width: 1.5 },
  { id: 'serialNumber', label: 'Serial Number', align: 'left' },
  // { id: 'previousMachine', label: 'Previous Machine', align: 'left' },
  { id: 'machineName', label: 'Name', align: 'left' },
  { id: 'model', label: 'Model', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'instalationSite', label: 'Installation Site', align: 'left' },
  { id: 'active', label: 'Active', align: 'center' },
  { id: 'created_at', label: 'Created At', align: 'left' },
];

export default function MachineList() {
  const {
    dense,
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: '-createdAt' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const { userId, user } = useAuthContext();
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const { machines, filterBy, page, rowsPerPage, isLoading, error, initial, responseMessage } = useSelector( (state) => state.machine );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    dispatch(getMachines());
    dispatch(resetMachine());
    dispatch(resetToolInstalled());
    dispatch(resetToolsInstalled());
    dispatch(resetSetting());
    dispatch(resetSettings());
    dispatch(resetLicense());
    dispatch(resetLicenses());
    dispatch(resetNote());
    dispatch(resetNotes());
    dispatch(resetMachineDocument());
    dispatch(resetMachineDocuments());
  }, [dispatch]);

  const { themeStretch } = useSettingsContext();
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (initial) {
      setTableData(machines);
    }
  }, [machines, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = 80 ;

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const filterNameDebounce = (value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
}

const debouncedSearch = debounce(async (criteria) => {
    filterNameDebounce(criteria);
  }, 500)

const handleFilterName = (event) => {
  debouncedSearch(event.target.value);
  setFilterName(event.target.value)
  setPage(0);
};

useEffect(() => {
    debouncedSearch.cancel();
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
    try {
      await dispatch(deleteMachine(id));
      dispatch(getMachines());
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

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row._id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  // const handleEditRow = (id) => {
  //   navigate(PATH_MACHINE.machines.edit(id));
  // };
  const handleViewRow = (id) => {
    navigate(PATH_MACHINE.machines.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
       
        <StyledCardContainer>
          <Cover title="Machines" name="Machines" icon="arcticons:materialistic" setting="enable" />
        </StyledCardContainer>
        <Card sx={{ mt: 3 }}>
          <MachineListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
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
            {selected.length > 1 ? "" :

            <TableSelectedAction

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
          }
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  // rowCount={tableData.length}
                  // numSelected={selected.length}
                  onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row._id)
                  //   )
                  // }
                />

              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <MachineListTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        // onDeleteRow={() => handleDeleteRow(row._id)}
                        // onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

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
        </Card>
        <Grid md={12}>
          <TableNoData isNotFound={isNotFound} />
        </Grid>
    </>
  );
}
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
      (product) =>
        product?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.serialNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.machineModel?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.status?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.instalationSite?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (product?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(product?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }
  return inputData;
}
