import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import _ from 'lodash';
import Button from 'material-ui/Button';
import { getReportNarrativeFromID } from '../../actions/reportActions';
import styles from './NarrativeAnnotatorStyles';
import './NarrativeAnnotator.css';

class NarrativeAnnotator extends Component {
  static propTypes = {
    getReportNarrativeFromID: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      pdfView: PropTypes.string,
      editorWindow: PropTypes.string,
      paperWindow: PropTypes.string,
      root: PropTypes.string,
      wrapper: PropTypes.string,
      buttonSuccess: PropTypes.string,
      buttonProgress: PropTypes.string,
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
      snackbarOpen: false,
      snackbarMessage: '',
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

  componentWillMount() {
    this.getTextFromID(Number(this.props.match.params.id, 10));
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
    this.autosave = setInterval(() => this.saveWork(), 10000);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
    clearInterval(this.autosave);
  }

  onUnload = () => this.saveWork();

  getTextFromID = (id) => {
    if (isNaN(id)) {
      this.setState({
        saving: true,
        success: false,
        loading: false,
        snackbarOpen: true,
        snackbarMessage: 'No Valid ID found in the URL',
      });
    } else {
      this.props.getReportNarrativeFromID(id)
        .then((rows) => {
          if (rows.length > 0) {
            this.setState({
              saving: false,
              success: true,
              loading: false,
              current: {
                reportText: rows[0].report_text,
                tags: rows[0].tags,
              },
              saved: {
                reportText: rows[0].report_text,
                tags: rows[0].tags,
              },
            });
          } else {
            this.setState({
              saving: true,
              success: false,
              loading: false,
              snackbarOpen: true,
              snackbarMessage: `ID ${id} not found in DB`,
            });
          }
        });
    }
  }

  saveWork = () => {
    if (!this.state.saving && !_.isEqual(this.state.current, this.state.saved)) {
      this.setState({
        success: false,
        saving: true,
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
          primaryid: Number(this.props.match.params.id, 10),
        }),
      };

      fetch('http://localhost:3001/savereporttext', fetchData)
        .then(() => {
          this.setState({
            saved: this.state.current,
            success: true,
            saving: false,
          });
        })
        .catch(err => console.log(err));
    }
  }

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
    this.setState({ snackbarOpen: false });
  };

  modules = {
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
  };

  render() {
    return (
      <div className={this.props.classes.pdfView}>
        <h1>PDF View</h1>

        {/* ====== Quil editor for Annotating the Report Text ====== */}
        <Paper elevation={4} className={this.props.classes.paperWindow}>
          {
            (!this.state.loading)
              ? <ReactQuill
                value={this.state.current.reportText}
                onChange={this.handleChange}
                modules={this.modules}
                theme="snow"
              />
              : null
          }
        </Paper>

        {/* ====== Save Button Area ====== */}
        <div className={this.props.classes.wrapper}>
          <Button
            raised
            color="primary"
            className={(this.state.success) ? this.props.classes.buttonSuccess : ''}
            disabled={this.state.saving}
            onClick={this.saveWork}
          >
            Save
          </Button>
          {this.state.saving &&
            <CircularProgress
              size={24}
              className={this.props.classes.buttonProgress}
            />}
        </div>

        {/* ====== Snackbar for Notificaitons to the User ====== */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbarOpen}
          transitionDuration={500}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id" style={{ color: 'tomato', fontSize: '14px' }} >{this.state.snackbarMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default connect(
  null,
  { getReportNarrativeFromID },
)(withStyles(styles)(NarrativeAnnotator));

