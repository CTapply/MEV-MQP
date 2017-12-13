import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  RowDetailState, SortingState, LocalSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTableView,
  TableHeaderRow,
  TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import _ from 'lodash';

const styles = {};

class ReportTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      primaryid: '',
      data: [],
    };
  }

  componentDidMount() {
    this.makeData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.bin !== this.props.bin || !_.isEqual(this.props.filters, prevProps.filters)) {
      this.makeData();
      console.log(`bin: ${this.props.bin}`);
    }
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

handleMove = (primaryid) => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      primaryid,
      bin: this.props.bin === '' ? 'trash' : '',
      userID: this.props.userID,
    }),
  };
  console.log(fetchData);
  fetch('http://localhost:3001/binreport', fetchData)
    .then(() => this.makeData());
};

detailRowContent = row => (<div>
  <Link to={`/pdf/${row.row.primaryid}`} target="_blank"><Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go to report text</Button></Link>
  <Button
    style={{ margin: 12 }}
    raised
    className="cal-button"
    color="primary"
    onClick={() => this.handleMove(row.row.primaryid)}
  >
    {this.props.bin === 'trash' ? 'Remove from Trash bin' : 'Move to Trash bin'}
  </Button>
</div>)

render() {
  return (
    <div>
      <Grid
        rows={this.state.data}
        columns={this.columns}
      >
        <RowDetailState />
        <SortingState />
        <LocalSorting />
        <VirtualTableView />
        <TableHeaderRow allowSorting />
        <TableRowDetail
          template={this.detailRowContent}
        />
      </Grid>
    </div>
  );
}
}


const mapStateToProps = state => ({
  filters: state.filters,
  userID: state.user.userID,
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(ReportTable));
