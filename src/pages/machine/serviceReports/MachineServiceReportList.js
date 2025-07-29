import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import useResponsive from '../../../hooks/useResponsive';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationFilter,
  TableHeadFilter,
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
  setFilterByStatus,
  setFilterByStatusType,
  setReportFilterBy,
  setReportFilterByStatus,
  setReportFilterByStatusType,
  setSendEmailDialog,
  setReportHiddenColumns,
} from '../../../redux/slices/products/machineServiceReport';
import { fDate, fDateTime } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import MachineTabContainer from '../util/MachineTabContainer';


// ----------------------------------------------------------------------

MachineServiceReportList.propTypes = {
  reportsPage: PropTypes.bool,
}

export default function MachineServiceReportList( { reportsPage }) {
  
  const { machine } = useSelector((state) => state.machine);
  const { machineServiceReports, filterBy, filterByStatus, filterByStatusType, reportFilterBy, reportFilterByStatus, reportFilterByStatusType, page, rowsPerPage, isLoading, reportHiddenColumns } = useSelector((state) => state.machineServiceReport);
  const { activeServiceReportStatuses, isLoadingReportStatus } = useSelector( (state) => state.serviceReportStatuses );
  const navigate = useNavigate();
  const { machineId } = useParams();
  
  const TABLE_HEAD = useMemo(() => {
    const baseHeaders =  [
      { id: 'checkboxes', label: 'Active', align: 'left' },
      { id: 'serviceDate', label: 'Service Date', align: 'left' },
      { id: 'serviceReportTemplate.reportType', label: 'Type', align: 'left' },
      { id: 'serviceReportUID', label: 'Service ID', align: 'left' },
      { id: 'customer.name', label: 'Customer', align: 'left' },
      { id: 'status.name', label: 'Status', align: 'left' },
      { id: 'createdBy.name', label: 'Created By', align: 'left' },
    ];
  
    if ( reportsPage ) {
      return [
        ...baseHeaders.slice(0, 4),
        { id: 'machine.serialNo', label: 'Machine', align: 'left' },
        ...baseHeaders.slice(4),
      ];
    }

    return baseHeaders;
  }, [ reportsPage ] );

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

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [statusType, setStatusType] = useState( [] );

  const isMobile = useResponsive('down', 'sm');

  useLayoutEffect(() => {
    if( !isLoadingReportStatus ){
      dispatch(getActiveServiceReportStatuses() )
    }
    return () => {
      dispatch( resetActiveServiceReportStatuses() )
      dispatch( resetMachineServiceReports() );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dispatch ]);

  const getReports = useCallback( async () => {
    await dispatch(setSendEmailDialog(false));
    await dispatch(setDetailPageFlag(false));
    if( !isLoadingReportStatus && Array.isArray( activeServiceReportStatuses ) && activeServiceReportStatuses?.length > 0 ){
      const matchedStatusIds = [
        ...(filterStatus?._id ? [filterStatus._id] : []),
        ... await activeServiceReportStatuses.filter(({ type }) => 
            statusType?.some(
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
  },[ filterStatus, statusType, page, isLoadingReportStatus, rowsPerPage ])

  useEffect(() => {
    getReports();
  }, [ getReports ]);  

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
    if( reportsPage ) {
      dispatch(setReportFilterBy(value))
    } else {
      dispatch(setFilterBy(value))
    }
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };

  const debouncedFilterStatus = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    if( reportsPage ){
      dispatch(setReportFilterByStatus(value))
    } else{
      dispatch(setFilterByStatus(value))
    }
  }, 500))

  const handleFilterStatus = ( option, newValue ) => {
    if( newValue ){
      debouncedFilterStatus.current( newValue );
      setFilterStatus( newValue );
      setPage(0);
    } else {
      debouncedFilterStatus.current( null );
      setFilterStatus( null );
    }
  }
  
  const debouncedFilterStatusType = useRef(debounce((value) => {
    dispatch(ChangePage(0));
    if (reportsPage) {
      dispatch(setReportFilterByStatusType(value));
    } else {
      dispatch(setFilterByStatusType(value));
    }
  }, 500));

  const handleStatusType = ( option, newValue ) => {
    if( newValue ){
      debouncedFilterStatusType.current(newValue);
      setStatusType( newValue );
      setPage(0);
    } else {
      debouncedFilterStatusType.current(null);
      setStatusType( null );
    }
  }

  useEffect(() => {
    debouncedSearch.current.cancel();
    debouncedFilterStatus.current.cancel();
    debouncedFilterStatusType.current.cancel();
  }, [ debouncedSearch, debouncedFilterStatus, debouncedFilterStatusType ]);

  useEffect(() => {
    setFilterName( reportsPage ? reportFilterBy : filterBy )
    setFilterStatus( reportsPage ? reportFilterByStatus : filterByStatus )
    setStatusType( reportsPage ? reportFilterByStatusType : filterByStatusType );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filterBy, reportFilterBy, filterByStatus, reportFilterByStatus, filterByStatusType, reportFilterByStatusType, reportsPage ] );
  

  const handleViewRow = async ( mId, id ) => { 
    navigate( PATH_MACHINE.machines.serviceReports.view( ( machineId || mId ), id ) );
  }

  const openInNewPage = async ( mId, id) => { 
      window.open(PATH_MACHINE.machines.serviceReports.view( ( machineId || mId ) ,id ), '_blank');
  }

  const handleResetFilter = () => {
    if( reportsPage ){
      dispatch(setReportFilterBy(''))
    }else{
      dispatch(setFilterBy(''))
    }
    setFilterName('');
  };

  
  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg))
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


        {!isNotFound && (
          <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={machineServiceReports?.totalCount || 0}
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                        <MachineServiceReportListTableRow
                          reportsPage={reportsPage}
                          key={row._id}
                          row={row}
                          hiddenColumns={reportHiddenColumns}
                          onViewRow={() => handleViewRow( row?.machine?._id, row._id )}
                          openInNewPage={() => openInNewPage( row?.machine?._id, row._id ) }
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

          {!isNotFound && <TablePaginationFilter
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
      ( msr ) =>
        ( msr?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate( msr?.serviceDate )?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        msr?.serviceReportTemplate?.reportType?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        msr?.serviceReportUID?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        msr?.machine?.serialNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        msr?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        msr?.status?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        msr?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDateTime( msr?.createdAt )?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
