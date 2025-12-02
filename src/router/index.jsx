import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import ActivityListPage from '../pages/ActivityListPage';
import ActivityDetailPage from '../pages/ActivityDetailPage';
import NotFoundPage from '../pages/NotFoundPage';
import ActivityAPITester from '../components/ActivityAPITester';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'activities',
        element: <ActivityListPage />,
      },
      {
        path: 'activities/:id',
        element: <ActivityDetailPage />,
      },
      {
        path: 'api-test',
        element: <ActivityAPITester />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;