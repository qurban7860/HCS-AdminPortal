import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
//
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Button, Container, DialogTitle, Dialog, Divider } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';

import {
  getVisits,
  resetVisits,
  newVisit,
  updateVisitDate,
  updateVisit,
  deleteVisit,
  selectVisit,
  selectRange,
  onOpenModal,
  onCloseModal,
} from '../../redux/slices/visit/visit';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import { fTimestamp } from '../../utils/formatTime';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useDateRangePicker } from '../../components/date-range-picker';
// sections
import {
  // CalendarForm,
  StyledCalendar,
  CalendarToolbar,
  // CalendarFilterDrawer,
} from '../calendar';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import VisitDialog from '../../components/Dialog/VisitDialog';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef(null);

  const { visits, openModal, selectedRange, selectedEventId } = useSelector((state) => state.visit );

  const [data, setData] = useState([]);

  const selectedEvent = useSelector(() => {
    if (selectedEventId) {
      return data.find((event) => event.id === selectedEventId);
    }
    return null;
  });

  const picker = useDateRangePicker(null, null);

  const [date, setDate] = useState(new Date());

  const [openFilter, setOpenFilter] = useState(false);

  const [filterEventColor, setFilterEventColor] = useState([]);

  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

  useEffect(() => {
    if (Array.isArray(visits) && visits.length > 0) {
      const formattedData = visits.map((v) => ({
        id: v?._id,
        title: v?.customer?.name,
        date: v?.visitDate,
        textColor: "#1890FF",
        extendedProps: {
          ...v
        }
      }));
      setData(formattedData);
    }
  }, [visits]);

  useEffect(() => {
      dispatch(getVisits(date));
}, [dispatch, date ]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);


  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(
      selectRange({
        start: arg.start,
        end: arg.end,
      })
    );
  };

  const handleSelectEvent = (arg) => dispatch(selectVisit(arg.event.id));

  const handleResizeEvent = async ({ event }) => {
    try {
      dispatch(
        updateVisit(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = async ({ event }) => {
    try {
      const visitDate = new Date(event?._def?.extendedProps?.visitDate)
      const newDate = new Date(event?._instance?.range?.start); 
      newDate.setHours(visitDate.getHours(), visitDate.getMinutes(), visitDate.getSeconds(), visitDate.getMilliseconds());
      await dispatch(updateVisitDate(event.id,  newDate));
      // await dispatch(getVisits(date));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => dispatch(onCloseModal());

  const handleCreateUpdateEvent = async (newEvent) => {
    if (selectedEventId) {
      await dispatch(updateVisit(selectedEventId, newEvent));
      await dispatch(onCloseModal());
      // await dispatch(getVisits(date));
      enqueueSnackbar('Update success!');
    } else {
      await dispatch(newVisit(newEvent));
      await dispatch(onCloseModal());
      // await dispatch(getVisits(date));
      enqueueSnackbar('Create success!');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (selectedEventId) {
        await dispatch(deleteVisit(selectedEventId));
        await handleCloseModal();
        await dispatch(getVisits(date));
        enqueueSnackbar('Delete success!');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const dataFiltered = applyFilter({
    inputData: data,
    filterEventColor,
    filterStartDate: picker.startDate,
    filterEndDate: picker.endDate,
    isError: !!picker.isError,
  });

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
            <Cover name="Visits" />
        </StyledCardContainer>
        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              allDayMaintainDuration
              eventResizableFromStart
              events={dataFiltered}
              initialEvents={data}
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              select={handleSelectRange}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isDesktop ? 720 : 'auto'}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      <VisitDialog
        event={selectedEvent}
        range={selectedRange}
        onCreateUpdateEvent={handleCreateUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />

    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filterEventColor, filterStartDate, filterEndDate, isError }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterEventColor.length) {
    inputData = inputData.filter((event) => filterEventColor.includes(event.textColor));
  }

  if (filterStartDate && filterEndDate && !isError) {
    inputData = inputData.filter(
      (event) =>
        fTimestamp(event.start) >= fTimestamp(filterStartDate) &&
        fTimestamp(event.end) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
