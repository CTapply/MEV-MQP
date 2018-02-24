import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';
import { getTagsinCase, getReportsInCases, getCaseNameByID } from '../../actions/reportActions';
import annotationColors from '../editor/components/AnnotationColors';
import MEVColors from '../../theme';

const styles = {};

class CaseSummary extends Component {
  static propTypes = {
    getTagsinCase: PropTypes.func.isRequired,
    getReportsInCases: PropTypes.func.isRequired,
    getCaseNameByID: PropTypes.func.isRequired,
    caseID: PropTypes.number,
    userID: PropTypes.number.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }

  static defaultProps = {
    caseID: null,
    match: {
      params: {
        id: null,
      },
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      tags: {},
      caseName: '',
      caseDescription: '',
      reportsInCase: [],
      pieChartData: [],
      barChartData: [],
    };
  }

  componentWillMount() {
    this.props.getTagsinCase(this.props.caseID)
      .then((tags) => {
        const combinedTags = tags.reduce((acc, row) => {
          Object.keys(row.tags).forEach((key) => {
            acc[key] = (acc[key]) ? acc[key].concat(row.tags[key]) : row.tags[key];
          });
          return acc;
        }, {});

        this.setState({
          tags: { ...combinedTags },
        });
      });

    this.props.getCaseNameByID(this.props.caseID)
      .then(rows => this.setState({
        caseName: (rows[0] ? rows[0].name : ''),
        caseDescription: (rows[0] ? rows[0].description : ''),
      }, () => {
        this.props.getReportsInCases(this.props.userID, this.state.caseName)
          .then(reports => this.setState({
            reportsInCase: reports,
          }, () => {
            this.getReportTypeData();
            this.getTagData();
          }));
      }));
  }

  getReportTypeData = () => {
    const typeObject = this.state.reportsInCase.reduce((acc, report) => {
      acc[report.type] = (acc[report.type]) ? acc[report.type] + 1 : 1;
      return acc;
    }, {});

    const pieChartData = Object.keys(typeObject).reduce((acc, key) => {
      return acc.concat({ name: key.toUpperCase(), value: typeObject[key] });
    }, []);

    this.setState({
      pieChartData,
    });
  }

  getTagData = () => {
    const barChartData = Object.keys(this.state.tags).reduce((acc, key) => {
      return acc.concat({ name: key.toUpperCase(), count: this.state.tags[key].length });
    }, []);

    this.setState({
      barChartData,
    });
  }

  /**
   * Changes the first letter of any word in a string to be capital
   * BEING REUSED IN ReportListing.jsx NEED TO DEAL WITH THIS LATER ! DUPLICATE METHODS
   */
  toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  COLORS = {
    supportive: '#0088FE',
    primary: '#FFBB28',
  };

  renderBarChart = () => ((this.state.barChartData.length > 0)
    ? (
      <ResponsiveContainer width="100%" height={300} >
        <BarChart
          data={this.state.barChartData}
          layout="vertical"
        >
          <XAxis dataKey="count" type="number" />
          <YAxis dataKey="name" type="category" width={100}/>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            // content={<CustomTooltip />}
            offset={15}
            cursor={{ stroke: '#424242', strokeWidth: 1 }}
            wrapperStyle={{ padding: '4px', zIndex: 1000 }}
            isAnimationActive={false}
          />
          <Bar dataKey="count" stroke="#444" >
            {
              this.state.barChartData.map(entry =>
                <Cell key={entry} fill={annotationColors[entry.name.toLowerCase()]} />)
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
    : null);

  renderPieChart = () => ((this.state.pieChartData.length > 0)
    ? (
      <ResponsiveContainer width="100%" height={200} >
        <PieChart width={200} height={200}>
          <Legend />
          <Pie
            data={this.state.pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={60}
            fill="#82ca9d"
            paddingAngle={1}
            label
            legendType="circle"
          >
            {
              this.state.pieChartData.map((entry, index) =>
                <Cell key={entry} fill={this.COLORS[entry.name.toLowerCase()]} />)
            }
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
    : null);


  render() {
    return (
      <div style={{ width: '100%' }} >
        <Typography type="display1">
          Case Details:
        </Typography>
        <br />
        <Typography type="headline">
          {this.toTitleCase(this.state.caseName)}
        </Typography>
        <Typography type="button">
          {this.state.caseDescription}
        </Typography>
        <Typography type="body1">
          Total Count of Reports: {this.state.reportsInCase.length}
        </Typography>
        {this.renderBarChart()}
        {this.renderPieChart()}
      </div>
    );
  }
}


const mapStateToProps = state => ({
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
  { getTagsinCase, getReportsInCases, getCaseNameByID },
)(withStyles(styles)(CaseSummary));

