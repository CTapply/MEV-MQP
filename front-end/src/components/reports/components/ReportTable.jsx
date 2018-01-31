import React from 'react';
import PropTypes from 'prop-types';
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
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import _ from 'lodash';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { moveReport, getCaseReports } from '../../../actions/reportActions';

const styles = {};

/**
 * This is the component for the Report Table
 */
class ReportTable extends React.PureComponent {
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
      anchorEl: null,
      selectedIndex: 0,
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
    this.props.getCaseReports(this.props.filters, this.props.bin, this.props.userID)
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
      this.props.getCaseReports(this.props.filters, this.props.bin, this.props.userID)
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

  /**
   * Default widths for the columns of the table
   */
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

  /**
   * Sends a backend request to move a report from one bin to another
   */
  handleMoveReport = (primaryid, toBin) => {
    this.props.moveReport(primaryid, this.props.bin, toBin, this.props.userID).then(() =>
      this.props.getCaseReports(this.props.filters, this.props.bin, this.props.userID)
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
   * Handler for drop down menu click
   */
  handleClickListItem = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  /**
   * Handler for drop down menu item click
   */
  handleMenuItemClick = (event, index, primaryid) => {
    this.setState({ selectedIndex: 0, anchorEl: null });
    this.handleMoveReport(primaryid, this.props.bins[index].toLowerCase());
  };

  /**
   * Handler for drop down menu closing
   */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /**
   * Defines the html content inside each expandable dropdown area for each row
   * of the table
   */
  detailRowContent = row => (
    <div>
      <Link href="/" to={`/pdf/${row.row.primaryid}`} target="_blank">
        <Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go to report text</Button>
      </Link>
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
            onClick={(event) => {
              this.handleMenuItemClick(event, index, row.row.primaryid);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>)

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
)(withStyles(styles)(ReportTable));
