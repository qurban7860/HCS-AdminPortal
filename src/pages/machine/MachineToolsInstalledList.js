import { useState, useEffect, memo } from 'react';
// @mui
import {
  Stack,
  Breadcrumbs,
  Card,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// hooks
import { useSnackbar } from '../../components/snackbar';
// components
import { useTable, getComparator, TableNoData } from '../../components/table';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import Iconify from '../../components/iconify';
// sections
import {
  setToolInstalledFormVisibility,
  getToolsInstalled,
} from '../../redux/slices/products/toolInstalled';
import ToolsInstalledAddForm from './ToolsInstalled/ToolsInstalledAddForm';
import ToolsInstalledEditForm from './ToolsInstalled/ToolsInstalledEditForm';
import ToolsInstalledViewForm from './ToolsInstalled/ToolsInstalledViewForm';
import { fDate } from '../../utils/formatTime';
// constants
import { BUTTONS, BREADCRUMBS } from '../../constants/default-constants';

// ----------------------------------------------------------------------;

// const _accordions = [...Array(8)].map((_, index) => ({
//   id: _mock.id(index),
//   value: `panel${index + 1}`,
//   heading: `Site ${index + 1}`,
//   subHeading: _mock.text.title(index),
//   detail: _mock.text.description(index),
// }));

// ----------------------------------------------------------------------

function MachineToolsInstalledList() {
  const { order, orderBy} = useTable({
    defaultOrderBy: 'createdAt',
  });
  const { machine } = useSelector((state) => state.machine);
  const {
    initial,
    error,
    responseMessage,
    toolInstalledEditFormVisibility,
    toolsInstalled,
    formVisibility,
  } = useSelector((state) => state.toolInstalled);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const toggleChecked = async () => {
    dispatch(setToolInstalledFormVisibility(!formVisibility));
  };

  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
    }
  };

  useEffect(() => {
    // if(!formVisibility && !toolInstalledEditFormVisibility){
    dispatch(getToolsInstalled(machine._id));
    // }
  }, [dispatch, machine._id, toolInstalledEditFormVisibility, formVisibility]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (initial) {
      setTableData(toolsInstalled);
    }
  }, [toolsInstalled, error, responseMessage, enqueueSnackbar, initial,dispatch]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const toggleCancel = () => {
    dispatch(setToolInstalledFormVisibility(!formVisibility));
    // setChecked(false);
  };

  const isNotFound = !toolsInstalled.length && !formVisibility && !toolInstalledEditFormVisibility;

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ fontSize: '12px', color: 'text.disabled' }}
          >
            <BreadcrumbsLink to={PATH_MACHINE.machines.list} name={BREADCRUMBS.MACHINES} />
            <BreadcrumbsLink to={PATH_MACHINE.machines.view(machine._id)} name={machine.serialNo} />
            <BreadcrumbsLink
              to={PATH_MACHINE.machines.settings.tool}
              name={
                <Stack>
                  {!expanded &&
                    !toolInstalledEditFormVisibility &&
                    formVisibility &&
                    BREADCRUMBS.NEWTOOL}
                  {!formVisibility && !toolInstalledEditFormVisibility && BREADCRUMBS.TOOL}
                  {toolInstalledEditFormVisibility && BREADCRUMBS.EDITTOOL}
                </Stack>
              }
            />
          </Breadcrumbs>
        </Grid>
        <AddButtonAboveAccordion
          name={BUTTONS.INSTALLTOOL}
          toggleChecked={toggleChecked}
          FormVisibility={formVisibility}
          toggleCancel={toggleCancel}
          disabled={toolInstalledEditFormVisibility}
        />
      </Grid>

      <Card>
        {formVisibility && !toolInstalledEditFormVisibility && <ToolsInstalledAddForm />}
        {toolInstalledEditFormVisibility && <ToolsInstalledEditForm />}
        {!formVisibility &&
          !toolInstalledEditFormVisibility &&
          toolsInstalled.map((tool, index) => {
            const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
            return (
              <Accordion
                key={tool._id}
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{ borderTop: borderTopVal }}
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  onClick={() => handleAccordianClick(index)}
                >
                  {index !== activeIndex ? (
                    <Grid container spacing={0}>
                      <Grid item xs={12} sm={3} md={2}>
                        {tool?.tool?.name || ''}
                      </Grid>

                      {/* <Grid item xs={12} sm={6} md={8} sx={{overflowWrap: 'break-word'}} >
                        {tool?.note.length > 100 ? tool?.note.substring(0, 100) : tool?.note}
                        {tool?.note.length > 100 ? '...' : null}
                      </Grid> * */}

                      <Grid item xs={12} sm={6} md={8} >
                        {tool?.toolType || ''}
                      </Grid>

                      <Grid item xs={12} sm={3} md={2}>
                        <Typography>{fDate(tool?.createdAt || '')}</Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                </AccordionSummary>
                <AccordionDetails sx={{ mt: -5 }}>
                  <ToolsInstalledViewForm currentTool={tool} />
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Card>
      <Grid item md={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
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
      (site) => site.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((site) => filterStatus.includes(site.status));
  }

  return inputData;
}

export default memo(MachineToolsInstalledList)