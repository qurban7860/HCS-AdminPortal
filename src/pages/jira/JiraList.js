import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import { Card, Table, TableBody, Container, TableContainer, Chip, Grid, Typography } from '@mui/material';
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
  TableHeadFilter,
  TableSelectedAction,
  TablePaginationFilter,
} from '../../components/table';
// sections
import JiraTableToolbar from './JiraTableToolbar';
import JiraTableRow from './JiraTableRow';
import { fDate, fDateTime } from '../../utils/formatTime';
// constants
import TableCard from '../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { getJiraTickets, resetJiraTickets, setFilterStatus, ChangePage, ChangeRowsPerPage, setFilterBy, setFilterPeriod, setReportHiddenColumns } from '../../redux/slices/jira/jira';
import { getJiraStatusChipColor } from '../../utils/jira';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fields.created', label: 'Date', align: 'left' },
  { id: 'key', label: 'Ticket No.', align: 'left' },
  { id: 'fields.summary', label: 'Subject', align: 'left' },
  { id: 'fields.customfield_10078', label: 'Oragnization', align: 'left' },
  { id: 'fields.customfield_10069', label: 'Machine', align: 'left' },
  { id: 'fields.customfield_10070.value', label: 'Model', align: 'left' },
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
    defaultOrderBy: 'fields.created', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const {
    jiraTickets,
    error,
    responseMessage,
    initial,
    filterBy, 
    filterStatus,
    filterPeriod,
    page, 
    rowsPerPage, 
    totalRows,
    isLoading,
    reportHiddenColumns
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
  const [ filterPeriodOption, setFilterPeriodOption ] = useState(3);

  useLayoutEffect(()=>{
    dispatch(getJiraTickets(filterPeriodOption));
    return ()=>{
      dispatch(resetJiraTickets());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, filterPeriodOption])

  const onRefresh = () => {
    dispatch(getJiraTickets(filterPeriodOption));
  };

  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    if (initial) {
      setTableData(jiraTickets?.issues || []);
      const counts = {};
      jiraTickets?.issues?.forEach(item => {
        const name = item.fields?.status?.name;
        const category = item.fields?.status?.statusCategory?.name;
        const color = getJiraStatusChipColor(item.fields?.status?.statusCategory?.colorName); // Extract colorName
        if (name) {
          if (!counts[name]) {
            counts[name] = { count: 0, color, category }; // Save colorName along with count
          }
          counts[name].count += 1; // Increment count
        }
      });
  
      const countsArray = Object.entries(counts).map(([name, { count, color, category }]) => ({
        name,
        count,
        color,
        category
      }));

      setStatusCounts(countsArray.sort((a, b) => b.category.localeCompare(a.category)));
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

  const debouncedPeriod = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterPeriod(value))
  }, 500))

  const handleFilterPeriod = (event) => {
    debouncedPeriod.current(event.target.value);
    setFilterPeriodOption(event.target.value)
    setPage(0);
  };

  useEffect(() => {
      debouncedSearch.current.cancel();
      debouncedStatus.current.cancel();
      debouncedPeriod.current.cancel();
  }, [debouncedSearch, debouncedStatus, debouncedPeriod]);

  useEffect(()=>{
      setFilterName(filterBy);
      setFilterStatusOption(filterStatus);
      setFilterPeriodOption(filterPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleResetFilter = () => {
    dispatch(setFilterBy(''));
    setFilterName('');
  };

  const handleViewRow = (key) => {
    window.open(`${CONFIG.JIRA_URL}${key}`, '_blank');
  }
  
  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg));
  };

  return (
      <Container maxWidth={false}>
        <StyledCardContainer><Cover name="Jira Tickets" /></StyledCardContainer>
        <TableCard>
          <JiraTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            filterStatus={filterStatusOption}
            onFilterStatus={handleFilterStatus}
            filterPeriod={filterPeriodOption}
            onFilterPeriod={handleFilterPeriod}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            onReload={onRefresh}
          />

          {!isLoading && !isNotFound &&
              <>
                <Grid sx={{px:3, pb:2}} container rowGap={0.5} columnGap={0.5}>
                  {statusCounts && statusCounts.map(({name, count, color}) => (
                    <Chip key={name} sx={color} label={<>{name} : <b>{count}</b></>}/>
                  ))}
                </Grid>
                <Grid container sx={{px:3, pb:2}}>
                  {jiraTickets?.total>500 && <Typography color='red' variant='body2'>There are more records!</Typography>}
                </Grid>
              </>
          }

        {!isNotFound && <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={dataFiltered?.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            // statusCounts={statusCounts}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
            />

            <Scrollbar>
              <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                <TableHeadFilter
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                  hiddenColumns={reportHiddenColumns}
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <JiraTableRow
                          key={row.id}
                          row={row}
                          onViewRow={handleViewRow}
                          hiddenColumns={reportHiddenColumns}
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
            count={dataFiltered?.length}
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
        jira?.fields?.customfield_10078?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.fields?.customfield_10069?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.fields?.customfield_10070?.value?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDateTime(jira?.fields?.created)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.fields?.summary?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        jira?.fields?.status?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
      );
  }

  return inputData;
}
