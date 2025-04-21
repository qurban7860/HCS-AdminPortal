import { Box, Tooltip, Typography } from '@mui/material';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

const PropTypes = require('prop-types');

const ToolPositionsDiagram = ({ componentIndex, tools }) => {
  const { control, watch } = useFormContext();

  // const { fields } = useFieldArray({
  //   control,
  //   name: `components.${componentIndex}.operations`,
  // });

  const currentComponentTotalLength = useWatch({
    control,
    name: `components.${componentIndex}.length`,
  });

  const currentComponentOperations = useWatch({
    control,
    name: `components.${componentIndex}.operations`,
  });

  return (
    <>
      {currentComponentOperations.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Operation Positions
          </Typography>
          <Box
            sx={{
              position: 'relative',
              height: 100,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: 5,
                right: 5,
                top: '50%',
                height: 4,
                bgcolor: '#e0e0e0',
                transform: 'translateY(-50%)',
                px: 2,
              }}
            />
            {currentComponentOperations.map((operation, index) => {
              if (operation.offset === undefined || operation.offset === 0) {
                return null;
              }
              const position = (operation.offset / currentComponentTotalLength) * 100;
              const tool = tools.find((t) => t.value === operation.tool);
              return (
                <Tooltip
                  key={operation.id || index}
                  title={`${tool?.label || 'Operation'} at ${operation.offset}mm`}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${position}%`,
                      top: '50%',
                      width: 12,
                      height: 12,
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      '&:hover': {
                        width: 16,
                        height: 16,
                        bgcolor: 'primary.dark',
                      },
                    }}
                  />
                </Tooltip>
              );
            })}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 5,
                right: 5,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="caption">0</Typography>
              <Typography variant="caption">{currentComponentTotalLength / 2}</Typography>
              <Typography variant="caption">{currentComponentTotalLength}</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

ToolPositionsDiagram.propTypes = {
  componentIndex: PropTypes.number,
  tools: PropTypes.array,
};

export default ToolPositionsDiagram;
