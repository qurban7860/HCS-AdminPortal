import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
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
  TablePaginationFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import ToolInstalledListTableRow from './ToolInstalledListTableRow';
import ToolInstalledListTableToolbar from './ToolInstalledListTableToolbar';
import { getToolsInstalled, ChangeRowsPerPage, ChangePage, setFilterBy } from '../../../redux/slices/products/toolInstalled';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineTabContainer from '../util/MachineTabContainer';

export default function ToolInstalledList() {
  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({defaultOrderBy: 'createdAt', defaultOrder: 'desc'});
  const { machineId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const { machine } = useSelector((state) => state.machine);
  const { toolsInstalled, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.toolInstalled );
  const TABLE_HEAD = [
    { id: 'tool.name', label: 'Tool', align: 'left' },
    { id: 'toolType', visibility: 'xs1', label: 'Tool Type', align: 'left' },
    { id: 'isActive', label: 'Active', align: 'center' },
    { id: 'updatedAt', label: 'Updated At', align: 'right' },
  ];

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
    if(machineId){
      dispatch(getToolsInstalled( machineId, machine?.isArchived ));
    }
  }, [dispatch, machineId, machine ]);

  useEffect(() => {
    setTableData(toolsInstalled);
  }, [toolsInstalled]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
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


  const handleViewRow = (id) => navigate(PATH_MACHINE.machines.toolsInstalled.view( machineId, id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='toolsinstalled' />
      <TableCard>
        <ToolInstalledListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
        />
          {!isNotFound && <TablePaginationFilter
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
                      <ToolInstalledListTableRow
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

        <TablePaginationFilter
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
      (licenseg) =>
        licenseg?.licenseKey?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        licenseg?.licenseDetail?.version?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        licenseg?.licenseDetail?.type?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(licenseg?.licenseDetail?.extensionTime)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(licenseg?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }


  return inputData;
}
