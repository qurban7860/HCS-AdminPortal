import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
//
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';

import {
  getVisits,
  resetVisits,
  newVisit,
  updateVisitDate,
  updateVisitDateLocal,
  updateVisit,
  deleteVisit,
  selectVisit,
  selectRange,
  onOpenModal,
  onCloseModal,
} from '../../redux/slices/visit/visit';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useDateRangePicker } from '../../components/date-range-picker';
// sections
import {
  StyledCalendar,
  CalendarToolbar,
} from '.';
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
  const { activeCustomers } = useSelector((state) => state.customer);
  const userCustomer = localStorage.getItem('customer')

  const [data, setData] = useState([]);
  const [previousDate, setPreviousDate] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() =>{
    if(userCustomer && Array.isArray(activeCustomers) && activeCustomers.length > 0 ){
      const filteredCustomer = activeCustomers?.find(c => c?._id === userCustomer )
      setSelectedCustomer(filteredCustomer)
    }
  },[ userCustomer, activeCustomers ])

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
    dispatch(getActiveCustomers());
  }, [dispatch]);

  useEffect(() => {
    if(selectedCustomer && date && !openModal ){
      // if(previousDate?.getFullYear() !== date?.getFullYear() && (Number(previousDate?.getMonth())+1) !== (Number(date?.getMonth())+1)){
        setPreviousDate(date);
        dispatch(getVisits(date, selectedCustomer?._id ));
      // }
    }
      return () => {
        dispatch(resetVisits());
        setData([])
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, date, selectedCustomer ]);

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
    console.log("calendarEl : ",calendarEl)
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

  const handleDropEvent = ({ event }) => {
    try {
      const visitDate = new Date(event?._def?.extendedProps?.visitDate)
      const newDate = new Date(event?._instance?.range?.start); 
      newDate.setHours(visitDate.getHours(), visitDate.getMinutes());
      setData(prevData =>  prevData.map(e =>  e?.id === event.id ? { ...e, date: newDate } : e ) );
      dispatch(updateVisitDate(event.id,  newDate));
    } catch (error) {
      enqueueSnackbar('Event Date Update Failed!', { variant: `error` });
      dispatch(getVisits(date));
    }
  };

  const handleCloseModal = () => dispatch(onCloseModal());

  const handleCreateUpdateEvent = async (newEvent) => {

    if (selectedEventId) {
      try{
        await dispatch(updateVisit(selectedEventId, newEvent));
        await dispatch(onCloseModal());
        enqueueSnackbar('Event Updated Successfully!');
      } catch(e){
        enqueueSnackbar('Event Update Failed!');
      }
    } else {
      try{
        await dispatch(newVisit(newEvent));
        await dispatch(onCloseModal());
        enqueueSnackbar('Event Created Successfully!');
      } catch(e){
      enqueueSnackbar('Event Create Failed!');
      }
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (selectedEventId) {
        await setData(prevData => prevData.filter(e =>  e?.id !== selectedEventId) );
        await handleCloseModal();
        await dispatch(deleteVisit(selectedEventId));
      }
      enqueueSnackbar('Event Deleted Successfully!');
    } catch (error) {
      enqueueSnackbar('Event Delete Failed!', { variant: 'error'});
      dispatch(getVisits(date));
    }
  };


  // const dataFiltered = applyFilter({
  //   inputData: data,
  //   filterEventColor,
  //   filterStartDate: picker.startDate,
  //   filterEndDate: picker.endDate,
  //   selectedCustomer,
  //   isError: !!picker.isError,
  // });

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
            <Cover name="Calendar Events" />
        </StyledCardContainer>
        <Card>
          <StyledCalendar>
            <CalendarToolbar
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
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
              events={data}
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
        date={date}
        event={selectedEvent}
        range={selectedRange}
        onCreateUpdateEvent={handleCreateUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />

    </>
  );
}

// ----------------------------------------------------------------------

// function applyFilter({ inputData, filterEventColor, filterStartDate, filterEndDate, selectedCustomer }) {
//   if(selectedCustomer && selectedCustomer._id ){
//     const stabilizedThis = inputData?.map((el, index) => [el, index]);

//     inputData = stabilizedThis.map((el) => el[0]);

//     inputData = inputData.filter(
//       (event) =>
//         event?.extendedProps?.customer?._id.indexOf(selectedCustomer?._id) >= 0 
//     );
//   }

//   return inputData;
// }
