import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationFilter
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import CustomerJiraListTableToolbar from './CustomerJiraListTableToolbar';
import CustomerJiraTableRow from './CustomerJiraTableRow';
import {
  getCustomerJiras,
  resetCustomerJiraRecords,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setFilterStatus
} from '../../../redux/slices/customer/customerJira';
import { fDateTime } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import CustomerTabContainer from '../customers/util/CustomerTabContainer';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fields.created', label: 'Date', align: 'left' },
  { id: 'key', label: 'Ticket No.', align: 'left' },
  { id: 'fields.summary', label: 'Subject', align: 'left' },
  { id: 'fields.customfield_10069', label: 'Serial No', align: 'left' },
  { id: 'fields.customfield_10070.value', label: 'Machine', align: 'left' },
  { id: 'fields.status.name', label: 'Status', align: 'left' },
];

// ----------------------------------------------------------------------

export default function CustomerJiraList(){
  const { initial, customerJiras, filterBy, page, rowsPerPage, filterStatus, isLoading } = useSelector((state) => state.customerJira );
  const { customer } = useSelector((state) => state.customer);

  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({ defaultOrderBy: 'fields.created', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [ filterStatusOption, setFilterStatusOption ] = useState('');
  
  useLayoutEffect(() => {
    if(customer?.ref){
      dispatch(getCustomerJiras(customer?.ref));
    }
    return () => {
      dispatch(resetCustomerJiraRecords());
    }
  }, [dispatch, customer?.ref]);

  useEffect(() => {
    if (initial) {
      setTableData(customerJiras?.issues || [] );
    }
  }, [customerJiras?.issues, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);
  const denseHeight = 60;

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };

  const debouncedStatus = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterStatus(value))
  }, 500))

  const handleFilterStatus = (event) => {
    debouncedStatus.current(event.target.value);
    setFilterStatusOption(event.target.value)
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
      debouncedStatus.current.cancel();
  }, [debouncedSearch, debouncedStatus]);


  
  useEffect(()=>{
      setFilterName(filterBy);
      setFilterStatusOption(filterStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleViewRow = (key) => {
    window.open(`${CONFIG.JIRA_URL}${key}`, '_blank');
  }
  
  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false} >
          <CustomerTabContainer currentTabValue='jira' />
        <TableCard>
          <CustomerJiraListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            filterStatus={filterStatusOption}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          {!isNotFound && <TablePaginationFilter
            count={ dataFiltered?.length }
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                    .map((row, index) =>
                      row ? (
                        <CustomerJiraTableRow
                          key={row._id}
                          row={row}
                          onViewRow={handleViewRow}
                          selected={selected.includes(row._id)}
                          selectedLength={selected.length}
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
          {!isNotFound && <TablePaginationFilter
            count={ dataFiltered?.length }
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        </TableCard>
      </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis =  inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if(filterStatus==='Open'){
    inputData = inputData.filter((jira) => jira?.fields?.status?.statusCategory?.name==='In Progress' || jira?.fields?.status?.statusCategory?.name==='To Do');
  }else if(filterStatus!=='All'){
    inputData = inputData.filter((jira) => jira?.fields?.status?.statusCategory?.name===filterStatus);
  }

  if (filterName) {
    filterName = filterName.trim();

    inputData = inputData.filter(
      (jira) =>
        jira?.id?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.key?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.expand?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDateTime(jira?.fields?.created)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.fields?.summary?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.fields?.customfield_10069?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.fields?.status?.statusCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
