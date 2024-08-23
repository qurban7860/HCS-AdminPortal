import { Snacks, allowedExtensions } from '../../../constants/document-constants';

const maxFiles = () => {
  const configurations = JSON.parse(localStorage.getItem('configurations'));
  if (!configurations) return 20;
  return configurations.find(c => c?.name.toUpperCase() === 'MAX_UPLOAD_FILES')?.value;
};

const validateFileType = (value, options) => {
  const { path, createError } = options;
  if (value && Array.isArray(value)) {
    if (value?.filter((el)=> !el?._id)?.length > ( Number(maxFiles()) ) ) {
      return createError({
        message: Snacks.fileMaxCount,
        path,
        value,
      });
    }
    const invalidFiles = value.filter((file) => {
      const fileExtension = file?.name?.split('.').pop().toLowerCase();
      return !allowedExtensions.includes(fileExtension);
    });
    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((file) => file.name).join(', ');
      return createError({
        message: `Invalid file(s) detected: ${invalidFileNames}`,
        path,
        value,
      });
    }
    return true;
  }
  return createError({
    message: Snacks.fileRequired,
    path,
    value,
  });
};


export default validateFileType;
