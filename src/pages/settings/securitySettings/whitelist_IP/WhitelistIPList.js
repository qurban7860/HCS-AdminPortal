import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
// @mui
import { Table, Button, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// components
import { useSnackbar } from '../../../../components/snackbar';
import { useTable, getComparator, TableNoData, TableSkeleton, TableHeadCustom, TablePaginationFilter } from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { PATH_SETTING } from '../../../../routes/paths';
// sections
import WhitelistIPListTableRow from './WhitelistIPListTableRow';
import WhitelistIPListTableToolbar from './WhitelistIPListTableToolbar';
import { getWhitelistIPs, deleteWhitelistIP, ChangeRowsPerPage, ChangePage, setFilterBy } from '../../../../redux/slices/securityConfig/whitelistIP';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import { handleError } from '../../../../utils/errorHandler';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'whiteListIP', label: 'Whitelist IPs', align: 'left' },
  { id: 'customer.name', label: 'Customer', align: 'left' },
  { id: 'createdBy.name', label: 'Updated By', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'left' },
  { id: 'action', label: 'Action', align: 'right' },
];

// ----------------------------------------------------------------------

export default function WhitelistIPList() {
  const {
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'whiteListIP',
    defaultOrder: 'asc',
  });
  const navigate = useNavigate();
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  const onChangePage = (event, newPage) => {
    dispatch(ChangePage(newPage));
  };
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { whitelistIPs, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.whitelistIP);

  useLayoutEffect(() => {
    dispatch(getWhitelistIPs());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(whitelistIPs);
    }
  }, [whitelistIPs, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const debouncedSearch = useRef(
    debounce((value) => {
      dispatch(ChangePage(0));
      dispatch(setFilterBy(value));
    }, 500)
  );

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    setFilterName(filterBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteWhitelistIP(id));
      dispatch(getWhitelistIPs());
      setSelected('');

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
      enqueueSnackbar("IP removed successfully!");
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''));
    setFilterName('');
  };
  const handleViewRow = (id) => navigate(PATH_SETTING.restrictions.whitelistIP.view(id));

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="Whitelist IPs" icon="ph:users-light" />
        </StyledCardContainer>

        <TableCard>
          <WhitelistIPListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />
          {!isNotFound && (
            <TablePaginationFilter count={dataFiltered.length} page={page} rowsPerPage={rowsPerPage} onPageChange={onChangePage} onRowsPerPageChange={onChangeRowsPerPage} />
          )}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} onSort={onSort} />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) =>
                    row ? (
                      <WhitelistIPListTableRow
                        key={row._id}
                        row={row}
                        onViewRow={() => handleViewRow(row._id)}
                        onDeleteRow={() => {
                          handleOpenConfirm();
                          setSelected(row?._id);
                        }}
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

          {!isNotFound && (
            <TablePaginationFilter count={dataFiltered.length} page={page} rowsPerPage={rowsPerPage} onPageChange={onChangePage} onRowsPerPageChange={onChangeRowsPerPage} />
          )}
        </TableCard>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
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
      (whiteList) =>
        whiteList?.whiteListIP?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        whiteList?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(whiteList?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
