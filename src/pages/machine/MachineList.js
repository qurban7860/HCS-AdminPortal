import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useLayoutEffect, useMemo, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid,Container, Stack, Typography, DialogTitle, Dialog, InputAdornment , Table, Button, Tooltip, TableBody, IconButton, TableContainer,} from '@mui/material';
import {useTable,getComparator,emptyRows,TableNoData,TableSkeleton,TableEmptyRows,TableHeadCustom,TableSelectedAction,TablePaginationCustom} from '../../components/table';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import MachineListTableRow from './MachineListTableRow';
import MachineListTableToolbar from './MachineListTableToolbar';
import { Cover } from '../components/Cover';
// slice
// import { getSPContacts } from '../../redux/slices/contact';
import machine, { getMachines, deleteMachine } from '../../redux/slices/products/machine';

// routes
import { PATH_DASHBOARD , PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSelect, RHFAutocomplete, RHFTextField, RHFMultiSelect, RHFEditor, RHFUpload, } from '../../components/hook-form';
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
  { id: 'havePrevious', label: '', align: 'center', width: 1.5 },
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
  const {dense,page,order,orderBy,rowsPerPage,setPage,selected,setSelected,onSelectRow,onSelectAllRows,onSort,onChangeDense,onChangePage,onChangeRowsPerPage,} = useTable({ defaultOrderBy: 'createdAt', });
  const { userId, user } = useAuthContext();
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const { machines, isLoading, error, initial, responseMessage } = useSelector((state) => state.machine);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  useLayoutEffect(() => {
    dispatch(getMachines());
  }, [dispatch]);
  const { themeStretch } = useSettingsContext();
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (initial) {
      if (machines && !error) {
        enqueueSnackbar(responseMessage);
      } else {
        enqueueSnackbar(error, { variant: `error` });
      }
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

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

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
      console.log(err);
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
  //   navigate(PATH_MACHINE.machine.edit(id));
  // };
  const handleViewRow = (id) => {
    navigate(PATH_MACHINE.machine.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
           <Container maxWidth={false}>
        <Grid container spacing={3}>
          {/* <MachineDashboardNavbar/> */}
        </Grid>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            mt: '24px',
          }}
        >
          <Cover name='Machines List' icon='arcticons:materialistic' setting="enable" />
        </Card>
        {/* <CustomBreadcrumbs
          heading="Machines"
          sx={{ mb: -3, mt: 3 }}
        /> */}
        <Card sx={{mt: 3 }}>
          <MachineListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          {/* {selected.length > 1 ? "" :

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
          } */}

            <Scrollbar>
              <Table size= 'small' sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
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
                          // selected={selected.includes(row._id)}
                          // onSelectRow={() => onSelectRow(row._id)}
                          // onDeleteRow={() => handleDeleteRow(row._id)}
                          // onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

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

          />
        </Card>
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
function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter( (product) => product?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
    product?.serialNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
    product?.machineModel?.name?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0  ||
    product?.status?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
    product?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
    product?.instalationSite?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
    // (product?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
    fDate(product?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0  );
  }
  return inputData;
}