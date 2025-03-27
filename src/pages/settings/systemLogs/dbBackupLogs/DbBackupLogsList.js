import { useState, useEffect, useRef } from 'react';
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
import ReleasesListTableRow from './DbBackupLogsTableRow';
import ReleasesListTableToolbar from './DbBackupLogsListTableToolbar';
import { getDbBackupLogs, setFilterBy } from '../../../../redux/slices/logs/dbBackupLogs';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';

export default function DbBackupLogsList() {
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
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);

  const { dbBackupLogs, filterBy, isLoading, initial } = useSelector((state) => state.dbBackupLogs );

  const TABLE_HEAD = [
    { id: 'updatedAt', label: 'Date', align: 'left' },
    { id: 'backupLocation', label: 'Name', align: 'left' },
    { id: 'backupSize', label: 'Size', align: 'left' },
    { id: 'databaseName', label: 'User', align: 'left' },
    { id: 'backupStatus', label: 'Status', align: 'right' },
  ];

  useEffect(() => {
      dispatch(getDbBackupLogs( page, rowsPerPage ));
  }, [dispatch, page, rowsPerPage ]);

  useEffect(() => {
    if (initial) {
      setTableData(dbBackupLogs?.data || [] ); 
    }
  }, [ initial, dbBackupLogs ]);

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
  };

  return (
      <Container maxWidth={false}>
        <Card sx={{mb: 3, height: 160, position: 'relative'}}>
          <Cover name="DB Backup Logs" />
        </Card>
        <TableCard>
          <ReleasesListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />
            <TablePaginationCustom
              count={dbBackupLogs?.totalCount || 0 }
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
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
                {(
                  isLoading
                    ? [...Array(rowsPerPage)]
                    : dataFiltered
                  )
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                        <ReleasesListTableRow
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
            count={ dbBackupLogs?.totalCount || 0 }
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
      (dbBackup) => 
        dbBackup?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 || 
        dbBackup?.backupSize?.toString()?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 || 
        dbBackup?.databaseName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 || 
        dbBackup?.databaseVersion?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 || 
        dbBackup?.backupStatus?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 || 
        dbBackup?.backupLocation?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 || 
        fDate(dbBackup?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 
    );
  }

  return inputData;
}
