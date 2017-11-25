import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Paper from 'material-ui/Paper';
import Dialog, {
  DialogActions,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import styles from './PDFAppStyles';

const blueTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      ...green,
      A400: '#00e677',
    },
    error: red,
  },
});

class PDFApp extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      pdfView: PropTypes.string,
      dialog: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }

  static defaultProps = {
    match: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      reportText: '',
      open: false,
      error: '',
    };
  }

  componentWillMount() {
    this.processID(Number(this.props.match.params.id, 10));
  }

  processID = (id) => {
    if (isNaN(id)) {
      this.setState({ open: true, error: 'No ID found in URL' });
    } else {
      const fetchData = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ primaryid: id }),
      };
      fetch('http://localhost:3001/getreporttext', fetchData)
        .then(response => response.json())
        .then((report) => {
          if (report.rows.length > 0) {
            this.setState({ reportText: report.rows[0].report_text });
          } else {
            this.setState({ open: true, error: `ID ${id} not found in DB` });
          }
        });
    }
  };

  handleChange = (value) => {
    this.setState({ reportText: value });
  }

  handleClose = () => {
    this.setState({ open: false, error: '' });
  };

  render() {
    return (
      <MuiThemeProvider theme={blueTheme} >
        <div className={this.props.classes.pdfView}>
          <Dialog
            open={this.state.open}
            onRequestClose={this.handleClose}
            style={{
              height: '40vh',
              maxWidth: 'none',
            }}
          >
            <DialogTitle>
              <div className={this.props.classes.dialog}>
                <h4>{this.state.error}</h4>
              </div>
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={this.handleClose}
                color={'primary'}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <h1>PDF View</h1>
          <Paper elevation={4}>
            <ReactQuill value={this.state.reportText} onChange={this.handleChange} />
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(PDFApp);
