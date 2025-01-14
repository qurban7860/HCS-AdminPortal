import * as Yup from 'yup';

export const AddTicketSchema = Yup.object().shape({
    customer: Yup.object().nullable().required('Customer is required'),
    machine: Yup.object().nullable(),
    summary: Yup.string().max(10000).required('Summary is required!'),
    status: Yup.object().nullable().label('Status'),
    dateFrom: Yup.date()
       .nullable()
       .test('dateFromTest', 'Start Date must be earlier than End Date', function (value) {
         const { dateTo } = this.parent;
         return value && (!dateTo || value < dateTo);
       }),
     dateTo: Yup.date()
       .nullable()
       .test('dateToTest', 'End Date must be later than Start Date', function (value) {
         const { dateFrom } = this.parent;
         return value && (!dateFrom || value > dateFrom);
       }),
    shareWith: Yup.boolean(),
  });
  