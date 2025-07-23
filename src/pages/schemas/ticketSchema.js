import * as Yup from 'yup';
import validateFileType from '../documents/util/validateFileType';
import { allowedExtensions } from '../../constants/document-constants';

export const ticketSchema = (reqType) => {
  const isNewRequest = reqType === 'new';
  return Yup.object().shape({

    customer: Yup.object().label('Customer').nullable()
      .when([], {
        is: () => isNewRequest,
        then: (schema) => schema.required(),
      }),

    machine: Yup.object().label('Machine').nullable()
      .when([], {
        is: () => isNewRequest,
        then: (schema) => schema.required(),
      }),

    issueType: Yup.object().label('Issue Type').nullable()
      .when([], {
        is: () => isNewRequest,
        then: (schema) => schema.required(),
      }),

    requestType: Yup.object().label('Request Type').nullable()
      .when([], {
        is: () => isNewRequest,
        then: (schema) => schema.required(),
      }),

    reporter: Yup.object().nullable().label('Reporter'),
    assignee: Yup.object().nullable().label('Assignee'),
    changeType: Yup.object().nullable().label('Change Type'),
    impact: Yup.object().nullable().label('Impact'),
    priority: Yup.object().nullable().label('Priority'),
    status: Yup.object().nullable().label('Status'),
    changeReason: Yup.object().nullable().label('Change Reason'),
    investigationReason: Yup.object().nullable().label('Investigation Reason'),

    files: Yup.mixed().label('Files')
      .test(
        'fileType', allowedExtensions,
        function (value) {
          return validateFileType({ _this: this, files: value, doc: true, image: true, video: true, others: true });
        }
      ).nullable(),
    hlc: Yup.string().label('HLC').trim().max(500).nullable(),
    plc: Yup.string().label('PLC').trim().max(500).nullable(),
    description: Yup.string().label('Description').trim().max(10000).nullable(),
    summary: Yup.string().label('Summary').required().trim().max(200).nullable(),
    implementationPlan: Yup.string().label('Implementation Plan').trim().max(10000).nullable(),
    backoutPlan: Yup.string().label('Backout Plan').trim().max(10000).nullable(),
    testPlan: Yup.string().label('Test Plan').trim().max(10000).nullable(),
    groups: Yup.string().label('Root Cause').trim().max(5000).nullable(),
    rootCause: Yup.string().label('Internal Note').trim().max(10000).nullable(),
    workaround: Yup.string().label('Work Around').trim().max(10000).nullable(),

    // plannedStartDate: Yup.date().label("Planned Start Date").nullable()
    // .test('plannedStartDate', 'Start Date must be earlier than End Date', ( value, context ) => {
    //   const { plannedEndDate } = context.parent;
    //   return ( plannedEndDate && value && value < plannedEndDate );
    // }),

    // startTime: Yup.date().label("Start Time").nullable()
    // .test('startTime', 'Start Time must be earlier than End Time', ( value, context ) => {
    //   const { endTime } = context.parent;
    //   return ( endTime && value && value < endTime );
    // }),

    // plannedEndDate: Yup.date().label("Planned End Date").nullable()
    // .test('plannedEndDate', 'End Date must be later than Start Date', ( value, context ) => {
    //   const { plannedStartDate } = context.parent;
    //   return ( plannedStartDate && value && value > plannedStartDate );
    // }),

    // endTime: Yup.date().label("End Time").nullable()
    // .test('endTime', 'End Time must be later than Start Time', ( value, context ) => {
    //   const { startTime } = context.parent;
    //   return ( startTime && value && value > startTime );
    // }),

    shareWith: Yup.boolean().label("Share With"),
    isActive: Yup.boolean().label("Active"),
    isArchived: Yup.boolean().label("Archived"),

  });
};


export const ticketControllerSchema =  Yup.object().shape({
    issueType: Yup.object().label('Issue Type').nullable(),
    requestType: Yup.object().label('Request Type').nullable(),
    isResolve: Yup.boolean().label('Open').nullable(),
    statusType: Yup.object().nullable().label('Status Type'),
    status: Yup.array().nullable().label('Status'),
    priority: Yup.object().nullable().label('Priority')
});