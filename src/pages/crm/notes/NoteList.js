// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import debounce from 'lodash/debounce';
// @mui
import { Card, Container } from '@mui/material';
// redux
// import { useDispatch, useSelector } from '../../../redux/store';
// routes
// components
// import { useSettingsContext } from '../../../components/settings';
// import {
//   useTable,
//   getComparator,
//   TableNoData,
//   TableSkeleton,
//   TableHeadCustom,
//   TablePaginationCustom,
// } from '../../../components/table';
// import Scrollbar from '../../../components/scrollbar';
// sections
// import NoteListTableRow from './NoteListTableRow';
// import NoteListTableToolbar from './NoteListTableToolbar';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
// import {
//   getNotes,
//   resetNotes,
//   ChangeRowsPerPage,
//   ChangePage,
//   setFilterBy
// } from '../../../redux/slices/customer/customerNote';
// import { fDate } from '../../../utils/formatTime';
// import TableCard from '../../../components/ListTableTools/TableCard';
// import { PATH_CRM } from '../../../routes/paths';
// import MachineNotes from '../../machine/notes/MachineNotes';
import { useAuthContext } from '../../../auth/useAuthContext';
import CustomerNotes from './CustomerNotes';

export default function NoteList() {
  // const {
  //   order,
  //   orderBy,
  //   setPage,
  //   onSort,
  // } = useTable({
  //   defaultOrderBy: '-createdAt',
  // });
  // useSettingsContext();
  const { user, userId } = useAuthContext();
  // const [filterName, setFilterName] = useState('');
  // const [tableData, setTableData] = useState([]);
  // const [filterStatus, setFilterStatus] = useState([]);
  // const { customerId } = useParams()
  // const { customer } = useSelector((state) => state.customer);

  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const { notes, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.customerNote);
  // const TABLE_HEAD = [
  //   { id: 'note', label: 'Note', align: 'left' },
  //   { id: 'isActive', visibility: 'xs1', label: 'Active', align: 'left' },
  //   { id: 'updatedAt', label: 'Updated At', align: 'right' },
  // ];

  // const onChangeRowsPerPage = (event) => {
  //   dispatch(ChangePage(0));
  //   dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  // };

  // const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  // useEffect(() => {
  //   dispatch(getNotes(customerId, customer?.isArchived));
  //   return () => { dispatch(resetNotes()) };
  // }, [dispatch, customerId, customer?.isArchived]);

  // useEffect(() => {
  //   setTableData(notes);
  // }, [notes]);

  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  //   filterStatus,
  // });
  // const denseHeight = 60;
  // const isFiltered = filterName !== '' || !!filterStatus.length;
  // const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  // const debouncedSearch = useRef(debounce((value) => {
  //   dispatch(ChangePage(0))
  //   dispatch(setFilterBy(value))
  // }, 500))

  // const handleFilterName = (event) => {
  //   debouncedSearch.current(event.target.value);
  //   setFilterName(event.target.value)
  //   setPage(0);
  // };

  // useEffect(() => {
  //   debouncedSearch.current.cancel();
  // }, [debouncedSearch]);

  // useEffect(() => {
  //   setFilterName(filterBy)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const handleFilterStatus = (event) => {
  //   setPage(0);
  //   setFilterStatus(event.target.value);
  // };

  // const handleViewRow = (noteid) => { if (customerId && noteid) navigate(PATH_CRM.customers.notes.view(customerId, noteid)) };

  return (
    <Container maxWidth={false} >
      <CustomerTabContainer currentTabValue='notes' />
      {/* <TableCard>
        <NoteListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
        // onResetFilter={handleResetFilter}
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
                      <NoteListTableRow
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
      </TableCard> */}
      <Card sx={{ mt: 2 }}>
        <CustomerNotes currentUser={{ ...user, userId }} />
      </Card>
    </Container>
  );
}
// ----------------------------------------------------------------------

// function applyFilter({ inputData, comparator, filterName, filterStatus }) {
//   const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);
//   if (filterName) {
//     inputData = inputData.filter(
//       (noteg) =>
//         noteg?.note?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
//         fDate(noteg?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
//     );
//   }

//   if (filterStatus.length) {
//     inputData = inputData.filter((noteg) => filterStatus.includes(noteg.status));
//   }

//   return inputData;
// }
