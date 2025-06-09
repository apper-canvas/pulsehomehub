import Home from '../pages/Home';
import Browse from '../pages/Browse';
import MapView from '../pages/MapView';
import Favorites from '../pages/Favorites';
import PropertyDetail from '../pages/PropertyDetail';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home,
    showInNav: false
  },
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Search',
    component: Browse,
    showInNav: true
  },
  mapView: {
    id: 'mapView',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView,
    showInNav: true
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    icon: 'Heart',
    component: Favorites,
    showInNav: true
  },
  propertyDetail: {
    id: 'propertyDetail',
    label: 'Property Detail',
    path: '/property/:id',
    icon: 'Home',
    component: PropertyDetail,
    showInNav: false
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
    component: NotFound,
    showInNav: false
  }
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => route.showInNav);