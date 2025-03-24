import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
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
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_CRM } from '../../../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationFilter,
  TablePaginationCustom,
  TableHeadFilter,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
// sections
import CustomerContactListTableRow from './CustomerContactListTableRow';
import CustomerContactListTableToolbar from './CustomerContactListTableToolbar';
import { getAllContacts, resetAllContacts, ChangePage, ChangeRowsPerPage, setFilterBy, setCardActiveIndex, setIsExpanded, setReportHiddenColumns } from '../../../../redux/slices/customer/contact';
import { Cover } from '../../../../components/Defaults/Cover';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { fDate } from '../../../../utils/formatTime';
import { useSnackbar } from '../../../../components/snackbar';
import { exportCSV } from '../../../../utils/exportCSV';

// ----------------------------------------------------------------------

CustomerContactList.propTypes = {
  isCustomerContactPage: PropTypes.bool,
  filterFormer: PropTypes.string,
};

export default function CustomerContactList({ isCustomerContactPage = false, filterFormer }) {
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSort,
  } = useTable({
    defaultOrderBy: 'firstName', defaultOrder: 'asc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { allContacts, contacts, filterBy, page, rowsPerPage, isLoading, reportHiddenColumns } = useSelector((state) => state.contact);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState(filterBy);
  const [exportingCSV, setExportingCSV] = useState(false);
  // ----------------------------------------------------------------------

  const TABLE_HEAD = [
    ...(isCustomerContactPage ? [{ id: 'isActive', label: <span style={{ marginRight: 3 }}>A</span>, align: 'right' }] : []),
    ...(isCustomerContactPage ? [{ id: 'formerEmployee', label: <span style={{ marginRight: 3 }}>E</span>, align: 'right' }] : []),
    ...(!isCustomerContactPage ? [{ id: 'isActive', label: 'Active', align: 'center' }] : []),
    { id: 'firstName', label: 'Contact Name', align: 'left' },
    ...(isCustomerContactPage ? [{ id: 'title', label: 'Title', align: 'left' }] : []),
    { id: 'phoneNumbers', label: 'Phone', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'address.country', label: 'Country', align: 'left' },
    ...(!isCustomerContactPage ? [{ id: 'customer.name', label: 'Customer', align: 'left' }] : []),
    { id: 'updatedAt', label: 'Updated At', align: 'right' },
  ];


  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  const onChangePage = (event, newPage) => {
    dispatch(ChangePage(newPage))
  }

  useEffect(() => {
    if (!isCustomerContactPage) {
      dispatch(getAllContacts());
      return () => {
        dispatch(resetAllContacts());
      };
    }
    return undefined;
  }, [dispatch, isCustomerContactPage]);
  
  useEffect(() => {
    setTableData(isCustomerContactPage ? contacts : allContacts || []);
  }, [allContacts, isCustomerContactPage, contacts]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterFormer,
    orderBy
  });

  const denseHeight = 60;
  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value)
    setFilterName(event.target.value)
    setPage(0);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const handleViewCustomer = (customerId) => navigate(PATH_CRM.customers.view(customerId));
  const handleViewCustomerInNewPage = (customerId) => window.open(PATH_CRM.customers.view(customerId), '_blank');

  const handleViewContact = async (customerId, contactId) => {
    await dispatch(setCardActiveIndex(contactId));
    await dispatch(setIsExpanded(true));
    await navigate(PATH_CRM.customers.contacts.view(customerId, contactId))
  };

  const handleViewContactInNewPage = async (customerId, contactId) => {
    await dispatch(setCardActiveIndex(contactId));
    await dispatch(setIsExpanded(true));
    window.open(PATH_CRM.customers.contacts.view(customerId, contactId), '_blank');
  };

  const onExportCSV = async () => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('allcontacts'));
    response.then((res) => {
      setExportingCSV(false);
      if (!res.hasError) {
        enqueueSnackbar('Contacts CSV Generated Successfully');
      } else {
        enqueueSnackbar(res.message, { variant: `${res.hasError ? "error" : ""}` });
      }
    });
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg))
  };

  return (
    <Container maxWidth={false}>
      {!isCustomerContactPage ? (
        <StyledCardContainer>
          <Cover name='Contacts' backLink customerSites />
        </StyledCardContainer>
      ) : null}
      <TableCard >
        <CustomerContactListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onExportCSV={!isCustomerContactPage ? onExportCSV : undefined}
          onExportLoading={exportingCSV}
        />

        {!isNotFound && (
          <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={tableData ? tableData.length : 0}
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
                      <CustomerContactListTableRow
                        key={row._id}
                        row={row}
                        hiddenColumns={reportHiddenColumns}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewCustomer(row?.customer?._id)}
                        openInNewPage={() => handleViewCustomerInNewPage(row?.customer?._id)}
                        handleContactView={handleViewContact}
                        handleContactViewInNewPage={handleViewContactInNewPage}
                        isCustomerContactPage={isCustomerContactPage}
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
          count={tableData ? tableData.length : 0}
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

function applyFilter({ inputData, comparator, filterName, filterFormer, orderBy }) {
  let filteredData = inputData;

  if (filterFormer?.toLowerCase() === 'former employee') {
    filteredData = filteredData.filter((contact) => contact?.formerEmployee);
  } else if (filterFormer?.toLowerCase() === 'current employee') {
    filteredData = filteredData.filter((contact) => !contact?.formerEmployee);
  }

  const stabilizedThis = filteredData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    if (orderBy === 'phoneNumbers') {
      const phoneA = a[0].phoneNumbers ? a[0].phoneNumbers.map(p => `${p.countryCode || ''}${p.contactNumber}`).join(', ') : '';
      const phoneB = b[0].phoneNumbers ? b[0].phoneNumbers.map(p => `${p.countryCode || ''}${p.contactNumber}`).join(', ') : '';
      return comparator({ phoneNumbers: phoneA }, { phoneNumbers: phoneB });
    }
    const order = comparator(a[0], b[0], orderBy);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  filteredData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    filteredData = filteredData.filter(
      (contact) =>
        `${contact?.firstName} ${contact?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.title?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.phoneNumbers?.map(phone => `+${phone.countryCode}-${phone.contactNumber}`).join(", ").toLowerCase().includes(filterName.toLowerCase()) ||
        contact?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.address?.country?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(contact?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return filteredData;
}