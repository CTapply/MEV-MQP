import MEVColors from '../theme';

export default {
  topNavigationContainer: {
    margin: '0px',
    width: '100%',
    'background-color': MEVColors.navBar,
    zIndex: 500,
    border: 'none',
    position: 'relative',
  },
  wpiLogoContainer: {
    position: 'absolute',
    bottom: '30px',
    left: '0px',
    right: '0px',
    padding: '30px 30px 15px 30px',
    textAlign: 'center',
  },
  drawerClass: {
    'background-color': MEVColors.navBarSlide,
    color: '#fff',
  },
  logo: {
    'font-family': "'Montserrat', sans-serif",
    'font-size': '32px',
    color: '#fff !important',
    'font-weight': '700',
  },
  drawerToggleContainer: {
  },
  buttonClass: {
    'padding-top': '5px',
    'margin-top': '5px',
    'background-color': '#fff',
  },
  listItem: {
    'font-size': '16px !important',
  },
  listLink: {
    color: '#fff !important',
  },
  drawerHeader: {
    padding: '15px',
  },
  SelectedFilters: {
    transform: 'translateY(1px)',
    marginLeft: '100px',
    marginRight: '100px',
  },
  TotalCountBox: {
    padding: '0px',
    display: 'inline-block',
    width: '100px',
    height: '37px',
    margin: '4px',
  },
};
