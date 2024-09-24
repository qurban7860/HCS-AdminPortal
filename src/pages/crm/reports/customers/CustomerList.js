import PropTypes from 'prop-types';
import { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  TableBody,
  Container,
  TableContainer,
  // Stack,
} from '@mui/material';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import useResponsive from 'src/hooks/useResponsive';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_CRM } from '../../../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationCustom,
  TablePaginationFilter,
  TableHeadFilter,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../../constants/default-constants';

// sections
import CustomerListTableRow from './CustomerListTableRow';
import CustomerListTableToolbar from './CustomerListTableToolbar';
import { getCustomers, 
  resetCustomers, 
  resetCustomer, 
  ChangePage, 
  ChangeRowsPerPage, 
  setFilterBy, 
  setVerified, 
  setExcludeReporting, 
  setReportHiddenColumns, 
  getCustomer,
  setCustomerDialog} from '../../../../redux/slices/customer/customer';
import { Cover } from '../../../../components/Defaults/Cover';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { fDate } from '../../../../utils/formatTime';
import { useSnackbar } from '../../../../components/snackbar';
import { exportCSV } from '../../../../utils/exportCSV';
import CustomerDialog from '../../../../components/Dialog/CustomerDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Customer', align: 'left', hideable:false },
  { id: 'clientCode', label: 'Code', align: 'left' },
  { id: 'tradingName', visibility: 's1', label: 'Trading Name', align: 'left' },
  { id: 'groupCustomer.name', visibility: 's1', label: 'Group Customer', align: 'left' },
  { id: 'address', visibility: 'xs2', label: 'Address', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------
CustomerList.propTypes = {
  isArchived: PropTypes.bool,
}
 
export default function CustomerList({ isArchived }) {
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();
  const [filterStatus, setFilterStatus] = useState([]);
  const { customers, reportHiddenColumns, filterBy, verified, excludeReporting, page, rowsPerPage, isLoading } = useSelector((state) => state.customer);
  const [filterVerify, setFilterVerify] = useState(verified);
  const [filterExcludeRepoting, setFilterExcludeRepoting] = useState(excludeReporting);
  const [filterName, setFilterName] = useState(filterBy);

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };
  const onChangePage = (event, newPage) => { 
    dispatch(ChangePage(newPage)) 
  }
  
  const isMobile = useResponsive('down', 'sm');

  useEffect(() => {
    dispatch(getCustomers( null, null, isArchived, cancelTokenSource ));
    return ()=> { dispatch( resetCustomers() ) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isArchived ]);

  const dataFiltered = applyFilter({
    inputData: customers,
    comparator: getComparator(order, orderBy),
    filterName,
    filterVerify,
    filterExcludeRepoting,
    filterStatus,
  });

  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
      dispatch(ChangePage(0))
      dispatch(setFilterBy(value))
  }, 500))

  const debouncedVerified = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setVerified(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value)
    setFilterName(event.target.value)
    setPage(0);
  };

  const handleFilterVerify = (event) => {
    debouncedVerified.current(event.target.value)
    setFilterVerify(event.target.value)
    setPage(0);
  };

  const debouncedExcludeReporting = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setExcludeReporting(value))
  }, 500))

  const handleExcludeRepoting = (event)=> {
    debouncedExcludeReporting.current(event.target.value);
    setFilterExcludeRepoting(event?.target?.value)
  }

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);


  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = (id) => {
    dispatch(resetCustomer(id));
    navigate(PATH_CRM.customers.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterStatus([]);
  }; 

  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async (fetchAllContacts, fetchAllSites) => {
    const response = dispatch(await exportCSV( 'Customers' ));
    response.then((res) => {
        setExportingCSV(false);
      enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
    });
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg))
  };

  const handleCustomerDialog = (id) => {
    dispatch(getCustomer(id))
    dispatch(setCustomerDialog(true))
  }

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={isArchived ? FORMLABELS.COVER.ARCHIVED_CUSTOMERS : FORMLABELS.COVER.CUSTOMERS}
          customerSites
          customerContacts
          isArchivedCustomers={!isArchived}
          isArchived={isArchived}
        />
      </StyledCardContainer>
      <TableCard>
        <CustomerListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          filterVerify={isArchived ? undefined : filterVerify}
          onFilterVerify={isArchived ? undefined : handleFilterVerify}
          filterStatus={isArchived ? undefined : filterStatus}
          onFilterStatus={isArchived ? undefined : handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          customerDocList
          machineDocList
          onExportCSV={onExportCSV}
          onExportLoading={exportingCSV}
          filterExcludeRepoting={isArchived ? undefined : filterExcludeRepoting}
          handleExcludeRepoting={isArchived ? undefined : handleExcludeRepoting}
          isArchived={isArchived}
        />

        {!isNotFound && !isMobile && (
          <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={customers ? customers.length : 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}

        {!isNotFound && isMobile && (
          <TablePaginationCustom
            count={customers ? customers.length : 0}
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
                      <CustomerListTableRow
                        hiddenColumns={reportHiddenColumns}
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onViewGroupCustomer={() => handleCustomerDialog(row?.groupCustomer?._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
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

        {!isNotFound && (
          <TablePaginationCustom
            count={customers ? customers.length : 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
      </TableCard>
      <CustomerDialog />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterVerify, filterExcludeRepoting, filterStatus }) {
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
  
  if(filterExcludeRepoting==="excluded"){
    inputData = inputData.filter((customer)=> customer.excludeReports===true);
  }else if(filterExcludeRepoting==="included"){
    inputData = inputData.filter((customer)=> customer.excludeReports===false);
  }

  if (filterName) {
    filterName = filterName.trim();
    
    inputData = inputData.filter(
      (customer) =>
        customer?.clientCode?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        customer?.tradingName?.some((tName) => tName.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ) ||
        `${customer?.mainSite?.address?.city}, ${customer?.mainSite?.address?.country}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        customer?.groupCustomer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // customer?.mainSite?.address?.country?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (customer?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(customer?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
