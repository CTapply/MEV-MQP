import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getTagsinCase, getReportsInCases, getCaseNameByID } from '../../actions/reportActions';

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
      reportsInCase: [],
      pieChartData: [],
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
      }, () => {
        this.props.getReportsInCases(this.props.userID, this.state.caseName)
          .then(reports => this.setState({
            reportsInCase: reports,
          }, () => {
            this.getReportTypeData();
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

  COLORS = {
    supportive: '#0088FE',
    primary: '#FFBB28',
  };

  render() {
    return (
      <div>
        <p> Case Details </p>
        <p> Case ID: {Number(this.props.caseID, 10)} </p>
        <p> Case Name: {this.state.caseName} </p>
        <p> User ID: {Number(this.props.userID, 10)} </p>
        <p> URL PARAM: {Number(this.props.match.params.id, 10)} </p>
        <p> TAGS: {JSON.stringify(this.state.tags)} </p>
        {/* <p> Reports: {JSON.stringify(this.state.reportsInCase)} </p> */}
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

