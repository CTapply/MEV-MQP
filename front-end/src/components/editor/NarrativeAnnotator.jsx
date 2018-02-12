import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Paper from 'material-ui/Paper';
import _ from 'lodash';
import Dialog, {
  DialogActions,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import styles from './NarrativeAnnotatorStyles';
import legendImage from './images/legend.png';

class NarrativeAnnotator extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      pdfView: PropTypes.string,
      dialog: PropTypes.string,
      editorWindow: PropTypes.string,
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
      loading: true,
      open: false,
      error: '',
      current: {
        reportText: '',
        tags: [],
      },
      saved: {
        reportText: '',
        tags: [],
      },
    };
  }

  componentDidMount() {
    this.processID(Number(this.props.match.params.id, 10));
    window.addEventListener('beforeunload', this.onUnload);
    this.autosave = setInterval(() => this.saveWork(), 10000);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
    clearInterval(this.autosave);
  }

  onUnload = () => this.saveWork()

  saveWork = () => {
    if (!this.state.saving && !_.isEqual(this.state.current, this.state.saved)) {
      console.log('saving!');
      this.setState({
        success: false,
        saving: true,
      }, () => {
        setTimeout(() => {
          this.setState({
            saving: false,
            success: true,
          });
        }, 2000);
      });
      const fetchData = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.state.current.reportText,
          tags: this.state.current.tags,
          primaryid: Number(this.props.match.params.id, 10) }),
      };
      console.log('done!');
      fetch('http://localhost:3001/savereporttext', fetchData);
      this.setState({ saved: this.state.current });
    }
  }

  processID = (id) => {
    if (isNaN(id)) {
      this.setState({ saving: true, success: false, loading: false, open: true, error: 'No ID found in URL' });
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
              saving: false,
              success: true,
              loading: false,
              current: {
                reportText: report.rows[0].report_text,
                tags: report.rows[0].tags },
              saved: {
                reportText: report.rows[0].report_text,
                tags: report.rows[0].tags },
            });
          } else {
            this.setState({ saving: true, success: false, loading: false, open: true, error: `ID ${id} not found in DB` });
          }
        });
    }
  };

  handleChange = (value) => {
    const greenRe = /background-color: chartreuse/;
    const blueRe = /background-color: cadetblue/;
    const orangeRe = /background-color: darkorange/;
    const yellowRe = /background-color: gold/;
    const pinkRe = /background-color: lightpink/;
    const purpleRe = /background-color: orchid/;
    const silverRe = /background-color: silver/;
    const cyanRe = /background-color: cyan/;
    const newTags = {};
    if (greenRe.exec(value)) {
      newTags.greenTag = 't';
    }
    if (cyanRe.exec(value)) {
      newTags.cyanTag = 't';
    }
    if (orangeRe.exec(value)) {
      newTags.redTag = 't';
    }
    if (yellowRe.exec(value)) {
      newTags.yellowTag = 't';
    }
    if (pinkRe.exec(value)) {
      newTags.pinkTag = 't';
    }
    if (purpleRe.exec(value)) {
      newTags.purpleTag = 't';
    }
    if (silverRe.exec(value)) {
      newTags.silverTag = 't';
    }
    if (blueRe.exec(value)) {
      newTags.blueTag = 't';
    }
    this.setState({ success: false, current: { reportText: value, tags: newTags } });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const modules = { modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: ['chartreuse', 'cyan', 'darkorange', 'gold', 'lightpink', 'orchid', 'silver', 'cadetblue'] }],
        ['clean'],
      ],
      history: {
        delay: 500,
        maxStack: 500,
        userOnly: true,
      },
    } };

    const buttonClassname = classNames({
      [this.props.classes.buttonSuccess]: this.state.success,
    });

    return (
      <div className={`${this.props.classes.pdfView} container`}>
      <div className="row">
      <div className="col-sm-8">
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
        <Paper elevation={4} className={this.props.classes.paperWindow}>
          {this.state.loading ? null : <ReactQuill
            className={this.props.classes.editorWindow}
            readOnly={this.state.error !== ''}
            value={this.state.current.reportText}
            onChange={this.handleChange}
            modules={modules.modules}
          /> }
        </Paper>
        <div className={this.props.classes.wrapper}>
          <Button
            raised
            color="primary"
            className={buttonClassname}
            disabled={this.state.saving}
            onClick={this.saveWork}
          >
            Save
          </Button>
          {this.state.saving && this.state.error === '' &&
            <CircularProgress
              size={24}
              className={this.props.classes.buttonProgress}
            />}
        </div>
        </div>
        <div className="col-sm-4">
        <h1>Legend</h1>
        <Paper elevation={4} className={`${this.props.classes.legend}`}>
          <img src={legendImage} className='img-responsive' />
        </Paper>
        </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(NarrativeAnnotator);

