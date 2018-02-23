import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import _ from 'lodash';
import { moveReport, getCaseReports, getReportNarrativeFromID, getReportsInCases } from '../../../actions/reportActions';
import QuillEditor from '../../editor/components/QuillEditor';
import ClearFilterIcon from '../../../resources/RemoveFromCaseIcon';
import CaseIcon from '../../../resources/CaseIcon';
import TrashIcon from '../../../resources/TrashIcon';
import styles from './ReportTableStyles';
import './ReportTable.css';

/**
 * This is the component for the Report Table
 */
class ReportTable extends React.PureComponent {
  static propTypes = {
    getCaseReports: PropTypes.func.isRequired,
    moveReport: PropTypes.func.isRequired,
    getReportNarrativeFromID: PropTypes.func.isRequired,
    getReportsInCases: PropTypes.func.isRequired,
    toTitleCase: PropTypes.func.isRequired,
    summaryOpen: PropTypes.bool.isRequired,
    bins: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    classes: PropTypes.shape({
      tableContainer: PropTypes.string,
      moveToCaseDetailsContainer: PropTypes.string,
      caseGridList: PropTypes.string,
      sendToCaseContainer: PropTypes.string,
      largeDetailRow: PropTypes.string,
      smallDetailRow: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      expandedRows: [],
      tableHeight: 0,
      stillResizingTimer: '',
      currentlyInCase: [],
      snackbarOpen: false,
      snackbarMessage: '',

      /**
       * Default widths for the columns of the table
       */
      widths: {
        init_fda_dt: 85,
        primaryid: 90,
        caseid: 80,
        caseversion: 95,
        age_year: 50,
        sex: 50,
        wt_lb: 65,
        drugname: 200,
        me_type: 180,
        outc_cod: 85,
        report_text: 200,
      },

      /**
       * Custom Sorting Functions
       */
      customSorting: [
        { columnName: 'init_fda_dt', compare: this.sortNumbers },
        { columnName: 'primaryid', compare: this.sortNumbers },
        { columnName: 'caseid', compare: this.sortNumbers },
        { columnName: 'caseversion', compare: this.sortNumbers },
        { columnName: 'age_year', compare: this.sortNumbers },
        { columnName: 'sex', compare: this.sortText },
        { columnName: 'wt_lb', compare: this.sortNumbers },
        { columnName: 'drugname', compare: this.sortText },
        { columnName: 'me_type', compare: this.sortText },
        { columnName: 'outc_cod', compare: this.sortText },
        { columnName: 'report_text', compare: this.sortText },
      ],
    };
  }

  /**
   * Sends fetch request to retrieve list of reports to be shown in table
   */
  componentWillMount() {
    this.props.getCaseReports(this.props.bin, this.props.userID)
      .then(bins => this.setState({
        data: bins,
      }));

    this.updateHighlightedRows();
  }

  componentDidMount() {
    this.resizeTable();

    // Listen for window resize, but wait till they have stopped to do the size calculations.
    window.addEventListener('resize', this.resizeTimer);
  }

  /**
   * Checks if the selected bin in the ReportList component changes and retrieves
   * new list of reports if necessary
   */
  componentDidUpdate(prevProps) {
    if (prevProps.bin !== this.props.bin || !_.isEqual(this.props.filters, prevProps.filters)) {
      this.props.getCaseReports(this.props.bin, this.props.userID)
        .then((bins) => {
          this.setState({ data: bins });
          this.changeExpandedDetails([]);
        });
    }
  }

  componentWillUnmount() {
    // Remove the event listeners when unmounting
    window.removeEventListener('resize', this.resizeTimer);
  }

  /**
   * Updates the column widths
   */
  onColumnWidthsChange = (widths) => {
    this.setState({ widths });
  }

  /**
   * Gets the report narrative for a given primaryid
   */
  getReportNarrative = (primaryid) => {
    this.props.getReportNarrativeFromID(primaryid)
      .then((rows) => {
        if (rows.length > 0) {
          return `${rows[0].report_text}`;
        }
        return 'Unable to Retrieve Narrative';
      });
  };

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
    {
      title: 'Narrative',
      name: 'report_text',
    },
  ];

  /**
   * Sets what rows are expanded in the table
   */
  changeExpandedDetails = (expandedRows) => {
    this.setState({ expandedRows });
  };

  updateHighlightedRows = () => {
    this.props.getReportsInCases(this.props.userID)
      .then(primaryids => this.setState({
        currentlyInCase: primaryids.reduce((acc, row) => {
          const caseNames = (acc[row.primaryid])
            ? acc[row.primaryid].concat(row.name)
            : [row.name];
          return ({
            ...acc,
            [row.primaryid]: caseNames,
          });
        }, {}),
      }));
  }

  /**
   * After 100ms of not resizing, we will then resize the graph (this improves performance)
   */
  resizeTimer = () => {
    clearTimeout(this.state.stillResizingTimer);
    this.setState({ stillResizingTimer: setTimeout(this.resizeTable, 100) });
  }

  /**
   * Compare functions for strings sorting
   */
  sortText = (a, b) => ((a < b) ? -1 : 1)

  /**
   * Compare functions for number sorting
   */
  sortNumbers = (a, b) => ((Number(a) < Number(b)) ? -1 : 1)

  /**
   * Handler to close the SnackBar
   */
  handleCloseSnackbar = () => {
    this.setState({ snackbarOpen: false });
  };

