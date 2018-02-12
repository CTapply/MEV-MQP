import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import MEVColors from '../../theme';

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      ...blue,
      500: MEVColors.buttonLight,
      700: MEVColors.buttonHover,
    },
    secondary: {
      ...green,
    },
    ...MEVColors,
    error: red,
  },
});

const styles = theme => ({});

/**
 * This is the component for the About Page
 */
class About extends Component {
  static propTypes = {
    classes: PropTypes.shape({
    }).isRequired,
  }

  asd = () => 123;

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="About container">
          <div className="row">
            <div className="col-sm-12">
              <h2>About Page</h2>
              <h3>Medication Error and Adverse Reaction Trend Visualizer</h3>
              <p>The Medication Error and Adverse Reaction trend visualizer compiles medication error and adverse reaction reports and visualizes them in a way that is easy to analyze and manipulate. The proposed layout for the interface below.</p>

              <p>The layout consists of three main sections. The center portion of the interface contains tree-mappings that display information about the selected reports. A majority of the interface is dedicated to this visualization because it holds the most significant data, which users can use to extrapolate trends. On the left side of the interface is the demographics bar which contains visualizations for the gender, age, and location breakdowns of selected reports. The lower section of the layout consists of two time-based tools- the timeline and calendar. The timeline displays how many reports were filed in a given week and changes color depending on the severity of those reports. When a time frame is selected, the visualizations in the timeline and demographics sections change accordingly to reflect the updated information. All of the sections are interactive and update dynamically to changes made in other parts of the interface.</p>
            </div>
          </div>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(About);
