import ReactGA from 'react-ga';
ReactGA.initialize('UA-38981959-1');

exports.onRouteUpdate = (state, page, pages) => {
  ReactGA.pageview(state.pathname);
};
