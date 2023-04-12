const ToolInstalledSchema = Yup.object().shape({
    note: Yup.string().max(1500),
    isDisabled : Yup.boolean(),
  });