import green from 'material-ui/colors/green';

export default {
  pdfView: {
    width: '100vw',
    height: '100vh',
    margin: 'auto',
    padding: '10px',
  },
  dialog: {
    width: '100%',
    padding: '0px 20px 0px 20px',
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
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
};
