
import Header from './components/Header.jsx'
import { useLocation, Outlet } from 'react-router-dom'


const Layout = () => {
  const location = useLocation();
  const hideHeader = ['/login', '/signup', '/','/pdf-viewer'].includes(location.pathname);
  
  return (
    <>
      {!hideHeader && <Header />}
      <div className={!hideHeader ? 'page-content' : ''}>
        <Outlet />
      </div>
    </>
  );
}
export default Layout