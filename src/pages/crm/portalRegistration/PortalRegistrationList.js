import { useState, useEffect , useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  TableBody,
  Container,
  TableContainer,
  // Stack,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_PORTAL_REGISTRATION } from '../../../routes/paths';
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
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
// sections
import PortalRegistrationListTableRow from './PortalRegistrationListTableRow';
import PortalRegistrationListTableToolbar from './PortalRegistrationListTableToolbar';
import { 
  getPortalRegistrations, 
  resetPortalRegistrations, 
  ChangePage, 
  ChangeRowsPerPage, 
  setFilterBy,
  setFilterStatus,
  setHiddenColumns
} from '../../../redux/slices/customer/portalRegistration';
import { getCustomer, setCustomerDialog } from '../../../redux/slices/customer/customer';
import { Cover } from '../../../components/Defaults/Cover';
import TableCard from '../../../components/ListTableTools/TableCard';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'contactPersonName', label: 'Contact Person Name', align: 'left', hideable:false },
  { id: 'email', label: 'Email', align: 'left', },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left', },
  { id: 'address', label: 'Address', align: 'left', },
  { id: 'customerName', label: 'Organization', align: 'left', },
  { id: 'machineSerialNos', label: 'Machines', align: 'left', },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'customer.name', label: 'Customer', align: 'left' },
  { id: 'contact.firstName', label: 'Contact', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function PortalRegistrationList() {
  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { portalRegistrations, hiddenColumns, filterBy, filterStatus, page, rowsPerPage, isLoading } = useSelector((state) => state.portalRegistration);
  const [ filterName, setFilterName ] = useState( filterBy );
  const [ filterByStatus, setFilterByStatus ] = useState( filterStatus );

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };
  const onChangePage = (event, newPage) => { 
    dispatch(ChangePage(newPage)) 
  }

  const getPortalRequests = useCallback(() => {
    dispatch(getPortalRegistrations( page, rowsPerPage, filterByStatus ));
  }, [ dispatch, page, rowsPerPage, filterByStatus ] )

  useEffect(() => {
    getPortalRequests();
    return ()=> { dispatch( resetPortalRegistrations() ) }
  }, [ dispatch, getPortalRequests, page, rowsPerPage, filterByStatus ]);

  const dataFiltered = applyFilter({
    inputData: portalRegistrations?.data || [],
    comparator: getComparator(order, orderBy),
    filterName,
    filterByStatus
  });

  const denseHeight = 60;
  const isFiltered = filterName !== '' ;
  const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);

  const debouncedSearch = useRef(debounce((value) => {
      dispatch(ChangePage(0))
      dispatch(setFilterBy(value))
  }, 500))

  const handleHiddenColumns = async (arg) => {
    dispatch(setHiddenColumns(arg))
  };

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value)
    setFilterName(event.target.value)
    setPage(0);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  const debouncedFilterByStatus = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterStatus(value))
  }, 500))

  const handleFilterByStatus = (value) => {
    debouncedFilterByStatus.current(value)
    setFilterByStatus(value)
    setPage(0);
  };

  const handleCustomerDialog = useCallback( async ( id ) => {
    await dispatch(getCustomer(id))
    await dispatch(setCustomerDialog(true))
  }, [ dispatch ])

useEffect(() => {
  debouncedFilterByStatus.current.cancel();
}, [ debouncedFilterByStatus ]);

  const handleViewRow = (id) => {
    navigate(PATH_PORTAL_REGISTRATION.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  }; 

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={ FORMLABELS.COVER.REGISTERED_REQUESTS}
        />
      </StyledCardContainer>
      <TableCard>
        <PortalRegistrationListTableToolbar
          filterName={ filterName }
          filterStatus={ filterByStatus }
          onFilterName={ handleFilterName }
          isFiltered={ isFiltered }
          onResetFilter={ handleResetFilter }
          onChangeStatus={ handleFilterByStatus }
          onReload={getPortalRequests}
        />

        {!isNotFound && (
          <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={hiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={ portalRegistrations?.totalCount ? portalRegistrations?.totalCount : 0 }
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
                onSort={onSort}
                hiddenColumns={hiddenColumns}
              />

              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <PortalRegistrationListTableRow
                        hiddenColumns={hiddenColumns}
                        key={row._id}
                        row={row}
                        onViewRow={() => handleViewRow(row._id)}
                        handleCustomerDialog={()=> row?.customer && handleCustomerDialog(row?.customer?._id)}
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
            count={ portalRegistrations?.totalCount ? portalRegistrations?.totalCount : 0 }
            page={ page }
            rowsPerPage={ rowsPerPage }
            onPageChange={ onChangePage }
            onRowsPerPageChange={ onChangeRowsPerPage }
          />
        )}
        
      </TableCard>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterByStatus }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (filterByStatus) {
    inputData = inputData?.filter((c) => c?.status === filterByStatus );
  }

  if (filterName) {
    filterName = filterName?.trim();
    inputData = inputData?.filter(
      ( c ) =>
        c?.contactPersonName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.phoneNumber?.toString()?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.address?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.customerName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.machineSerialNos?.some( msn => msn?.toString()?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ) ||
        c?.status?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(c?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
