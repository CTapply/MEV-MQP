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
    height: 'calc(100% + 3px)',
  },
  timelineChartWrapperMinimized: {
    height: 'calc(100% - 4px)',
    width: 'calc(100% - 60px)',
    margin: '0px 4px',
    overflow: 'visible',
  },
  reportsButtonWrapperMaximized: {
    height: 'calc(100% - 4px)',
    width: '50px',
    overflow: 'hidden',
    padding: '0px',
  },
  goToReportsButton: {
    height: '100%',
    width: '100%',
    padding: '0px',
    justifyContent: 'left',
  },
  reportsButtonSVG: {
    width: '35%',
    transform: 'translateX(40%)',
  },
  tooltipStyle: {
    fontSize: '10pt',
    'pointer-events': 'none',
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
