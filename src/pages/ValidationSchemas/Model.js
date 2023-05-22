export  const ModelSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required') ,
    description: Yup.string().max(2000),
    isDisabled : Yup.boolean(),
    category: Yup.string().required('Category is required'),
  });