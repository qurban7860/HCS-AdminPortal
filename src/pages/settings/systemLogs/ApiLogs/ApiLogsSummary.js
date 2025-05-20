import dayjs from 'dayjs';
import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// @mui
import { Table, TableBody, TableContainer, Container, Card, Box, Grid, Stack, MenuItem } from '@mui/material';
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
  getComparator,
} from '../../../../components/table';
import FormProvider, { RHFDatePicker, RHFSelect } from '../../../../components/hook-form';
import Scrollbar from '../../../../components/scrollbar';
// sections
import { getApiLogSummary } from '../../../../redux/slices/logs/apiLogs';
import { getMachineForDialog, setMachineDialog } from '../../../../redux/slices/products/machine';
import TableCard from '../../../../components/ListTableTools/TableCard';
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
import RHFFilteredSearchBar from '../../../../components/hook-form/RHFFilteredSearchBar';
import { apiTypeOptions } from '../../../../utils/constants';
import APILogsSummaryTableRow from './APILogsSummaryTableRow';
import MachineDialog from '../../../../components/Dialog/MachineDialog';

export default function ApiLogsSummary() {
  const { order, orderBy, onSort } = useTable({
    defaultOrderBy: 'lastCallTime',
    defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const { machineId } = useParams();
  const [tableData, setTableData] = useState([]);
  
  const { apiLogSummary, isLoading } = useSelector((state) => state.apiLogs);

  const TABLE_HEAD = [
    { id: 'serialNo', label: 'Serial No', align: 'left' },
    { id: 'count', label: 'API Calls', align: 'left' },
    { id: 'lastCallTime', label: 'Last Call', align: 'left' },
  ];

  const defaultValues = {
    dateFrom: dayjs().subtract(30, 'day').startOf('day').toDate(),
    dateTo: dayjs().endOf('day').toDate(),
    filterRequestType: 'ALL',
  };

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit } = methods;

  // useEffect(() => {
  //   const values = methods.getValues();
  //   handleFetchLogSummary(values);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [order, orderBy]);

  useEffect(() => {
    setTableData(apiLogSummary || []);
  }, [apiLogSummary]);

  // const dataFiltered = tableData;

  const dataFiltered = [...tableData].sort(getComparator(order, orderBy));

  const denseHeight = 60;
  const isNotFound = !dataFiltered.length || (!isLoading && !dataFiltered.length);

  const handleFetchLogSummary = (data) => {
    const query = {
      fromDate: new Date(new Date(data.dateFrom).setHours(0, 0, 0, 0)).toISOString(),
      toDate: new Date(new Date(data.dateTo).setHours(23, 59, 59, 999)).toISOString(),
    };

    if (data.filterRequestType !== 'ALL') {
      query.apiType = data.filterRequestType;
    }
    
    dispatch(getApiLogSummary(query));
  };

  const handleViewRow = (row) => {
    dispatch(getMachineForDialog(row?._id));
    dispatch(setMachineDialog(true));
  };
  
  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="API Log Summary" />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleFetchLogSummary)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, alignItems: 'center', width: '100%', }}>
                  <RHFSelect name="filterRequestType" label="Request Type" size="small">
                    {apiTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFDatePicker label="Start Date" name="dateFrom" size="small" />
                  <RHFDatePicker label="End Date" name="dateTo" size="small" />
                  <LoadingButton type="submit" variant="contained" sx={{ height: '40px' }} size="large">
                    Search
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      
      <TableCard>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
              <TableHeadFilter
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onSort={onSort}
              />
              <TableBody>
                {(isLoading ? [...Array(10)] : dataFiltered)
                  .map((row, index) =>
                    row ? (
                      <APILogsSummaryTableRow key={index} row={row} onViewRow={() => handleViewRow(row)} />
                    ) : (
                      !isNotFound && isLoading && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}
                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </TableCard>
      <MachineDialog />
    </Container>
  );
}