import React from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { 
  X, 
  PhoneCall, 
  Award, 
  TrendingUp, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Star, 
  Calendar, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { calculateStudentStats, STATUS_CONFIG } from '../utils/alertEngine';

interface Props {
  student: Student;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<Props> = ({ student, onClose }) => {
  const { assignments, submissions, setSelectedSubmissionForGrading, reassignTask } = useApp();

  const stats = calculateStudentStats(student.id, assignments, submissions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center font-extrabold text-xl sm:text-2xl shadow-lg shrink-0">
              {student.code}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950">
                  {student.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                  Tổ {student.group}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                  Giới tính: {student.gender}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {student.fullName}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-200 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Sinh ngày: {new Date(student.dob).toLocaleDateString('vi-VN')}
                </span>
                <span>•</span>
                <span>Phụ huynh: <strong>{student.parentName}</strong></span>
                <span>•</span>
                <a
                  href={`tel:${student.parentPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold underline"
                >
                  <PhoneCall className="w-3 h-3" />
                  {student.parentPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top 5 Stats Grid as specifically requested */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
              <span className="text-[11px] font-bold text-indigo-700 uppercase">Tổng số bài giao</span>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">
                {stats.totalAssigned}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">100% nhiệm vụ</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Đã hoàn thành</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                {stats.completedCount}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Tỷ lệ {stats.completionRate}%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-center">
              <span className="text-[11px] font-bold text-rose-700 uppercase">Chưa hoàn thành</span>
              <div className="text-2xl font-extrabold text-rose-700 mt-1">
                {stats.incompleteCount}
              </div>
              <span className="text-[10px] text-rose-600 font-medium">Cần hoàn thành</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 text-center">
              <span className="text-[11px] font-bold text-orange-700 uppercase">Số bài nộp muộn</span>
              <div className="text-2xl font-extrabold text-orange-700 mt-1">
                {stats.lateCount}
              </div>
              <span className="text-[10px] text-orange-600 font-medium">Sau thời hạn</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase">Điểm trung bình</span>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">
                {stats.averageGrade > 0 ? stats.averageGrade : '—'}
              </div>
              <span className="text-[10px] text-amber-800 font-semibold">Thang điểm 10</span>
            </div>

          </div>

          {/* Section: Biểu đồ tiến bộ theo tuần/tháng & Kết quả theo môn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Biểu đồ tiến bộ theo tuần (Clean visual graph) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-sm text-slate-900">Biểu đồ tiến bộ theo tuần</h4>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {student.id === 'HS02' ? '+18% so với tuần trước' : 'Duy trì ổn định'}
                </span>
              </div>

              {/* Graphical Bar/Point Representation */}
              <div className="space-y-3 pt-2">
                {stats.progressHistory.map((item, i) => {
                  const percent = Math.min(100, Math.round((item.score / 10) * 100));
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{item.week}</span>
                        <span className="font-extrabold text-indigo-700">{item.score} / 10đ</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Kết quả theo từng môn học */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-sm text-slate-900">Kết quả theo từng môn học</h4>
                </div>
              </div>

              <div className="space-y-2.5">
                {stats.subjectStats.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60 text-xs">
                    <span className="font-bold text-slate-800">{sub.subject}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">Hoàn thành: <strong className="text-slate-700">{sub.completionRate}%</strong></span>
                      <span className="px-2 py-0.5 rounded-md font-extrabold bg-indigo-50 text-indigo-700">
                        {sub.average}đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section: Điểm mạnh & Nội dung cần cải thiện & Nhận xét gần nhất */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Điểm mạnh & Cần cải thiện */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Đặc điểm sư phạm của học sinh
              </h4>

              <div>
                <span className="text-xs font-bold text-emerald-700 block mb-1">🌟 Điểm mạnh nổi bật:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(student.strengths || ['Chăm chỉ', 'Lễ phép', 'Nộp bài đúng hạn']).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-800 block mb-1">🎯 Nội dung cần cải thiện:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(student.areasToImprove || ['Cần rèn thêm chữ viết', 'Kiểm tra kỹ lại bài trước khi nộp']).map((a, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Nhận xét sư phạm gần nhất */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-indigo-950 flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Nhận xét sư phạm gần nhất của giáo viên
                </h4>
                <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs">
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    “{student.notes || 'Học sinh ngoan, có ý thức học tập tốt, hoàn thành đầy đủ các bài tập được giao.'}”
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Cô Hoàng Mai Lan</span>
                    <span>Tuần hiện tại</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <a
                  href={`tel:${student.parentPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Gọi trao đổi với Phụ huynh</span>
                </a>
              </div>
            </div>

          </div>

          {/* Section: Lịch sử bài tập & kết quả đánh giá */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600" />
                Lịch sử bài tập & Kết quả đánh giá ({stats.studentSubmissions.length})
              </h4>
            </div>

            <div className="space-y-2.5">
              {stats.studentSubmissions.map(({ assignment, submission, status }) => {
                const cfg = STATUS_CONFIG[status];

                return (
                  <div
                    key={assignment.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                          {assignment.subject}
                        </span>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {assignment.title}
                        </h5>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                        {submission?.submittedAt && (
                          <span>• Nộp lúc: {new Date(submission.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                        {submission?.teacherComment && (
                          <span className="text-indigo-600 truncate max-w-xs font-medium">
                            • Lời phê: "{submission.teacherComment}"
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${cfg.badgeBg} ${cfg.textColor} ${cfg.border}`}>
                        <span>{cfg.icon}</span>
                        <span>{submission?.grade !== undefined ? `${submission.grade}đ` : cfg.label}</span>
                      </span>

                      {submission && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSubmissionForGrading({
                              assignment,
                              submission,
                              student,
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                        >
                          Chấm / Sửa
                        </button>
                      )}

                      {status === 'needs_revision' && (
                        <button
                          type="button"
                          onClick={() => reassignTask(assignment.id, student.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                        >
                          Giao lại
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Mã học sinh: {student.code} • Lớp {student.group ? `Tổ ${student.group}` : ''}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
