import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import DashboardIndex from "./components/dashboard/index"
import Register from "./components/login/Register"
import Login from "./components/login"
import ForgetPassword from './components/login/ForgetPassword';
import TermsMain from './components/dashboard/TermsMain';
import PrivacyMain from './components/dashboard/PrivacyMain';
import HubIndex from "./components/hub/index";
import Messages from "./components/hub/Messages";
import Notifications from "./components/hub/Notifications"
import Settings from "./components/hub/Settings"
import TaskProfile from "./components/task_profile"
import TaskDashboard from "./components/task_dashboard"
import TaskIndex from "./components/dashboard/TaskIndex"
import TaskList from "./components/task_list"


export default function ResponsiveAppBar() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/task/index" />} replace/>
        <Route path="/login" element={<Login />} replace/>
        <Route path="/register" element={<Register />} replace/>
        <Route path="/forgot-password" element={<ForgetPassword />} replace/>
        <Route path="/terms" element={<TermsMain />} replace/>
        <Route path="/privacy" element={<PrivacyMain />} replace/>
        <Route path="/task" element={<DashboardIndex />} replace>
          <Route path="index" element={<TaskIndex />} />
          <Route path="task-list" element={<TaskList />} />
          <Route path="profile/:userid" element={<TaskProfile />} />
          <Route path="dashboard" element={<TaskDashboard />} />
          <Route path="hub" element={<HubIndex />}>
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}