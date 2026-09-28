import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import HomePage from '../pages/HomePage';
import ExplorePage from '../pages/ExplorePage';
import ProfilePage from '../pages/ProfilePage';
import NotificationsPage from '../pages/NotificationsPage';
import MessagesPage from '../pages/MessagesPage';
import SavedPage from '../pages/SavedPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import CreatePostModal from '../components/post/CreatePostModal';

const AppRoutes = () => {
  const location = useLocation();
  // We use state to render the Create Post modal over the previous background
  const previousLocation = location.state?.previousLocation;

  return (
    <>
      <Routes location={previousLocation || location}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* If accessed directly, render home underneath */}
          <Route path="create" element={<HomePage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Render modal independently when matching /create */}
      <Routes>
        <Route path="/create" element={<CreatePostModal />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
