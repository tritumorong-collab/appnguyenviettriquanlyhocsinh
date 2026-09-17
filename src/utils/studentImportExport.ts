import { Student } from '../types';

/**
 * Downloads a sample CSV template for teachers to fill in student information.
 * Uses UTF-8 BOM (\uFEFF) so Microsoft Excel opens it with perfect Vietnamese font.
 */
export const downloadStudentTemplate = () => {
  const headers = [
    'Mã học sinh',
    'Họ và tên',
    'Giới tính',
    'Ngày sinh (YYYY-MM-DD)',
    'Tổ (1-4)',
    'Họ tên phụ huynh',
    'Số điện thoại phụ huynh',
    'Điểm mạnh',
    'Cần rèn luyện',
    'Ghi chú sư phạm'
  ];

  const sampleRows = [
    [
      'HS01',
      '"Nguyễn Gia Bảo"',
      '"Nam"',
      '"2016-03-15"',
      1,
      '"Bác Nguyễn Văn Thành"',
      '"0912345678"',
      '"Chăm chỉ làm bài, tính toán nhanh"',
      '"Cần rèn thêm chữ viết nét thanh nét đậm"',
      '"Lớp phó học tập, nhiệt tình giúp bạn"'
    ].join(','),
    [
      'HS02',
      '"Trần Mai Anh"',
      '"Nữ"',
      '"2016-05-20"',
      1,
      '"Cô Trần Thị Lan"',
      '"0987654321"',
      '"Đọc to rõ ràng, chữ viết tròn đều đẹp"',
      '"Cần tập trung hơn trong giờ Toán"',
      '"Lớp trưởng gương mẫu, hoạt bát"'
    ].join(','),
    [
      'HS03',
      '"Lê Hoàng Nam"',
      '"Nam"',
      '"2016-08-10"',
      2,
      '"Chú Lê Văn Hùng"',
      '"0933112233"',
      '"Hăng hái phát biểu, tư duy hình học tốt"',
      '"Cần cẩn thận khi tính toán phép cộng trừ có nhớ"',
      '"Tổ trưởng tổ 2, chăm ngoan"'
    ].join(',')
  ];

  const csvContent = '\uFEFF' + [headers.join(','), ...sampleRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Mau_Danh_Sach_Hoc_Sinh_Tieu_Hoc.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports the current student roster to a CSV file with UTF-8 BOM.
 */
export const downloadStudentList = (students: Student[], className = 'Lớp 3A') => {
  const headers = [
    'STT',
    'Mã học sinh',
    'Họ và tên',
    'Giới tính',
    'Ngày sinh',
    'Tổ',
    'Họ tên phụ huynh',
    'Số điện thoại phụ huynh',
    'Điểm mạnh',
    'Cần rèn luyện',
    'Ghi chú sư phạm'
  ];

  const rows = students.map((s, idx) => {
    const strengths = (s.strengths || []).join('; ');
    const areas = (s.areasToImprove || []).join('; ');

    return [
      idx + 1,
      s.code,
      `"${(s.fullName || '').replace(/"/g, '""')}"`,
      `"${s.gender || 'Nam'}"`,
      `"${s.dob || ''}"`,
      s.group || 1,
      `"${(s.parentName || '').replace(/"/g, '""')}"`,
      `"${(s.parentPhone || '').replace(/"/g, '""')}"`,
      `"${strengths.replace(/"/g, '""')}"`,
      `"${areas.replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Danh_sach_hoc_sinh_${className.replace(/\s+/g, '_')}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Standard CSV line parser that handles quoted cells containing commas, escaped quotes ("")
 */
function parseCsvLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Detect delimiter: comma, semicolon, or tab
 */
function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r\n|\n|\r/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount > tabCount) return ';';
  if (tabCount > commaCount && tabCount > semicolonCount) return '\t';
  return ',';
}

/**
 * Parses dates from formats like DD/MM/YYYY, DD-MM-YYYY, or YYYY-MM-DD
 */
function normalizeDate(raw: string): string {
  if (!raw) return '2016-01-01';
  const clean = raw.trim().replace(/"/g, '');

  // Case: DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Case: YYYY-MM-DD
  const ymdMatch = clean.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return clean;
}

/**
 * Parses student CSV / text content into Student records with error checking
 */
export function parseStudentCSV(
  fileContent: string
): { success: boolean; students: Student[]; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fileContent || !fileContent.trim()) {
    return { success: false, students: [], errors: ['File rỗng hoặc không có dữ liệu.'], warnings: [] };
  }

  // Remove UTF-8 BOM if present
  let cleanContent = fileContent;
  if (cleanContent.charCodeAt(0) === 0xfeff) {
    cleanContent = cleanContent.slice(1);
  }

  const delimiter = detectDelimiter(cleanContent);
  const rawLines = cleanContent.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);

  if (rawLines.length === 0) {
    return { success: false, students: [], errors: ['Không tìm thấy dòng dữ liệu nào trong file.'], warnings: [] };
  }

  // Parse header line
  const headerTokens = parseCsvLine(rawLines[0], delimiter).map(h => 
    h.toLowerCase().trim().replace(/["\s_]/g, '')
  );

  // Identify column indices
  let codeIdx = -1;
  let nameIdx = -1;
  let genderIdx = -1;
  let dobIdx = -1;
  let groupIdx = -1;
  let parentNameIdx = -1;
  let parentPhoneIdx = -1;
  let strengthsIdx = -1;
  let areasIdx = -1;
  let notesIdx = -1;

  let hasHeader = false;

  headerTokens.forEach((token, idx) => {
    if (token.includes('mã') || token.includes('mahs') || token === 'code' || token === 'id') {
      codeIdx = idx;
      hasHeader = true;
    } else if (token.includes('tên') || token.includes('fullname') || token === 'name') {
      nameIdx = idx;
      hasHeader = true;
    } else if (token.includes('tính') || token.includes('gender') || token === 'phái') {
      genderIdx = idx;
      hasHeader = true;
    } else if (token.includes('sinh') || token.includes('dob') || token.includes('birth')) {
      dobIdx = idx;
      hasHeader = true;
    } else if (token.includes('tổ') || token.includes('group') || token === 'to') {
      groupIdx = idx;
      hasHeader = true;
    } else if (token.includes('phụhuynh') && (token.includes('tên') || !token.includes('thoại') && !token.includes('sđt'))) {
      parentNameIdx = idx;
      hasHeader = true;
    } else if (token.includes('thoại') || token.includes('sđt') || token.includes('sdt') || token.includes('phone')) {
      parentPhoneIdx = idx;
      hasHeader = true;
    } else if (token.includes('mạnh') || token.includes('strength')) {
      strengthsIdx = idx;
      hasHeader = true;
    } else if (token.includes('rèn') || token.includes('cảithiện') || token.includes('improve')) {
      areasIdx = idx;
      hasHeader = true;
    } else if (token.includes('chú') || token.includes('note') || token.includes('nhậnxét')) {
      notesIdx = idx;
      hasHeader = true;
    }
  });

  const startIndex = hasHeader ? 1 : 0;
  
  // If no header found, fallback to positional indices
  if (!hasHeader) {
    codeIdx = 0;
    nameIdx = 1;
    genderIdx = 2;
    dobIdx = 3;
    groupIdx = 4;
    parentNameIdx = 5;
    parentPhoneIdx = 6;
  }

  const students: Student[] = [];
  const existingCodes = new Set<string>();

  for (let i = startIndex; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    const row = parseCsvLine(line, delimiter);

    // If row has less than 2 items, skip or warn
    if (row.length < 2) continue;

    // Extract student code
    let code = (codeIdx >= 0 && row[codeIdx] ? row[codeIdx].trim() : '').replace(/["']/g, '');
    if (!code) {
      const num = students.length + 1;
      code = `HS${num < 10 ? '0' + num : num}`;
    }

    // Extract full name
    const fullName = (nameIdx >= 0 && row[nameIdx] ? row[nameIdx].trim() : '').replace(/["']/g, '');
    if (!fullName) {
      warnings.push(`Dòng ${i + 1}: Bỏ qua vì không có họ và tên học sinh.`);
      continue;
    }

    // Check duplicate in same file
    if (existingCodes.has(code.toUpperCase())) {
      const originalCode = code;
      const nextNum = students.length + 1;
      code = `HS${nextNum < 10 ? '0' + nextNum : nextNum}`;
      warnings.push(`Dòng ${i + 1}: Mã "${originalCode}" bị trùng, đã tự động đổi thành "${code}".`);
    }
    existingCodes.add(code.toUpperCase());

    // Gender
    let rawGender = (genderIdx >= 0 && row[genderIdx] ? row[genderIdx].trim() : '').toLowerCase();
    let gender: 'Nam' | 'Nữ' = 'Nam';
    if (rawGender.includes('nữ') || rawGender.includes('nu') || rawGender.includes('gái') || rawGender === 'f') {
      gender = 'Nữ';
    }

    // Date of Birth
    const rawDob = dobIdx >= 0 && row[dobIdx] ? row[dobIdx].trim() : '';
    const dob = normalizeDate(rawDob);

    // Group (1-4)
    let group = 1;
    if (groupIdx >= 0 && row[groupIdx]) {
      const parsedGroup = parseInt(row[groupIdx].replace(/\D/g, ''), 10);
      if (!isNaN(parsedGroup) && parsedGroup >= 1 && parsedGroup <= 4) {
        group = parsedGroup;
      }
    }

    // Parent Name
    const parentName = (parentNameIdx >= 0 && row[parentNameIdx] ? row[parentNameIdx].trim() : '').replace(/["']/g, '');

    // Parent Phone
    const parentPhone = (parentPhoneIdx >= 0 && row[parentPhoneIdx] ? row[parentPhoneIdx].trim() : '').replace(/["']/g, '');

    // Strengths
    const rawStrengths = strengthsIdx >= 0 && row[strengthsIdx] ? row[strengthsIdx].trim() : '';
    const strengths = rawStrengths 
      ? rawStrengths.split(/;|,/).map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
      : ['Chăm chỉ', 'Hăng hái phát biểu'];

    // Areas to improve
    const rawAreas = areasIdx >= 0 && row[areasIdx] ? row[areasIdx].trim() : '';
    const areasToImprove = rawAreas
      ? rawAreas.split(/;|,/).map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
      : ['Cần rèn luyện thêm chữ viết'];

    // Notes
    const notes = (notesIdx >= 0 && row[notesIdx] ? row[notesIdx].trim() : '').replace(/["']/g, '');

    students.push({
      id: code,
      code,
      fullName,
      gender,
      dob,
      group,
      parentName: parentName || `Phụ huynh em ${fullName}`,
      parentPhone: parentPhone || '0912 345 678',
      notes: notes || undefined,
      strengths,
      areasToImprove
    });
  }

  if (students.length === 0) {
    errors.push('Không nhận diện được học sinh nào từ file đã tải lên. Vui lòng kiểm tra lại định dạng file mẫu.');
    return { success: false, students: [], errors, warnings };
  }

  return { success: true, students, errors, warnings };
}
