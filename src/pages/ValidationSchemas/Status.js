export const StatusSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required') ,
    description: Yup.string().max(2000),
    isDisabled : Yup.boolean(),
    displayOrderNo: Yup.number(),
  });