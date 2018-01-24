export default {
  mainVisualization: {
    height: 'calc(65vh - 52px)',
    margin: 'auto',
    padding: '10px 10px 0px 10px',
    transition: 'height 200ms ease-in-out',
  },
  treemapVisualization: {
    height: '25%',
    overflow: 'visible',
    display: 'block',
  },
  treePaper: {
    'vertical-align': 'middle',
    display: 'inline-block',
  },
  clearFilterChip: {
    'font-size': '9pt',
    height: '14pt',
    right: '0px',
    transform: 'translateY(5px) translateX(-15px)',
    'box-shadow': '2px 5px 5px 0 rgba(0,0,0,0.3)',
    position: 'absolute',
    'z-index': 100,
  },
  chipAvatar: {
    height: '11pt',
    width: '11pt',
    transform: 'translateX(3px)',
  },
};