  /**
   * Sends a backend request to move a report from one bin to another
   */
  handleMoveReport = (primaryid, toBin) => {
    this.props.moveReport(primaryid, this.props.bin, toBin, this.props.userID)
      .then(() =>
        this.props.getCaseReports(this.props.bin, this.props.userID)
          .then(reports => this.setState({ data: reports }))
          .then(() => {
            this.updateHighlightedRows();
            this.setState({
              snackbarOpen: true,
              snackbarMessage: `Report ${primaryid} Moved to ${this.props.toTitleCase(toBin)}`,
            });
          }));
    if (this.props.bin !== 'all reports' || toBin === 'trash') {
      const newExpandedRows = this.state.expandedRows;
      newExpandedRows.splice(this.state.expandedRows.indexOf(primaryid.toString()), 1);
      this.changeExpandedDetails(newExpandedRows);
      this.updateHighlightedRows();
    }
  };

  /**
   * Calculate the size of the table
   */
  resizeTable = () => {
    const container = document.getElementById('table-container');
    const containerHeight = window.getComputedStyle(container, null).getPropertyValue('height');
    this.setState({
      tableHeight: parseInt(containerHeight || 800, 10),
      stillResizingTimer: '',
    });
  }

  /**
   * This returns the table Row component with the added background color
   * if the report is in any case for the current user
   */
  TableRow = ({ row, ...props }) => {
    const backgroundColor =
      (this.state.currentlyInCase[props.tableRow.rowId] && this.props.bin === 'all reports')
        ? 'RGBA(131, 255, 168, 0.2)'
        : '';
    return (
      <VirtualTable.Row
        {...props}
        style={{
          backgroundColor,
        }}
      />
    );
  };

  renderMoveToIcon = (binName, greyOutCaseIcon) => {
    switch (binName) {
      case 'Trash':
        return (
          <div>
            <TrashIcon />
            <Typography style={{ display: 'block' }} type="subheading">
              {binName}
            </Typography>
          </div>
        );
      case 'All Reports':
        return (
          <div>
            <ClearFilterIcon />
            <Typography style={{ display: 'block' }} type="subheading">
              Remove From Case
            </Typography>
          </div>
        );
      default:
        return (
          <div>
            {(greyOutCaseIcon)
              ? <CaseIcon width={45} height={45} style={{ filter: 'grayscale(100%)' }} />
              : <CaseIcon width={45} height={45} />}
            <Typography style={{ display: 'block' }} type="subheading">
              {binName}
            </Typography>
          </div>
        );
    }
  }

  /**
   * Defines the html content inside each expandable dropdown area for each row
   * of the table
   */
  renderDetailRowContent = row => (
    <div className={(this.props.summaryOpen) ? this.props.classes.smallDetailRow : this.props.classes.largeDetailRow} >
      <Paper elevation={6} style={{ width: 'fit-content', display: 'inline-block', transform: 'translateY(-20%)' }} >
        <Link href="/" to={`/pdf/${row.row.primaryid}`} target="_blank">
          <Button raised className="cal-button" color="primary">Go to report text</Button>
        </Link>
      </Paper>
      <div className={this.props.classes.sendToCaseContainer}>
        <Typography style={{ position: 'absolute', fontSize: '14px', transform: 'translateX(3px) translateY(3px)' }} type="button">
          Send Report to:
        </Typography>
        <Paper elevation={6} className={this.props.classes.moveToCaseDetailsContainer} >
          {this.props.bins.map((bin, index) => (
            (this.props.bin.toLowerCase() !== bin.name.toLowerCase())
              ? (
                <Button
                  flat="true"
                  key={bin.case_id}
                  className={this.props.classes.caseGridList}
                  onClick={() => {
                    this.handleMoveReport(
                      row.row.primaryid,
                      this.props.bins[index].name.toLowerCase(),
                    );
                  }}
                >
                  {(this.state.currentlyInCase[row.row.primaryid]
                  && this.state.currentlyInCase[row.row.primaryid].includes(bin.name.toLowerCase()))
                    ? this.renderMoveToIcon(bin.name, true)
                    : this.renderMoveToIcon(bin.name)}
                </Button>
              )
            : null
          ))}
        </Paper>
      </div>
      <div style={{ marginTop: '10px' }}>
        <ExpansionPanel elevation={6}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography type="subheading">Preview Narrative</Typography>
          </ExpansionPanelSummary>
          <Divider light />
          <ExpansionPanelDetails>
            <QuillEditor primaryid={Number(row.row.primaryid, 10)} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </div>
  )

  render() {
    return (
      <Paper id="table-container" className={this.props.classes.tableContainer} elevation={4}>
        {(this.state.tableHeight !== 0 && this.state.stillResizingTimer === '')
          ? (
            <Grid
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
              <IntegratedSorting
                columnExtensions={this.state.customSorting}
              />
              <VirtualTable rowComponent={this.TableRow} height={this.state.tableHeight} />
              <TableColumnResizing
                columnWidths={this.state.widths}
                onColumnWidthsChange={this.onColumnWidthsChange}
              />
              <TableHeaderRow showSortingControls />
              <TableColumnReordering defaultOrder={this.columns.map(column => column.name)} />
              <TableRowDetail
                contentComponent={this.renderDetailRowContent}
              />
            </Grid>
            )
          : null
        }

        {/* ====== Snackbar for Notificaitons to the User ====== */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackbarOpen}
          onClose={this.handleCloseSnackbar}
          transitionDuration={300}
          autoHideDuration={3000}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <span id="message-id" style={{ color: 'LightGreen' }} >{this.state.snackbarMessage}</span>
          }
        />
      </Paper>
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
  {
    moveReport,
    getCaseReports,
    getReportNarrativeFromID,
    getReportsInCases,
  },
)(withStyles(styles)(ReportTable));
