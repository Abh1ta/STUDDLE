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

<<<<<<< HEAD
export default HeaderLayout;
=======
export default HeaderLayout;
>>>>>>> origin/feature/update
