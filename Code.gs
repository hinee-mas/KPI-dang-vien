/**
 * KPI ĐẢNG VIÊN – máy chủ lưu dữ liệu vào Google Sheets của người quản trị.
 * Cách dùng: mở Google Trang tính (đăng nhập bằng email cá nhân) → Tiện ích mở rộng → Apps Script,
 * dán toàn bộ mã này, đổi ADMIN_PIN, rồi Triển khai → Ứng dụng web
 * (Thực thi với tư cách: Tôi; Người có quyền truy cập: Bất kỳ ai). Sao chép URL dán vào KPI_API trong index.html.
 */
const ADMIN_PIN = '123456';            // ĐỔI mã quản trị trước khi triển khai
const SHEET_NAME = 'DuLieu';
const FOLDER_NAME = 'KPI-MinhChung';
const HEAD = ['uid','Kỳ','Họ và tên','Đơn vị','Chức vụ','Tiêu chí chung (30)','Trục 1','Trục 2','Trục 3','Trục 4','Trục 5','Trục 6','Nhiệm vụ (70)','Tổng (100)','Số minh chứng','Xếp loại','Nhận xét','Cập nhật','JSON'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET_NAME);
  if (!s) { s = ss.insertSheet(SHEET_NAME); s.appendRow(HEAD); s.setFrozenRows(1); }
  return s;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function isAdmin_(q) { return String(q.adminPin || '') === ADMIN_PIN; }
function rows_() { const s = sheet_(), n = s.getLastRow(); return n < 2 ? [] : s.getRange(2, 1, n - 1, HEAD.length).getValues(); }
function doGet() { return out_({ ok: true, msg: 'KPI API' }); }

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try { return out_(handle_(JSON.parse(e.postData.contents))); }
  catch (err) { return out_({ error: String(err) }); }
  finally { lock.releaseLock(); }
}

function handle_(q) {
  const s = sheet_();
  if (q.action === 'auth') return { ok: isAdmin_(q) };

  if (q.action === 'get') {
    const rs = rows_().filter(r => r[0] === q.uid);
    if (!rs.length) return { data: null };
    const periods = {};
    if (q.col === 'kpi') {
      rs.forEach(r => { periods[r[1]] = JSON.parse(r[18]); });
      return { data: { uid: q.uid, name: rs[0][2], periods: periods } };
    }
    rs.forEach(r => { if (r[15] || r[16]) periods[r[1]] = { level: r[15], note: r[16], at: new Date(r[17]).getTime() || 0 }; });
    return { data: { uid: q.uid, periods: periods } };
  }

  if (q.action === 'list') {
    if (!isAdmin_(q)) return { error: 'Không có quyền quản trị' };
    const kpi = {}, rat = {};
    rows_().forEach(r => {
      (kpi[r[0]] = kpi[r[0]] || { uid: r[0], name: r[2], periods: {} }).periods[r[1]] = JSON.parse(r[18]);
      if (r[15] || r[16]) (rat[r[0]] = rat[r[0]] || { uid: r[0], periods: {} }).periods[r[1]] = { level: r[15], note: r[16] };
    });
    return { kpi: Object.keys(kpi).map(k => kpi[k]), ratings: rat };
  }

  if (q.action === 'set' && q.col === 'kpi') {
    const per = (q.data && q.data.periods) || {};
    let all = rows_();
    for (let i = all.length - 1; i >= 0; i--) if (all[i][0] === q.uid && !(all[i][1] in per)) s.deleteRow(i + 2);
    const cur = rows_();
    Object.keys(per).forEach(k => {
      const sm = (q.sums || {})[k] || [];
      const idx = cur.findIndex(r => r[0] === q.uid && r[1] === k);
      const old = idx >= 0 ? cur[idx] : null;
      const row = [q.uid, k].concat(sm.slice(0, 13));
      while (row.length < 15) row.push('');
      row.push(old ? old[15] : '', old ? old[16] : '', new Date(), JSON.stringify(per[k]));
      if (idx >= 0) s.getRange(idx + 2, 1, 1, HEAD.length).setValues([row]); else s.appendRow(row);
    });
    return { ok: true };
  }

  if (q.action === 'set' && q.col === 'ratings') {
    if (!isAdmin_(q)) return { error: 'Không có quyền quản trị' };
    const per = (q.data && q.data.periods) || {}, cur = rows_();
    Object.keys(per).forEach(k => {
      const idx = cur.findIndex(r => r[0] === q.uid && r[1] === k);
      if (idx >= 0) s.getRange(idx + 2, 16, 1, 3).setValues([[per[k].level || '', per[k].note || '', new Date()]]);
    });
    return { ok: true };
  }

  if (q.action === 'del') {
    if (!isAdmin_(q)) return { error: 'Không có quyền quản trị' };
    const all = rows_();
    for (let i = all.length - 1; i >= 0; i--) if (all[i][0] === q.uid) s.deleteRow(i + 2);
    return { ok: true };
  }

  if (q.action === 'upload') {
    const it = DriveApp.getFoldersByName(FOLDER_NAME);
    const folder = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
    const blob = Utilities.newBlob(Utilities.base64Decode(q.b64), q.mime || 'application/octet-stream', q.name || 'minh-chung');
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return { id: file.getId() };
  }
  return { error: 'Yêu cầu không hợp lệ' };
}
