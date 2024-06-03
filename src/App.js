import Home from './pages/home/Home';
import './App.scss';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layout/Layout';
import News from './pages/news/News';
import About from './pages/about/About';
import Partners from './pages/partners/Partners';
import PersonOfInterest from './pages/personofInterest/PersonOfInterest';
import Author from './pages/author/Author';
import SearchResult from './pages/searchResult/SearchResult';
import Donate from './pages/donate/Donate';
import Button2Page from './pages/button2Page/Button2Page';
import Shop from './pages/shop/Shop';
import AuthLayout from './layout/AuthLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Posts from './pages/posts/Posts';
import UsersPage from './pages/usersPage/UsersPage';
import LoginPage from './pages/loginPage/LoginPage';
import HeaderItems from './pages/header/HeaderItems';
import FooterItems from './pages/footer/FooterItems';
import CreateEditUser from './pages/createEditUser/CreateEditUser';
import transformPath from './utils/transformPath';
import { useRouteContext } from './context/route/RouteProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import CreateEditPost from './pages/createEditPost/CreateEditPost';
import SingleNews from './pages/singleNews/SingleNews';
import SortPersons from './pages/sortPersons/SortPersons';
import SoonPage from './pages/soonPage/SoonPage';
import PersonEditPage from './pages/personEditPage/PersonEditPage';
import IpVisitorPage from './pages/ipVisitorPage/IpVisitorPage';
import { PreviewState } from './context/previewContext/PreviewState';
import PreviewAuthor from './pages/previewAuthor/PreviewAuthor';
import PreviewNewsAndPage from './pages/previewNewsAndPage/PreviewNewsAndPage';
import { ThemeContext } from './context/theme/ThemeContext';
import { useContext } from 'react';
import MaintenancePage from './pages/maintenancePage/MaintenancePage';

function App() {
  const { state } = useRouteContext();
  const { maintenance } = useContext(ThemeContext);
  const { headersData } = state;
  const { routes, buttons } = headersData;
  const location = useLocation();
  /*  const { isAuthenticated } = useAuthContext(); */

  // Check if the current path starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Render maintenance page for non-admin routes if in maintenance mode
  if (maintenance === 0 && !isAdminRoute) {
    return <MaintenancePage />;
  } else
    return (
      <PreviewState>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route
              path={transformPath(routes.person)}
              element={<PersonOfInterest />}
            />
            <Route path={transformPath(routes.news)} element={<News />} />
            <Route path={transformPath(routes.about)} element={<About />} />
            <Route
              path={transformPath(`${routes.news}/:slug`)}
              element={<SingleNews />}
            />
            <Route path={transformPath(routes.soon)} element={<SoonPage />} />

            <Route
              path={transformPath(routes.partners)}
              element={<Partners />}
            />
            <Route
              path={transformPath(buttons.button2)}
              element={<Button2Page />}
            />
            <Route path={transformPath(buttons.button1)} element={<Donate />} />
            <Route path='/search' element={<SearchResult />} />
            <Route path='/person/:id' element={<Author />} />
            <Route path='/person/:id/:title' element={<Author />} />
            <Route path='/shop' element={<Shop />} />
          </Route>
          <Route path='/admin' element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='posts' element={<Posts />} />
              <Route path='users' element={<UsersPage />} />
              <Route path='sort-person' element={<SortPersons />} />
              <Route path='header-items' element={<HeaderItems />} />
              <Route path='footer-items' element={<FooterItems />} />
              <Route path='ip-visitors' element={<IpVisitorPage />} />
              <Route path='post/preview' element={<PreviewAuthor />} />
              <Route
                path='news-page/preview'
                element={<PreviewNewsAndPage />}
              />
              <Route path='users/create-edit' element={<CreateEditUser />} />
              <Route path='posts/create-edit' element={<CreateEditPost />} />
              <Route
                path='posts/person-edit/:id'
                element={<PersonEditPage />}
              />
              <Route
                path='users/create-edit/:id'
                element={<CreateEditUser />}
              />
              <Route
                path='posts/create-edit/:category/:id'
                element={<CreateEditPost />}
              />
            </Route>
          </Route>
        </Routes>
      </PreviewState>
    );
}
export default App;
