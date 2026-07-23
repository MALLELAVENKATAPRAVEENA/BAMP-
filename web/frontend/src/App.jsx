import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AIChatAssistant from './components/AIChatAssistant';

// Authentication & Identity pages
import Splash from './pages/Splash';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EmailVerification from './pages/EmailVerification';
import OTPVerify from './pages/OTPVerify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AccessSelection from './pages/AccessSelection';

// Dashboards
import Dashboard from './pages/Dashboard';
import ClinicManagerDashboard from './pages/ClinicManagerDashboard';

// Patient Management Workspaces
import NewPatient from './pages/NewPatient';
import EditPatient from './pages/EditPatient';
import PatientRecords from './pages/PatientRecords';
import PatientProfile from './pages/PatientProfile';

// Imaging & Evaluation Pipelines
import UploadScan from './pages/UploadScan';
import ImagingPipeline from './pages/ImagingPipeline';
import LandmarkDetection from './pages/LandmarkDetection';
import ImageAnalysis from './pages/ImageAnalysis';
import AIEngine from './pages/AIEngine';
import AIPrediction from './pages/AIPrediction';
import ClinicalInsights from './pages/ClinicalInsights';
import AIOutcomes from './pages/AIOutcomes';

// Reporting & Telemetries
import Reports from './pages/Reports';
import ChartsDashboard from './pages/ChartsDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';

// Info and Support pages
import About from './pages/About';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Feedback from './pages/Feedback';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

// Layout component wrapping sub-routes
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-darkbg text-slate-800 dark:text-slate-100 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main panel container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navbar */}
        <TopBar toggleSidebar={toggleSidebar} />

        {/* Dynamic Outlet sub-view */}
        <main className="flex-1 p-6 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>

      {/* Floating AI chat and voice assistant available on every page */}
      <AIChatAssistant />

    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Entry Routes */}
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/otp-verify" element={<OTPVerify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/access-selection" element={<AccessSelection />} />

            {/* Protected Workstation Stations */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clinic-manager-dashboard" element={<ClinicManagerDashboard />} />
              
              {/* Patient Management */}
              <Route path="new-patient" element={<NewPatient />} />
              <Route path="edit-patient/:id" element={<EditPatient />} />
              <Route path="patient-records" element={<PatientRecords />} />
              <Route path="patient-profile/:id" element={<PatientProfile />} />

              {/* Imaging & Evaluation */}
              <Route path="upload-scan" element={<UploadScan />} />
              <Route path="imaging-pipeline" element={<ImagingPipeline />} />
              <Route path="landmark-detection" element={<LandmarkDetection />} />
              <Route path="image-analysis" element={<ImageAnalysis />} />
              <Route path="ai-engine" element={<AIEngine />} />
              <Route path="ai-prediction" element={<AIPrediction />} />
              <Route path="clinical-insights" element={<ClinicalInsights />} />
              <Route path="ai-outcomes" element={<AIOutcomes />} />

              {/* Reporting & Settings */}
              <Route path="reports" element={<Reports />} />
              <Route path="charts-dashboard" element={<ChartsDashboard />} />
              <Route path="analytics-dashboard" element={<AnalyticsDashboard />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="change-password" element={<ChangePassword />} />

              {/* Info Pages */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="help-center" element={<HelpCenter />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-conditions" element={<TermsConditions />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="faq" element={<FAQ />} />
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
