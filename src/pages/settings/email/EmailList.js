import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Card, Table, Checkbox, TableBody, TableContainer, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_SETTING } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import EmailListTableRow from './EmailListTableRow';
import EmailListTableToolbar from './EmailListTableToolbar';
import {
  getEmails,
  resetEmails,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../../redux/slices/email/emails';
import { fDateTime } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import { Cover } from '../../../components/Defaults/Cover';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'subject', label: 'Subject' ,align: 'left',},
  { id: 'customer.name', label: 'Customer' , align: 'left', },
  { id: 'fromEmail', label: 'From', align: 'left', },
  { id: 'toEmails', label: 'To', align: 'left',},
  { id: 'createdAt', label: 'Created At', align: 'right',},
];

// ----------------------------------------------------------------------

export default function EmailList(){
  const { initial, emails, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.emails);

  const navigate = useNavigate();
  const { machineId } = useParams();
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({ defaultOrderBy: 'date', defaultOrder: 'asc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [ isCreatedAt, setIsCreatedAt ] = useState(false);

  useLayoutEffect(() => {
        dispatch(getEmails(page, rowsPerPage ));
        return () => {
          dispatch(resetEmails());
        }
  }, [dispatch, machineId, page, rowsPerPage ]);

  useEffect(() => {
    if (initial) {
      setTableData(emails?.data || [] );
    }
  }, [emails?.data, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);
  const denseHeight = 60;

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


  const handleViewRow = (id) => navigate(PATH_SETTING.email.view(id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };
  
  return (
    <Container maxWidth={false} >
      <Card sx={{ mb: 3, height: 160, position: 'relative' }} >
        <Cover name="Email" icon="ph:users-light" generalSettings />
      </Card>
        <TableCard>
          <EmailListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          {!isNotFound && <TablePaginationCustom
            count={ emails?.totalCount || 0 }
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
                    .map((row, index) =>
                      row ? (
                        <EmailListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow(row._id)}
                          selected={selected.includes(row._id)}
                          selectedLength={selected.length}
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
            count={ emails?.totalCount || 0 }
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

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    console.log("filterName : ",filterName,'inputData : ',inputData)
    inputData = inputData.filter(
      (email) =>
        email?.subject?.toLowerCase().indexOf(filterName?.toLowerCase()) >= 0 ||
        email?.customer?.name?.toLowerCase().indexOf(filterName?.toLowerCase()) >= 0 ||
        email?.fromEmail?.toLowerCase().indexOf(filterName?.toLowerCase()) >= 0 ||
        email?.toEmails?.some((toEmail) => toEmail.toLowerCase().indexOf(filterName.toLowerCase()))  >= 0 ||
        fDateTime(email?.createdAt)?.toLowerCase().indexOf(filterName?.toLowerCase())
    );
  }
  
  return inputData;
}
