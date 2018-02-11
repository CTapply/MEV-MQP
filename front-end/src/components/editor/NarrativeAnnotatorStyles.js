import green from 'material-ui/colors/green';
import grey from 'material-ui/colors/grey';

export default {
  pdfView: {
    width: '75%',
    height: '75%',
    margin: 'auto',
    padding: '10px',
  },
  paperWindow: {
    height: 'calc(77% + 44px)',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: 10,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: grey[400],
    '&:hover': {
      backgroundColor: grey[500],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    marginTop: -12,
    marginLeft: 5,
  },
};
