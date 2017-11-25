import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  constructor(props) {
    super(props);
    this.state = {
      reportText: 'Loading...',
    };
  }

  componentWillMount() {
    this.processID(this.props.match.params.id);
  }

  processID = (id) => {
    if (typeof id === 'undefined') {
      this.setState({ reportText: 'No ID found in URL' });
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
            this.setState({ reportText: 'ID not found in DB' });
          }
        });
    }
  };

  handleChange = (value) => {
    this.setState({ reportText: value });
  }

  render() {
    return (
      <MuiThemeProvider theme={blueTheme} >
        <div className="ReportView">
          <h1>PDF View</h1>
          <ReactQuill value={this.state.reportText} onChange={this.handleChange} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default PDFApp;
