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
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import QuillEditor from '../../editor/components/QuillEditor';
import Switch from 'material-ui/Switch';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
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
      .then(bins => {
        this.props.setReportCount(bins.length)
        this.setState({ data: bins });
      });
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
          this.props.setReportCount(bins.length)
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
    {
      title: 'Narrative',
      name: 'report_text',
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
    report_text: 200,
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
      <div className="col-sm-12" style={{ marginBottom: '15px' }}>
        <div style={{ marginTop: '10px' }}>
          <ExpansionPanel elevation={6}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography type="subheading">Preview Narrative</Typography>
            </ExpansionPanelSummary>
            <Divider light />
            <ExpansionPanelDetails style={{ display: 'block' }}>
              <Link href="/" to={`/pdf/${row.row.primaryid}`} target="_blank">
                <Button raised color="primary">Go to Report Text</Button>
              </Link>
              <br />
              <div style={{ marginTop: '10px', fontSize: '14px', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: row.row.report_text }} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
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
