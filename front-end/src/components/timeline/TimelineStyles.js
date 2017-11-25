export default {
  dateSelectedTextField: {
    width: '100%',
    'font-size': '0.8em',
  },
  gridContainer: {
    padding: '0px 2px',
    width: '100%',
    margin: '0px',
    height: '15vh',
    overflow: 'hidden',
  },
  timelineChartWrapper: {
    height: 'calc(15vh - 8px)',
    overflow: 'hidden',
  },
  timelineChart: {
    display: 'inline-block',
    width: '100%',
    height: 'calc(15vh + 3px)',
  },
  calendartWrapper: {
    height: 'calc(15vh - 8px)',
    overflow: 'hidden',
    padding: '8px',
  },
  '@keyframes pulseShadow': {
    from: {
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .10)',
    },
    to: {
      boxShadow: '0 3px 15px 10px rgba(255, 105, 135, .4)',
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
