import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';

// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { CONFIG } from '../../../config-global';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import MachineJiraListTableToolbar from './MachineJiraListTableToolbar';
import MachineJiraTableRow from './MachineJiraTableRow';
import {
  getMachineJiras,
  resetMachineJiraRecords,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setFilterStatus
} from '../../../redux/slices/products/machineJira';
import { fDateTime } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fields.created', label: 'Date', align: 'left' },
  { id: 'key', label: 'Ticket No.', align: 'left' },
  { id: 'fields.summary', label: 'Subject', align: 'left' },
  { id: 'fields.status.name', label: 'Status', align: 'left' },
];

// ----------------------------------------------------------------------

export default function MachineJiraList(){
  const { machineJiras, filterBy, page, rowsPerPage, isLoading, filterStatus } = useSelector((state) => state.machineJira );
  const { machine } = useSelector((state) => state.machine);
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
  
  useLayoutEffect(() => {
      if(machine?.serialNo){
        dispatch(getMachineJiras(machine?.serialNo));
      }
      return () => {
        dispatch(resetMachineJiraRecords());
      }
  }, [dispatch, machine ]);

  const dataFiltered = applyFilter({
    inputData: machineJiras?.issues || [],
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
  
  const handleFilterStatus = (event) => {
    dispatch(setFilterStatus(event.target.value))
    setPage(0);
  };
  
  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [ debouncedSearch ]);

  useEffect(()=>{
      setFilterName(filterBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleViewRow = (machineIssueKey) => {
    window.open(`${CONFIG.JIRA_URL}${machineIssueKey}`, '_blank');
  }

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false} >
          <MachineTabContainer currentTabValue='jira' />
        <TableCard>
          <MachineJiraListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
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
                        <MachineJiraTableRow
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
  const stabilizedThis =  inputData && inputData?.map((el, index) => [el, index]); 
  stabilizedThis?.sort((a, b) => {
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
      jira?.fields?.status?.statusCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
