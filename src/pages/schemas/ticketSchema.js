import * as Yup from 'yup';
  
  export const ticketSchema = ( reqType ) => {
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

        reporter: Yup.object().nullable().label('Reporter'),
        assignee: Yup.object().nullable().label('Assignee'),
        changeType: Yup.object().nullable().label('Change Type'),
        impact: Yup.object().nullable().label('Impact'),
        priority: Yup.object().nullable().label('Priority'),
        status: Yup.object().nullable().label('Status'),
        changeReason: Yup.object().nullable().label('Change Reason'),
        investigationReason: Yup.object().nullable().label('Investigation Reason'),

        files: Yup.mixed().label("Files").nullable(),
        hlc: Yup.string().label('HLC').trim().max(500).nullable(),
        plc: Yup.string().label('PLC').trim().max(500).nullable(),
        description: Yup.string().label('Description').trim().max(10000).nullable(),
        summary: Yup.string().label('Summary').trim().max(150).nullable(),
        implementationPlan: Yup.string().label('Implementation Plan').trim().max(10000).nullable(),
        backoutPlan: Yup.string().label('Backout Plan').trim().max(10000).nullable(),
        testPlan: Yup.string().label('Test Plan').trim().max(10000).nullable(),
        groups: Yup.string().label('Root Cause').trim().max(5000).nullable(),
        rootCause: Yup.string().label('Internal Note').trim().max(10000).nullable(),
        workaround: Yup.string().label('Work Around').trim().max(10000).nullable(),

        plannedStartDate: Yup.date().label("Planned Start Date").nullable()
        .test('plannedStartDate', 'Start Date must be earlier than End Date', ( value, context ) => {
          const { plannedEndDate } = context.parent;
          return value && (!plannedEndDate || value < plannedEndDate);
        }),

        plannedEndDate: Yup.date().label("Planned End Date").nullable()
        .test('plannedEndDate', 'End Date must be later than Start Date', ( value, context ) => {
          const { plannedStartDate } = context.parent;
          return value && (!plannedStartDate || value > plannedStartDate);
        }),

        shareWith: Yup.boolean().label("Share With"),
        isActive: Yup.boolean().label("Active"),
        isArchived: Yup.boolean().label("Archived"),
        
    });
};