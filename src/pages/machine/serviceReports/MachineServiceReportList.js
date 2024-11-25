import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE, PATH_SERVICE_REPORTS } from '../../../routes/paths';
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
} from '../../../redux/slices/products/machineServiceReport';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'checkboxes', label: ' ', align: 'left' },
  { id: 'serviceDate', label: 'Service Date', align: 'left' },
  { id: 'serviceReportTemplate.reportType', label: 'Type', align: 'left' },
  { id: 'serviceReportUID', label: 'Service ID', align: 'left' },
  { id: 'machine.serialNo', label: 'Machine', align: 'left' },
  { id: 'customer.name', label: 'Customer', align: 'left' },
  { id: 'status.name', label: 'Status', align: 'left' },
  { id: 'createdBy.name', label: 'Created By', align: 'left' },
];
// ----------------------------------------------------------------------

MachineServiceReportList.propTypes = {
  reportsPage: PropTypes.bool,
}

export default function MachineServiceReportList( { reportsPage }) {
  const { machine } = useSelector((state) => state.machine);
  const { machineServiceReports, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.machineServiceReport);
  const { activeServiceReportStatuses, isLoadingReportStatus } = useSelector( (state) => state.serviceReportStatuses );
  const navigate = useNavigate();
  const { machineId } = useParams();

  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({ defaultOrderBy: 'serviceDate', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [statusType, setStatusType] = useState([ 'To Do', 'In Progress' ]);

  const getReports = useCallback( async ()=>{
    await dispatch(setSendEmailDialog(false));
    await dispatch(getActiveServiceReportStatuses() )
    await dispatch(setDetailPageFlag(false));
    if ( !isLoadingReportStatus ) {
      const matchedStatusIds = [
        ...(filterStatus?._id ? [filterStatus._id] : []),
        ... await activeServiceReportStatuses.filter(({ type }) => 
            statusType.some(
              (status) => status.toLowerCase() === type.toLowerCase()
            )
          ).map(({ _id }) => _id)
      ];
      const uniqueStatusIds = [...new Set(matchedStatusIds)];
      dispatch(
        getMachineServiceReports({
          page,
          rowsPerPage,
          machineId,
          isMachineArchived: machine?.isArchived,
          status: uniqueStatusIds,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch, filterStatus, statusType, isLoadingReportStatus, page, rowsPerPage ])

  useLayoutEffect(() => {
    getReports();
    return () => {
      dispatch( resetActiveServiceReportStatuses() )
      dispatch( resetMachineServiceReports() );
    };
  }, [ dispatch, getReports ]);  

  const dataFiltered = applyFilter({
    inputData: machineServiceReports?.data || [],
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isFiltered = filterName !== '' ;
  const isNotFound = (!dataFiltered.length && !!filterName);

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

  const handleViewRow = async ( mId, id) => { 
    if( mId && !machineId ){
      window.open(PATH_MACHINE.machines.serviceReports.view( ( machineId || mId ) ,id ), '_blank');
    } else {
      navigate( PATH_MACHINE.machines.serviceReports.view( machineId ,id ) );
    }
  }

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false} >
          { machineId && <MachineTabContainer currentTabValue='serviceReports' />}
          { !machineId && 
            <StyledCardContainer>
              <Cover name="Service Reports" icon="mdi:clipboard-text-clock" />
            </StyledCardContainer>
          }
        <TableCard>
          <MachineServiceReportListTableToolbar
            onReload={getReports}
            reportsPage={reportsPage}
            filterName={ filterName }
            filterStatus={ filterStatus }
            filterStatusType={ statusType } 
            onFilterName={ handleFilterName }
            onFilterStatus={ handleFilterStatus }
            onFilterStatusType={ handleStatusType }
            isFiltered={ isFiltered }
            onResetFilter={ handleResetFilter }
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
                  {( ( isLoading || isLoadingReportStatus ) ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <MachineServiceReportListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow( row?.machine?._id, row._id)}
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

function applyFilter({ inputData, comparator, filterName }) {
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
