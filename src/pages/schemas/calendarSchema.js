
import * as Yup from 'yup';
import validateFileType from '../documents/util/validateFileType';
import { allowedExtensions } from '../../constants/document-constants';

export const eventSchema = (clearErrors) => Yup.object().shape({
  date: Yup.date().nullable().label('Event Date').typeError('End Time should be a valid Date').required(),
  end_date: Yup.date().nullable().label('Event Date').typeError('End Time should be a valid Date').required()
    .test('is-greater-than-start-date', 'End Date must be later than Start Date', (value, context) => {
      const start_date = context.parent.date;
      if (start_date && value) {
        const startDate = new Date(start_date).setHours(0, 0, 0, 0);
        const endDate = new Date(value).setHours(0, 0, 0, 0);
        if (startDate !== endDate) {
          clearErrors('end')
        }
        return startDate <= endDate;
      }
      return true;
    }),
  start: Yup.object().nullable().label('Start Time').required('Start Time is required'),
  end: Yup.object().nullable().label('End Time').required('End Time is required')
    .test('is-greater-than-start-time-if-same-date', 'End Time must be later than Start Time', (value, context) => {
      const { start, date, end_date } = context.parent;
      if (start && date && end_date && value) {
        let startDate = new Date(date);
        let endDate = new Date(end_date);
        const [start_hours, start_minutes] = start.value.split(':').map(Number);
        const [end_hours, end_minutes] = value.value.split(':').map(Number);
        startDate.setHours(start_hours, start_minutes);
        startDate = new Date(startDate);
        endDate.setHours(end_hours, end_minutes);
        endDate = new Date(endDate);
        if (startDate.getDate() === endDate.getDate()) {
          return startDate < endDate;
        }
      }
      return true;
    }),
  jiraTicket: Yup.string().max(200).label('Jira Ticket'),
  customer: Yup.object().nullable().label('Customer').required(),
  priority: Yup.object().label('Priority').nullable(),
  status: Yup.string().nullable().label('Status').required(),
  machines: Yup.array().nullable().label('Machines'),
  site: Yup.object().nullable().label('Site'),
  primaryTechnician: Yup.object().nullable().label('Primary Technician').required(),
  supportingTechnicians: Yup.array().nullable().label('Supporting Technicians'),
  notifyContacts: Yup.array().nullable().label('Notify Contacts'),
  description: Yup.string().max(500).label('Description'),
  files: Yup.mixed().label('Files')
    .test(
      'fileType', allowedExtensions,
      function (value) {
        return validateFileType({ _this: this, files: value, doc: true, image: true, video: true, others: true });
      }
    ).nullable(),
});
