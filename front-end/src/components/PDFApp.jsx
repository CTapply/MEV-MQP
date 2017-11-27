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
      open: false,
      error: '',
      current: {
        reportText: '',
        tag1: '',
      },
      saved: {
        reportText: '',
        tag1: '',
      },
    };
  }

  componentWillMount() {
    this.processID(Number(this.props.match.params.id, 10));
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
    this.autosave = setInterval(() => this.saveWork(), 5000);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
    clearInterval(this.autosave);
  }

  onUnload = () => this.saveWork()

  saveWork = () => {
    console.log(this.state.saved.reportText !== this.state.current.reportText ||
    this.state.saved.tag1 !== this.state.current.tag1);
    if (this.state.saved.reportText !== this.state.current.reportText ||
      this.state.saved.tag1 !== this.state.current.tag1) {
      const fetchData = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.state.current.reportText,
          tag1: this.state.current.tag1,
          primaryid: Number(this.props.match.params.id, 10) }),
      };
      fetch('http://localhost:3001/savereporttext', fetchData);
      this.setState({ saved: this.state.current });
    }
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
            this.setState({
              current: {
                reportText: report.rows[0].report_text,
                tag1: report.rows[0].tag1 },
              saved: {
                reportText: report.rows[0].report_text,
                tag1: report.rows[0].tag1,
              },
            });
          } else {
            this.setState({ open: true, error: `ID ${id} not found in DB` });
          }
        });
    }
  };

  handleChange = (value) => {
    console.log('update');
    const greenTag = /background-color: green/;
    const redTag = /background-color: red/;
    const blueTag = /background-color: blue/;
    let g = false;
    if (greenTag.exec(value)) {
      g = true;
      console.log('there is green highlighted');
    }
    if (redTag.exec(value)) {
      console.log('there is red highlighted');
    }
    if (blueTag.exec(value)) {
      console.log('there is blue highlighted');
    }
    this.setState({ current: { reportText: value, tag1: g } });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const modules = { modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: ['white', 'red', 'green', 'blue'] }],
        ['clean'],
      ],
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true,
      },
    } };

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
            <ReactQuill
              theme="snow"
              readOnly={this.state.error !== ''}
              value={this.state.current.reportText}
              onChange={this.handleChange}
              modules={modules.modules}
            />
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(PDFApp);
