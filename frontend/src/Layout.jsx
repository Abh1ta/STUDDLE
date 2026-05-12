
import Header from './components/Header.jsx' 
import { useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation();
  const hideHeader = ['/login', '/signup', '/', '/Signup'].includes(location.pathname);
  
  return !hideHeader ? <Header /> : null;
}
export default Layout