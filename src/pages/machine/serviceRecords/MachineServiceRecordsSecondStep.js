import React from 'react'
import PropTypes from 'prop-types';
import { Box, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import { RHFTextField } from '../../../components/hook-form';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/default-constants';
import CollapsibleCheckedItemInputRow from './CollapsibleCheckedItemInputRow';

MachineServiceRecordsSecondStep.propTypes = {
    checkItemLists: PropTypes.array,
    handleChangeCheckItemListDate: PropTypes.func,
    handleChangeCheckItemListValue: PropTypes.func,
    handleChangeCheckItemListStatus: PropTypes.func,
    handleChangeCheckItemListChecked: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
    handleChangeCheckItemListComment: PropTypes.func,
};

function MachineServiceRecordsSecondStep( { 
    checkItemLists, 
    handleChangeCheckItemListDate, 
    handleChangeCheckItemListValue,  
    handleChangeCheckItemListStatus,
    handleChangeCheckItemListChecked,
    handleChangeCheckItemListCheckBoxValue,
    handleChangeCheckItemListComment,
} ) {

    const { isLoadingCheckItems } = useSelector((state) => state.serviceRecordConfig);

  return (
    <>


<RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline/> 
                    
                    {checkItemLists?.length > 0 && <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}

                    {isLoadingCheckItems ? 
                    <Box sx={{ width: '100%',mt:1 }}>
                      <Skeleton />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation={false} />
                    </Box>
                    :<>
                    {checkItemLists?.map((row, index) =>
                          ( typeof row?.checkItems?.length === 'number' &&
                            <CollapsibleCheckedItemInputRow 
                              key={index}
                              row={row} 
                              index={index} 
                              checkItemLists={checkItemLists} 
                              handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                              handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                              handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                              handleChangeCheckItemListChecked={handleChangeCheckItemListChecked}
                              handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                              handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                              machineId
                              serviceId
                            />
                          ))}
                      </>
                    }

                    <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline/> 

    </>
)
}

export default MachineServiceRecordsSecondStep