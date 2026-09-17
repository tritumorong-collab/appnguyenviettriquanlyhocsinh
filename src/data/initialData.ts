import { Student, Assignment, Submission, ClassSettings } from '../types';

export const initialClassSettings: ClassSettings = {
  className: 'Lớp 3A',
  schoolName: 'Trường Tiểu học Chu Văn An',
  teacherName: 'Cô Hoàng Mai Lan',
  teacherEmail: 'anthonydong.genz@gmail.com',
  teacherPhone: '0903 888 999',
  academicYear: '2025 - 2026',
  autoEmailAlerts: true,
  autoDailyReport: true,
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    isConfigured: false,
  },
};

export const initialStudents: Student[] = [
  {
    id: 'HS01',
    code: 'HS01',
    fullName: 'Nguyễn Minh Anh',
    gender: 'Nữ',
    dob: '2016-03-12',
    group: 1,
    parentName: 'Nguyễn Văn Hùng',
    parentPhone: '0912 345 601',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    notes: 'Chăm chỉ, chữ viết đẹp, tích cực phát biểu xây dựng bài.',
    strengths: ['Chữ viết nắn nót', 'Tiếng Việt tốt', 'Ý thức kỷ luật cao'],
    areasToImprove: ['Cần tự tin hơn khi thuyết trình trước lớp'],
  },
  {
    id: 'HS02',
    code: 'HS02',
    fullName: 'Trần Gia Huy',
    gender: 'Nam',
    dob: '2016-05-20',
    group: 1,
    parentName: 'Trần Văn Mạnh',
    parentPhone: '0912 345 602',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    notes: 'Tư duy Toán học nhanh nhẹn, tuần này có tiến bộ 18% so với tuần trước.',
    strengths: ['Tính nhẩm nhanh', 'Ham học hỏi', 'Sáng tạo'],
    areasToImprove: ['Thỉnh thoảng vội vàng chưa đọc kỹ đề'],
  },
  {
    id: 'HS03',
    code: 'HS03',
    fullName: 'Lê Phương Thảo',
    gender: 'Nữ',
    dob: '2016-08-15',
    group: 1,
    parentName: 'Lê Thị Thu',
    parentPhone: '0912 345 603',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    notes: 'Tổ trưởng gương mẫu, giúp đỡ bạn bè rất nhiệt tình.',
    strengths: ['Quản lý tổ tốt', 'Vẽ tranh đẹp', 'Nộp bài đúng giờ'],
    areasToImprove: ['Rèn thêm phép chia có dư'],
  },
  {
    id: 'HS04',
    code: 'HS04',
    fullName: 'Phạm Quang Vinh',
    gender: 'Nam',
    dob: '2016-01-10',
    group: 1,
    parentName: 'Phạm Minh Tuấn',
    parentPhone: '0912 345 604',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    notes: 'Ngoan ngoãn, thích môn Tự nhiên & Xã hội.',
    strengths: ['Hiểu biết khoa học đời sống', 'Lễ phép'],
    areasToImprove: ['Cần rèn luyện tính cẩn thận khi làm bài Tiếng Việt'],
  },
  {
    id: 'HS05',
    code: 'HS05',
    fullName: 'Hoàng Diệu Linh',
    gender: 'Nữ',
    dob: '2016-11-05',
    group: 1,
    parentName: 'Hoàng Quốc Việt',
    parentPhone: '0912 345 605',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    notes: 'Hát hay, giọng đọc truyền cảm, luôn hoàn thành bài tập đúng hạn.',
    strengths: ['Đọc diễn cảm', 'Năng nổ hoạt động văn nghệ'],
    areasToImprove: ['Cần tập trung hơn trong giờ Toán'],
  },
  {
    id: 'HS06',
    code: 'HS06',
    fullName: 'Vũ Tuấn Kiệt',
    gender: 'Nam',
    dob: '2016-04-18',
    group: 1,
    parentName: 'Vũ Đức Nam',
    parentPhone: '0912 345 606',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    notes: 'Cần quan tâm: Đang chưa hoàn thành 2 bài gần nhất do quên lịch nộp.',
    strengths: ['Nhanh nhẹn', 'Thích vận động thể thao'],
    areasToImprove: ['Cần bố mẹ nhắc nhở nộp bài đúng hạn'],
  },
  {
    id: 'HS07',
    code: 'HS07',
    fullName: 'Đặng Ngọc Mai',
    gender: 'Nữ',
    dob: '2016-09-22',
    group: 1,
    parentName: 'Đặng Văn Long',
    parentPhone: '0912 345 607',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    notes: 'Hiền lành, trầm tính, làm bài tập đầy đủ.',
    strengths: ['Cẩn thận', 'Trình bày sạch sẽ'],
    areasToImprove: ['Tích cực giơ tay phát biểu hơn'],
  },
  {
    id: 'HS08',
    code: 'HS08',
    fullName: 'Bùi Đức Hải',
    gender: 'Nam',
    dob: '2016-07-30',
    group: 1,
    parentName: 'Bùi Quang Thắng',
    parentPhone: '0912 345 608',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    notes: 'Thích môn Tin học và khám phá máy tính.',
    strengths: ['Thao tác máy tính nhanh', 'Logic tốt'],
    areasToImprove: ['Tập trung rèn chữ viết'],
  },
  {
    id: 'HS09',
    code: 'HS09',
    fullName: 'Đỗ Cẩm Tú',
    gender: 'Nữ',
    dob: '2016-02-14',
    group: 2,
    parentName: 'Đỗ Tiến Dũng',
    parentPhone: '0912 345 609',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    notes: 'Tổ trưởng tổ 2, gương mẫu, kết quả học tập ổn định.',
    strengths: ['Chăm chỉ', 'Tiếng Anh tốt'],
    areasToImprove: ['Phát huy vai trò chỉ huy nhóm'],
  },
  {
    id: 'HS10',
    code: 'HS10',
    fullName: 'Ngô Minh Khôi',
    gender: 'Nam',
    dob: '2016-12-08',
    group: 2,
    parentName: 'Ngô Xuân Trường',
    parentPhone: '0912 345 610',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    notes: 'Cần lưu ý: Hay nộp bài sát giờ hoặc nộp muộn.',
    strengths: ['Thông minh', 'Hiểu bài nhanh'],
    areasToImprove: ['Quản lý thời gian học ở nhà'],
  },
  {
    id: 'HS11',
    code: 'HS11',
    fullName: 'Dương Thảo My',
    gender: 'Nữ',
    dob: '2016-06-19',
    group: 2,
    parentName: 'Dương Văn Hòa',
    parentPhone: '0912 345 611',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    notes: 'Được nhiều sao khen thưởng tuần qua, đạt điểm tối đa môn Tiếng Việt.',
    strengths: ['Văn phong lưu loát', 'Chăm đọc sách'],
    areasToImprove: ['Rèn luyện thêm bài toán lời văn có hai phép tính'],
  },
  {
    id: 'HS12',
    code: 'HS12',
    fullName: 'Lý Quốc Bảo',
    gender: 'Nam',
    dob: '2016-10-25',
    group: 2,
    parentName: 'Lý Trọng Nghĩa',
    parentPhone: '0912 345 612',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    notes: 'Ngoan, có nhiều tiến bộ trong môn Toán tuần này.',
    strengths: ['Cố gắng vươn lên', 'Nghe lời thầy cô'],
    areasToImprove: ['Ôn tập kỹ các bảng nhân chia'],
  },
  {
    id: 'HS13',
    code: 'HS13',
    fullName: 'Trịnh Khánh An',
    gender: 'Nữ',
    dob: '2016-04-03',
    group: 2,
    parentName: 'Trịnh Thanh Bình',
    parentPhone: '0912 345 613',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    notes: 'Học đều các môn, nộp bài đầy đủ và đúng hạn.',
    strengths: ['Tự giác cao', 'Gọn gàng ngăn nắp'],
    areasToImprove: ['Tập nói to hơn khi phát biểu'],
  },
  {
    id: 'HS14',
    code: 'HS14',
    fullName: 'Mai Đức Anh',
    gender: 'Nam',
    dob: '2016-08-11',
    group: 2,
    parentName: 'Mai Văn Sơn',
    parentPhone: '0912 345 614',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    notes: 'Cần chú ý: Bài tập hôm qua chưa hoàn thành, cần liên hệ phụ huynh hỗ trợ.',
    strengths: ['Nhiệt tình với bạn bè'],
    areasToImprove: ['Thực hiện bài tập về nhà đều đặn'],
  },
  {
    id: 'HS15',
    code: 'HS15',
    fullName: 'Lương Bảo Châu',
    gender: 'Nữ',
    dob: '2016-01-28',
    group: 2,
    parentName: 'Lương Quốc Toàn',
    parentPhone: '0912 345 615',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
    notes: 'Rất sáng tạo trong giờ Mỹ thuật và Tiếng Anh.',
    strengths: ['Năng khiếu hội họa', 'Phát âm Tiếng Anh chuẩn'],
    areasToImprove: ['Cẩn thận hơn với dấu câu trong Tiếng Việt'],
  },
  {
    id: 'HS16',
    code: 'HS16',
    fullName: 'Hồ Hoàng Nam',
    gender: 'Nam',
    dob: '2016-05-17',
    group: 3,
    parentName: 'Hồ Sỹ Hùng',
    parentPhone: '0912 345 616',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    notes: 'Tổ trưởng tổ 3, nhanh nhẹn, luôn nộp bài sớm nhất lớp.',
    strengths: ['Nộp bài sớm', 'Ý thức tự giác', 'Toán giỏi'],
    areasToImprove: ['Rèn thêm viết câu dài trong văn miêu tả'],
  },
  {
    id: 'HS17',
    code: 'HS17',
    fullName: 'Đinh Lan Hương',
    gender: 'Nữ',
    dob: '2016-07-09',
    group: 3,
    parentName: 'Đinh Quang Đạt',
    parentPhone: '0912 345 617',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    notes: 'Chăm chỉ, hoàn thành tất cả các nhiệm vụ được giao.',
    strengths: ['Tỉ mỉ', 'Được bạn bè quý mến'],
    areasToImprove: ['Rèn luyện thêm tốc độ tính toán'],
  },
  {
    id: 'HS18',
    code: 'HS18',
    fullName: 'Phan Nhật Minh',
    gender: 'Nam',
    dob: '2016-09-02',
    group: 3,
    parentName: 'Phan Văn Hải',
    parentPhone: '0912 345 618',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    notes: 'Có tinh thần học tập cao, đã sửa lại bài tập Toán đạt điểm 9.',
    strengths: ['Kiên trì', 'Không ngại sửa sai'],
    areasToImprove: ['Cần đọc kỹ hướng dẫn trước khi làm'],
  },
  {
    id: 'HS19',
    code: 'HS19',
    fullName: 'Võ Tuyết Nhi',
    gender: 'Nữ',
    dob: '2016-11-20',
    group: 3,
    parentName: 'Võ Minh Quân',
    parentPhone: '0912 345 619',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    notes: 'Viết chữ đẹp, cẩn thận, là cây bút chữ đẹp của lớp.',
    strengths: ['Vở sạch chữ đẹp', 'Đúng giờ'],
    areasToImprove: ['Nâng cao tốc độ làm bài trắc nghiệm'],
  },
  {
    id: 'HS20',
    code: 'HS20',
    fullName: 'Tạ Gia Bảo',
    gender: 'Nam',
    dob: '2016-03-31',
    group: 3,
    parentName: 'Tạ Văn Thái',
    parentPhone: '0912 345 620',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    notes: 'Hiếu động, nhanh nhẹn, thỉnh thoảng nộp bài vội.',
    strengths: ['Sáng tạo', 'Tương tác tốt'],
    areasToImprove: ['Kiểm tra bài trước khi nộp'],
  },
  {
    id: 'HS21',
    code: 'HS21',
    fullName: 'Châu Yến Linh',
    gender: 'Nữ',
    dob: '2016-10-14',
    group: 3,
    parentName: 'Châu Văn Hậu',
    parentPhone: '0912 345 621',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    notes: 'Học sinh tiến bộ tuần này, nâng điểm từ 6 lên 8.5.',
    strengths: ['Chăm chỉ luyện tập', 'Cầu tiến'],
    areasToImprove: ['Duy trì phong độ học tập ổn định'],
  },
  {
    id: 'HS22',
    code: 'HS22',
    fullName: 'Hà Thế Vinh',
    gender: 'Nam',
    dob: '2016-06-27',
    group: 3,
    parentName: 'Hà Văn Tiến',
    parentPhone: '0912 345 622',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    notes: 'Cần chú ý: Còn bài tập Tiếng Việt sắp hết hạn chưa nộp.',
    strengths: ['Toán học tốt'],
    areasToImprove: ['Chú ý thời hạn nộp bài các môn'],
  },
  {
    id: 'HS23',
    code: 'HS23',
    fullName: 'Lâm Thanh Hằng',
    gender: 'Nữ',
    dob: '2016-12-19',
    group: 3,
    parentName: 'Lâm Văn Khoa',
    parentPhone: '0912 345 623',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    notes: 'Hoàn thành tốt các nhiệm vụ học tập trên lớp và ở nhà.',
    strengths: ['Ý thức tốt', 'Tự lập'],
    areasToImprove: ['Rèn thêm khả năng tính nhẩm'],
  },
  {
    id: 'HS24',
    code: 'HS24',
    fullName: 'Quách Tấn Phát',
    gender: 'Nam',
    dob: '2016-02-05',
    group: 4,
    parentName: 'Quách Văn Bình',
    parentPhone: '0912 345 624',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    notes: 'Tổ trưởng tổ 4, năng nổ nhiệt huyết.',
    strengths: ['Lãnh đạo nhóm', 'Toán tốt'],
    areasToImprove: ['Viết chữ cần nắn nót hơn'],
  },
  {
    id: 'HS25',
    code: 'HS25',
    fullName: 'Đoàn Kim Ngân',
    gender: 'Nữ',
    dob: '2016-08-29',
    group: 4,
    parentName: 'Đoàn Văn Sơn',
    parentPhone: '0912 345 625',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    notes: 'Chăm học, bài tập nộp luôn đính kèm câu hỏi rất hay.',
    strengths: ['Tư duy sâu sắc', 'Chủ động hỏi bài'],
    areasToImprove: ['Cần tự tin hơn trước đám đông'],
  },
  {
    id: 'HS26',
    code: 'HS26',
    fullName: 'Cao Hữu Nghĩa',
    gender: 'Nam',
    dob: '2016-04-24',
    group: 4,
    parentName: 'Cao Văn Lộc',
    parentPhone: '0912 345 626',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    notes: 'Ngoan ngoãn, tiến bộ rõ rệt môn Tiếng Anh.',
    strengths: ['Nhớ từ vựng tốt', 'Thân thiện'],
    areasToImprove: ['Rèn luyện kỹ năng viết câu tiếng Việt'],
  },
  {
    id: 'HS27',
    code: 'HS27',
    fullName: 'Thái Mỹ Uyên',
    gender: 'Nữ',
    dob: '2016-07-16',
    group: 4,
    parentName: 'Thái Văn Kiên',
    parentPhone: '0912 345 627',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    notes: 'Hoàn thành bài đầy đủ, luôn đúng giờ.',
    strengths: ['Ngăn nắp', 'Chăm chỉ'],
    areasToImprove: ['Cần tự tin trao đổi cùng nhóm'],
  },
  {
    id: 'HS28',
    code: 'HS28',
    fullName: 'Lưu Trọng Khang',
    gender: 'Nam',
    dob: '2016-10-02',
    group: 4,
    parentName: 'Lưu Văn Hùng',
    parentPhone: '0912 345 628',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    notes: 'Cần quan tâm: Chưa nộp 2 bài tập, phụ huynh bận đi công tác.',
    strengths: ['Sáng dạ', 'Nhiệt tình'],
    areasToImprove: ['Cần cô giáo động viên và theo sát tiến độ nộp bài'],
  },
  {
    id: 'HS29',
    code: 'HS29',
    fullName: 'Triệu Ánh Tuyết',
    gender: 'Nữ',
    dob: '2016-05-11',
    group: 4,
    parentName: 'Triệu Văn Lâm',
    parentPhone: '0912 345 629',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
    notes: 'Bài làm luôn đạt điểm cao, nhiều nhận xét tốt.',
    strengths: ['Toán - Văn đều tốt', 'Chăm chỉ'],
    areasToImprove: ['Chia sẻ phương pháp học cho các bạn trong tổ'],
  },
  {
    id: 'HS30',
    code: 'HS30',
    fullName: 'Hoàng Gia Phúc',
    gender: 'Nam',
    dob: '2016-09-08',
    group: 4,
    parentName: 'Hoàng Văn Thắng',
    parentPhone: '0912 345 630',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    notes: 'Có cố gắng, đã hoàn thành bài tập vừa giao.',
    strengths: ['Lễ phép', 'Ngoan ngoãn'],
    areasToImprove: ['Rèn luyện thêm chữ viết'],
  },
];

