import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Table,
  TableBody,
  TableRow,
  Stack,
  TableCell,
  Container,
  TableContainer,
} from '@mui/material';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import { getEmails, resetEmails, setFilterBy, ChangePage, ChangeRowsPerPage } from '../../../redux/slices/email/emails';
import { CONFIG } from '../../../config-global';
import axios from '../../../utils/axios';
import EmailListTableRow from './EmailListTableRow';
import EmailListTableToolbar from './EmailListTableToolbar';
import { Cover } from '../../../components/Defaults/Cover';
import { PATH_SETTING } from '../../../routes/paths';
import { fDate } from '../../../utils/formatTime';


const TABLE_HEAD = [
  { id: 'subject', label: 'Subject' ,align: 'left',},
  { id: 'customer.name', label: 'Customer' , align: 'left', },
  { id: 'fromEmail', label: 'From', align: 'left', },
  { id: 'toEmails', label: 'To', align: 'left',},
  { id: 'createdAt', label: 'Created At', align: 'right',},

];


export default function App() {

  const {
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { emails, filterBy, page, rowsPerPage, isLoading , initial } = useSelector((state) => state.emails);
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
    dispatch(getEmails( page, rowsPerPage ))
    return () => {
      dispatch(resetEmails())
    }
  }, [ dispatch, page, rowsPerPage, ]);

  useEffect(() => {
    setTableData(emails || []);
  }, [ emails ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  
  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleViewRow = (id) => navigate(PATH_SETTING.email.view(id));

  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);
  const denseHeight = 60;

  return (
    <Container maxWidth={false}>
      <Card
        sx={{ mb: 3, height: 160, position: 'relative' }}
      >
        <Cover name="Email" icon="ph:users-light" generalSettings />
      </Card>

      <Card sx={{ mt: 3 }}>
        <EmailListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
        />
          <TablePaginationCustom
            count={tableData?.length || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        <TableContainer>
        <Scrollbar>
        <Table >
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
                <EmailListTableRow
                  key={row?._id}
                  row={row}
                  selected={selected.includes(row._id)}
                  onSelectRow={() => onSelectRow(row._id)}
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
        <TablePaginationCustom
            count={tableData?.length || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
      </Card>
    </Container>
  );
}


// .................................................................................... //

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
      (email) =>
        email?.subject?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        email?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        email?.fromEmail?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        email?.toEmails?.some((toEmail) => toEmail.toLowerCase().indexOf(filterName.toLowerCase()))  >= 0 ||
        email?.createdAt?.toLowerCase().indexOf(filterName.toLowerCase())
    );
  }

  return inputData;
}
