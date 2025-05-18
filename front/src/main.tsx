import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import SignUp from './pages/sign-up';
import "./styles/globals.css"
import SignIn from './pages/sign-in';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ViewBook from './pages/view-book';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/dashboard';
import DashboardLayout from './components/dashboard/Layout';
import BooksPage from './components/dashboard/books';
import UsersPage from './components/dashboard/userse';
import AllBooks from './pages/AllBooks';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
   {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path:"books/:id",
    element:<ViewBook/>
  },
  {
    path:"all",
    element:<AllBooks/>
  },
  {
    path:"dashboard",
    element:<DashboardLayout><Dashboard/></DashboardLayout>
  },
  {
    path:"dashboard/books",
    element:<DashboardLayout><BooksPage/></DashboardLayout>
  },
  {
    path:"dashboard/users",
    element:<DashboardLayout><UsersPage/></DashboardLayout>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);