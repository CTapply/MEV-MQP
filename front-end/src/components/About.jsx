import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';


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

const styles = theme => ({});

/**
 * This is the component for the App
 */
class About extends Component {
  static propTypes = {
    classes: PropTypes.shape({
    }).isRequired,
  }

  asd = () => 123;

  render() {
    return (
      <MuiThemeProvider theme={blueTheme} >
        <div className="About container">
          <div className="row">
            <div className="col-sm-12">
              <h2>About Page</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius purus a commodo congue. Aenean scelerisque rutrum mi, id feugiat sem accumsan et. Proin non lectus vitae nibh bibendum porttitor ac nec ligula. Maecenas lobortis diam non mi scelerisque, vitae suscipit magna placerat. Nam volutpat tristique neque ac varius. Vivamus cursus, augue eget vehicula lacinia, diam mi blandit arcu, at tempor est mauris at neque. Nullam eget dignissim urna. Nulla et mattis elit, vel aliquam nulla.</p>

              <p>Duis at luctus tellus. Donec tempor fringilla massa in varius. Fusce non rutrum nibh. Nunc ut erat leo. Vivamus in lorem id nisi pharetra tincidunt. Phasellus in facilisis nibh. Ut at luctus lacus, nec ullamcorper risus.</p>
            </div>
          </div>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(About);
