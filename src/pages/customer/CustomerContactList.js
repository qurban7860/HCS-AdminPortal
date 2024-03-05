import { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  // Stack,
} from '@mui/material';
import axios from 'axios';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { FORMLABELS } from '../../constants/default-constants';

// sections
import CustomerContactListTableRow from './CustomerContactListTableRow';
import CustomerContactListTableToolbar from './CustomerContactListTableToolbar';
import { getContacts, resetContacts, ChangePage, ChangeRowsPerPage, setFilterBy, setCardActiveIndex, setIsExpanded, getContact  } from '../../redux/slices/customer/contact';
import { setCustomerTab } from '../../redux/slices/customer/customer';
import { Cover } from '../../components/Defaults/Cover';
import TableCard from '../../components/ListTableTools/TableCard';
import { fDate } from '../../utils/formatTime';
import { useSnackbar } from '../../components/snackbar';
import { exportCSV } from '../../utils/exportCSV';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customer', visibility: 'sm', label: 'Customer', align: 'left' },
  { id: 'firstName', visibility: 'sm', label: 'Contact', align: 'left' },
  { id: 'phone', visibility: 'sm', label: 'Phone', align: 'left' },
  { id: 'email', visibility: 'sm', label: 'Email', align: 'left' },
  { id: 'address.country', visibility: 'sm', label: 'Country', align: 'left' },
  { id: 'isActive', visibility: 'sm', label: 'Active', align: 'center' },
  { id: 'createdAt',visibility: 'sm', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function CustomerContactList() {
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();
  
  const { contacts, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.contact);
  
  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName, setFilterName] = useState(filterBy);

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };
  const onChangePage = (event, newPage) => { 
    dispatch(ChangePage(newPage)) 
  }

  useEffect(() => {
    dispatch(getContacts());
    return ()=> { dispatch( resetContacts() ) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    setTableData(contacts || []);
  }, [contacts]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const denseHeight = 60;
  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleCloseConfirm = () => setOpenConfirm(false);

  const debouncedSearch = useRef(debounce((value) => {
      dispatch(ChangePage(0))
      dispatch(setFilterBy(value))
  }, 500))

  const debouncedVerified = useRef(debounce((value) => {
    dispatch(ChangePage(0))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value)
    setFilterName(event.target.value)
    setPage(0);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);


  const handleViewRow = (id) => {
    navigate(PATH_CUSTOMER.view(id));
  };

  const openInNewPage = (id) => {
    dispatch(setCustomerTab('info'));
    const url = PATH_CUSTOMER.view(id);
    window.open(url, '_blank');
  };


  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  }; 

  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async() => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('allcontacts'));
    response.then((res) => {
      setExportingCSV(false);
      if(!res.hasError){
        enqueueSnackbar('Contacts CSV Generated Successfully');
      }else{
        enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
      }
    });
  };

  const handleContactView = async (customerId, contactId ) => {
    await navigate(PATH_CUSTOMER.view(customerId))
    await dispatch(setCustomerTab('contacts'));
    await dispatch(setCardActiveIndex(contactId));
    await dispatch(setIsExpanded(true));
    await dispatch(getContact(customerId, contactId));
  };

  const handleContactViewInNewPage = async (customerId, contactId ) => {
    await openInNewPage(customerId);
    await dispatch(setCustomerTab('contacts'));
    await dispatch(setCardActiveIndex(contactId));
    await dispatch(setIsExpanded(true));
    await dispatch(getContact(customerId, contactId));
  };

  return (
    <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name='Customer Contacts' backLink customerSites/>
        </StyledCardContainer>
      <TableCard >
      <CustomerContactListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onExportCSV={onExportCSV}
          onExportLoading={exportingCSV}
        />

        {!isNotFound && <TablePaginationCustom
          count={contacts?contacts.length : 0}
          page={page}
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
                      <CustomerContactListTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row?.customer?._id)}
                        openInNewPage={() => openInNewPage(row?.customer?._id)}
                        handleContactView= { handleContactView }
                        handleContactViewInNewPage= { handleContactViewInNewPage }
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
          count={contacts?contacts.length : 0}
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

function applyFilter({ inputData, comparator, filterName }) {
  if (filterName) {
    inputData = inputData.filter(
      (contact) =>
        contact?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${contact?.firstName} ${contact?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // contact?.title?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.phone?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.address?.country?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(contact?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