// Reference date helper (relative to present)
const now = new Date();
const formatISO = (offsetDays: number, hours = 20, minutes = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const initialAssignments: Assignment[] = [
  {
    id: 'B01',
    title: 'Ôn tập Bảng nhân 7 và Bảng chia 7',
    subject: 'Toán',
    content: '1. Học sinh đọc thuộc lòng bảng nhân 7 và bảng chia 7.\n2. Làm bài tập 1, 2, 3 trang 35 SGK Toán 3.\n3. Viết kết quả ra vở, chụp ảnh bài làm gửi cô hoặc nhập kết quả các phép tính vào ô trả lời.',
    attachments: [
      {
        type: 'link',
        name: 'Video bài giảng Bảng nhân 7 (Bộ GD&ĐT)',
        url: 'https://youtu.be/example-bang-nhan-7',
      },
    ],
    assignedDate: formatISO(-3, 8),
    dueDate: formatISO(-1, 20), // Overdue yesterday for pending students!
    difficulty: 'Trung bình',
    targetType: 'all',
    targetStudentIds: initialStudents.map(s => s.id),
    status: 'active',
    createdAt: formatISO(-3, 8),
  },
  {
    id: 'B02',
    title: 'Luyện từ và câu: Mở rộng vốn từ Trường học - Đặt câu Ai làm gì?',
    subject: 'Tiếng Việt',
    content: '1. Tìm 5 từ ngữ chỉ hoạt động học tập ở trường tiểu học.\n2. Đặt 3 câu theo mẫu "Ai làm gì?" có sử dụng các từ vừa tìm được.\n3. Chú ý đầu câu viết hoa, cuối câu có dấu chấm.',
    attachments: [
      {
        type: 'pdf',
        name: 'Phiếu-luyện-tập-tuần-3.pdf',
        url: 'https://example.com/phieu-tieng-viet.pdf',
      },
    ],
    assignedDate: formatISO(-2, 8),
    dueDate: formatISO(0, 20), // Due TODAY at 20:00!
    difficulty: 'Dễ',
    targetType: 'all',
    targetStudentIds: initialStudents.map(s => s.id),
    status: 'active',
    createdAt: formatISO(-2, 8),
  },
  {
    id: 'B03',
    title: 'Unit 3: Our Friends - Lesson 2 Vocabulary & Speaking',
    subject: 'Tiếng Anh',
    content: '1. Practice speaking dialogue: "Who is that? - It is my friend Tony."\n2. Do exercise 1, 2 in English Activity Book page 22.\n3. Type your answers or take a picture of your book.',
    attachments: [
      {
        type: 'link',
        name: 'Audio Pronunciation Unit 3',
        url: 'https://example.com/audio-unit3.mp3',
      },
    ],
    assignedDate: formatISO(-1, 8),
    dueDate: formatISO(1, 20), // Due tomorrow
    difficulty: 'Trung bình',
    targetType: 'all',
    targetStudentIds: initialStudents.map(s => s.id),
    status: 'active',
    createdAt: formatISO(-1, 8),
  },
  {
    id: 'B04',
    title: 'Tìm hiểu về Họ hàng nội ngoại của em',
    subject: 'Tự nhiên & Xã hội',
    content: '1. Hãy kể tên ít nhất 3 người thuộc họ nội và 3 người thuộc họ ngoại của em.\n2. Em đã làm gì để thể hiện sự quan tâm, yêu quý đối với họ hàng của mình? (Viết 3-4 câu ngắn)',
    assignedDate: formatISO(-1, 14),
    dueDate: formatISO(2, 20),
    difficulty: 'Dễ',
    targetType: 'all',
    targetStudentIds: initialStudents.map(s => s.id),
    status: 'active',
    createdAt: formatISO(-1, 14),
  },
  {
    id: 'B05',
    title: 'Bài tập nâng cao: Giải toán có lời văn bằng 2 phép tính',
    subject: 'Toán',
    content: 'Một cửa hàng buổi sáng bán được 42kg gạo, buổi chiều bán được số gạo gấp 2 lần buổi sáng. Hỏi cả hai buổi cửa hàng bán được tất cả bao nhiêu ki-lô-gam gạo? (Trình bày bài giải đầy đủ các bước).',
    assignedDate: formatISO(0, 9),
    dueDate: formatISO(3, 20),
    difficulty: 'Khó',
    targetType: 'selected',
    targetStudentIds: ['HS01', 'HS02', 'HS03', 'HS09', 'HS11', 'HS16', 'HS18', 'HS21', 'HS24', 'HS29'], // Giao cho nhóm năng khiếu
    status: 'active',
    createdAt: formatISO(0, 9),
  },
  {
    id: 'B06',
    title: 'Vẽ tranh đề tài: Góc học tập yêu thích của em',
    subject: 'Mỹ thuật',
    content: 'Em hãy vẽ và tô màu một bức tranh về góc học tập hoặc chiếc bàn học thân quen của em tại nhà. Chụp ảnh tranh vẽ và gửi lên hệ thống.',
    assignedDate: formatISO(-4, 8),
    dueDate: formatISO(4, 18),
    difficulty: 'Dễ',
    targetType: 'all',
    targetStudentIds: initialStudents.map(s => s.id),
    status: 'active',
    createdAt: formatISO(-4, 8),
  },
];

// Generate authentic initial submissions for all 30 students across assignments
export const generateInitialSubmissions = (): Submission[] => {
  const submissions: Submission[] = [];

  // For Assignment B01 (Due yesterday - some overdue, some completed on time, some late, some star)
  initialStudents.forEach((student, idx) => {
    let subStatus: Submission['status'] = 'completed_ontime';
    let grade: number | undefined = 9;
    let rank: Submission['assessmentRank'] = 'Hoàn thành tốt';
    let comment: string | undefined = 'Con học bài rất cẩn thận, tính nhẩm chính xác!';
    let isCompletedMarked = true;
    let submittedAt: string | null = formatISO(-2, 16);
    let answer = 'Câu 1: 7 x 4 = 28, 7 x 6 = 42, 7 x 8 = 56. Câu 2: 35 : 7 = 5, 49 : 7 = 7. Đã hoàn thành các bài tập trong SGK.';

    // Specific cases to match prompt requirements:
    if (student.id === 'HS06' || student.id === 'HS14' || student.id === 'HS28') {
      // 🔴 Overdue unsubmitted
      subStatus = 'incomplete';
      grade = undefined;
      rank = undefined;
      comment = undefined;
      isCompletedMarked = false;
      submittedAt = null;
      answer = '';
    } else if (student.id === 'HS10' || student.id === 'HS20') {
      // 🟠 Nộp muộn
      subStatus = 'submitted_late';
      grade = 7;
      rank = 'Hoàn thành';
      comment = 'Con nộp muộn hơn hạn quy định một chút, lần sau chú ý nộp sớm hơn nhé!';
      submittedAt = formatISO(0, 2); // submitted after deadline
    } else if (student.id === 'HS18') {
      // 🟡 Needs revision
      subStatus = 'needs_revision';
      grade = 5;
      rank = 'Yêu cầu làm lại';
      comment = 'Con bị nhầm phép tính 7 x 8 = 54 (đúng là 56). Con hãy tính lại câu 2 nhé!';
      submittedAt = formatISO(-2, 19);
    } else if (['HS01', 'HS02', 'HS03', 'HS11', 'HS16', 'HS29'].includes(student.id)) {
      // ⭐ Hoàn thành tốt
      subStatus = 'excellent';
      grade = 10;
      rank = 'Hoàn thành tốt';
      comment = 'Xuất sắc! Lời giải rõ ràng, chữ viết đẹp, nộp bài rất sớm.';
    } else {
      grade = 8 + (idx % 3);
      if (grade > 10) grade = 9;
      subStatus = grade >= 9 ? 'excellent' : 'completed_ontime';
      rank = grade >= 9 ? 'Hoàn thành tốt' : 'Hoàn thành';
    }

    submissions.push({
      id: `SUB-B01-${student.id}`,
      assignmentId: 'B01',
      studentId: student.id,
      submittedAt,
      status: subStatus,
      answerText: answer,
      attachmentName: submittedAt ? 'Bai-lam-toan.jpg' : undefined,
      attachmentUrl: submittedAt ? 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&auto=format&fit=crop&q=80' : undefined,
      isCompletedMarked,
      grade,
      assessmentRank: rank,
      teacherComment: comment,
      gradedAt: submittedAt ? formatISO(-1, 10) : undefined,
      studentQuestion: student.id === 'HS02' ? 'Thưa cô, con có thể làm thêm bài nâng cao được không ạ?' : undefined,
    });
  });

  // For Assignment B02 (Due TODAY at 20:00 - some newly submitted waiting for review, some assigned, some on time)
  initialStudents.forEach((student, idx) => {
    let subStatus: Submission['status'] = 'assigned';
    let submittedAt: string | null = null;
    let answer = '';
    let grade: number | undefined = undefined;
    let comment: string | undefined = undefined;
    let rank: Submission['assessmentRank'] = undefined;
    let isCompletedMarked = false;

    if (idx < 18) {
      // Already submitted on time today!
      subStatus = idx % 5 === 0 ? 'excellent' : 'completed_ontime';
      submittedAt = formatISO(0, 10 + (idx % 4));
      answer = '1. 5 từ chỉ hoạt động: Đọc sách, viết bài, thảo luận nhóm, giải toán, tập thể dục.\n2. Đặt câu:\n- Bạn Nam đang say sưa đọc sách ở thư viện.\n- Cả lớp đang chăm chú viết bài chính tả.\n- Chúng em cùng nhau thảo luận nhóm trong giờ Tiếng Việt.';
      isCompletedMarked = true;
      if (idx < 10) {
        grade = 9;
        rank = 'Hoàn thành tốt';
        comment = 'Con đặt câu rất hay, đúng mẫu câu Ai làm gì? và chữ viết rất sạch.';
      }
    } else if (idx >= 18 && idx < 25) {
      // 🔵 Assigned (within deadline, not submitted yet)
      subStatus = 'assigned';
    } else {
      // 🔵 In progress
      subStatus = 'assigned';
    }

    submissions.push({
      id: `SUB-B02-${student.id}`,
      assignmentId: 'B02',
      studentId: student.id,
      submittedAt,
      status: subStatus,
      answerText: answer,
      attachmentName: submittedAt ? 'Vo-luyen-tu-va-cau.jpg' : undefined,
      attachmentUrl: submittedAt ? 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=80' : undefined,
      isCompletedMarked,
      grade,
      assessmentRank: rank,
      teacherComment: comment,
      gradedAt: grade ? formatISO(0, 14) : undefined,
      studentQuestion: student.id === 'HS25' ? 'Thưa cô, từ "chạy nhảy" trong giờ ra chơi có được tính vào hoạt động ở trường không ạ?' : undefined,
    });
  });

  // For Assignment B03 (Due tomorrow)
  initialStudents.forEach((student, idx) => {
    let subStatus: Submission['status'] = 'assigned';
    let submittedAt: string | null = null;
    let answer = '';

    if (idx < 12) {
      subStatus = 'completed_ontime';
      submittedAt = formatISO(0, 11);
      answer = '1. Who is that? - It is my friend Tony.\n2. Exercise 1: 1-B, 2-C, 3-A.\nExercise 2: Nice to meet you, Mai.';
    }

    submissions.push({
      id: `SUB-B03-${student.id}`,
      assignmentId: 'B03',
      studentId: student.id,
      submittedAt,
      status: subStatus,
      answerText: answer,
      isCompletedMarked: !!submittedAt,
      grade: idx < 6 ? 10 : undefined,
      assessmentRank: idx < 6 ? 'Hoàn thành tốt' : undefined,
      teacherComment: idx < 6 ? 'Very good! You speak English clearly and confidently!' : undefined,
    });
  });

  return submissions;
};
