import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Submission, Assignment, Student } from '../types';
import { 
  X, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Image, 
  ExternalLink, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Send,
  ZoomIn
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  assignment: Assignment;
  submission: Submission;
  student: Student;
  onClose: () => void;
}

const QUICK_COMMENTS = [
  'Bài làm tốt, chữ viết sạch đẹp!',
  'Con cần tính cẩn thận hơn ở bài 2 nhé.',
  'Đã có tiến bộ rất rõ rệt, cô khen con!',
  'Con đọc kỹ lại đề bài và làm lại câu cuối nhé.',
  'Làm bài đúng phương pháp, trình bày khoa học.',
  'Cần chú ý thêm dấu câu và chính tả con nhé.',
];

export const GradingModal: React.FC<Props> = ({ assignment, submission, student, onClose }) => {
  const { gradeSubmission, reassignTask } = useApp();

  const [grade, setGrade] = useState<number>(submission.grade !== undefined ? submission.grade : 9);
  const [assessmentRank, setAssessmentRank] = useState<Submission['assessmentRank']>(
    submission.assessmentRank || 'Hoàn thành tốt'
  );
  const [comment, setComment] = useState<string>(submission.teacherComment || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedList, setAiGeneratedList] = useState<string[]>([]);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Auto-adjust rank based on grade
  useEffect(() => {
    if (grade >= 9) {
      setAssessmentRank('Hoàn thành tốt');
    } else if (grade >= 5) {
      setAssessmentRank('Hoàn thành');
    } else if (grade > 0) {
      setAssessmentRank('Yêu cầu làm lại');
    } else {
      setAssessmentRank('Chưa hoàn thành');
    }
  }, [grade]);

  // AI Suggestion Handler
  const handleAiSuggest = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.fullName,
          subject: assignment.subject,
          assignmentTitle: assignment.title,
          grade,
          assessmentRank,
          studentQuestion: submission.studentQuestion,
          submissionAttempt: (submission.reassignedCount || 0) + 1,
        }),
      });

      const data = await response.json();
      if (data.comment) {
        setComment(data.comment);
      }
      if (Array.isArray(data.alternatives) && data.alternatives.length > 0) {
        setAiGeneratedList(data.alternatives);
      }
    } catch (err) {
      console.warn('AI suggestion fallback used', err);
      setComment(`Cô khen em ${student.fullName} đã hoàn thành bài ${assignment.subject}. Con chú ý rèn chữ cẩn thận hơn để đạt kết quả tốt nhất nhé!`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    gradeSubmission(submission.id, {
      grade: Number(grade),
      assessmentRank,
      teacherComment: comment.trim(),
    });

    // If grade is excellent (>= 9 or 'Hoàn thành tốt'), trigger joyful confetti!
    if (grade >= 9 || assessmentRank === 'Hoàn thành tốt') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onClose();
  };

  const handleReassign = () => {
    if (window.confirm(`Yêu cầu học sinh "${student.fullName}" làm lại bài tập này?`)) {
      reassignTask(assignment.id, student.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">
              {student.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {student.code}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg">{student.fullName}</h3>
                <span className="text-xs text-indigo-200">(Tổ {student.group})</span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Chấm bài: <strong className="text-white">{assignment.subject}</strong> — {assignment.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Student's Work (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Bài làm của học sinh
              </span>
              {submission.submittedAt && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Nộp: {new Date(submission.submittedAt).toLocaleTimeString('vi-VN')} ({new Date(submission.submittedAt).toLocaleDateString('vi-VN')})
                </span>
              )}
            </div>

            {/* Answer text */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                Nội dung câu trả lời / Bài giải:
              </span>
              <p className="text-sm text-slate-900 whitespace-pre-line leading-relaxed font-medium">
                {submission.answerText || 'Học sinh chưa nhập câu trả lời dạng văn bản (đã nộp ảnh bài viết đính kèm).'}
              </p>
            </div>

            {/* Student's Question to Teacher if any */}
            {submission.studentQuestion && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>Câu hỏi của em gửi cô giáo:</span>
                </div>
                <p className="text-amber-950 italic pl-5">
                  "{submission.studentQuestion}"
                </p>
              </div>
            )}

            {/* Attached Photo of Homework (with zoom) */}
            {submission.attachmentUrl && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Image className="w-3.5 h-3.5 text-indigo-600" />
                    Ảnh chụp bài làm trong vở:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowImageZoom(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    Phóng to ảnh
                  </button>
                </div>

                <div 
                  className="relative rounded-xl overflow-hidden cursor-pointer group border border-slate-200 max-h-56"
                  onClick={() => setShowImageZoom(true)}
                >
                  <img
                    src={submission.attachmentUrl}
                    alt="Bài làm học sinh"
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    Nhấn để phóng to ảnh
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Grading & AI Evaluation (6 cols) */}
          <form onSubmit={handleSave} className="md:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Grade Selector (0 - 10) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Điểm số (Thang điểm 10)
                  </label>
                  <span className="text-2xl font-black text-indigo-700">
                    {grade} / 10đ
                  </span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGrade(num)}
                      className={`flex-1 min-w-[32px] h-9 rounded-xl font-black text-xs transition-all ${
                        grade === num
                          ? 'bg-indigo-600 text-white shadow-md scale-105 ring-2 ring-indigo-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assessment Rank Radios */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Mức độ đánh giá
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Hoàn thành tốt', icon: '⭐', bg: 'bg-amber-50 text-amber-900 border-amber-300' },
                    { label: 'Hoàn thành', icon: '🟢', bg: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
                    { label: 'Yêu cầu làm lại', icon: '🟡', bg: 'bg-yellow-50 text-yellow-900 border-yellow-300' },
                    { label: 'Chưa hoàn thành', icon: '🔴', bg: 'bg-rose-50 text-rose-900 border-rose-300' },
                  ].map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setAssessmentRank(item.label as any)}
                      className={`p-2 rounded-xl text-xs font-bold border text-left flex items-center gap-2 transition-all ${
                        assessmentRank === item.label
                          ? `${item.bg} ring-2 ring-indigo-500 shadow-xs font-extrabold`
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Comments Bank */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  Nhận xét nhanh tiểu học:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_COMMENTS.map((qc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setComment(qc)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-[11px] font-medium text-slate-700 transition-colors border border-slate-200"
                    >
                      {qc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teacher Comment with AI Assistant */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Lời phê & Nhận xét của giáo viên
                  </label>
                  <button
                    id="btn-ai-suggest-comment"
                    type="button"
                    onClick={handleAiSuggest}
                    disabled={isAiLoading}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiLoading ? 'AI đang viết...' : 'AI Gợi ý nhận xét'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập nhận xét hoặc dùng nút AI Gợi ý ở trên..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />

                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Giáo viên có thể chỉnh sửa nhận xét thoải mái trước khi lưu.
                </p>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReassign}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
                title="Yêu cầu học sinh làm lại bài này"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yêu cầu làm lại</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu đánh giá & Điểm</span>
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>

      {/* Image Zoom Modal */}
      {showImageZoom && submission.attachmentUrl && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImageZoom(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <button
              type="button"
              onClick={() => setShowImageZoom(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={submission.attachmentUrl}
              alt="Bài làm phóng to"
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
