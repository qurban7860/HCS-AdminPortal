import { Snacks, allowedExtensions } from '../../../constants/document-constants';

const maxFiles = JSON.parse( localStorage.getItem('configurations'))?.find( ( c )=> c?.name === 'MAX_UPLOAD_FILES' )

const validateFileType = (value, options) => {
  const { path, createError } = options;
  if (value && Array.isArray(value)) {
    if (value?.filter((el)=> !el?._id)?.length > ( Number(maxFiles?.value) || 20 ) ) {
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
