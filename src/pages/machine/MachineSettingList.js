import { useState, useEffect, useLayoutEffect } from 'react';
// @mui
import {
  Stack,
  Card,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Breadcrumbs,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { useTable, getComparator, TableNoData } from '../../components/table';
import Iconify from '../../components/iconify';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import SearchInput from '../components/Defaults/SearchInput';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
// sections
import {
  setSettingFormVisibility,
  getSettings,
} from '../../redux/slices/products/machineTechParamValue';
import SettingAddForm from './MachineTechParamValue/SettingAddForm';
import SettingEditForm from './MachineTechParamValue/SettingEditForm';
import SettingViewForm from './MachineTechParamValue/SettingViewForm';
import { fDate } from '../../utils/formatTime';
// constants
import { BUTTONS, BREADCRUMBS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

export default function MachineSettingList() {
  const { order, orderBy } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const dispatch = useDispatch();
  const { error, responseMessage, settings, settingEditFormVisibility, formVisibility } = useSelector((state) => state.machineSetting);
  const { machine } = useSelector((state) => state.machine);
  const isMobile = useResponsive('down', 'sm');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    dispatch(getSettings(machine._id));
  }, [dispatch, machine._id, settingEditFormVisibility]);

  useEffect(() => {
    setTableData(settings);
  }, [settings, error, responseMessage]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const toggleChecked = async () => {
    dispatch(setSettingFormVisibility(!formVisibility));
  };

  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  const toggleCancel = () => {
    dispatch(setSettingFormVisibility(false));
    //  if just added new setting then remove add form
    if (settings.length + 1 === tableData.length) {
      dispatch(setSettingFormVisibility(false));
    }
  };

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = !settings.length && !formVisibility && !settingEditFormVisibility;

  return (
    <>
      <Grid
        container
        direction={{ sm: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} md={6}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ fontSize: '12px', color: 'text.disabled' }}
          >
            <BreadcrumbsLink to={PATH_MACHINE.machines.list} name={BREADCRUMBS.MACHINES} />
            <BreadcrumbsLink to={PATH_MACHINE.machines.view(machine._id)} name={machine.serialNo} />
            <BreadcrumbsLink
              to={PATH_MACHINE.machines.settings}
              name={
                <Stack>
                  {!expanded && !settingEditFormVisibility && formVisibility && 'New Setting'}
                  {!formVisibility && !settingEditFormVisibility && 'Settings'}
                  {settingEditFormVisibility && 'Edit Setting'}
                </Stack>
              }
            />
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid
            container
            direction={{ sm: 'column', lg: 'row' }}
            justifyContent="flex-end"
            alignItems="center"
          >
            {isMobile && (
              <Grid item xs={12} md={3}>
                <Grid container justifyContent="flex-end">
                  <AddButtonAboveAccordion
                    name={BUTTONS.NEWSETTING}
                    toggleChecked={toggleChecked}
                    FormVisibility={formVisibility}
                    toggleCancel={toggleCancel}
                    disabled={settingEditFormVisibility}
                  />
                </Grid>
              </Grid>
            )}
            <Grid item xs={12} md={9} mt={1}>
              <SearchInput
                // searchFormVisibility={formVisibility || contactEditFormVisibility}
                filterName={filterName}
                handleFilterName={handleFilterName}
                isFiltered={isFiltered}
                handleResetFilter={handleResetFilter}
                toggleChecked={toggleChecked}
                toggleCancel={toggleCancel}
                FormVisibility={formVisibility}
                disabled={settingEditFormVisibility || formVisibility || settings.length === 0}
                size="small"
                isSearchBar
                display={settings.length === 0 ? 'none' : 'inline-flex'}
              />
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <Grid container justifyContent="flex-end">
                  <AddButtonAboveAccordion
                    name={BUTTONS.NEWSETTING}
                    toggleChecked={toggleChecked}
                    FormVisibility={formVisibility}
                    toggleCancel={toggleCancel}
                    disabled={settingEditFormVisibility}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {!settingEditFormVisibility && formVisibility && <SettingAddForm />}
      {settingEditFormVisibility && <SettingEditForm />}
      <Grid mb={5}>
        <Card>
          {!settingEditFormVisibility &&
            !formVisibility &&
            dataFiltered.map((setting, index) => {
              const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
              return (
                <Accordion
                  key={setting._id}
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
                        <Grid item xs={12} sm={3} md={3}>
                          {setting?.techParam?.category?.name || ''}
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                          {setting?.techParam?.name || ''}
                        </Grid>
                        <Grid item xs={12} sm={3} md={4}>
                          {setting?.techParamValue || ''}
                        </Grid>
                        <Grid item xs={12} sm={3} md={2}>
                          <Typography>{fDate(setting?.createdAt || '')}</Typography>
                        </Grid>
                        <Divider />
                      </Grid>
                    ) : null}
                  </AccordionSummary>
                  <AccordionDetails sx={{ mt: -5 }}>
                    <SettingViewForm currentSetting={setting} />
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </Card>
      </Grid>
      <Grid item md={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  // console.log(filterName)
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (setting) =>
        setting?.techParam?.category?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        setting?.techParam?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        setting?.techParamValue?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (setting?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(setting?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
