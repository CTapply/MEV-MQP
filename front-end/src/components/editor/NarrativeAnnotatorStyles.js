import green from 'material-ui/colors/green';
import grey from 'material-ui/colors/grey';

export default {
  pdfView: {
    width: '75vw',
    height: '75vh',
    margin: 'auto',
    padding: '10px',
  },
  dialog: {
    width: '100%',
    padding: '0px 2000px 0px 20px',
  },
  editorWindow: {
    height: '77vh',
  },
  paperWindow: {
    height: 'calc(77vh + 45px)',
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
