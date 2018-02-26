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
    zIndex: '10002',
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
  filterPaper: {
    padding: '0px',
    display: 'inline-block',
    width: '100px',
    height: '100%',
    margin: '4px',
    transform: 'translateY(5px)',
  },
  clearFilterChip: {
    'font-size': '9pt',
    height: '14pt',
    position: 'absolute',
  },
  chipAvatar: {
    height: '13pt',
    width: '13pt',
    transform: 'translateX(1px)',
    'box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.3)',
  },
  chipLabel: {
    paddingLeft: '6px',
    paddingRight: '0px',
  },
  TotalCountBox: {
    padding: '0px',
    display: 'inline-block',
    width: '100px',
    height: '37px',
    margin: '4px',
  },
};
