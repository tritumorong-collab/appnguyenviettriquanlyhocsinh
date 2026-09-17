import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StudentManagementView } from './components/StudentManagementView';
import { AssignmentManagerView } from './components/AssignmentManagerView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { StudentPortalView } from './components/StudentPortalView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { GradingModal } from './components/GradingModal';

const MainContent: React.FC = () => {
  const { 
    role, 
    activeTab, 
    selectedStudentForDetail, 
    setSelectedStudentForDetail,
    selectedSubmissionForGrading,
    setSelectedSubmissionForGrading
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'student' ? (
          <StudentPortalView />
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'students' && <StudentManagementView />}
            {activeTab === 'assignments' && <AssignmentManagerView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'settings' && <SettingsView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
        <p>TRỢ LÝ QUẢN LÝ HỌC SINH • Mô hình quản lý & cảnh báo học tập chủ động cho giáo viên tiểu học</p>
      </footer>

      {/* Global Modals */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
        />
      )}

      {selectedSubmissionForGrading && (
        <GradingModal
          assignment={selectedSubmissionForGrading.assignment}
          submission={selectedSubmissionForGrading.submission}
          student={selectedSubmissionForGrading.student}
          onClose={() => setSelectedSubmissionForGrading(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
