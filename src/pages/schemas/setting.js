import * as Yup from 'yup';

    export const regionSchema = Yup.object().shape({
        name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
        countries: Yup.array(),
        description: Yup.string().max(5000),
        isActive: Yup.boolean(),
        isDefault: Yup.boolean(),
    });

    export const configSchema = Yup.object().shape({
        type: Yup.string().nullable().required('Type is required!'),
        name: Yup.string().required('Name is required!').min(2, 'Name must be at least 2 characters long').max(200, 'Name must not exceed 200 characters!'),
        value: Yup.string().required('Value is required!').max(5000, 'Value must not exceed 200 characters!'),
        notes: Yup.string().max(5000),
        isActive: Yup.boolean(),
      });