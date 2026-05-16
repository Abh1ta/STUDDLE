
import Header from './components/Header.jsx'
import { useLocation, Outlet } from 'react-router-dom'
import { useSidebar } from './context/SidebarContext.jsx'

const SIDEBAR_W = 210;
const SIDEBAR_W_COLLAPSED = 64;

const Layout = () => {
  const location = useLocation();
  const { collapsed } = useSidebar();
  const isIframe = window.self !== window.top;
  const hideHeader = ['/login', '/signup', '/', '/pdf-viewer'].includes(location.pathname) || isIframe;

  const marginLeft = hideHeader ? 0 : (collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f7e5eb 0%, #ffffff 45%, #c6c6e840 100%)' }}>
      {!hideHeader && <Header />}
      <div
        style={{
          flex: 1,
          marginLeft,
          minHeight: '100vh',
          transition: 'margin-left 0.25s ease',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Layout
