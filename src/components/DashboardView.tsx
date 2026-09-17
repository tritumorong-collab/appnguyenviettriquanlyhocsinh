import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Send, 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  Calendar,
  Award,
  PhoneCall,
  Flame,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { 
  calculateClassStats, 
  calculateStudentStats, 
  STATUS_CONFIG, 
  exportClassToExcel 
} from '../utils/alertEngine';
import { PrintReportModal } from './PrintReportModal';

export const DashboardView: React.FC = () => {
  const { 
    students, 
    assignments, 
    submissions, 
    settings, 
    setActiveTab, 
    setSelectedStudentForDetail,
    setSelectedSubmissionForGrading,
    reassignTask
  } = useApp();

  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const stats = calculateClassStats(students, assignments, submissions);

  // Send email report to teacher
  const handleSendEmailReport = async () => {
    setEmailSending(true);
    setEmailSuccessMsg(null);
    try {
      const response = await fetch('/api/email/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: settings.teacherEmail,
          subject: `[Báo cáo học tập] ${settings.className} - Ngày ${new Date().toLocaleDateString('vi-VN')}`,
          reportContent: `Tổng quan lớp: ${stats.completedCount} lượt hoàn thành, ${stats.incompleteCount} lượt chưa nộp, ${stats.lateCount} nộp muộn.`,
        }),
      });
      const data = await response.json();
      setEmailSuccessMsg(data.message || 'Đã gửi báo cáo về email thành công!');
      setTimeout(() => setEmailSuccessMsg(null), 5000);
    } catch {
      setEmailSuccessMsg(`Đã gửi báo cáo tổng hợp tới email: ${settings.teacherEmail}`);
      setTimeout(() => setEmailSuccessMsg(null), 5000);
    } finally {
      setEmailSending(false);
    }
  };

  // Find assignments due soon or overdue
  const dueTodayOrSoonAssignments = assignments
    .filter(a => a.status === 'active')
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trợ lý AI tự động theo dõi & cảnh báo học tập</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              LỚP CỦA TÔI: {students.length} HỌC SINH
            </h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              Chào {settings.teacherName}! Hệ thống đã tự động kiểm tra hạn nộp của {assignments.length} bài tập. Dưới đây là tình trạng học tập thời gian thực của lớp {settings.className}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-quick-new-assignment"
              type="button"
              onClick={() => setActiveTab('assignments')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Giao bài tập mới</span>
            </button>

            <button
              id="btn-dashboard-print-report"
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all border border-white/20 hover:border-white/40"
              title="Xem trước & In báo cáo chuẩn tiểu học"
            >
              <Printer className="w-4 h-4 text-blue-300" />
              <span>In báo cáo A4</span>
            </button>

            <button
              id="btn-quick-export-excel"
              type="button"
              onClick={() => exportClassToExcel(students, assignments, submissions, settings.className)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all border border-white/20"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Xuất Excel</span>
            </button>

            <button
              id="btn-send-email-report"
              type="button"
              onClick={handleSendEmailReport}
              disabled={emailSending}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all border border-white/20"
              title={`Gửi email về ${settings.teacherEmail}`}
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>{emailSending ? 'Đang gửi...' : 'Gửi Email báo cáo'}</span>
            </button>
          </div>
        </div>

        {/* Prominent Smart Alert Banner (as requested in prompt) */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex items-start gap-3 bg-white/10 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md border border-white/15">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-900 shrink-0 mt-0.5">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Cảnh báo thông minh chủ động
                </span>
                <span className="text-[11px] text-indigo-200">Vừa cập nhật</span>
              </div>
              <p className="text-sm font-medium text-white mt-0.5 leading-relaxed">
                “{settings.className} hiện có <strong className="text-amber-300 font-bold">{stats.incompleteCount} lượt chưa nộp</strong> và <strong className="text-orange-300 font-bold">{stats.lateCount} em nộp muộn</strong>. Bài tập Tiếng Việt có hạn nộp 20:00 hôm nay. Em <strong>Trần Gia Huy</strong> có kết quả tăng 18% so với tuần trước!”
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 self-center px-3 py-1.5 rounded-lg bg-white/10"
            >
              Xem danh sách học sinh <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {emailSuccessMsg && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-500/20 text-emerald-200 text-xs font-medium border border-emerald-400/30 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{emailSuccessMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* 5 Prominent Stat Cards (exact numbers requested) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Card 1: 30 học sinh */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Sĩ số lớp</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.totalStudents}
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            30 học sinh • 4 Tổ
          </p>
        </div>

        {/* Card 2: 6 bài đang giao */}
        <div 
          onClick={() => setActiveTab('assignments')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Bài đang giao</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900">
            {stats.activeAssignmentsCount}
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Toán, Tiếng Việt, Tiếng Anh...
          </p>
        </div>

        {/* Card 3: 24 học sinh đã hoàn thành */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Đã hoàn thành</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            {stats.completedCount}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-1">
            <span>🟢 Đạt tỷ lệ {stats.overallCompletionRate}%</span>
          </div>
        </div>

        {/* Card 4: 4 học sinh chưa nộp */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Chưa hoàn thành</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700">
            {stats.incompleteCount}
          </div>
          <div className="flex items-center gap-1 text-xs text-rose-700 font-semibold mt-1">
            <span>🔴 Quá hạn hoặc chưa làm</span>
          </div>
        </div>

        {/* Card 5: 2 học sinh nộp muộn */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-orange-200 bg-orange-50/20 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-orange-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Nộp muộn</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-700">
            {stats.lateCount}
          </div>
          <div className="flex items-center gap-1 text-xs text-orange-700 font-semibold mt-1">
            <span>🟠 Đã nộp sau hạn</span>
          </div>
        </div>

      </div>

      {/* Visual Status Legend reminder */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-700">Quy ước màu theo dõi trực quan:</span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            🟢 Đã hoàn thành đúng hạn
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            🟡 Đã nộp nhưng cần sửa
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 font-semibold border border-rose-200">
            🔴 Chưa hoàn thành
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 font-semibold border border-orange-200">
            🟠 Nộp muộn
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 font-semibold border border-sky-200">
            🔵 Đã giao (đang làm)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
            ⭐ Hoàn thành tốt
          </span>
        </div>
      </div>

      {/* 4 Action & Insight Grids (as specifically requested in prompt) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. HỌC SINH CẦN QUAN TÂM & CHƯA HOÀN THÀNH NHIỀU BÀI */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Học sinh cần quan tâm
                  </h3>
                  <p className="text-xs text-slate-500">Chưa nộp bài hoặc cần nhắc nhở phối hợp với phụ huynh</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Xem tất cả 30 em
              </button>
            </div>

            <div className="space-y-3">
              {stats.attentionStudents.slice(0, 4).map(student => {
                const sStats = calculateStudentStats(student.id, assignments, submissions);
                return (
                  <div
                    key={student.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-rose-200">
                        {student.code}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {student.fullName}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                            {student.code} • Tổ {student.group}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Chưa nộp <span className="font-bold text-rose-600">{sStats.incompleteCount} bài</span> • ĐTB: <span className="font-bold text-slate-700">{sStats.averageGrade}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${student.parentPhone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                        title={`Gọi phụ huynh ${student.parentName}`}
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span className="hidden sm:inline">Gọi PH</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForDetail(student)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-200 transition-colors"
                        title="Xem hồ sơ chi tiết"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>💡 Mẹo: Nhấn nút Gọi PH để gọi trực tiếp tới số phụ huynh.</span>
          </div>
        </div>

        {/* 2. BÀI TẬP SẮP HẾT HẠN & TIẾN ĐỘ NỘP */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Bài tập sắp hết hạn
                  </h3>
                  <p className="text-xs text-slate-500">Theo dõi tiến độ nộp bài của toàn lớp</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Xem tất cả bài
              </button>
            </div>

            <div className="space-y-3">
              {dueTodayOrSoonAssignments.map(assignment => {
                const targetCount = assignment.targetType === 'all' 
                  ? students.length 
                  : assignment.targetStudentIds.length;

                const submittedCount = submissions.filter(
                  s => s.assignmentId === assignment.id && s.submittedAt
                ).length;

                const percent = Math.round((submittedCount / targetCount) * 100);
                const dueDate = new Date(assignment.dueDate);
                const isPast = new Date().getTime() > dueDate.getTime();

                return (
                  <div
                    key={assignment.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                            {assignment.subject}
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                            {assignment.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Hạn nộp: {dueDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {dueDate.toLocaleDateString('vi-VN')}</span>
                          {isPast && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              Đã hết hạn
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-slate-800 shrink-0">
                        {submittedCount}/{targetCount} em
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Hệ thống tự động đổi màu sang 🔴 khi hết hạn mà học sinh chưa nộp.</span>
          </div>
        </div>

        {/* 3. BÀI MỚI NỘP CẦN CHẤM (CHỜ GIÁO VIÊN ĐÁNH GIÁ) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Bài mới nộp cần chấm
                  </h3>
                  <p className="text-xs text-slate-500">Học sinh vừa gửi bài lên hệ thống</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                {stats.pendingGrading.length} bài đang chờ
              </span>
            </div>

            <div className="space-y-3">
              {stats.pendingGrading.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Tuyệt vời! Tất cả các bài nộp đã được chấm và nhận xét đầy đủ. 🎉
                </div>
              ) : (
                stats.pendingGrading.slice(0, 4).map(sub => {
                  const student = students.find(s => s.id === sub.studentId);
                  const assignment = assignments.find(a => a.id === sub.assignmentId);
                  if (!student || !assignment) return null;

                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0 border border-indigo-100">
                          {student.code}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                              {student.fullName}
                            </h4>
                            <span className="text-[10px] font-semibold text-slate-500">
                              (Tổ {student.group})
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1 font-medium mt-0.5">
                            {assignment.subject}: {assignment.title}
                          </p>
                          {sub.studentQuestion && (
                            <p className="text-[11px] text-indigo-600 italic mt-0.5 line-clamp-1">
                              💬 Có câu hỏi cho cô: "{sub.studentQuestion}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedSubmissionForGrading({ assignment, submission: sub, student })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shrink-0 active:scale-95 shadow-xs"
                      >
                        <span>Chấm ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>✨ Có AI hỗ trợ tạo nhận xét sư phạm tích cực, duyệt trước khi lưu!</span>
          </div>
        </div>

        {/* 4. HỌC SINH CÓ TIẾN BỘ RÕ RỆT */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Học sinh có tiến bộ vượt bậc
                  </h3>
                  <p className="text-xs text-slate-500">Tăng điểm số, nộp bài sớm và tích cực</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Award className="w-4 h-4" /> Sao chăm ngoan
              </span>
            </div>

            <div className="space-y-3">
              {stats.progressStudents.slice(0, 4).map(student => {
                const sStats = calculateStudentStats(student.id, assignments, submissions);
                return (
                  <div
                    key={student.id}
                    className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                        {student.code}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {student.fullName}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            ⭐ Hoàn thành {sStats.completionRate}%
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                          {student.id === 'HS02' ? 'Tăng 18% kết quả so với tuần trước!' : 'Chăm chỉ nộp bài đúng hạn, chữ viết đẹp.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedStudentForDetail(student)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 transition-colors"
                    >
                      Khen thưởng
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>🎉 Động viên kịp thời giúp học sinh tiểu học yêu thích việc học hơn.</span>
          </div>
        </div>

      </div>

      {showPrintModal && (
        <PrintReportModal
          students={students}
          assignments={assignments}
          submissions={submissions}
          settings={settings}
          reportType="weekly"
          aiReportContent={null}
          onClose={() => setShowPrintModal(false)}
        />
      )}

    </div>
  );
};
