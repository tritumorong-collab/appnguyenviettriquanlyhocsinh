import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Bell, 
  UserCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    currentStudentId, 
    setCurrentStudentId, 
    students, 
    currentStudent, 
    activeTab, 
    setActiveTab, 
    alerts,
    markAlertRead,
    dismissAlert,
    settings,
    setSelectedStudentForDetail
  } = useApp();

  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.read);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Hồ sơ 30 Học sinh', icon: '👥' },
    { id: 'assignments', label: 'Giao bài tập', icon: '📝' },
    { id: 'reports', label: 'Báo cáo & Xuất file', icon: '📈' },
    { id: 'settings', label: 'Cài đặt & Firebase', icon: '⚙️' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-50">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  TRỢ LÝ QUẢN LÝ HỌC SINH
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {settings.className} • {students.length} Học sinh
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Hệ thống theo dõi tiến độ, chấm bài với AI & cảnh báo chủ động
              </p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Role Switcher */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
              <button
                id="nav-switch-teacher"
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  role === 'teacher'
                    ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Giáo viên:</span>
                <span className="truncate max-w-[100px]">{settings.teacherName}</span>
              </button>

              <button
                id="nav-switch-student"
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  role === 'student'
                    ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Học sinh:</span>
                <span className="truncate max-w-[100px] font-bold text-emerald-700">
                  {currentStudent?.fullName || 'Học sinh'}
                </span>
              </button>
            </div>

            {/* Quick Select Student Selector when in Student Mode */}
            {role === 'student' && (
              <div className="relative">
                <button
                  id="btn-pick-student"
                  type="button"
                  onClick={() => setShowStudentPicker(!showStudentPicker)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <span>Đổi em khác</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showStudentPicker && (
                  <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                    <div className="px-2 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Chọn 1 trong 30 học sinh
                    </div>
                    {students.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setCurrentStudentId(s.id);
                          setShowStudentPicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                          currentStudentId === s.id
                            ? 'bg-emerald-50 text-emerald-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{s.code} - {s.fullName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
                          Tổ {s.group}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Bell (Teacher alerts) */}
            {role === 'teacher' && (
              <div className="relative">
                <button
                  id="btn-teacher-notifications"
                  type="button"
                  onClick={() => setShowAlertMenu(!showAlertMenu)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Cảnh báo thông minh"
                >
                  <Bell className="w-5 h-5" />
                  {unreadAlerts.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                      {unreadAlerts.length}
                    </span>
                  )}
                </button>

                {showAlertMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-sm text-slate-800">
                          Cảnh báo thông minh ({alerts.length})
                        </span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShowAlertMenu(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 my-1">
                      {alerts.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          Không có cảnh báo mới nào. Cả lớp đều hoàn thành bài tập tốt! 🎉
                        </div>
                      ) : (
                        alerts.map(alert => (
                          <div 
                            key={alert.id}
                            className={`p-2.5 rounded-xl transition-colors ${
                              alert.read ? 'opacity-65' : 'bg-slate-50/80 font-medium'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                {alert.severity === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                                {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                                {alert.severity === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                                {alert.severity === 'info' && <Bell className="w-4 h-4 text-indigo-600 shrink-0" />}
                                <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                              </div>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{alert.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                            <div className="flex items-center justify-between mt-2 pt-1">
                              {alert.studentId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const student = students.find(s => s.id === alert.studentId);
                                    if (student) {
                                      setSelectedStudentForDetail(student);
                                      setShowAlertMenu(false);
                                    }
                                  }}
                                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                >
                                  Xem hồ sơ em {alert.studentName} <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                              {!alert.read && (
                                <button
                                  type="button"
                                  onClick={() => markAlertRead(alert.id)}
                                  className="text-[11px] text-slate-500 hover:text-slate-800 ml-auto"
                                >
                                  Đã đọc
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Teacher Navigation Tabs */}
        {role === 'teacher' && (
          <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
            {navItems.map(item => (
              <button
                id={`tab-nav-${item.id}`}
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
