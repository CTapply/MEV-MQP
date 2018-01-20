import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  RowDetailState, SortingState, IntegratedSorting, IntegratedSelection, SelectionState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  DragDropProvider,
  TableColumnReordering,
  TableSelection,
  TableRowDetail,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import { moveReport, getCaseReports } from '../../../actions/reportActions';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import _ from 'lodash';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';

const styles = {};

class ReportTable extends React.PureComponent {
  static defaultProps = {
    bins: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      primaryid: '',
      data: [],
      anchorEl: null,
      selectedIndex: 0,
    };
  }

  componentDidMount() {
    this.temp();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.bin !== this.props.bin || !_.isEqual(this.props.filters, prevProps.filters)) {
      this.makeData();
      console.log(`bin: ${this.props.bin}`);
    }
  }

getRowId = row => row.primaryid;

temp = () => {
  this.props.getCaseReports(this.props.filters, this.props.bin, this.props.userID)
    .then(bins => this.setState({
      data: bins,
    }));
}

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

columnWidths = {
  init_fda_dt: 80,
  primaryid: 80,
  caseid: 80,
  caseversion: 50,
  age_year: 50,
  sex: 50,
  wt_lb: 50,
  drugname: 100,
  me_type: 100,
  outc_cod: 75,
};

makeData = () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...this.props.filters,
      bin: this.props.bin,
      userID: this.props.userID,
    }),
  };
  console.log(fetchData);
  fetch('http://localhost:3001/getreports', fetchData)
    .then(response => response.json())
    .then((reports) => {
      this.setState({ data: reports.rows });
    });
};

handleMove = (primaryid, toBin) => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      primaryid,
      fromBin: this.props.bin,
      toBin,
      userID: this.props.userID,
    }),
  };
  console.log(fetchData);
  fetch('http://localhost:3001/binreport', fetchData)
    .then(() => this.makeData());
};

// detailRowContent = row => (<div>
//   <Link to={`/pdf/${row.row.primaryid}`} target="_blank"><Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go to report text</Button></Link>
//   {this.props.bins.map(bin => {
//     return <Button style={{ margin: 12 }} raised key={`${bin}`} className={'bin-button'} color="primary" onClick={() => this.handleMove(row.row.primaryid, bin.toLowerCase())}> Move to {bin}</Button>
//   })}
// </div>)


  handleClickListItem = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleMenuItemClick = (event, index, primaryid) => {
    this.setState({ selectedIndex: index, anchorEl: null });
    this.handleMove(primaryid, this.props.bins[index].toLowerCase());
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  detailRowContent = row => (<div>
    <Link href="/" to={`/pdf/${row.row.primaryid}`} target="_blank"><Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go to report text</Button></Link>
    <List>
      <ListItem
        button
        aria-haspopup="true"
        aria-controls="lock-menu"
        aria-label="Move to Bin"
        onClick={this.handleClickListItem}
      >
        <ListItemText
          primary={this.props.bins[this.state.selectedIndex]}
          secondary="Move to Bin"
        />
      </ListItem>
    </List>
    <Menu
      id="lock-menu"
      anchorEl={this.state.anchorEl}
      open={Boolean(this.state.anchorEl)}
      onClose={this.handleClose}
    >
      {this.props.bins.map((option, index) => (
        <MenuItem
          key={option}
          selected={index === this.state.selectedIndex}
          onClick={event => this.handleMenuItemClick(event, index, row.row.primaryid)}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  </div>)


  render() {
    return (
      <Paper elevation={15} className="paperbby" >
        <Grid
          id="test2"
          rows={this.state.data}
          columns={this.columns}
          getRowId={this.getRowId}
        >
          <RowDetailState
            expandedRowIds={[]}
            defaultExpandedRowIds={[]}
          />
          <DragDropProvider />
          <SortingState
            defaultSorting={[
            { columnName: 'Event Date', direction: 'asc' },
          ]}
          />
          <IntegratedSorting />
          <VirtualTable />
          <TableColumnResizing columnWidths={this.columnWidths} />
          <TableHeaderRow showSortingControls />
          <SelectionState />
          <IntegratedSelection />
          <TableColumnReordering defaultOrder={this.columns.map(column => column.name)} />
          <TableSelection showSelectAll />
          <TableRowDetail
            contentComponent={this.detailRowContent}
          />
        </Grid>
      </Paper>
    );
  }
}


const mapStateToProps = state => ({
  filters: state.filters,
  userID: state.user.userID,
});

export default connect(
  mapStateToProps,
  { moveReport, getCaseReports },
)(withStyles(styles)(ReportTable));
