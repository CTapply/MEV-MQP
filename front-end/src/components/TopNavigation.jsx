import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { setUserInfo } from '../actions/userActions';
import CurrentlySelectedFilters from './components/CurrentlySelectedFilters';
import wpiLogo from '../resources/wpi-logo.png';
import styles from './TopNavigationStyles';
import { toggleSexFilter, toggleAgeFilter, toggleLocationFilter, toggleOccupationFilter } from '../actions/demographicActions';
import { toggleMETypeFilter, toggleProductFilter, toggleStageFilter, toggleCauseFilter } from '../actions/visualizationActions';
import { setSelectedDate } from '../../src/actions/timelineActions';
import ClearFilterIcon from '../resources/clearFilterIcon.svg';

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
    window.location = '/';
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
                    <h2>Navigation Panel</h2>
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
                <div className={`${this.props.classes.wpiLogoContainer}`} >
                  <img src={wpiLogo} className={`${this.props.classes.wpiLogoClass} img-responsive`} />
                  <Link to="/about" className={this.props.classes.listLink}>
                    <Typography style={{
 fontSize: '12px', color: '#fff', marginTop: '15px', display: 'inline-block',
}}
                    >
                      About&nbsp;
                    </Typography>
                  </Link>
                  <Typography style={{
 fontSize: '12px', color: '#fff', marginTop: '15px', display: 'inline-block',
}}
                  >
                      | &copy; 2018
                  </Typography>
                </div>
              </Drawer>
            </div>
          </div>
          <div className="navbar-header pull-right">
            <a className={`${this.props.classes.logo} navbar-brand`} href="/">
              MEV
            </a>
          </div>
          {this.props.showFilters ? 
          <div className={this.props.classes.SelectedFilters} >
            <Paper className={this.props.classes.TotalCountBox} elevation={4} >
              <Typography type="body1" align="center" style={{ lineHeight: '1.4rem' }} >
                Report Count
              </Typography>
              <Typography type="subheading" align="center" style={{ lineHeight: '1.4rem' }} >
                {this.formatNumberWithCommas(this.props.totalCount)}
              </Typography>
            </Paper>
            <CurrentlySelectedFilters />
            <Paper className={`${this.props.classes.filterPaper} pull-right`} elevation={4}>
              <Chip
                avatar={<Avatar src={ClearFilterIcon} alt="Clear Filters" className={this.props.classes.chipAvatar} />}
                onClick={this.handleClearFilters}
                className={this.props.classes.clearFilterChip}
                style={{ transform: `translateY(-5px) translateX(${100 - 13}px)` }}
                classes={{ label: this.props.classes.chipLabel }}
              />
              <Typography type="subheading" align="center" style={{ lineHeight: '2.3rem' }} >
                Clear Filters
              </Typography>
            </Paper>
          </div>
          : null}
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
