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
                    {!this.props.isLoggedIn ? (
                      <Link to="/login" className={this.props.classes.listLink}>
                        <ListItem button >
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography style={{ fontSize: '16px', color: '#fff' } }>
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
                              <Typography style={{ fontSize: '16px', color: '#fff' } }>
                                Logout
                              </Typography>
                            }
                          />
                        </ListItem>
                      </Link>
                    )
                    }
                    <Link to="/" className={this.props.classes.listLink}>
                      <ListItem button >
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography style={{ fontSize: '16px', color: '#fff' } }>
                            Visualizations
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
                            <Typography style={{ fontSize: '16px', color: '#fff' } }>
                            About
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
                            <Typography style={{ fontSize: '16px', color: '#fff' } }>
                            Reports
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Link>
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
  { setUserInfo },
)(withStyles(styles)(TopNavigation));
