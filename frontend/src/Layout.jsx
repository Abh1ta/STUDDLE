import Header from './components/Header.jsx'  // adjust path
import { useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation();
  const hideHeader = ['/login', '/signup'].includes(location.pathname);
  
  return !hideHeader ? <Header /> : null;
}
export default Layout