import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import { Card, Table, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// components
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar';
import { Cover } from '../../components/Defaults/Cover';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import JiraTableToolbar from './JiraTableToolbar';
import JiraTableRow from './JiraTableRow';
import { fDate, fDateTime } from '../../utils/formatTime';
// constants
import TableCard from '../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { getJiraTickets, resetJiraTickets, setFilterStatus, ChangePage, ChangeRowsPerPage, setFilterBy } from '../../redux/slices/jira/jira';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = ['Administrator', 'Normal User', 'Guest User', 'Restriced User'];

const TABLE_HEAD = [
  { id: 'fields.created', label: 'Date', align: 'left' },
  { id: 'key', label: 'Ticket No.', align: 'left' },
  { id: 'fields.summary', label: 'Subject', align: 'left' },
  { id: 'fields.status.name', label: 'Status', align: 'left' },
];

// ----------------------------------------------------------------------

export default function JiraList() {
  const {
    dense,
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSort,
  } = useTable({
    defaultOrderBy: 'isOnline', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const {
    jiraTickets,
    error,
    responseMessage,
    initial,
    filterBy, 
    filterStatus,
    page, 
    rowsPerPage, 
    isLoading
  } = useSelector((state) => state.jira);

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [ tableData, setTableData ] = useState([]);
  const [ filterName, setFilterName ] = useState('');
  const [ filterStatusOption, setFilterStatusOption ] = useState('');

  useEffect(()=>{
    dispatch(getJiraTickets(rowsPerPage, filterStatusOption));
    return ()=>{
      dispatch(resetJiraTickets());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, page, rowsPerPage, filterStatusOption])

  useEffect(() => {
    if (initial) {
      setTableData(jiraTickets?.issues || []);
    }
  }, [jiraTickets, error, enqueueSnackbar, responseMessage, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus
  });
  
  const denseHeight = 60;
  const isFiltered = filterName !== '';
  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !isLoading);

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

  const handleResetFilter = () => {
    dispatch(setFilterBy(''));
    setFilterName('');
  };

  const onRefresh = () => {
    dispatch(getJiraTickets(rowsPerPage, filterStatusOption));
  };

  return (
      <Container maxWidth={false}>
        <StyledCardContainer><Cover name="Jira Report" /></StyledCardContainer>
        <TableCard>
          <JiraTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            filterStatus={filterStatusOption}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            onReload={onRefresh}
          />

        {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
            />

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
                        <JiraTableRow
                        key={row._id}
                        row={row}
                        // selected={selected.includes(row._id)}
                        // onSelectRow={() => onSelectRow(row._id)}
                        // onViewRow={() => handleViewRow(row._id)}
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

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

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
