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
import Scrollbar from '../../components/scrollbar';
import MachineListTableRow from './MachineListTableRow';
import MachineTableController from './MachineTableController';

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
  setMachineTab,
  setAccountManager,
  setSupportManager,
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

MachineList.propTypes = {
  isArchived: PropTypes.object,
};

const TABLE_HEAD = [
  { id: 'serialNo', label: 'Serial Number', align: 'left', hideable:false },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'machineModel.name', label: 'Model', align: 'left' },
  { id: 'customer.name', label: 'Customer', align: 'left' },
  { id: 'installationDate', label: 'Installation Date', align: 'left' },
  { id: 'shippingDate', label: 'Shipping Date', align: 'left' },
  { id: 'manufactureDate', label: 'Manufacture Date', align: 'left'},
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'profiles', label: 'Profile', align: 'left' },

  { id: 'isActive', label: 'Active', align: 'center' },
];

export default function MachineList({ isArchived }) {
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
  const [accountManagers, setAccountManagers] = useState([]);
  
  const dispatch = useDispatch();
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();

  const { machines, 
    verified,
    supportManager, 
    filterBy, 
    page, 
    rowsPerPage, 
    isLoading, 
    error, 
    initial, 
    responseMessage,
    reportHiddenColumns
  } = useSelector( (state) => state.machine);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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

  const [filterVerify, setFilterVerify] = useState(verified);
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
    filterVerify,
    filterStatus,
    accountManagers, 
    supportManager,
  });

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);
  const denseHeight = 60;

  // const debouncedMachineVerify = useRef(debounce((value) => {
  //   dispatch(ChangePage(0));  // Resets the page to 0 when filters change
  //   dispatch(setVerified(value));  // Update the `verified` state in Redux (if needed)
  // }, 500));
  
  
  
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
  
  
  
  const debouncedAccountManager = useRef(debounce((value) => {
    dispatch(ChangePage(0))
  }, 500))

  const setAccountManagerFilter = (newValues) => {
    debouncedAccountManager.current(newValues?.[0]?._id)
    // dispatch(setAccountManager(event))
    setAccountManagers([...newValues])
  };

  const debouncedSupportManager = useRef(debounce((value) => {
    dispatch(ChangePage(0))
  }, 500))

  const setSupportManagerFilter = (event) => {
    debouncedSupportManager.current(event?._id)
    dispatch(setSupportManager(event))
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = (id) => {
    dispatch(setMachineTab('info'));
    navigate(PATH_MACHINE.machines.view(id));
  }
  
  const handleCustomerDialog = (e, id) => {
    dispatch(getCustomer(id))
    dispatch(setCustomerDialog(true))
  }

  const openInNewPage = (id) => {
      dispatch(setMachineTab('info'));
      const url = PATH_MACHINE.machines.view(id);
      window.open(url, '_blank');
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterStatus([]);
  };
  
  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async () => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('Machines'));
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
      <Cover name={ isArchived ? "Archived Machines" : "Machines" } icon="arcticons:materialistic" isArchived={isArchived} />
      </StyledCardContainer>
      <TableCard>
        <MachineTableController
          filterName={filterName}
          onFilterName={handleFilterName}
          filterVerify={ isArchived ? undefined : filterVerify}
          onFilterVerify={ isArchived ? undefined : handleFilterVerify}
          filterStatus={ isArchived ? undefined : filterStatus}
          onFilterStatus={ isArchived ? undefined : handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onExportCSV={onExportCSV}
          onExportLoading={exportingCSV}
          accountManagerFilter={accountManagers}
          setAccountManagerFilter={ isArchived ? undefined : setAccountManagerFilter}
          supportManagerFilter={supportManager}
          setSupportManagerFilter={ isArchived ? undefined : setSupportManagerFilter}
          isArchived={isArchived}
        />

        {!isNotFound && (
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
                      <MachineListTableRow
                        key={row._id}
                        row={row}
                        hiddenColumns={reportHiddenColumns}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        openInNewPage={ () => openInNewPage(row._id)}
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
function applyFilter({ inputData=[], comparator, filterName, filterVerify, filterStatus, accountManagers, supportManager }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if(accountManagers?.length > 0)
    inputData = inputData.filter((machine) => machine?.accountManager?.some(machineManagerId => accountManagers?.some(accountManager => accountManager._id === machineManagerId)));
    // inputData = inputData.filter((machine) => machine?.accountManager?.some(manager => manager === accountManager?._id ));
  if(supportManager)
    inputData = inputData.filter((machine) => machine?.supportManager?.some(manager => manager === supportManager?._id ));
  if(filterVerify==='verified')
    inputData = inputData.filter((machine)=> machine?.verifications?.length > 0);
  
  if(filterVerify==='unverified')
    inputData = inputData.filter((machine)=> machine?.verifications?.length === 0);

  if (filterVerify === 'transferredDate')
    inputData = inputData.filter((machine) => machine?.transferredDate);

  // if (filterVerify === 'all')
  //   inputData = inputData.filter((machine) => !machine?.transferredDate);
  
  if (filterName) {
    inputData = inputData.filter(
      (product) =>
        product?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.serialNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.machineModel?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.status?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        product?.instalationSite?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // `${product?.accountManager?.firstName} ${product?.accountManager?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // `${product?.projectManager?.firstName} ${product?.projectManager?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // `${product?.supportManager?.firstName} ${product?.supportManager?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (product?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(product?.installationDate)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(product?.shippingDate)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(product?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }
  return inputData;
}
