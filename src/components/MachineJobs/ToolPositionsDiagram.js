import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';

import { StyledTooltip } from '../../theme/styles/default-styles';

const generateRandomColor = (seed) => {
  const hash = String(seed)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0) * 31, 0);

  const randomFactor = Math.sin(hash) * 10000;
  const h = Math.abs(Math.floor((randomFactor * 360) % 360));
  const s = 50 + Math.abs(Math.floor((randomFactor * 50) % 50));
  const l = 40 + Math.abs(Math.floor((randomFactor * 30) % 30));

  return `hsl(${h}, ${s}%, ${l}%)`;
};

const ToolPositionsDiagram = ({ tools, unitOfLength }) => {
  const theme = useTheme();
  const { control } = useFormContext();

  const toolColorMap = useMemo(() => {
    if (!tools?.length) return {};

    const colorMap = {};
    const themeColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
    ];

    tools.forEach((tool, index) => {
      if (index < themeColors.length) {
        colorMap[tool.value] = themeColors[index];
      } else {
        colorMap[tool.value] = generateRandomColor(tool.value);
      }
    });

    return colorMap;
  }, [tools, theme]);

  const getUnitLabel = () => {
    switch (unitOfLength) {
      case 'MILLIMETRE':
        return 'mm';
      case 'INCH':
        return 'in';
      default:
        return 'units';
    }
  };

  const currentComponentTotalLength = useWatch({
    control,
    name: 'length',
  });

  const currentComponentOperations = useWatch({
    control,
    name: 'operations',
  });

  const allToolOperationOffsets = useMemo(() => {
    if (!currentComponentOperations?.length) return [];

    return currentComponentOperations
      .filter((op) => op?.offset && op?.operationType)
      .flatMap((op) => {
        const offsets = op.offset
          .split(',')
          .map((offset) => offset.trim())
          .map((offset) => parseFloat(offset))
          .filter(
            (numericOffset) =>
              !Number.isNaN(numericOffset) && numericOffset <= currentComponentTotalLength
          );

        return offsets.map((numericOffset) => ({
          operationType: op.operationType,
          offset: numericOffset,
        }));
      });
  }, [currentComponentOperations, currentComponentTotalLength]);

  const usedTools = useMemo(() => {
    if (!currentComponentOperations?.length || !tools?.length) return [];

    const usedToolIds = new Set(
      currentComponentOperations.filter((op) => op.operationType).map((op) => op.operationType)
    );
    return tools.filter((tool) => usedToolIds.has(tool.label));
  }, [currentComponentOperations, tools]);

  return (
    <>
      {currentComponentOperations?.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Operation Positions
          </Typography>
          <Box
            sx={{
              position: 'relative',
              height: 120,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: 2,
              px: 4,
              userSelect: 'none',
            }}
          >
            <Box sx={{ position: 'relative', height: '100%' }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  height: 30,
                  bgcolor: '#e0e0e0',
                  transform: 'translateY(-50%)',
                  px: 2,
                }}
              />
              {allToolOperationOffsets.map((operation, index) => {
                if (operation.offset === undefined || operation.offset === 0) {
                  return null;
                }
                const position = (operation.offset / currentComponentTotalLength) * 100;
                const tool = tools.find((t) => t.label === operation.operationType);
                const toolColor =
                  toolColorMap[tool.value] || theme.palette.primary.main;

                return (
                  <StyledTooltip
                    key={operation.id || index}
                    title={`${tool?.label || 'Operation'} at ${operation.offset}${getUnitLabel()}`}
                    placement="top"
                    disableFocusListener
                    tooltipcolor={toolColor}
                    color={toolColor}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${position}%`,
                        top: '10%',
                        width: 14,
                        height: 14,
                        bgcolor: toolColor,
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        '&:hover': {
                          width: 18,
                          height: 18,
                          bgcolor: toolColor,
                          opacity: 0.8,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: '50%',
                          top: '100%',
                          width: 0,
                          height: 45,
                          borderLeft: '2px dotted',
                          borderColor: toolColor,
                          transform: 'translateX(-50%)',
                        },
                      }}
                    />
                  </StyledTooltip>
                );
              })}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 15,
                  cursor: 'default',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    left: 0,
                    transform: 'translateX(-50%)',
                  }}
                >
                  0
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {currentComponentTotalLength / 2}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    right: 0,
                    transform: 'translateX(50%)',
                  }}
                >
                  {currentComponentTotalLength}
                </Typography>
              </Box>
            </Box>
          </Box>

          {usedTools.length > 0 && (
            <Box
              sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}
            >
              {usedTools.map((tool) => (
                <Box key={tool.value} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: toolColorMap[tool.value] || theme.palette.primary.main,
                      borderRadius: '50%',
                    }}
                  />
                  <Typography variant="caption">{tool.label}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

ToolPositionsDiagram.propTypes = {
  tools: PropTypes.array,
  unitOfLength: PropTypes.string,
};

export default ToolPositionsDiagram;
