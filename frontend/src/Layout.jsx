import Header from './components/Header.jsx' 
import { useLocation, Outlet } from 'react-router-dom'

const Layout = () => {
  const location = useLocation();
  const hideHeader = ['/login', '/signup', '/', '/Signup'].includes(location.pathname);
  
  return (
    <>
      {!hideHeader && <Header />}
      <Outlet />
    </>
  );
}

export default Layout