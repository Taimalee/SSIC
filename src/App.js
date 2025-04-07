import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Slider, 
  Button, 
  Paper,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import axios from 'axios';

const StyledSlider = styled(Slider)({
  color: '#1976d2',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
  },
});

function App() {
  const [soilMoisture, setSoilMoisture] = useState(50);
  const [temperature, setTemperature] = useState(20);
  const [sunlight, setSunlight] = useState(50);
  const [tabValue, setTabValue] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/calculate', {
        soil_moisture: soilMoisture,
        temperature: temperature,
        sunlight: sunlight
      });
      
      if (response.data.status === 'success') {
        setRecommendation(response.data.watering_time);
      } else {
        setError('Failed to calculate watering time');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error calculating watering time:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" color="primary" gutterBottom>
        Smart Soil Irrigation Controller
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Optimize your watering schedule based on soil conditions, temperature, and sunlight using
        our advanced fuzzy logic algorithm.
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {/* Left Panel - Soil Conditions */}
        <Paper sx={{ flex: 2, p: 3, minWidth: 300 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Soil Conditions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adjust the sliders to match your current garden conditions
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WaterDropIcon color="primary" sx={{ mr: 1 }} />
              <Typography>Soil Moisture</Typography>
              <Tooltip title="Measure of soil water content">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <StyledSlider
              value={soilMoisture}
              onChange={(e, value) => setSoilMoisture(value)}
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${value}%`}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ThermostatIcon color="primary" sx={{ mr: 1 }} />
              <Typography>Temperature</Typography>
              <Tooltip title="Current ambient temperature">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <StyledSlider
              value={temperature}
              onChange={(e, value) => setTemperature(value)}
              min={0}
              max={40}
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${value}°C`}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WbSunnyIcon color="primary" sx={{ mr: 1 }} />
              <Typography>Sunlight Intensity</Typography>
              <Tooltip title="Current sunlight level">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <StyledSlider
              value={sunlight}
              onChange={(e, value) => setSunlight(value)}
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${value}%`}
            />
          </Box>

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleCalculate}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Watering Time'}
          </Button>
        </Paper>

        {/* Right Panel - Recommendation and How It Works */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Recommendation
            </Typography>
            {error ? (
              <Typography color="error">{error}</Typography>
            ) : recommendation !== null ? (
              <>
                <Typography variant="h4" align="center" sx={{ my: 3 }}>
                  Recommended Watering Time
                </Typography>
                <Typography variant="h2" color="primary" align="center" sx={{ mb: 3 }}>
                  {recommendation} min
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Water your plants for {recommendation} minutes based on current conditions.
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Enter your soil conditions and click calculate to get a recommendation.
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              How It Works
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Overview" />
                <Tab label="Algorithm" />
              </Tabs>
            </Box>
            <Box sx={{ py: 2 }}>
              {tabValue === 0 ? (
                <>
                  <Typography variant="body2" paragraph>
                    Our smart irrigation system uses environmental data to determine optimal watering times, conserving water while keeping your plants healthy.
                  </Typography>
                  <Typography variant="body2">
                    The system considers soil moisture, temperature, and sunlight intensity to make intelligent watering decisions.
                  </Typography>
                </>
              ) : (
                <Typography variant="body2">
                  The system uses fuzzy logic to process multiple environmental factors and determine the ideal watering duration based on expert-defined rules and relationships.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center" 
        sx={{ mt: 4 }}
      >
        © 2025 Smart Soil Irrigation System | Conserving water, one garden at a time
      </Typography>
    </Container>
  );
}

export default App; 