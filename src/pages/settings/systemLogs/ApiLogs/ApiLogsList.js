import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { useParams } from 'react-router-dom';
// @mui
import { Table, TableBody, TableContainer, Container, Card } from '@mui/material';
import { useNavigate } from 'react-router';
import { Cover } from '../../../../components/Defaults/Cover';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationFilter,
  TablePaginationCustom,
  TableHeadFilter,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
// sections
import APILogsTableRow from '../../../../components/machineIntegration/APILogsTableRow';
import ApiLogsListTableToolbar from './ApiLogsListTableToolbar';
import { getApiLogs, setFilterBy, ChangePage,  setReportHiddenColumns } from '../../../../redux/slices/logs/apiLogs';
import { fDateTime } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';

export default function ApiLogsList() {
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
  const { machineId } = useParams()
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterRequestStatus, setFilterRequestStatus] = useState(-1);
  const [filterRequestMethod, setFilterRequestMethod] = useState('default');
  const { apiLogs, filterBy, isLoading, initial, reportHiddenColumns } = useSelector((state) => state.apiLogs );

  const TABLE_HEAD = [
    { id: 'createdAt', label: 'Timestamp', align: 'left' },
    { id: 'requestMethod', label: 'Method', align: 'left' },
    { id: 'requestURL', label: 'Endpoint', align: 'left' },
    { id: 'responseStatusCode', label: 'Status', align: 'left' },
    { id: 'responseTime', label: 'Response Time', align: 'left' },
    { id: 'machine', label: 'Machine', align: 'left' },
    { id: 'customer', label: 'Customer', align: 'left' },
    { id: 'additionalContextualInformation', label: 'Description', align: 'left' },
  ];

  useEffect(() => {
    if (initial) {
      setTableData(apiLogs?.data || [] ); 
    }
  }, [ initial, apiLogs ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });  
  const denseHeight = 60;
  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))
  
  const handleFilterName = (event) => {
    const { value } = event.target;
    debouncedSearch.current(value);
    setFilterName(value);
    setPage(0);
  };
  
  const handleFilterRequestStatus = (event) => {
    dispatch(ChangePage(0))
    setFilterRequestStatus(event.target.value);
  };

  const handleFilterRequestMethod = (event) => {
    dispatch(ChangePage(0))
    setFilterRequestMethod(event.target.value);
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
  
  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg))
  };
  
  useEffect(() => {
    const query = { apiType: 'MACHINE-INTEGRATION' }; 
    if (filterRequestStatus !== -1) {
      if (filterRequestStatus === '200-299') {
        query.responseStatusCode = { $gte: 200, $lt: 300 };
      } else if (filterRequestStatus === '400-499') {
        query.responseStatusCode = { $gte: 400, $lte: 500 };
      } else {
        query.responseStatusCode = filterRequestStatus;
      }
    }
    if (filterRequestMethod !== 'default') {
      query.requestMethod = filterRequestMethod;
    }  
    dispatch(getApiLogs({
      machineId,
      orderBy: 'createdAt:desc',
      query,
      page,
      pageSize: rowsPerPage,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterRequestStatus, filterRequestMethod]);
  
  
  return (
      <Container maxWidth={false}>
        <Card sx={{mb: 3, height: 160, position: 'relative'}}>
          <Cover name="API Logs" generalSettings />
        </Card>
        <TableCard>
          <ApiLogsListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            filterRequestStatus={filterRequestStatus}
            onFilterRequestStatus={handleFilterRequestStatus}
            filterRequestMethod={filterRequestMethod}
            onFilterRequestMethod={handleFilterRequestMethod}
          />
          {!isNotFound && (
          <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={apiLogs?.totalCount || 0}
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
                {(
                  isLoading
                    ? [...Array(rowsPerPage)]
                    : dataFiltered
                  )
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                        <APILogsTableRow
                          key={index}
                          row={row}
                          hiddenColumns={reportHiddenColumns}
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
          {!isNotFound && (
          <TablePaginationCustom
            count={ apiLogs?.totalCount || 0 }
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          /> )}
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
    filterName = filterName?.trim();
    inputData = inputData?.filter(
      ( api ) =>
        fDateTime(api?.createdAt)?.toLowerCase().includes(filterName.toLowerCase()) ||
        api?.requestMethod?.toLowerCase().includes(filterName.toLowerCase()) ||
        api?.requestURL?.toString()?.toLowerCase().includes(filterName.toLowerCase()) ||
        (api?.responseStatusCode || '').toString().toLowerCase().includes(filterName.toLowerCase()) ||
        (api?.responseTime || '').toString().toLowerCase().includes(filterName.toLowerCase()) ||
        api?.machine?.some((machine) => machine?.serialNo?.toLowerCase().includes(filterName.toLowerCase()) ) ||      
        api?.customer?.name?.toLowerCase().includes(filterName.toLowerCase()) ||
        api?.additionalContextualInformation?.toLowerCase().includes(filterName.toLowerCase())
      );
  }

  return inputData;
}