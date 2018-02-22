import green from 'material-ui/colors/green';
import grey from 'material-ui/colors/grey';

export default {
  pdfView: {
    width: '100%',
    height: '75%',
    margin: 'auto',
    padding: '10px',
  },
  dialog: {
    width: '100%',
    padding: '0px 20px 0px 20px',
  },
  editorWindow: {
    height: '60vh',
  },
  paperWindow: {
    height: 'calc(77% + 44px)',
  },
  legend: {
    width: '20vw',
    height: '66vh',
    padding: '1px',
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
