import { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// form
// @mui
import { Grid, Container, Table, TableBody, TableContainer , Tooltip, IconButton} from '@mui/material';
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
import MachineListTableRow from './MachineListTableRow';
import MachineListTableToolbar from './MachineListTableToolbar';

import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';

// slice
import {
  getMachines,
  resetMachine,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setVerified
} from '../../redux/slices/products/machine';
import { resetToolInstalled, resetToolsInstalled } from '../../redux/slices/products/toolInstalled';
import { resetSetting, resetSettings } from '../../redux/slices/products/machineSetting';
import { resetLicense, resetLicenses } from '../../redux/slices/products/license';
import { resetNote, resetNotes } from '../../redux/slices/products/machineNote';
import {
  resetMachineDocument,
  resetMachineDocuments,
} from '../../redux/slices/document/machineDocument';

// routes
import { PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
// auth
// asset
// util
import TableCard from '../components/ListTableTools/TableCard';
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'havePrevious', label: '', align: 'center', width: 1.5 },
  { id: 'serialNo', label: 'Serial Number', align: 'left' },
  // { id: 'previousMachine', label: 'Previous Machine', align: 'left' },
  { id: 'name', visibility: 'md1',label: 'Name', align: 'left' },
  { id: 'machineModel.name', visibility: 'xs1', label: 'Model', align: 'left' },
  { id: 'status.name', visibility: 'xs2',  label: 'Status', align: 'left' },
  { id: 'customer.name', visibility: 'md2', label: 'Customer', align: 'left' },
  { id: 'instalationSite.name', visibility: 'md3', label: 'Installation Site', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

export default function MachineList() {
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  // const { userId, user } = useAuthContext();
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const { machines, verified, filterBy, page, rowsPerPage, isLoading, error, initial, responseMessage } = useSelector( (state) => state.machine );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
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
    
    dispatch(getMachines());
  }, [dispatch]);

  const [filterVerify, setFilterVerify] = useState(verified);
  const [filterName, setFilterName] = useState(filterBy);
  const [filterStatus, setFilterStatus] = useState([]);
  const [setOpenConfirm] = useState(false);

  useEffect(() => {
    if (initial) {
      setTableData(machines);
    }
  }, [machines, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterVerify,
    filterStatus,
  });

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);
  const denseHeight = 60;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const debouncedVerified = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setVerified(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };

  const handleFilterVerify = (event) => {
    debouncedVerified.current(event.target.value);
    setFilterVerify(event.target.value)
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  // useEffect(()=>{
  //     setFilterName(filterBy)
  //     setFilterVerify(verified)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = (id) => {
    navigate(PATH_MACHINE.machines.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <Container maxWidth={false} sx={{mb:3}}>
        <StyledCardContainer>
          <Cover title="Machines" name="Machines" icon="arcticons:materialistic" setting />
        </StyledCardContainer>
        <TableCard>
          <MachineListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            filterVerify={filterVerify}
            onFilterVerify={handleFilterVerify}
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
              <Table size="small" sx={{ minWidth: 360 }}>
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
  );
}
function applyFilter({ inputData, comparator, filterName, filterVerify, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if(filterVerify==='verified')
    inputData = inputData.filter((customer)=> customer.verifications.length>0);
  else if(filterVerify==='unverified')
    inputData = inputData.filter((customer)=> customer.verifications.length===0);
    
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
