export default {
  dateSelectedTextField: {
    width: '100%',
    'font-size': '0.8em',
    display: 'none',
  },
  gridContainer: {
    padding: '0px 2px',
    width: '100%',
    margin: '0px',
    height: '100%',
    overflow: 'hidden',
  },
  timelineChartWrapperMaximized: {
    height: 'calc(100% - 4px)',
    width: 'calc(100% - 84px)',
    overflow: 'hidden',
    marginRight: '4px',
  },
  timelineChartMaximized: {
    display: 'inline-block',
    height: 'calc(15vh + 8px)',
    width: '100%',
  },
  reportsButtonWrapperMaximized: {
    height: 'calc(15vh - 4px)',
    width: '80px',
    overflow: 'hidden',
    padding: '0px',
  },
  goToReportsButton: {
    height: '100%',
    width: '100%',
  },
  reportsButtonSVG: {
    width: '80%',
  },
  tooltipStyle: {
    fontSize: '10pt',
    'pointer-events': 'none',
  },
  setDateButton: {
    position: 'absolute',
    zIndex: 800,
    transform: 'translate(3px, 3px)',
    visibility: 'hidden',
  },
  unselectedSetDateButton: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    'animation-duration': '1s',
    'animation-name': 'pulseShadow',
    'animation-iteration-count': 'infinite',
    'animation-direction': 'alternate',
    visibility: 'visible',
  },
  '@keyframes pulseShadow': {
    '0%': {
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .10)',
    },
    '100%': {
      boxShadow: '0 3px 30px 10px rgba(255, 105, 135, .4)',
    },
  },
};
