export const ParameterSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required') ,
    description: Yup.string().min(2).max(2000),
    isDisabled : Yup.boolean(),
    code: Yup.string(),
  });