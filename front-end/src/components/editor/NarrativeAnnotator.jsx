import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import 'react-quill/dist/quill.snow.css';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import QuillEditor from './components/QuillEditor';
import styles from './NarrativeAnnotatorStyles';

class NarrativeAnnotator extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      pdfView: PropTypes.string,
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
      snackbarOpen: false,
      snackbarMessage: '',
    };
  }

  handleClose = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    return (
      <div className={`${this.props.classes.pdfView} container`}>
        <div className="row">
          <div className="col-sm-12">
            <h1>PDF View</h1>
            <QuillEditor match={this.props.match} />
          </div>
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
  null,
)(withStyles(styles)(NarrativeAnnotator));

