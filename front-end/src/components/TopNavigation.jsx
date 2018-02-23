import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { setUserInfo } from '../actions/userActions';
import CurrentlySelectedFilters from './components/CurrentlySelectedFilters';
import styles from './TopNavigationStyles';
import { toggleSexFilter, toggleAgeFilter, toggleLocationFilter, toggleOccupationFilter } from '../actions/demographicActions';
import { toggleMETypeFilter, toggleProductFilter, toggleStageFilter, toggleCauseFilter } from '../actions/visualizationActions';
import { setSelectedDate } from '../../src/actions/timelineActions';

class TopNavigation extends Component {
  static propTypes = {
    setUserInfo: PropTypes.func.isRequired,
    totalCount: PropTypes.number.isRequired,
    classes: PropTypes.shape({
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { open: false, left: false };
  }

  logout = (event) => {
    event.preventDefault();
    this.props.setUserInfo(false, '', -1);
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  formatNumberWithCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  handleClearFilters = () => {
    this.props.toggleSexFilter('CLEAR');
    this.props.toggleAgeFilter('CLEAR');
    this.props.toggleLocationFilter('CLEAR');
    this.props.toggleOccupationFilter('CLEAR');
    this.props.toggleMETypeFilter('CLEAR');
    this.props.toggleProductFilter('CLEAR');
    this.props.toggleStageFilter('CLEAR');
    this.props.toggleCauseFilter('CLEAR');
    this.props.setSelectedDate({
      startDate: 20170316,
      endDate: 20170331,
    });
  }

  render = () => (
    <div className={this.props.classes.topNavigationContainer}>
      <nav className={`${this.props.classes.topNavigationContainer} navbar navbar-default`}>
        <div className="container-fluid">
          <div className="pull-left">
            <div>
              <Button onClick={this.toggleDrawer('left', true)} className={this.props.classes.buttonClass}><i className="material-icons">menu</i></Button>
              <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)} SlideProps={{ className: this.props.classes.drawerClass }}>
                <div
                  tabIndex={0}
                  role="button"
                  onClick={this.toggleDrawer('left', false)}
                  onKeyDown={this.toggleDrawer('left', false)}
                >
                  <div className={this.props.classes.drawerHeader}>
                    <h2>Hello, welcome!</h2>
                  </div>
                  <Divider style={{ backgroundColor: 'rgb(255,255,255)' }} />
                  <List>
                    <Link to="/dashboard" className={this.props.classes.listLink}>
                      <ListItem button >
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography style={{ fontSize: '16px', color: '#fff' }}>
                            Dashboard
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Link>
                    <Link to="/visualization" className={this.props.classes.listLink}>
                      <ListItem button >
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography style={{ fontSize: '16px', color: '#fff' }}>
                            Visualizations
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Link>
                    <Link to="/report" className={this.props.classes.listLink}>
                      <ListItem button >
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography style={{ fontSize: '16px', color: '#fff' }}>
                            Reports
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Link>
                    <Link to="/about" className={this.props.classes.listLink}>
                      <ListItem button >
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography style={{ fontSize: '16px', color: '#fff' }}>
                            About
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Link>
                    {!this.props.isLoggedIn ? (
                      <Link to="/" className={this.props.classes.listLink}>
                        <ListItem button >
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography style={{ fontSize: '16px', color: '#fff' }}>
                                Login
                              </Typography>
                            }
                          />
                        </ListItem>
                      </Link>
                    ) : (
                      <Link to="/" onClick={this.logout} className={this.props.classes.listLink}>
                        <ListItem button >
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography style={{ fontSize: '16px', color: '#fff' }}>
                                Logout
                              </Typography>
                            }
                          />
                        </ListItem>
                      </Link>
                    )
                    }
                  </List>
                  <Divider style={{ backgroundColor: 'rgb(255,255,255)' }} />
                </div>
              </Drawer>
            </div>
          </div>
          <div className="navbar-header pull-right">
            <a className={`${this.props.classes.logo} navbar-brand`} href="/">
              MEV
            </a>
          </div>
          <div className={this.props.classes.SelectedFilters} >
            <Paper className={this.props.classes.TotalCountBox} elevation={4} >
              <Typography type="body1" align="center" style={{ lineHeight: '1.4rem' }} >
                Report Count
              </Typography>
              <Typography type="subheading" align="center" style={{ lineHeight: '1.4rem' }} >
                {this.formatNumberWithCommas(this.props.totalCount)}
              </Typography>
            </Paper>
            <Paper className={this.props.classes.TotalCountBox} style={{ transform: 'translateY(-9px)'}} elevation={4} >
              <Button style={{ fontSize: '11px', padding: '2px', height: '100%', width: '100%', backgroundColor: '#FFE6D2', border: 'solid 1px #F42D1F' }} onClick={this.handleClearFilters} >
                Clear All Filters
              </Button>
            </Paper>
            <CurrentlySelectedFilters />
          </div>
        </div>
      </nav>
    </div>
  )
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  totalCount: state.demographic.totalCount,
});

export default connect(
  mapStateToProps,
  {
    setUserInfo,
    toggleSexFilter,
    toggleAgeFilter,
    toggleLocationFilter,
    toggleOccupationFilter,
    toggleMETypeFilter,
    toggleProductFilter,
    toggleStageFilter,
    toggleCauseFilter,
    setSelectedDate,
  },
)(withStyles(styles)(TopNavigation));
