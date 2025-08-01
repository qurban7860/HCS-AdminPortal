import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
// @mui
import { Container, Table, TableBody, TableContainer, Grid, Card, Box, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadFilter,
  TablePaginationFilter
} from '../../components/table';
import { RHFAutocomplete } from '../../components/hook-form';
import useResponsive from '../../hooks/useResponsive';
import Scrollbar from '../../components/scrollbar';
import RHFFilteredSearchBar from '../../components/hook-form/RHFFilteredSearchBar';
import MachineSettingReportListTableRow from './MachineSettingReportListTableRow';
import MachineSettingReportListTableToolbar from './MachineSettingReportListTableToolbar';

import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getTechparamReports, ChangePage, ChangeRowsPerPage, setReportHiddenColumns  } from '../../redux/slices/products/machineTechParamReport';

import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
// components
import { useSnackbar } from '../../components/snackbar';
// util
import TableCard from '../../components/ListTableTools/TableCard';
import { exportCSV } from '../../utils/exportCSV';

// ----------------------------------------------------------------------

MachineSettingReportList.propTypes = {
  isArchived: PropTypes.object,
};

const TABLE_HEAD = [
  { id: 'serialNo', label: 'Serial No.', align: 'left', hideable:false, allowSearch: true },
  { id: 'machineModel.name', visibility: 'xs1', label: 'Model', align: 'left', allowSearch: true },
  { id: 'customer.name', visibility: 'xs1', label: 'Customer', align: 'left', allowSearch: true },
  { id: 'HLCSoftwareVersion', visibility: 'md', label: 'HLC Software Version', align: 'left' },
  { id: 'PLCSoftwareVersion', visibility: 'md', label: 'PLC Software Version', align: 'left' },
];

export default function MachineSettingReportList({ isArchived }) {
  const [statusesToShow, setStatusesToShow] = useState([])
  const [tableData, setTableData] = useState([]);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');
  
  const { page, rowsPerPage, isLoading, techparamReport, machineSettingReportstotalCount, reportHiddenColumns } = useSelector((state) => state.techparamReport) || {};
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus) || {};

  const { order, orderBy,  onSelectRow, onSort } = useTable({
    defaultOrderBy: 'machineModel.name',
    defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useResponsive('down', 'lg');

  const methods = useForm({
    defaultValues: {
      filteredSearchKey: '',
      statusType: [],
    },
  });

  const { watch, handleSubmit } = methods;
  const {filteredSearchKey, statusType} = watch();

  useEffect(() => {
    if (activeMachineStatuses?.length > 0) {
      const filteredStatuses = activeMachineStatuses.filter((status => (status.name !== "Transferred" && status.name !== "Decommissioned")))
      setStatusesToShow([...filteredStatuses])
    }
  }, [activeMachineStatuses]);

  useEffect(() => {
    const status = statusType?.map((item) => item.name).join(',');
    dispatch(
      getTechparamReports({
        page,
        pageSize: rowsPerPage,
        searchKey: filteredSearchKey,
        searchColumn: selectedSearchFilter,
        machineStatus: status,
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, rowsPerPage]);
  
  useEffect(() => {
    setTableData(techparamReport?.data || []);
  }, [techparamReport]);
  
  useEffect(() => {
    const fetchStatuses = async () => {
      await dispatch(getActiveMachineStatuses())
    };
    fetchStatuses();
    return () => {
      dispatch(resetActiveMachineStatuses());
    };
  }, [dispatch]);

  const dataFiltered = applySort({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const isNotFound = !dataFiltered.length || (!isLoading && !dataFiltered.length);
  const denseHeight = 60;

  const onChangePage = (event, newPage) => {
    dispatch(ChangePage(newPage));
  };
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };
  
  const handleCustomerDialog = (e, id) => {
    dispatch(getCustomer(id))
    dispatch(setCustomerDialog(true))
  }
  
  const onGetReports = (data) => {
    if ((filteredSearchKey && selectedSearchFilter) || statusType) {
      const status = data?.statusType?.map((item) => item.name).join(',');
      dispatch(
        getTechparamReports({
          searchKey: filteredSearchKey,
          searchColumn: selectedSearchFilter,
          machineStatus: status,
        })
      );
    }
  };
  
  const afterClearHandler = () => {
    const status = statusType?.map((item) => item.name).join(',');
    dispatch(
      getTechparamReports({
        page,
        pageSize: rowsPerPage,
        searchKey: '',
        searchColumn: '',
        machineStatus: status,
      })
    );
  };  

  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async () => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('MachineSettingsReport'));
    response.then((res) => {
      setExportingCSV(false);
      enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
    });
  };

  const handleHiddenColumns = async (arg) => {
   dispatch(setReportHiddenColumns(arg))
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Machine Setting Reports" />
      </StyledCardContainer>
      <FormProvider {...methods} onSubmit={handleSubmit(onGetReports)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: '1fr auto auto' },
                  width: '100%',
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <RHFFilteredSearchBar
                    name="filteredSearchKey"
                    filterOptions={TABLE_HEAD.filter((item) => item?.allowSearch)}
                    setSelectedFilter={setSelectedSearchFilter}
                    selectedFilter={selectedSearchFilter}
                    placeholder="Enter Search here..."
                    afterClearHandler={afterClearHandler}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(onGetReports)();
                      }
                    }}
                    fullWidth
                  />
                </Box>
                <Box sx={{ flexShrink: 0, display: 'flex' }}>
                  <RHFAutocomplete
                    name="statusType"
                    label="Status Type"
                    sx={{ minWidth: { sm: 400 } }}
                    options={statusesToShow || []}
                    multiple
                    disableCloseOnSelect
                    size="small"
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option?.name || ''}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>
                        <Checkbox 
                          checked={statusType?.some((item) => item._id === option._id)} 
                          size="small"
                        />
                        {option?.name || ''}
                      </li>
                    )}
                  />
                </Box>
                <Box sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                  <LoadingButton
                    type="button"
                    onClick={handleSubmit(onGetReports)}
                    variant="contained"
                    size="large"
                  >
                    Search
                  </LoadingButton>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <TableCard>
          <MachineSettingReportListTableToolbar
            onExportCSV={onExportCSV}
            onExportLoading={exportingCSV}
            isArchived={isArchived}
          />
          {!isNotFound && !isMobile && (
            <TablePaginationFilter
              columns={TABLE_HEAD}
              hiddenColumns={reportHiddenColumns}
              handleHiddenColumns={handleHiddenColumns}
              count={machineSettingReportstotalCount || 0}
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
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .map((row, index) =>
                      row ? (
                        <MachineSettingReportListTableRow
                          key={row._id}
                          row={row}
                          hiddenColumns={reportHiddenColumns}
                          onSelectRow={() => onSelectRow(row._id)}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                          handleCustomerDialog={(e) =>
                            row?.customer && handleCustomerDialog(e, row?.customer?._id)
                          }
                          isArchived={isArchived}
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
          {!isNotFound && (
            <TablePaginationFilter
              count={machineSettingReportstotalCount || 0}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          )}
        </TableCard>
      </FormProvider>
    </Container>
  );
}

function applySort({ inputData, comparator }) {
  const stabilizedThis =  inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  return inputData;
}