import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import styles from '../ReportContainerStyles';

class ReportTable extends Component {
  constructor() {
    super();
    this.state = {
      data: this.makeData(),
    };
  }

  asd = () => 123;
  range = (len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(i);
    }
    return arr;
  };

newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: 'test',
    lastName: 'test',
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? 'relationship'
        : statusChance > 0.33 ? 'complicated' : 'single',
  };
};

makeData = () => {
  const leng = 5355;
  return (this.range(leng).map(d => ({
    ...this.newPerson(),
    children: this.range(10).map(this.newPerson),
  })));
};
render() {
  const { data } = this.state;
  return (
    <div>
      <ReactTable
        data={data}
        columns={[
          {
            Header: 'Name',
            columns: [
              {
                Header: 'First Name',
                accessor: 'firstName',
              },
              {
                Header: 'Last Name',
                id: 'lastName',
                accessor: d => d.lastName,
              },
            ],
          },
          {
            Header: 'Info',
            columns: [
              {
                Header: 'Age',
                accessor: 'age',
              },
              {
                Header: 'Status',
                accessor: 'status',
              },
            ],
          },
          {
            Header: 'Stats',
            columns: [
              {
                Header: 'Visits',
                accessor: 'visits',
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

export default withStyles(styles)(ReportTable);
