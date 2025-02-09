import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserList from './components/User/UserList';
import UserForm from './components/User/UserForm';
import InvitationList from './components/Invitation/invitationList';
import InvitationForm from './components/Invitation/InvitationForm';
import MaterialForm from './components/Material/MaterialForm';
import MaterialList from './components/Material/MaterialList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          <Route path="users" element={<UserList />} />
          <Route path="invitations" element={<InvitationList />} />
          <Route path="invitations/new" element={<InvitationForm />} />
          <Route path="invitations/edit/:id" element={<InvitationForm />} />
          <Route path="materials" element={<MaterialList />} />
          <Route path='materials/new' element={<MaterialForm />} />
          <Route path='materials/edit/:id' element={<MaterialForm />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;