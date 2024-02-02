import * as Yup from 'yup';

export const regionSchema = Yup.object().shape({
        name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
        countries: Yup.array(),
        description: Yup.string().max(5000),
        isActive: Yup.boolean(),
        isDefault: Yup.boolean(),
    });