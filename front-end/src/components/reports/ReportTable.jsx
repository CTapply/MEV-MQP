import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import styles from '../ReportContainerStyles';

class ReportTable extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.makeData();
  }

makeData = () => { 
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...this.props.filters,
    }),
  };
  console.log(fetchData);
  fetch('http://localhost:3001/getreports', fetchData)
    .then(response => response.json())
    .then((reports) => {
      console.log(reports.rows);
      this.setState({ data: reports.rows });
    });
};

render() {
  const { data } = this.state;
  return (
    <div>
      {console.log(this.props.filters)}
      <ReactTable
        data={data}
        columns={[
          {
            Header: 'Case Information',
            columns: [
              {
                Header: 'Event Date',
                accessor: 'init_fda_dt',
              },
              {
                Header: 'Primary ID',
                accessor: 'primaryid',
              },
              {
                Header: 'Case ID',
                accessor: 'caseid',
              },
              {
                Header: 'Case Version',
                accessor: 'caseversion',
              },
            ],
          },
          {
            Header: 'Demographics',
            columns: [
              {
                Header: 'Age',
                accessor: 'age_year',
              },
              {
                Header: 'Sex',
                accessor: 'sex',
              },
              {
                Header: 'Weight',
                accessor: 'wt_lb',
              },
            ],
          },
          {
            Header: 'Stats',
            columns: [
              {
                Header: 'Drugs',
                accessor: 'drugname',
              },
              {
                Header: 'Medication Error',
                accessor: 'me_type',
              },
              {
                Header: 'Outcome',
                accessor: 'outc_cod',
              },
            ],
          },
        ]}
        defaultPageSize={10}
        className="-striped -highlight"
      />
      <br />
    </div>
  );
}
}


const mapStateToProps = state => ({
  filters: state.filters,
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(ReportTable));
