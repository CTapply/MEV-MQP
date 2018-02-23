import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  RowDetailState, SortingState, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  DragDropProvider,
  TableColumnReordering,
  TableRowDetail,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import CaseIcon from '../../../resources/CaseIcon';
import { moveReport, getCaseReports } from '../../../actions/reportActions';

const styles = {};

/**
 * This is the component for the Report Table
 */
class UserReportTable extends React.PureComponent {
  static propTypes = {
    getCaseReports: PropTypes.func.isRequired,
    moveReport: PropTypes.func.isRequired,
    bins: PropTypes.arrayOf(PropTypes.string).isRequired,
    filters: PropTypes.shape({
      init_fda_dt: PropTypes.object,
      sex: PropTypes.array,
      occr_country: PropTypes.array,
      age: PropTypes.array,
      occp_cod: PropTypes.array,
      meType: PropTypes.array,
      product: PropTypes.array,
      stage: PropTypes.array,
      cause: PropTypes.array,
    }).isRequired,
    bin: PropTypes.string.isRequired,
    userID: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      expandedRows: [],
    };

    this.changeExpandedDetails = (expandedRows) => {
      this.setState({ expandedRows });
    };
  }

  /**
   * Sends fetch request to retrieve list of reports to be shown in table
   */
  componentDidMount() {
    this.props.getCaseReports(this.props.bin, this.props.userID, {})
      .then(bins => this.setState({
        data: bins,
      }));
  }

  /**
   * Checks if the selected bin in the ReportList component changes and retrieves
   * new list of reports if necessary
   */
  componentDidUpdate(prevProps) {
    if (prevProps.bin !== this.props.bin || !_.isEqual(this.props.filters, prevProps.filters)) {
      this.props.getCaseReports(this.props.bin, this.props.userID, {})
        .then((bins) => {
          this.setState({ data: bins });
          this.changeExpandedDetails([]);
        });
    }
  }

  /**
   * Names and values for the columns of the table
   */
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

  /**
   * Default widths for the columns of the table
   */
  columnWidths = {
    init_fda_dt: 80,
    primaryid: 80,
    caseid: 80,
    caseversion: 50,
    drugname: 100,
    me_type: 100,
    outc_cod: 75,
  };

  /**
   * Sends a backend request to move a report from one bin to another
   */
  handleMoveReport = (primaryid, toBin) => {
    this.props.moveReport(primaryid, this.props.bin, toBin, this.props.userID).then(() =>
      this.props.getCaseReports(this.props.bin, this.props.userID, {})
        .then(bins => this.setState({
          data: bins,
        })));
    if (this.props.bin !== 'all reports' || toBin === 'trash') {
      const newExpandedRows = this.state.expandedRows;
      newExpandedRows.splice(this.state.expandedRows.indexOf(primaryid.toString()), 1);
      this.changeExpandedDetails(newExpandedRows);
    }
  };

  /**
   * Defines the html content inside each expandable dropdown area for each row
   * of the table
   */
  detailRowContent = row => (
    <div>
      <Paper
        elevation={6}
        style={{
          backgroundColor: '#fefefe', width: 'fit-content', display: 'inline-block', transform: 'translateY(-20%)', marginTop: '10px', marginBottom: '5px',
        }}
      >
        <Link href="/" to={`/pdf/${row.row.primaryid}`} target="_blank">
          <Button raised className="cal-button" color="primary">Go to report text</Button>
        </Link>
      </Paper>
      <div className={this.props.classes.sendToCaseContainer}>
        <Paper elevation={6} className={this.props.classes.moveToCaseDetailsContainer} >
          <Typography type="button" style={{ padding: '15px' }}>
          Send Report to:
          </Typography>
          {this.props.bins.map((binName, index) => (
            <Button
              flat="true"
              key={binName}
              className={this.props.classes.caseGridList}
              onClick={() => {
                this.handleMoveReport(row.row.primaryid, this.props.bins[index].toLowerCase());
              }}
            >
              <div>
                <CaseIcon width={45} height={45} />
                <Typography style={{ display: 'block' }} type="subheading">
                  {binName}
                </Typography>
              </div>
            </Button>
          ))}
        </Paper>
      </div>
    </div>
  )

  render() {
    return (
      <Grid
        id="test2"
        rows={this.state.data}
        columns={this.columns}
        getRowId={row => row.primaryid}
      >
        <RowDetailState
          expandedRows={this.state.expandedRows}
          onExpandedRowsChange={this.changeExpandedDetails}
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
        <TableColumnReordering defaultOrder={this.columns.map(column => column.name)} />
        <TableRowDetail
          contentComponent={this.detailRowContent}
        />
      </Grid>
    );
  }
}


const mapStateToProps = state => ({
  filters: state.filters,
  userID: state.user.userID,
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  { moveReport, getCaseReports },
)(withStyles(styles)(UserReportTable));
