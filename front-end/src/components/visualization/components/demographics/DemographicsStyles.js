export default {
  gridContainer: {
    padding: '0px 2px',
    width: '100%',
    height: '20vh',
    margin: '0px',
    overflow: 'visible',
    transition: 'height 200ms ease-in-out',
  },
  gridContainerMinimized: {
    height: '5vh',
    overflow: 'visible',
  },
  minimizeButton: {
    width: '25px',
    height: '25px',
    minHeight: '20px',
    position: 'absolute',
    right: '2px',
    top: 'calc(20% + 25px)',
    transition: 'top 200ms ease-in-out',
    zIndex: 900,
  },
  minimizeButtonMinimized: {
    top: 'calc(5% + 25px)',
  },
  maxHeight: {
    height: '100%',
  },
};
