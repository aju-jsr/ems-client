import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginLoyout from "./components/LoginLayout.jsx"
import MainLayout from './components/MainLayout.jsx';
import EventBudgetProposal from "./pages/event_budget_proposal.jsx";
import EventBudgetProposalRM from "./pages/event_budget_proposal_rm.jsx";
import EventBudgetProposalFin from "./pages/event_budget_proposal_fin.jsx";
import LoginPath from "./pages/login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Register from "./pages/register.jsx";
// user update
import UserUpdateRoute from "./pages/user_update.jsx";

// settlements routes
import SettlementsForRequester from "./pages/settlements/settlements.jsx";
import SettlementsForRM from "./pages/settlements/settlements_rm.jsx";
import SettlementsForFIN from "./pages/settlements/settlements_fin.jsx";

import { HeaderProvider } from "./components/HeaderContext.jsx"
// Reports
import BudgetReport from "./pages/repors/budget_proposal_report.jsx";
import SettlementReport from "./pages/repors/budget_settlement_report.jsx";

export default function App() {
  if (window.location.pathname.includes("//")) {
    const normalizedPath = window.location.pathname.replace(/\/{2,}/g, "/");
    window.history.replaceState(null, "", `${normalizedPath}${window.location.search}${window.location.hash}`);
  }

  return (
    
    <HeaderProvider>
    <BrowserRouter>
    
      {/* <Header /> */}
      {/* <MainLayout /> */}
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<LoginLoyout />}>

        <Route path="/login" element={<LoginPath />} />

        {/* <Route path="/register" element={<Register />} /> */}

        </Route>

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* <Route path="/register" element={<Register />} /> */}
            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/user_update"
              element={<UserUpdateRoute />}
            />
            
            <Route
              path="/budget_proposal_report"
              element={<BudgetReport />}
            />

            <Route
              path="/settlement_report"
              element={<SettlementReport />}
            />
            
            
            <Route
              path="/event_budget_proposal"
              element={<EventBudgetProposal />}
            />
            <Route
              path="/event_budget_proposal_rm"
              element={<EventBudgetProposalRM />}
            />
            <Route
              path="/event_budget_proposal_fin"
              element={<EventBudgetProposalFin />}
            />

            <Route
              path='/settlements'
              element={<SettlementsForRequester />}
            />
            <Route
              path='/settlements_rm'
              element={<SettlementsForRM />}
            />

            <Route
              path='/settlements_fin'
              element={<SettlementsForFIN />}
            />
            
            

          </Route>

          
        
        

      </Routes>
      <Footer />
    </BrowserRouter>
    </HeaderProvider>
  );
}
