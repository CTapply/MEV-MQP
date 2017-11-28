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
      data: [], // this.makeData(),
    };
  }

  componentDidMount() {
    this.makeData();
  }
  // range = (len) => {
  //   const arr = [];
  //   for (let i = 0; i < len; i++) {
  //     arr.push(i);
  //   }
  //   return arr;
  // };

// newPerson = () => {
//   const statusChance = Math.random();
//   return {
//     firstName: 'test',
//     lastName: 'test',
//     age: Math.floor(Math.random() * 30),
//     visits: Math.floor(Math.random() * 100),
//     progress: Math.floor(Math.random() * 100),
//     status:
//       statusChance > 0.66
//         ? 'relationship'
//         : statusChance > 0.33 ? 'complicated' : 'single',
//   };
// };

makeData = () => {
  // const leng = 5355;
  // return (this.range(leng).map(d => ({
  //   ...this.newPerson(),
  //   children: this.range(10).map(this.newPerson),
  // })));
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
      console.log(reports);
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
                accessor: 'firstName',
              },
              {
                Header: 'Primary ID',
                id: 'lastName',
                accessor: d => d.lastName,
              },
              {
                Header: 'Case ID',
              },
              {
                Header: 'Case Version',
              },
            ],
          },
          {
            Header: 'Demographics',
            columns: [
              {
                Header: 'Age',
                accessor: 'age',
              },
              {
                Header: 'Sex',
                accessor: 'status',
              },
              {
                Header: 'Weight',
              },
            ],
          },
          {
            Header: 'Stats',
            columns: [
              {
                Header: 'Drugs',
                accessor: 'visits',
              },
              {
                Header: 'Medication Error',
              },
              {
                Header: 'Outcome',
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
