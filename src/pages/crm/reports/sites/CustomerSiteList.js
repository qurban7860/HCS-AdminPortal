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
} from '@mui/material';
import { LoadingButton } from '@mui/lab'; 

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
  TablePaginationCustom,
  TablePaginationFilter,
  TableHeadFilter,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
// sections
import CustomerSiteListTableRow from './CustomerSiteListTableRow';
import CustomerSiteListTableToolbar from './CustomerSiteListTableToolbar';
import { getAllSites, resetAllSites, ChangePage, ChangeRowsPerPage, setFilterBy, setIsExpanded, setCardActiveIndex, setReportHiddenColumns, deleteSite, restoreSite } from '../../../../redux/slices/customer/site';
import { getCustomer } from '../../../../redux/slices/customer/customer';
import { Cover } from '../../../../components/Defaults/Cover';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { fDate } from '../../../../utils/formatTime';
import { useSnackbar } from '../../../../components/snackbar';
import { exportCSV } from '../../../../utils/exportCSV';
import ConfirmDialog from '../../../../components/confirm-dialog'; 

// ----------------------------------------------------------------------

CustomerSiteList.propTypes = {
  isCustomerSitePage: PropTypes.bool,
  isArchived: PropTypes.bool,
};

export default function CustomerSiteList({ isCustomerSitePage = false, isArchived}) {
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

  const { sites, allSites, filterBy, page, rowsPerPage, isLoading, reportHiddenColumns } = useSelector((state) => state.site);

  const [exportingCSV, setExportingCSV] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState(filterBy);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [dialogType, setDialogType] = useState(''); 
  const [selectedSiteRow, setSelectedSiteRow] = useState(null); 
  const [isSubmittingAction, setIsSubmittingAction] = useState(false); 

  const TABLE_HEAD = [
    { id: 'isActive', label: 'Active', align: 'center' },
    { id: 'name', label: 'Site', align: 'left' },
    { id: 'address.country', label: 'Address', align: 'left' },
    { id: 'phoneNumbers', label: 'Phone', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'primaryTechnicalContact.firstName', label: 'Technical Contact', align: 'left' },
    { id: 'primaryBillingContact.firstName', label: 'Billing Contact', align: 'left' },
    ...(isCustomerSitePage ? [] : [{ id: 'customer.name', label: 'Customer', align: 'left' }]),
    { id: 'updatedAt', label: 'Updated At', align: 'right' },
    ...(isArchived ? [{ id: 'isArchived', label: 'Actions', align: 'center' }] : []),
  ];

  // ----------------------------------------------------------------------

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  const onChangePage = (event, newPage) => {
    dispatch(ChangePage(newPage))
  };

  useEffect(() => {
    if (!isCustomerSitePage) {
      dispatch(getAllSites(isArchived));
    }
    return () => {
      dispatch(resetAllSites());
    }
  }, [dispatch, isCustomerSitePage, isArchived]);

  useEffect(() => {
    setTableData(isCustomerSitePage ? sites : allSites || []);
  }, [allSites, isCustomerSitePage, sites]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
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

  const handleViewCustomer = (id) => navigate(PATH_CRM.customers.view(id));
  const handleViewCustomerInNewPage = (id) => window.open(PATH_CRM.customers.view(id), '_blank');

  const handleViewSite = async (customerId, siteId) => {
    await dispatch(getCustomer(customerId));
    await dispatch(setCardActiveIndex(siteId));
    await dispatch(setIsExpanded(true));
    await navigate(PATH_CRM.customers.sites.view(customerId, siteId))
  };

  const handleViewSiteInNewPage = async (customerId, siteId) => {
    await dispatch(setCardActiveIndex(siteId));
    await dispatch(setIsExpanded(true));
    window.open(PATH_CRM.customers.sites.view(customerId, siteId), '_blank');
  };

  const onExportCSV = async () => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('allsites'));
    response.then((res) => {
      setExportingCSV(false);
      if (!res.hasError) {
        enqueueSnackbar('Sites CSV Generated Successfully');
      } else {
        enqueueSnackbar(res.message, { variant: `${res.hasError ? "error" : ""}` });
      }
    });
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg));
  };

  const handleOpenConfirm = (type, row) => {
    setDialogType(type);
    setSelectedSiteRow(row);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setDialogType('');
    setSelectedSiteRow(null);
  };

  const handleDeleteSite = async () => {
    if (selectedSiteRow) {
      setIsSubmittingAction(true); 
      try {
        await dispatch(deleteSite(selectedSiteRow.customer._id, selectedSiteRow._id));
        enqueueSnackbar('Site deleted successfully!');
        await dispatch(getAllSites(isArchived));
      } catch (error) {
        enqueueSnackbar('Failed to delete site.', { variant: 'error' });
        console.error(error);
      } finally {
        setIsSubmittingAction(false); 
        handleCloseConfirm();
      }
    }
  };

  const handleRestoreSite = async () => {
    if (selectedSiteRow) {
      setIsSubmittingAction(true); 
      try {
        await dispatch(restoreSite(selectedSiteRow.customer._id, selectedSiteRow._id));
        enqueueSnackbar('Site restored successfully!');
        await dispatch(getAllSites(isArchived));
      } catch (error) {
        enqueueSnackbar('Failed to restore site.', { variant: 'error' });
        console.error(error);
      } finally {
        setIsSubmittingAction(false); 
        handleCloseConfirm();
      }
    }
  };

  const handleArchive = () => {
    navigate(PATH_CRM.customers.archivedSites.root);
  };

  return (
    <Container maxWidth={false}>
      {!isCustomerSitePage ? (
        <StyledCardContainer>
          <Cover
            name={isArchived ? 'Archived Sites' : 'Sites'}
            {...(!isArchived && { backLink: true })}
            customerContacts
            archivedLink={
              !isArchived ? { label: 'Archived Sites', link: handleArchive, icon: 'mdi:book-variant' } : null
            }
            isArchived={isArchived}
          />
        </StyledCardContainer>
      ) : null}
      <TableCard >
        <CustomerSiteListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onExportCSV={!isCustomerSitePage ? onExportCSV : undefined}
          onExportLoading={exportingCSV}
          isArchived={isArchived}
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
                      <CustomerSiteListTableRow
                        key={row._id}
                        row={row}
                        hiddenColumns={reportHiddenColumns}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewCustomer(row?.customer?._id)}
                        openInNewPage={() => handleViewCustomerInNewPage(row?.customer?._id)}
                        handleSiteView={handleViewSite}
                        handleSiteViewInNewPage={handleViewSiteInNewPage}
                        isCustomerSitePage={isCustomerSitePage}
                        onDeleteRow={(siteRow) => handleOpenConfirm('delete', siteRow)}
                        onRestoreRow={(siteRow) => handleOpenConfirm('restore', siteRow)}
                        isArchived={isArchived}
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={dialogType === 'delete' ? 'Delete Site' : 'Restore Site'}
        content={
          dialogType === 'delete' ? 'Are you sure you want to delete this contact?' : 'Are you sure you want to restore this contact?'
        }
        action={
          dialogType === 'delete' ? (
            <LoadingButton 
              variant="contained"
              color="error"
              loading={isSubmittingAction} 
              disabled={isSubmittingAction} 
              onClick={handleDeleteSite}
            >
              Delete
            </LoadingButton>
          ) : (
            <LoadingButton 
              variant="contained"
              color="success"
              loading={isSubmittingAction} 
              disabled={isSubmittingAction} 
              onClick={handleRestoreSite}
            >
              Restore
            </LoadingButton>
          )
        }
      />
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
      (site) =>
        site?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        site?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        site?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        site?.website?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${site?.primaryTechnicalContact?.firstName} ${site?.primaryTechnicalContact?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${site?.primaryBillingContact?.firstName} ${site?.primaryBillingContact?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${site?.address?.street}, ${site?.address?.suburb}, ${site?.address?.city}, ${site?.address?.country}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `+${site?.phoneNumbers[0]?.countryCode} ${site?.phoneNumbers[0]?.contactNumber}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(site?.updatedAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}