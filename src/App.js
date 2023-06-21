/** @format */
import { HashRouter, BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import { CustomerContext } from './CustomerContext';
import { MachineContext } from './MachineContext';
import { UpdateCustomersContext } from './UpdateCustomersContext';
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NavItems, SuperNavItems } from './components/constants';
import Profile from './pages/Profile';
import { AddCustomer, AddMachine, EditMachine } from './forms';
import EditCustomer from './forms/EditCustomer';
import DashboardPage from './pages/Dasjboard';
import ShowMachine from './miniPages/ShowMachine';
import Ptd from './Protected';

import Layout from './components/Layout';

let theme = createTheme({ typography: { fontSize: '2vh', button: { textTransform: 'none' } } });

function App() {
  const [customerID, setCustomerID] = useState(() => localStorage.getItem('admin_client'));
  const [machineID, setMachineID] = useState(localStorage.getItem('admin_api'));
  const [updateCustomers, setUpdateCustomers] = useState(false);
  const id = localStorage.getItem('admin_id');
  const nav = id === '5' ? SuperNavItems : NavItems;
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HashRouter>
          <CustomerContext.Provider value={{ customerID, setCustomerID }}>
            <MachineContext.Provider value={{ machineID, setMachineID }}>
              <UpdateCustomersContext.Provider value={{ updateCustomers, setUpdateCustomers }}>
                <Routes>
                  <Route element={<Ptd />}>
                    <Route element={<Layout />}>
                      {nav.map((item) => (
                        <Route key={item.lable} path={`/${item.route}`} element={<item.element />}/>
                      ))}
                      <Route element={<AddCustomer />} path="/clients/new" />
                      <Route element={<EditCustomer />} path="/clients/edit" />
                      <Route element={<AddMachine />} path="/machines/new" />
                      <Route element={<EditMachine />} path="/machines/edit" />
                      <Route element={<ShowMachine />} path="/machines/detail" />
                      <Route element={<Profile />} path="/profile" />
                      <Route element={<DashboardPage />} path="/*" />
                    </Route>
                  </Route>
                  <Route element={<LoginPage />} path="/login" />
                </Routes>
              </UpdateCustomersContext.Provider>
            </MachineContext.Provider>
          </CustomerContext.Provider>
        </HashRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
