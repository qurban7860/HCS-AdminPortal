import PropTypes from 'prop-types';
import { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';
// form
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadFilter,
  TablePaginationCustom,
  TablePaginationFilter
} from '../../components/table';
import useResponsive from '../../hooks/useResponsive';
import Scrollbar from '../../components/scrollbar';
import MachineSettingReportListTableRow from './MachineSettingReportListTableRow';
import MachineSettingReportListTableToolbar from './MachineSettingReportListTableToolbar';

import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';

// slice
import {
  getMachines,
  resetMachines,
  resetMachine,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setVerified,
  setReportHiddenColumns
} from '../../redux/slices/products/machine';
import { resetToolInstalled, resetToolsInstalled } from '../../redux/slices/products/toolInstalled';
import { resetSetting, resetSettings } from '../../redux/slices/products/machineSetting';
import { resetLicense, resetLicenses } from '../../redux/slices/products/license';
import { resetNote, resetNotes } from '../../redux/slices/products/machineNote';
import {
  resetMachineDocument,
  resetMachineDocuments,
} from '../../redux/slices/document/machineDocument';
import { getSPContacts } from '../../redux/slices/customer/contact';

import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
// util
import TableCard from '../../components/ListTableTools/TableCard';
import { fDate } from '../../utils/formatTime';
import { exportCSV } from '../../utils/exportCSV';

// ----------------------------------------------------------------------

MachineSettingReportList.propTypes = {
  isArchived: PropTypes.object,
};

const TABLE_HEAD = [
  { id: 'serialNo', label: 'Serial Number', align: 'left', hideable:false },
  // { id: 'name', visibility: 'md1',label: 'Name', align: 'left' },
  { id: 'machineModel.name', visibility: 'xs1', label: 'Model', align: 'left' },
  { id: 'customer.name', visibility: 'md2', label: 'Customer', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' }
];

export default function MachineSettingReportList({ isArchived }) {
  const {
    order,
    orderBy,
    setPage,
    onSelectRow,
    onSort,
  } = useTable({ defaultOrderBy: 'serialNo', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const [tableData, setTableData] = useState([]);
  
  const dispatch = useDispatch();
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();

  const { machines, 
    filterBy, 
    page, 
    rowsPerPage, 
    isLoading, 
    error, 
    initial, 
    responseMessage,
    reportHiddenColumns
  } = useSelector( (state) => state.machine);

  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useResponsive('down', 'sm');

  useLayoutEffect(() => {
    dispatch(resetMachine());
    dispatch(resetMachines());
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
    dispatch(getSPContacts( cancelTokenSource ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(()=>{
    dispatch(getMachines(null, null, isArchived, cancelTokenSource ));
    return ()=>{ cancelTokenSource.cancel() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, page, rowsPerPage, isArchived])

  const [filterName, setFilterName] = useState(filterBy);
  const [filterStatus, setFilterStatus] = useState([]);
  
  useEffect(() => {
    if (initial) {
      setTableData(machines || []);
    }
  }, [machines, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);
  const denseHeight = 60;

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
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  const handleCustomerDialog = (e, id) => {
    dispatch(getCustomer(id))
    dispatch(setCustomerDialog(true))
  }

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterStatus([]);
  };
  
  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async () => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('machinesettingreports'));
    response.then((res) => {
      setExportingCSV(false);
      enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
    });
  };

  const handleHiddenColumns = async (arg) => {
   dispatch(setReportHiddenColumns(arg))
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
      <Cover name= "Machine Setting Reports"  />
      </StyledCardContainer>
      <TableCard>
        <MachineSettingReportListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onExportCSV={onExportCSV}
          onExportLoading={exportingCSV}
          isArchived={isArchived}
        />

        {!isNotFound && !isMobile &&(
          <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={machines? machines.length : 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}

        {!isNotFound && isMobile && (
          <TablePaginationCustom
            count={machines ? machines.length : 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
              <TableHeadFilter
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                hiddenColumns={reportHiddenColumns}
                onSort={onSort}
              />

              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <MachineSettingReportListTableRow
                        key={row._id}
                        row={row}
                        hiddenColumns={reportHiddenColumns}
                        onSelectRow={() => onSelectRow(row._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        handleCustomerDialog={(e)=> row?.customer && handleCustomerDialog(e,row?.customer?._id)}
                        isArchived={isArchived}
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
            count={machines? machines.length : 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
      </TableCard>
    </Container>
  );
}
function applyFilter({ inputData, comparator, filterName }) {
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
        // product?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.serialNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.machineModel?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(product?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }
  return inputData;
}

