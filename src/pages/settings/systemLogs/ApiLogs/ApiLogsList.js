import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// @mui
import { Table, TableBody, TableContainer, Container, Card, Box, Grid, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Cover } from '../../../../components/Defaults/Cover';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// components
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TablePaginationFilter,
  TableHeadFilter,
} from '../../../../components/table';
import FormProvider, { RHFDatePicker } from '../../../../components/hook-form';
import Scrollbar from '../../../../components/scrollbar';
// sections
import APILogsTableRow from '../../../../components/machineIntegration/APILogsTableRow';
import {
  getApiLogs,
  getApiLogSummary,
  setFilterBy,
  setReportHiddenColumns,
} from '../../../../redux/slices/logs/apiLogs';
import TableCard from '../../../../components/ListTableTools/TableCard';
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
import RHFFilteredSearchBar from '../../../../components/hook-form/RHFFilteredSearchBar';

export default function ApiLogsList() {
  const { order, orderBy, onSort } = useTable({
    defaultOrderBy: 'createdAt',
    defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const { machineId } = useParams();
  const [tableData, setTableData] = useState([]);
  const [filterRequestStatus, setFilterRequestStatus] = useState(-1);
  const [filterRequestMethod, setFilterRequestMethod] = useState('default');
  const [filterRequestType, setFilterRequestType] = useState('ALL');
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');
  const { apiLogs, isLoading, reportHiddenColumns } = useSelector(
    (state) => state.apiLogs
  );

  const TABLE_HEAD = [
    { id: 'createdAt', label: 'Timestamp', align: 'left' },
    { id: 'apiType', label: 'API Type', align: 'left' },
    { id: 'requestMethod', label: 'Method', align: 'left' },
    { id: 'requestURL', label: 'Endpoint', align: 'left', allowSearch: true },
    { id: 'responseStatusCode', label: 'Status', align: 'left' },
    { id: 'responseTime', label: 'Time(ms)', align: 'left', allowSearch: true },
    { id: 'responseMessage', label: 'Response', align: 'left', allowSearch: true },
    { id: 'noOfRecordsUpdated', label: 'Records', align: 'left' },
    { id: 'customer.name', label: 'Customer', align: 'left' },
    { id: 'machine', label: 'Machine', align: 'left', allowSearch: true },
  ];

  const defaultValues = {
    dateFrom: new Date(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)).toISOString(),
    dateTo: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    filteredSearchKey: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const { watch, setValue, handleSubmit, trigger } = methods;
  const { dateFrom, dateTo, filteredSearchKey } = watch();

  useEffect(() => {
    
    handleFetchLogs(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, orderBy]);

  useEffect(() => {
    setTableData(apiLogs || []);
  }, [apiLogs]);

  const dataFiltered = tableData;
  const denseHeight = 60;
  const isNotFound = !dataFiltered.length || (!isLoading && !dataFiltered.length);

  const handleFetchLogs = () => {
    const query = {
      fromDate: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)).toISOString(),
      toDate: new Date(new Date(dateTo).setHours(23, 59, 59, 999)).toISOString(),
    };

    dispatch(getApiLogSummary(query));

    if (filteredSearchKey && selectedSearchFilter) {
      if (selectedSearchFilter === 'responseTime') {
        query.responseTime = { $regex: filteredSearchKey, $options: 'i' };
      } else if (selectedSearchFilter === 'responseMessage') {
        query.responseMessage = { $regex: filteredSearchKey, $options: 'i' };
      } else if (selectedSearchFilter === 'requestURL') {
        query.requestURL = { $regex: filteredSearchKey, $options: 'i' };
      } else if (selectedSearchFilter === 'machine') {
        query['machine.serialNo'] = { $regex: filteredSearchKey, $options: 'i' };
      }
    }

    if (filterRequestStatus !== -1) {
      query.responseStatusCode = getStatusCodeFilter(filterRequestStatus);
    }

    if (filterRequestMethod !== 'default') {
      query.requestMethod = filterRequestMethod;
    }

    if (filterRequestType !== 'ALL') {
      query.apiType = filterRequestType;
    }

    dispatch(
      getApiLogs({
        machineId,
        query,
        orderBy: { [orderBy]: order === 'desc' ? -1 : 1 },
        limit: 1000,
      })
    );
  };

  const debouncedSearch = useRef(
    debounce((value) => {
      dispatch(setFilterBy(value));
    }, 500)
  );

  const handleFilterRequestStatus = (event) => {
    setFilterRequestStatus(event.target.value);
  };

  const handleFilterRequestMethod = (event) => {
    setFilterRequestMethod(event.target.value);
  };

  const handleFilterRequestType = (event) => {
    setFilterRequestType(event.target.value);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  const afterClearHandler = () => {
    const query = {
      fromDate: new Date(dateFrom).toISOString(),
      toDate: new Date(dateTo).toISOString(),
      ...(filterRequestStatus !== -1 && {
        responseStatusCode: getStatusCodeFilter(filterRequestStatus)
      }),
      ...(filterRequestMethod !== 'default' && {
        requestMethod: filterRequestMethod
      }),
      ...(filterRequestType !== 'ALL' && {
        apiType: filterRequestType
      })
    };

    dispatch(
      getApiLogs({
        machineId,
        query,
        orderBy: { [orderBy]: order === 'desc' ? -1 : 1 },
        limit: 1000,
      })
    );

    setValue('filteredSearchKey', defaultValues.filteredSearchKey);
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg));
  };

  const onHandleSubmit = (data) => {
    handleFetchLogs(data);
  };

  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="API Logs" />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onHandleSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <SearchBarCombo
                  apiLogsStatusFilter={filterRequestStatus}
                  onApiLogsStatusFilter={handleFilterRequestStatus}
                  apiLogsMethodFilter={filterRequestMethod}
                  onApiLogsMethodFilter={handleFilterRequestMethod}
                  apiLogsTypeFilter={filterRequestType}
                  onApiLogsTypeFilter={handleFilterRequestType}
                />
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <RHFDatePicker
                    label="Start Date"
                    name="dateFrom"
                    size="small"
                    value={dateFrom}
                    onChange={(newValue) => {
                      setValue('dateFrom', newValue);
                      trigger(['dateFrom', 'dateTo']);
                    }}
                  />
                  <RHFDatePicker
                    label="End Date"
                    name="dateTo"
                    size="small"
                    value={dateTo}
                    onChange={(newValue) => {
                      setValue('dateTo', newValue);
                      trigger(['dateFrom', 'dateTo']);
                    }}
                  />
                </Box>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                    <RHFFilteredSearchBar
                      name="filteredSearchKey"
                      filterOptions={TABLE_HEAD.filter((item) => item?.allowSearch)}
                      setSelectedFilter={setSelectedSearchFilter}
                      selectedFilter={selectedSearchFilter}
                      placeholder="Enter Search here..."
                      afterClearHandler={afterClearHandler}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmit(onHandleSubmit)();
                        }
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton
                      type="button"
                      onClick={handleSubmit(onHandleSubmit)}
                      variant="contained"
                      size="large"
                    >
                      Search
                    </LoadingButton>
                  </Box>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <TableCard>
        {!isNotFound && (
          <TablePaginationFilter
            pagination={false}
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            recordCount={tableData?.length || 0}
            disablePagination
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
                {(isLoading ? [...Array(10)] : tableData)
                  .map((row, index) =>
                    row ? (
                      <APILogsTableRow
                        key={index}
                        row={row}
                        hiddenColumns={reportHiddenColumns}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        tableColumns={TABLE_HEAD}
                      />
                    ) : (
                      !isNotFound &&
                      isLoading && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}
                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </TableCard>
    </Container>
  );
}

// ----------------------------------------------------------------------

function getStatusCodeFilter(status) {
  if (status === '200-299') return { $gte: 200, $lt: 300 };
  if (status === '400-499') return { $gte: 400, $lte: 500 };
  return status;
}
