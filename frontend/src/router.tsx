import { Navigate, useRoutes } from 'react-router-dom';
import AccountLayout from './Layouts/account';
import MainLayout from './Layouts/main';
import Login from './Pages/Account/Login';
import Signup from './Pages/Account/Signup';
import Main from './Pages/Main/Main';
import PageNotFound from './Pages/PageNotFound';
import Codes from './Pages/Room/Codes';
import Compile from './Pages/Room/Compile';
import Invite from './Pages/Room/Invite';
import ProblemManage from './Pages/Room/ProblemManage';
import RoomMain from './Pages/Room/RoomMain';

interface RouterProps {
  isLogin: boolean;
}

function Router({ isLogin }: RouterProps) {
  return useRoutes([
    {
      path: '',
      element: isLogin ? <MainLayout /> : <Navigate to="login" />,
      children: [
        { path: '', element: <Main /> },
        {
          path: 'room/:roomId',
          children: [
            { path: '', element: <RoomMain /> },
            {
              path: 'problem-manage',
              element: <ProblemManage />,
            },
          ],
        },

        {
          path: 'codes/:codeId',
          element: <Codes />,
        },
        {
          path: 'compile/:problemId',
          element: <Compile />,
        },
        { path: '/404', element: <PageNotFound /> },
      ],
    },
    {
      path: '',
      element: !isLogin ? <AccountLayout /> : <Navigate to="/" />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'signup',
          element: <Signup />,
        },
        {
          path: 'invite/:inviteId',
          element: <Invite />,
        },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

export default Router;
