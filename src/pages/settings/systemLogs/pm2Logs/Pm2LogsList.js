import { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
// @mui
import { Table, TableBody, TableContainer, Container, Card } from '@mui/material';
import { useNavigate } from 'react-router';
import { PATH_SETTING } from '../../../../routes/paths';
import { Cover } from '../../../../components/Defaults/Cover';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
// sections
import Pm2LogsTableRow from './Pm2LogsTableRow';
import Pm2LogsListTableToolbar from './Pm2LogsListTableToolbar';
import { getPm2Logs, resetPm2Logs, getPm2Environments, resetPm2Environments, setFilterBy } from '../../../../redux/slices/logs/pm2Logs';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';

export default function Pm2LogsList() {
  const {
    order,
    orderBy,
    page, 
    rowsPerPage,
    setPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'id', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);

  const { pm2Logs, pm2Environment, filterBy, isLoading, initial } = useSelector((state) => state.pm2Logs );

  const TABLE_HEAD = [
    { id: 'pm2Logs', label: 'PM 2 Logs', align: 'left' },
  ];

  const fetchPm2Logs = useCallback(()=>{
    if (pm2Environment) {
      dispatch(getPm2Logs( page, rowsPerPage, pm2Environment ));
    }
  },[ dispatch, pm2Environment, page, rowsPerPage ] )

  useEffect(() => {
      dispatch(getPm2Environments());
      return () => {
        dispatch(resetPm2Environments());
      }
  }, [ dispatch ]);

  useEffect(() => {
    fetchPm2Logs();
    return () => {
      dispatch(resetPm2Logs());
    }
}, [dispatch, fetchPm2Logs, pm2Environment ]);

  useEffect(() => {
    if (initial) {
      setTableData(pm2Logs?.data || [] ); 
    }
  }, [ dispatch, initial, pm2Logs ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });  
  const denseHeight = 60;
  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
    setPage(0)
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ filterBy ])

  const handleFilterStatus = (event) => {
    setPage(0);
  };

  // const handleViewRow = (id) => {
  //   const url = `https://howickltd.atlassian.net/projects/HPS/versions/${id}/tab/release-report-all-issues`
  //   window.open(url, '_blank');
  //   // navigate(PATH_SETTING.releases.view(link))
  // };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
      <Container maxWidth={false}>
        <Card sx={{mb: 3, height: 160, position: 'relative'}}>
          <Cover name="PM2 Logs" icon="simple-icons:pm2" generalSettings />
        </Card>
        <TableCard>
          <Pm2LogsListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            isPm2Environments
          />
            <TablePaginationCustom
              count={pm2Logs?.totalPages || 0 }
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              refresh={ fetchPm2Logs }
            />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableBody>
                {(
                  isLoading
                    ? [...Array(rowsPerPage)]
                    : dataFiltered
                  )
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                        <Pm2LogsTableRow
                          key={index}
                          row={row}
                          // onViewRow={() => handleViewRow(row?.id)}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        />
                      
                    ) : !isNotFound && isLoading && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={pm2Logs?.totalPages}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </TableCard>
      </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    return inputData.filter(
      (release) => 
        release.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 
    );
  }
  return inputData;
}
