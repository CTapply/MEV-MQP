export default {
  dateSelectedTextField: {
    width: '100%',
    'font-size': '0.8em',
  },
  gridContainer: {
    padding: '0px 2px',
    width: '100%',
    margin: '0px',
    height: '100%',
    overflow: 'hidden',
  },
  timelineChartMinimized: {
    display: 'inline-block',
    width: '100%',
    height: 'calc(5vh - 1px)',
  },
  calendarWrapperMinimized: {
    height: 'calc(5vh - 4px)',
    width: '94px',
    overflow: 'hidden',
    marginLeft: '4px',
    padding: '4px',
  },
  timelineChartWrapperMinimized: {
    height: 'calc(100% - 4px)',
    width: 'calc(100% - 106px)',
    margin: '0px 4px',
    overflow: 'visible',
  },
  '@keyframes pulseShadow': {
    '0%': {
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .10)',
    },
    '100%': {
      boxShadow: '0 3px 30px 10px rgba(255, 105, 135, .4)',
    },
  },
  nonSetDateButton: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    'animation-duration': '1s',
    'animation-name': 'pulseShadow',
    'animation-iteration-count': 'infinite',
    'animation-direction': 'alternate',
  },
};
