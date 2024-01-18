import { useState, useEffect , useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  // Stack,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { FORMLABELS } from '../../constants/default-constants';

// sections
import CustomerListTableRow from './CustomerListTableRow';
import CustomerListTableToolbar from './CustomerListTableToolbar';
import { getCustomers, ChangePage, ChangeRowsPerPage, setFilterBy, setVerified,
   setCustomerTab,
   setExcludeReporting,
   resetCustomers} from '../../redux/slices/customer/customer';
import { Cover } from '../components/Defaults/Cover';
import TableCard from '../components/ListTableTools/TableCard';
import { fDate } from '../../utils/formatTime';
import { useSnackbar } from '../../components/snackbar';
import { exportCSV } from '../../utils/exportCSV';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Customer', align: 'left' },
  { id: 'clientCode', label: 'Code', align: 'left' },
  { id: 'tradingName', visibility: 's1', label: 'Trading Name', align: 'left' },
  { id: 'mainSite.address.country', visibility: 'xs2', label: 'Address', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function CustomerList() {
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { customers, filterBy, verified, excludeReporting, page, rowsPerPage, isLoading } = useSelector((state) => state.customer);
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

  useEffect(() => {
      dispatch(getCustomers(page, rowsPerPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, rowsPerPage]);

  useEffect(() => {
    setTableData(customers?.data || []);
  }, [customers]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterVerify,
    filterExcludeRepoting,
    filterStatus,
  });
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

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
    dispatch(setCustomerTab('info'));
    navigate(PATH_CUSTOMER.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterStatus([]);
  }; 

  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async () => {
    setExportingCSV(true);
    const params = {
      isArchived: false,
      orderBy : {
        createdAt:-1
      }
    };

    const response = dispatch(await exportCSV('CustomerCSV','crm/customers/export', params));
    response.then((res) => {
      setExportingCSV(false);
      enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
    });
  };

  return (
    <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.CUSTOMERS} icon="mdi:users" />
        </StyledCardContainer>
      <TableCard >
        <CustomerListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          filterVerify={filterVerify}
          onFilterVerify={handleFilterVerify}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          customerDocList
          machineDocList
          onExportCSV={onExportCSV}
          onExportLoading={exportingCSV}
          filterExcludeRepoting={filterExcludeRepoting}
          handleExcludeRepoting={handleExcludeRepoting}
        />

        {!isNotFound && <TablePaginationCustom
          count={customers?.totalCount || 0}
          page={customers?.totalCount?page:0}
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
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <CustomerListTableRow
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
          count={customers?.totalCount || 0}
          page={customers?.totalCount? page:0}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />}
      </TableCard>

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
              // handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
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
    inputData = inputData.filter(
      (customer) =>
        customer?.clientCode?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        customer?.tradingName?.some((tName) => tName.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ) ||
        `${customer?.mainSite?.address?.city}, ${customer?.mainSite?.address?.country}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
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
