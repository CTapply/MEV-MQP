import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  SortingState, SelectionState, FilteringState, GroupingState, PagingState,
  LocalFiltering, LocalGrouping, LocalSorting, LocalPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTableView, TableHeaderRow, TableFilterRow, TableSelection, TableGroupRow,
  GroupingPanel, DragDropContext, TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import styles from '../ReportContainerStyles';

class ReportTable extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      primaryid: '',
      data: [],
    };
  }

  componentDidMount() {
    this.makeData();
  }

getRowId = row => row.primaryid;

columns = [
  {
    title: 'Event Date',
    name: 'init_fda_dt',
  },
  {
    title: 'Primary ID',
    name: 'primaryid',
  },
  {
    title: 'Case ID',
    name: 'caseid',
  },
  {
    title: 'Case Version',
    name: 'caseversion',
  },
  {
    title: 'Age',
    name: 'age_year',
  },
  {
    title: 'Sex',
    name: 'sex',
  },
  {
    title: 'Weight',
    name: 'wt_lb',
  },
  {
    title: 'Drugs',
    name: 'drugname',
  },
  {
    title: 'Medication Error',
    name: 'me_type',
  },
  {
    title: 'Outcome',
    name: 'outc_cod',
  },
];

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
      this.setState({ data: reports.rows });
    });
};

handleClick = (ev) => {
  console.log(ev);
}

render() {
  return (
    <div>
      <Grid
        rows={this.state.data}
        columns={this.columns}
        getRowId={this.getRowId}
      >
        <DragDropContext />
        <SortingState />
        <GroupingState />
        <PagingState
          defaultCurrentPage={0}
          defaultPageSize={10}
        />
        <LocalSorting />
        <LocalGrouping />
        <LocalPaging />
        <SelectionState
          defaultSelection={[1, 3, 18]}
        />
        <VirtualTableView />
        <TableHeaderRow allowSorting />
        <TableColumnReordering defaultOrder={this.columns.map(column => column.name)} />
        <TableGroupRow />
      </Grid>
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
