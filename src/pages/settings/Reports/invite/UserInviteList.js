import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import { Table, TableBody, TableContainer, Container, Card } from '@mui/material';
import { useNavigate } from 'react-router';
import { PATH_SETTING } from '../../../../routes/paths';
import { Cover } from '../../../../components/Defaults/Cover';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
// components
import { useSettingsContext } from '../../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
// sections
import UserInviteListTableRow from './UserInviteListTableRow';
import UserInviteListTableToolbar from './UserInviteListTableToolbar';

import {
  getUserInvites, 
  getUserInvite,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy } from '../../../../redux/slices/securityUser/invite';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

export default function UserInviteList() {
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
  useSettingsContext();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);

  const { userInvites, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.userInvite );
  const TABLE_HEAD = [
    { id: 'name', label: 'Invited User', align: 'left' },
    { id: 'cName', label: 'Customer', align: 'left' },
    { id: 'senderInvitationUser.name', visibility: 'xs1', label: 'Invited By', align: 'left' },
    { id: 'invitationStatus', label: 'Status', align: 'left' },
    { id: 'inviteExpireTime', label: 'Expiry Time', align: 'left' },
    { id: 'updatedAt', visibility: 'xs2', label: 'Updated At', align: 'left' },
  ];

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
      dispatch(getUserInvites());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(userInvites);
    }
  }, [initial, userInvites ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });  
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

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

  const handleViewRow = (inviteid) => {
    dispatch(getUserInvite(inviteid))
    navigate(PATH_SETTING.invite.view(inviteid))
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="User Invites" />
        </StyledCardContainer>
        <TableCard>
          <UserInviteListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />
            {!isNotFound && <TablePaginationCustom
              count={dataFiltered.length}
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
                        <UserInviteListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow(row?._id)}
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

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </TableCard>
      </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter(
      (invite) =>
        invite?.name?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        invite?.receiverInvitationEmail?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        invite?.email?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        invite?.senderInvitationUser?.name?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        invite?.customer?.name?.toString().toLowerCase().includes(filterName.toLowerCase()) || // ✅ added
        invite?.invitationStatus?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(invite?.inviteExpireTime)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(invite?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((licenseg) => filterStatus.includes(licenseg.status));
  }

  return inputData;
}
