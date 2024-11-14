import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
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
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import MachineServiceReportListTableRow from './MachineServiceReportListTableRow';
import MachineServiceReportListTableToolbar from './MachineServiceReportListTableToolbar';
import { getActiveServiceReportStatuses, resetActiveServiceReportStatuses } from '../../../redux/slices/products/serviceReportStatuses';
import {
  getMachineServiceReports,
  resetMachineServiceReports,
  setDetailPageFlag,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setSendEmailDialog,
  setFilterDraft
} from '../../../redux/slices/products/machineServiceReport';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'serviceDate', label: 'Service Date', align: 'left' },
  { id: 'serviceReportUID', label: 'Service ID', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'serviceReportTemplate.reportTitle', label: 'Service Template', align: 'left' },
  { id: 'versionNo', label: 'Version', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdBy.name', label: 'Created By', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];
// ----------------------------------------------------------------------

export default function MachineServiceReportList() {
  const { machine } = useSelector((state) => state.machine);
  const { machineServiceReports, filterBy, filterDraft, page, rowsPerPage, isLoading } = useSelector((state) => state.machineServiceReport);
  const { activeServiceReportStatuses } = useSelector( (state) => state.serviceReportStatuses );
  const navigate = useNavigate();
  const { machineId } = useParams();

  const {
    order,
    orderBy,
    setPage,
    //
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
  const [filterStatus, setFilterStatus] = useState(null);
  const [statusType, setStatusType] = useState(null);
  const [filterDraftStatus, setFilterDraftStatus] = useState(false);
  
  useLayoutEffect(() => {
    dispatch(setSendEmailDialog(false));
    dispatch(getActiveServiceReportStatuses() )
    dispatch(setDetailPageFlag(false));
    return ()=>{
      dispatch( resetActiveServiceReportStatuses() )
    }
  }, [ dispatch ]);

  useLayoutEffect(() => {
    if(machineId ){
      dispatch(getMachineServiceReports(
        {
          page,
          rowsPerPage,
          machineId,
          isMachineArchived: machine?.isArchived,
          status: filterStatus?._id,
          draftStatus: !filterDraftStatus ? activeServiceReportStatuses?.find( ds => ds?.type?.toLowerCase() === 'draft' )?._id : undefined ,
          statusType
        }
      ));
    }
    return () => {
      dispatch( resetMachineServiceReports() )
    }
  }, [dispatch, machineId, machine, activeServiceReportStatuses, filterStatus, filterDraftStatus, statusType, page, rowsPerPage ]);

  const dataFiltered = applyFilter({
    inputData: machineServiceReports?.data || [],
    comparator: getComparator(order, orderBy),
    filterName,
    filterDraftStatus
  });

  const isFiltered = filterName !== '' ;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const denseHeight = 60;

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const debouncedDraft = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterDraft(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };

  const handleFilterDraft = (status) => {
    debouncedDraft.current(status)
    setFilterDraftStatus(status)
    setPage(0);
  }

  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
      setFilterDraftStatus(filterDraft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterStatus = ( option, newValue ) => {
    if( newValue ){
      setPage(0);
      setFilterStatus( newValue );
    } else {
      setFilterStatus( null );
    }
  }
  const handleStatusType = ( option, newValue ) => {
    if( newValue ){
      setPage(0);
      setStatusType( newValue );
    } else {
      setStatusType( null );
    }
  }

  const handleViewRow = async (id) => navigate(PATH_MACHINE.machines.serviceReports.view(machineId ,id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false} >
          <MachineTabContainer currentTabValue='serviceReports' />
        <TableCard>
          <MachineServiceReportListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            filterStatusType={ statusType } 
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            onFilterStatusType={handleStatusType}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            toggleStatus={filterDraftStatus}
            onToggleStatus={handleFilterDraft}
          />

          {!isNotFound && <TablePaginationCustom
            count={machineServiceReports?.totalCount || 0 }
            page={machineServiceReports?.currentPage || 0 }
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}

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
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <MachineServiceReportListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow(row._id)}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
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
            count={ machineServiceReports?.totalCount || 0 }
            page={ machineServiceReports?.currentPage || 0 }
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        </TableCard>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterDraftStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if(!filterDraftStatus){
    inputData = inputData.filter((srec) => srec?.status?.type?.toLowerCase() !=="draft");
  }

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
