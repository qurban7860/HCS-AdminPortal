import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useState, useEffect, useRef } from 'react';
// @mui
import { Table, Tooltip, TableBody, IconButton, TableContainer, Grid, Container, Typography } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
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
import { useSnackbar } from '../../../components/snackbar';
// sections
import MachineServiceRecordHistoryListTableRow from './MachineServiceRecordHistoryListTableRow';
import {
  getMachineServiceRecordVersion,
  getMachineServiceRecord,
  setHistoricalFlag,
  resetMachineServiceRecord,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../../redux/slices/products/machineServiceRecord';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import IconTooltip from '../../../components/Icons/IconTooltip';
import { StyledStack } from '../../../theme/styles/default-styles';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

MachineServiceRecordHistoryList.propTypes = {
  serviceId: PropTypes.string,
};

const TABLE_HEAD = [
  { id: 'serviceDate', label: 'Service Date', align: 'left' },
  { id: 'versionNo', visibility: 'xs5', label: 'Version', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdBy.name', label: 'Created By', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];
// ----------------------------------------------------------------------

export default function MachineServiceRecordHistoryList({ serviceId }) {
  const { machineServiceRecordHistory, isDetailPage, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.machineServiceRecord);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId, id } = useParams();

  const {
    order,
    orderBy,
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

  useEffect(() => {
    if (initial) {
      setTableData(machineServiceRecordHistory);
    }
  }, [machineServiceRecordHistory, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const denseHeight = 60;

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleViewRow = async (Id, isHistory, ServiceId) => {
    try{
      navigate(PATH_MACHINE.machines.serviceRecords.view(machineId, id))
      await dispatch(resetMachineServiceRecord())
      if(isHistory) {
        await dispatch(getMachineServiceRecordVersion(machineId, Id));
      }else{
        await dispatch(getMachineServiceRecord(machineId, Id));
        await dispatch(setHistoricalFlag(true));
      }
    }catch(e){
      enqueueSnackbar(e, { variant: `error` });
      console.error(e);
    }
  };


  return (
    <Container maxWidth={false} >
          <MachineTabContainer currentTabValue='serviceRecords' />
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
            onClick={() => navigate(PATH_MACHINE.machines.serviceRecords.view(machineId, id)) }
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
                          onViewRow={() => handleViewRow(row._id, row?.isHistory, row?.serviceId)}
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
    inputData = inputData.filter(
      (docCategory) =>
        docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.versionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(docCategory?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
