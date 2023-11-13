import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import {
  Table,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
  Grid,
  Typography,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
// sections
import MachineServiceRecordHistoryListTableRow from './MachineServiceRecordHistoryListTableRow';
import MachineServiceRecordListTableToolbar from './MachineServiceRecordListTableToolbar';
import {
  getMachineServiceHistoryRecords,
  getMachineServiceRecordVersion,
  setMachineServiceRecordViewFormVisibility,
  setMachineServiceRecordHistoryFormVisibility,
  resetMachineServiceRecord,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../../redux/slices/products/machineServiceRecord';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import IconTooltip from '../../components/Icons/IconTooltip';
import { StyledStack } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

MachineServiceRecordHistoryList.propTypes = {
  serviceId: PropTypes.string,
};

const TABLE_HEAD = [
  // { id: 'technician.name', visibility: 'xs5', label: 'Technician', align: 'left' },
  { id: 'serviceDate', label: 'Service Date', align: 'left' },
  { id: 'versionNo', visibility: 'xs5', label: 'Version', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdBy.name', label: 'Created By', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];
// ----------------------------------------------------------------------

export default function MachineServiceRecordHistoryList({ serviceId }) {
  const { machineServiceRecordHistory, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine);

  const {
    order,
    orderBy,
    setPage,
    //
    selected,
    onSelectAllRows,
    //
    onSort,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);

  // useLayoutEffect(() => {
  //   dispatch(getMachineServiceHistoryRecords(machine?._id, serviceId)); 
  // }, [dispatch, machine?._id,serviceId]);

  useEffect(() => {
    if (initial) {
      setTableData(machineServiceRecordHistory);
    }
  }, [machineServiceRecordHistory, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

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
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = async (id) => {
    await dispatch(setMachineServiceRecordViewFormVisibility(true));
    await dispatch(resetMachineServiceRecord())
    await dispatch(getMachineServiceRecordVersion(machine._id, id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
        <TableCard>
        <Grid container sx={{ m: 2 }}>
        <Grid item sm={12}
          sx={{ display: 'flex' }}
        >
        <StyledStack>
          <IconTooltip
            title='Back'
            color='#008000'
            icon="mdi:arrow-left"
            onClick={() => dispatch(setMachineServiceRecordHistoryFormVisibility(false))}
            size="small"
            />
        </StyledStack>
        </Grid> 
            <Typography variant='h3'>{machineServiceRecordHistory?.[0]?.serviceRecordConfig?.docTitle || '' }</Typography>
        </Grid>

          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" >
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
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
                        <MachineServiceRecordHistoryListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow(row._id)}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                          isHistory
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
  // (customer) => customer.name.toLowerCase().indexOf(filterName.toLowerCase()) || customer.tradingName.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.city.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.country.toLowerCase().indexOf(filterName.toLowerCase()) || customer.createdAt.toLowerCase().indexOf(filterName.toLowerCase()) !== -1

  if (filterName) {
    inputData = inputData.filter(
      (docCategory) =>
        docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.versionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (docCategory?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(docCategory?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
