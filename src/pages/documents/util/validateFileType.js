import { 
    Snacks, 
    allowedDocumentExtension, 
    allowedImageExtensions, 
    allowedOtherExtension, 
    allowedVideoExtensions 
  } from '../../../constants/document-constants';

const maxFiles = () => {
  const configurations = JSON.parse(localStorage.getItem('configurations'));
  if (!configurations) return 20;
  return configurations.find(c => c?.name.toUpperCase() === 'MAX_UPLOAD_FILES')?.value;
};

const validateFileType = ({_this, files, doc=false, image=false, video=false, others=false, required=false}) => {
  
  const { path, createError } = _this;
  
  const allowedExtensions = [];

  if(doc) allowedExtensions.push(...allowedDocumentExtension);
  if(image) allowedExtensions.push(...allowedImageExtensions);
  if(video) allowedExtensions.push(...allowedVideoExtensions);
  if(others) allowedExtensions.push(...allowedOtherExtension);

  if (files && Array.isArray(files) && files?.length > 0) {
    if (files?.filter((el)=> !el?._id)?.length > ( Number(maxFiles()) ) ) {
      return createError({
        message: Snacks.fileMaxCount,
        path,
        value:files,
      });
    }
    
    const invalidFiles = files.filter((file) => {
      const fileExtension = file?.name?.split('.').pop().toLowerCase();
      return !allowedExtensions.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((file) => file.name).join(', ');
      return createError({
        message: `Invalid file(s) detected: ${invalidFileNames}`,
        path,
        value:files,
      });
    }
    
    return true;
  }

  if(required){
    return createError({
      message: Snacks.fileRequired,
      path,
      value:files,
    });
  }

  return true;
};

export default validateFileType;
