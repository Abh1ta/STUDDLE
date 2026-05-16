import Header from './Header';
import { Outlet } from 'react-router-dom';

const HeaderLayout = () => {
  return (
    <>
      <Header />
      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
};

export default HeaderLayout;