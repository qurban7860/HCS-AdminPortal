import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  TableBody,
  TableRow,
  Stack,
  TableCell,
   Container,
} from '@mui/material';
import {
  getComparator,
  TableHeadCustom,
} from '../../components/table';
import Scrollbar from '../../components/scrollbar';
import { CONFIG } from '../../config-global';
import axios from '../../utils/axios';
import EmailListTableRow from './EmailListTableRow';
import EmailListTableToolbar from './EmailListTableToolbar';
import { Cover } from '../components/Defaults/Cover';
// import { Email } from 'src/routes/elements';
import { PATH_EMAIL } from '../../routes/paths';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import LinkTableCell from '../components/ListTableTools/LinkTableCell';
// import { email } from 'src/_mock/assets';

const TABLE_HEAD = [
  { id: 'name', label: 'email' ,align: 'center',},
  { id: 'subject', label: 'subject '  },
  // { id: 'body', label: 'body' , align: 'center'},
  { id: 'fromEmail', label: 'from email',align:'center', },
  { id: 'toEmails', label: 'to email',align:'center',},
  { id: 'created_at', label: 'Created At'},

];


export default function App() {

  const [sortingOrder, setSortingOrder] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState('');
  const [emails, setEmails] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState([]);
  // eslint-disable-next-line
  const [tableData, setTableData] = useState([]);
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const navigate = useNavigate();


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}emails`);
      setEmails(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const onSort = (column) => {
    sortTable(column);
  };

  const sortTable = (column) => {
    if (sortedColumn === column) {
      setSortingOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortingOrder('asc');
      setSortedColumn(column);
    }
  };


  const order = sortingOrder === 'asc' ? 'asc' : 'desc';
  const orderBy = sortedColumn;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event) => {
    setFilterStatus(event.target.value);
  };
  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };


  const sortedEmails = [...emails].sort((a, b) => {
    if (sortingOrder === 'asc') {
      return a[sortedColumn] - b[sortedColumn];
    }
    return b[sortedColumn] - a[sortedColumn];
  });

  const [selected, setSelected] = useState([]);
  const onSelectRow = (rowId) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(rowId)) {
        return prevSelected.filter((id) => id !== rowId);
      }
      return [...prevSelected, rowId];

    });
  };

  const handleDeleteRow = (rowId) => {

  };

  const handleViewRow = (id) => {
    navigate(PATH_EMAIL.email.view(id));
  };

  const isNotFound = false; // Define the variable based on your condition
  const denseHeight = 48; // Define the desired height


  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative'
        }}
      >
        <Cover name="Email" icon="ph:users-light" />
      </Card>


      <Card sx={{ mt: 3 }}>
        <EmailListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
        />
        <Table >

          <TableHeadCustom
            order={order}
            orderBy={orderBy}
            headLabel={TABLE_HEAD}
            // rowCount={tableData.length}
            // numSelected={selected.length}
            onSort={onSort}
            // onSelectAllRows={(checked) =>
            //   onSelectAllRows(
            //     checked,
            //     tableData.map((row) => row._id)
            //   )
            // }
          />


          <TableBody>
            {sortedEmails.map((email) => (
              <TableRow key={email.id}>
                <Stack direction="row" alignItems="center">
                    
                  <CustomAvatar
                    name={email.subject}
                    alt={email.subject}
                    sx={{ ml: 1, my: 0.5, width: '30px', height: '30px' }} 
                  />
                  <LinkTableCell align="left" onClick={() => handleViewRow(email._id)} param={email.subject} />
                </Stack>
                <TableCell>{(email.customer) ? email.customer.name : ''}</TableCell> 
                <TableCell>{email.toEmails}</TableCell>
                <TableCell>{email.fromEmail}</TableCell>
                <TableCell>{email.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Scrollbar>
          <Table size="small" sx={{ minWidth: 960 }}>
            <TableBody>
              {dataFiltered
                .map((row, index) =>
                  row ? (
                    <EmailListTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      // onEditRow={() => handleEditRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      style={index % 2 ? { background: 'red' } : { background: 'green' }}
                    />
                  ) : (
                    !isNotFound && <Table key={index} sx={{ height: denseHeight }} />
                  )
                )}

            </TableBody>
          </Table>
        </Scrollbar>
      </Card>
    </Container>
  );
}


// .................................................................................... //


function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((email) =>
    email.customer.name?.toLowerCase().includes(filterName.toLowerCase()) ||
    email.fromEmail?.toLowerCase().includes(filterName.toLowerCase()) ||
    // email.body?.toLowerCase().includes(filterName.toLowerCase()) ||
    email.createdAt?.toLowerCase().includes(filterName.toLowerCase())
    );
  }


  if (filterStatus.length) {
    inputData = inputData.filter((email) => filterStatus.includes(email.status));
  }

  return inputData;
}
