import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Assignment, Submission } from '../types';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Image as ImageIcon, 
  Send, 
  MessageSquare, 
  Star, 
  Sparkles, 
  ExternalLink,
  Award,
  ChevronRight,
  Smile,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STATUS_CONFIG, evaluateSubmissionStatus } from '../utils/alertEngine';

type StudentTab = 'today' | 'upcoming' | 'completed' | 'revision';

export const StudentPortalView: React.FC = () => {
  const { 
    currentStudent, 
    assignments, 
    submissions, 
    submitAssignment, 
    settings 
  } = useApp();

  const [studentTab, setStudentTab] = useState<StudentTab>('today');
  const [activeAssignmentForSubmit, setActiveAssignmentForSubmit] = useState<Assignment | null>(null);

  // Form states for submission
  const [answerText, setAnswerText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [studentQuestion, setStudentQuestion] = useState('');
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);

  if (!currentStudent) {
    return <div className="p-8 text-center text-slate-500">Vui lòng chọn học sinh.</div>;
  }

  // Filter tasks targeted for this student
  const studentAssignments = assignments.filter(
    a => a.targetType === 'all' || a.targetStudentIds.includes(currentStudent.id)
  );

  const now = new Date().getTime();

  // 1. “Bài cần làm hôm nay”
  const todayTasks = studentAssignments.filter(a => {
    const sub = submissions.find(s => s.assignmentId === a.id && s.studentId === currentStudent.id);
    const dueDate = new Date(a.dueDate).getTime();
    const isDone = sub && (sub.status === 'completed_ontime' || sub.status === 'excellent' || sub.status === 'submitted_late');
    if (isDone) return false;

    // Due within 24-36h or assigned today
    return dueDate >= now - 1000 * 60 * 60 * 12;
  });

  // 2. “Bài sắp hết hạn”
  const upcomingTasks = studentAssignments.filter(a => {
    const sub = submissions.find(s => s.assignmentId === a.id && s.studentId === currentStudent.id);
    const isDone = sub && (sub.status === 'completed_ontime' || sub.status === 'excellent' || sub.status === 'submitted_late');
    if (isDone) return false;

    const dueDate = new Date(a.dueDate).getTime();
    const hoursLeft = (dueDate - now) / (1000 * 60 * 60);
    return hoursLeft > 0 && hoursLeft <= 24;
  });

  // 3. “Bài đã hoàn thành”
  const completedTasks = studentAssignments.filter(a => {
    const sub = submissions.find(s => s.assignmentId === a.id && s.studentId === currentStudent.id);
    return sub && (sub.status === 'completed_ontime' || sub.status === 'excellent' || sub.status === 'submitted_late');
  });

  // 4. “Bài cần làm lại”
  const revisionTasks = studentAssignments.filter(a => {
    const sub = submissions.find(s => s.assignmentId === a.id && s.studentId === currentStudent.id);
    return sub && (sub.status === 'needs_revision' || sub.assessmentRank === 'Yêu cầu làm lại');
  });

  // Open submission drawer/modal for assignment
  const handleOpenSubmit = (assignment: Assignment) => {
    const sub = submissions.find(s => s.assignmentId === assignment.id && s.studentId === currentStudent.id);
    setAnswerText(sub?.answerText || '');
    setAttachmentUrl(sub?.attachmentUrl || '');
    setStudentQuestion(sub?.studentQuestion || '');
    setActiveAssignmentForSubmit(assignment);
  };

  const handleDoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignmentForSubmit) return;

    submitAssignment(activeAssignmentForSubmit.id, currentStudent.id, {
      answerText,
      attachmentUrl: attachmentUrl.trim() || undefined,
      attachmentName: attachmentUrl.trim() ? 'Ảnh chụp bài viết của em' : undefined,
      studentQuestion: studentQuestion.trim() || undefined,
    });

    // Fire joyful celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });

    setShowSuccessCelebration(true);
    setTimeout(() => {
      setShowSuccessCelebration(false);
      setActiveAssignmentForSubmit(null);
    }, 2000);
  };

  // Sample homework photos for convenient student testing
  const samplePhotos = [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=700&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Friendly Student Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center font-extrabold text-xl sm:text-2xl shadow-lg shrink-0">
              {currentStudent.code}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-1">
                <span>⭐ Bạn nhỏ chăm ngoan</span>
                <span>• {settings.className}</span>
                <span>• Tổ {currentStudent.group}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                Chào {currentStudent.fullName}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Hôm nay con đã sẵn sàng hoàn thành bài tập để nhận thật nhiều Sao từ {settings.teacherName} chưa?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-xs self-start sm:self-auto border border-white/20">
            <Award className="w-8 h-8 text-amber-300 shrink-0" />
            <div>
              <span className="text-xs text-emerald-100 block">Đã hoàn thành</span>
              <span className="text-lg font-black text-white">{completedTasks.length} bài tập</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Required Student Navigation Tabs (as explicitly quoted in prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Tab 1: Bài cần làm hôm nay */}
        <button
          id="student-tab-today"
          type="button"
          onClick={() => setStudentTab('today')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative ${
            studentTab === 'today'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">📚</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
              studentTab === 'today' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {todayTasks.length}
            </span>
          </div>
          <h3 className="font-extrabold text-xs sm:text-sm">Bài cần làm hôm nay</h3>
          <p className={`text-[11px] mt-0.5 ${studentTab === 'today' ? 'text-indigo-100' : 'text-slate-500'}`}>
            Nhiệm vụ đang chờ con
          </p>
        </button>

        {/* Tab 2: Bài sắp hết hạn */}
        <button
          id="student-tab-upcoming"
          type="button"
          onClick={() => setStudentTab('upcoming')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative ${
            studentTab === 'upcoming'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">⏰</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
              studentTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-800'
            }`}>
              {upcomingTasks.length}
            </span>
          </div>
          <h3 className="font-extrabold text-xs sm:text-sm">Bài sắp hết hạn</h3>
          <p className={`text-[11px] mt-0.5 ${studentTab === 'upcoming' ? 'text-amber-100' : 'text-slate-500'}`}>
            Mau nộp đúng giờ nhé
          </p>
        </button>

        {/* Tab 3: Bài đã hoàn thành */}
        <button
          id="student-tab-completed"
          type="button"
          onClick={() => setStudentTab('completed')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative ${
            studentTab === 'completed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">🎉</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
              studentTab === 'completed' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'
            }`}>
              {completedTasks.length}
            </span>
          </div>
          <h3 className="font-extrabold text-xs sm:text-sm">Bài đã hoàn thành</h3>
          <p className={`text-[11px] mt-0.5 ${studentTab === 'completed' ? 'text-emerald-100' : 'text-slate-500'}`}>
            Xem điểm và lời khen
          </p>
        </button>

        {/* Tab 4: Bài cần làm lại */}
        <button
          id="student-tab-revision"
          type="button"
          onClick={() => setStudentTab('revision')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative ${
            studentTab === 'revision'
              ? 'bg-rose-500 text-white border-rose-500 shadow-md ring-2 ring-rose-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">✍️</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
              studentTab === 'revision' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-800'
            }`}>
              {revisionTasks.length}
            </span>
          </div>
          <h3 className="font-extrabold text-xs sm:text-sm">Bài cần làm lại</h3>
          <p className={`text-[11px] mt-0.5 ${studentTab === 'revision' ? 'text-rose-100' : 'text-slate-500'}`}>
            Cô đã gửi hướng dẫn sửa
          </p>
        </button>

      </div>

      {/* Task List Display for Selected Tab */}
      <div className="space-y-4">
        {(() => {
          let currentList: Assignment[] = [];
          let emptyText = '';

          if (studentTab === 'today') {
            currentList = todayTasks;
            emptyText = 'Tuyệt vời! Con không còn bài tập nào cần làm hôm nay. Nghỉ ngơi vui vẻ nhé! 🌟';
          } else if (studentTab === 'upcoming') {
            currentList = upcomingTasks;
            emptyText = 'Không có bài nào sắp hết hạn trong 24h tới! 🎉';
          } else if (studentTab === 'completed') {
            currentList = completedTasks;
            emptyText = 'Con chưa hoàn thành bài tập nào. Hãy bắt đầu làm bài nhé!';
          } else if (studentTab === 'revision') {
            currentList = revisionTasks;
            emptyText = 'Tuyệt vời! Con không có bài nào cần sửa lại. Cố gắng phát huy nhé! 🚀';
          }

          if (currentList.length === 0) {
            return (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  ✨
                </div>
                <h4 className="font-bold text-base text-slate-800">{emptyText}</h4>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentList.map(assignment => {
                const sub = submissions.find(s => s.assignmentId === assignment.id && s.studentId === currentStudent.id);
                const status = evaluateSubmissionStatus(assignment, sub);
                const cfg = STATUS_CONFIG[status];
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = now > dueDate.getTime();

                return (
                  <div
                    key={assignment.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Subject & Status */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-100 text-indigo-800">
                            {assignment.subject}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                            {assignment.difficulty}
                          </span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${cfg.badgeBg} ${cfg.textColor} ${cfg.border}`}>
                          <span>{cfg.icon}</span>
                          <span>{sub?.grade !== undefined ? `${sub.grade}đ` : cfg.label}</span>
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                        {assignment.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">
                        {assignment.description || assignment.content}
                      </p>

                      {/* Attachments if teacher provided */}
                      {(assignment.attachmentUrl || (assignment.attachments && assignment.attachments.length > 0)) && (
                        <div className="mt-2.5">
                          <a
                            href={assignment.attachmentUrl || assignment.attachments?.[0]?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Tài liệu cô gửi: {assignment.attachmentName || assignment.attachments?.[0]?.name || 'Xem chi tiết'}</span>
                          </a>
                        </div>
                      )}

                      {/* Due date info */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hạn nộp: {dueDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {dueDate.toLocaleDateString('vi-VN')}</span>
                      </div>

                      {/* Teacher's Feedback & Praise if graded */}
                      {sub?.teacherComment && (
                        <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>Lời khen & nhận xét của cô giáo:</span>
                          </div>
                          <p className="text-amber-950 italic pl-5 font-medium">
                            “{sub.teacherComment}”
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {sub?.submittedAt ? (
                        <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Đã nộp bài lúc {new Date(sub.submittedAt).toLocaleTimeString('vi-VN')}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-rose-600">
                          {isOverdue ? '⚠️ Đã quá hạn nộp' : 'Chưa nộp bài'}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenSubmit(assignment)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                          sub?.submittedAt
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <span>{sub?.submittedAt ? 'Xem / Nộp lại' : 'Nộp bài ngay'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Student Submission Modal / Drawer */}
      {activeAssignmentForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Môn {activeAssignmentForSubmit.subject}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold mt-1">
                  Nộp bài: {activeAssignmentForSubmit.title}
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Học sinh: {currentStudent.fullName} ({currentStudent.code})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveAssignmentForSubmit(null)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                ✕
              </button>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleDoSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              
              {/* Assignment Reminder */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Đề bài / Yêu cầu cô giao:
                </span>
                <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {activeAssignmentForSubmit.description || activeAssignmentForSubmit.content}
                </p>
              </div>

              {/* Input 1: Answer text */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  1. Nhập câu trả lời / Bài làm của con:
                </label>
                <textarea
                  rows={4}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Ví dụ: Bài 1: 25 x 4 = 100..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* Input 2: Photo of notebook / Homework photo */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  2. Chụp ảnh bài làm trong vở hoặc dán link ảnh:
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="Dán link ảnh chụp bài làm (https://...)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />

                  {/* Convenient sample photo buttons for demonstration */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-400">Ảnh mẫu để thử:</span>
                    {samplePhotos.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAttachmentUrl(url)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold border border-emerald-200"
                      >
                        Ảnh trang vở {i + 1}
                      </button>
                    ))}
                  </div>

                  {attachmentUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-48">
                      <img
                        src={attachmentUrl}
                        alt="Xem trước ảnh"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Input 3: Question for teacher if confused */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  3. Câu hỏi gửi cô giáo (nếu con chưa hiểu bài):
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={studentQuestion}
                    onChange={(e) => setStudentQuestion(e.target.value)}
                    placeholder="Cô ơi, con chưa hiểu rõ câu 2 phần tính nhẩm ạ..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Success Notification */}
              {showSuccessCelebration && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-center flex items-center justify-center gap-2 animate-bounce">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Hoan hô con đã nộp bài thành công! 🌟 Chúc mừng con!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Hệ thống tự động ghi nhận thời gian nộp bài chính xác.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveAssignmentForSubmit(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Nộp bài cho cô</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
