import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
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
import MachineServiceRecordListTableRow from './MachineServiceRecordListTableRow';
import MachineServiceRecordListTableToolbar from './MachineServiceRecordListTableToolbar';
import {
  getMachineServiceRecords,
  setDetailPageFlag,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setSendEmailDialog
} from '../../../redux/slices/products/machineServiceRecord';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'serviceDate', label: 'Service Date', align: 'left' },
  { id: 'serviceRecordUid', label: 'Service ID', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'serviceRecordConfig.docTitle', label: 'Service Configuration', align: 'left' },
  { id: 'versionNo', visibility: 'xs5', label: 'Version', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdBy.name', label: 'Created By', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];
// ----------------------------------------------------------------------

export default function MachineServiceRecordList() {
  const { machineServiceRecords, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.machineServiceRecord);
  const navigate = useNavigate();
  const { machineId } = useParams();

  const {
    order,
    orderBy,
    setPage,
    //
    //
    onSort,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);

  useLayoutEffect(() => {
    dispatch(setSendEmailDialog(false));
    if(machineId){
      dispatch(getMachineServiceRecords(machineId));
    }
    dispatch(setDetailPageFlag(false));
  }, [dispatch, machineId]);

  useEffect(() => {
    if (initial) {
      setTableData(machineServiceRecords);
    }
  }, [machineServiceRecords, initial]);

  const [draft, setDraft] = useState(false); 
  const handleToggleDraft = (status) => {
    setDraft(status);
  }

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    draft
  });

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

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

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = async (id) => navigate(PATH_MACHINE.machines.serviceRecords.view(machineId ,id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false} >
          <MachineTabContainer currentTabValue='serviceRecords' />
        <TableCard>
          <MachineServiceRecordListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            toggleStatus={draft}
            onToggleStatus={handleToggleDraft}
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
                        <MachineServiceRecordListTableRow
                          key={row._id}
                          row={row}
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

          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
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

function applyFilter({ inputData, comparator, filterName, filterStatus, draft }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if(!draft){
    inputData = inputData.filter((srec) => srec?.status!=="DRAFT");
  }

  if (filterName) {
    inputData = inputData.filter(
      (docCategory) =>
        docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.versionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(docCategory?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
