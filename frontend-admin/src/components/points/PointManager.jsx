import React, { useState, useEffect, Suspense } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Đảm bảo đường dẫn import đúng với cấu trúc thư mục của bạn
import MediaSelector from "../mediaSelector/MediaSelector"; 
import PointPreview from "../pointsPreview/PointPreview";

// MapPicker thường nặng nên dùng Lazy load
const MapPicker = React.lazy(() => import("../mappicker/MapPicker"));

// --- CONFIG ---
const API_POINT_URL = "http://localhost:5000/api/points";
const MEDIA_BASE_URL = "http://localhost:5001/uploads/";

// --- INITIAL STATE ---
const initialPointState = {
  id: "", 
  title: "", 
  lead: "", 
  description: "", 
  website: "",
  logoSrc: "/images/logo-default.svg",
  imageSrc: "/images/img-default.jpg",
  panoramaUrl: "",
  enableSchedule: true,
  schedule: {
    monday: "Closed", tuesday: "10:00 - 18:00", wednesday: "10:00 - 18:00",
    thursday: "10:00 - 20:00", friday: "10:00 - 18:00", saturday: "10:00 - 18:00", sunday: "10:00 - 18:00"
  },
  contact: { phone: "", email: "" },
  posX: 0, posY: 0, posZ: 0,
};

// Cấu hình Toolbar cho ReactQuill
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};
const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image'];

export default function PointManager() {
  // === STATE ===
  const [points, setPoints] = useState([]);
  const [pointForm, setPointForm] = useState(initialPointState);
  const [isEditingPoint, setIsEditingPoint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Modal State (Map & Media)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null); // Để biết đang chọn ảnh cho logo hay ảnh bìa...

  // === FETCH DATA ===
  const fetchPoints = async () => {
    try {
      const response = await fetch(API_POINT_URL);
      const data = await response.json();
      setPoints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi fetch points:", error);
      setPoints([]);
    }
  };

  useEffect(() => { fetchPoints(); }, []);

  // === HANDLERS ===
  const handleEditPointClick = (point) => {
    // Xử lý lấy toạ độ từ array hoặc field lẻ
    let x = 0, y = 0, z = 0;
    if (Array.isArray(point.position) && point.position.length >= 3) {
      x = point.position[0]; y = point.position[1]; z = point.position[2];
    } else {
      x = point.posX || 0; y = point.posY || 0; z = point.posZ || 0;
    }
    
    // Merge dữ liệu cũ với default để tránh lỗi undefined khi render
    const editingData = {
      ...initialPointState,
      ...point,
      posX: x, posY: y, posZ: z,
      enableSchedule: point.enableSchedule !== undefined ? point.enableSchedule : true, 
      schedule: point.schedule || initialPointState.schedule,
      contact: point.contact || initialPointState.contact,
    };

    setPointForm(editingData);
    setIsEditingPoint(true);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditPoint = () => {
    setPointForm(initialPointState);
    setIsEditingPoint(false);
    setMessage(null);
  };

  const handleDescriptionChange = (val) => {
    setPointForm(prev => ({ ...prev, description: val }));
  };

  // --- HÀM LƯU QUAN TRỌNG (ĐÃ FIX LỖI 500) ---
  const handleSavePoint = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null);

    // 1. Validate cơ bản
    if (!pointForm.id || !pointForm.title) {
      setMessage({ type: "error", text: "Vui lòng điền ID và Tiêu đề." });
      setLoading(false); return;
    }

    try {
      // 2. Hàm làm sạch số (Chuyển dấu phẩy thành chấm, ép kiểu Number)
      const cleanNumber = (val) => {
        if (!val) return 0;
        const strVal = String(val).replace(',', '.'); // Nếu lỡ nhập 10,5 -> 10.5
        const num = Number(strVal);
        return isNaN(num) ? 0 : num;
      };

      // 3. Chuẩn bị Payload sạch sẽ
      const payload = {
        ...pointForm,
        posX: cleanNumber(pointForm.posX),
        posY: cleanNumber(pointForm.posY),
        posZ: cleanNumber(pointForm.posZ),
      };

      console.log("📤 Sending Payload:", payload); // Debug xem gửi gì đi

      const method = isEditingPoint ? "PUT" : "POST";
      const url = isEditingPoint ? `${API_POINT_URL}/${pointForm.id}` : API_POINT_URL;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Lỗi HTTP ${response.status}`);
      }

      // Thành công
      setMessage({ type: "success", text: `${isEditingPoint ? "Đã cập nhật" : "Đã tạo mới"} thành công!` });
      
      if (!isEditingPoint) {
        setPointForm(initialPointState); // Reset form nếu là thêm mới
      }
      fetchPoints(); // Load lại danh sách
    } catch (error) {
      console.error("Save Error:", error);
      setMessage({ type: "error", text: `LỖI: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoint = async (pointId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa điểm ${pointId}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_POINT_URL}/${pointId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa thất bại");

      setMessage({ type: "success", text: "Đã xóa thành công." });
      fetchPoints();
      if (pointForm.id === pointId) handleCancelEditPoint();
    } catch (error) {
      setMessage({ type: "error", text: "Lỗi khi xóa: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Helper hiển thị toạ độ đẹp
  const displayXYZ = (val) => (val !== undefined && val !== null) ? Number(val).toFixed(3) : "0.000";

  return (
    <>
      {/* Thông báo lỗi/thành công */}
      {message && (
        <div className={message.type === 'success' ? 'message-box msg-success' : 'message-box msg-error'}>
          {message.text}
        </div>
      )}

      <div className="split-layout">
        
        {/* CỘT TRÁI: DANH SÁCH ĐIỂM */}
        <aside className="panel">
          <div className="panel-header">
            <span>Danh Sách Điểm ({points.length})</span>
          </div>
          <div className="list-group">
            {points.map(point => (
              <div key={point.id} className="list-item">
                <span className="item-title">{point.title || point.id}</span>
                <div className="item-actions">
                  <button onClick={() => handleEditPointClick(point)} className="btn btn-primary btn-sm">Sửa</button>
                  <button onClick={() => handleDeletePoint(point.id)} className="btn btn-danger btn-sm">Xóa</button>
                </div>
              </div>
            ))}
            {points.length === 0 && <div style={{ padding: 15, color: '#999', fontStyle: 'italic' }}>Chưa có dữ liệu</div>}
          </div>
        </aside>

        {/* CỘT GIỮA & PHẢI: FORM + PREVIEW */}
        <div className="admin-layout-grid">
          
          {/* CỘT GIỮA: FORM NHẬP LIỆU */}
          <main className="panel">
            <div className="panel-header panel-header-actions">
              <span>{isEditingPoint ? `Đang sửa: ${pointForm.title}` : "Thêm Điểm Mới"}</span>
              {isEditingPoint && (
                <button onClick={handleCancelEditPoint} className="btn btn-sm btn-secondary">Hủy</button>
              )}
            </div>

            <div className="form-section">
              <form onSubmit={handleSavePoint}>
                
                {/* ID & Title */}
                <div className="form-row-id-title">
                  <div className="form-group">
                    <label className="form-label">ID (Duy nhất)</label>
                    <input 
                      type="text" className="form-control" required
                      value={pointForm.id} disabled={isEditingPoint}
                      onChange={(e) => setPointForm(prev => ({ ...prev, id: e.target.value }))} 
                      placeholder="VD: P01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tiêu đề hiển thị</label>
                    <input 
                      type="text" className="form-control" required
                      value={pointForm.title} 
                      onChange={(e) => setPointForm(prev => ({ ...prev, title: e.target.value }))} 
                      placeholder="VD: Khu vực A"
                    />
                  </div>
                </div>

                {/* Map Picker Button */}
                <div className="form-group">
                  <label className="form-label">Vị trí trong không gian 3D</label>
                  <div className="input-group">
                    <div className="form-control input-display-readonly">
                      X: {displayXYZ(pointForm.posX)} | Y: {displayXYZ(pointForm.posY)} | Z: {displayXYZ(pointForm.posZ)}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setIsPickerOpen(true)}>
                      Chọn trên bản đồ
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả ngắn (Lead)</label>
                  <textarea 
                    className="form-control" rows="2"
                    value={pointForm.lead} 
                    onChange={(e) => setPointForm(prev => ({ ...prev, lead: e.target.value }))} 
                  />
                </div>

                {/* Rich Editor */}
                <div className="form-group">
                  <label className="form-label">Mô tả chi tiết</label>
                  <div className="quill-wrapper">
                    <ReactQuill 
                      theme="snow" value={pointForm.description} onChange={handleDescriptionChange} 
                      modules={modules} formats={formats} 
                      className="quill-editor-custom"
                    />
                  </div>
                </div>

                {/* Media Section */}
                <h3 className="section-title">Hình ảnh & Media</h3>
                
                <div className="form-group">
                  <label className="form-label">Logo & Ảnh đại diện</label>
                  <div className="media-row">
                    {/* Logo */}
                    <div className="media-col">
                      <div className="input-group">
                        <input type="text" className="form-control" value={pointForm.logoSrc} readOnly style={{fontSize: 12}}/>
                        <button type="button" className="btn btn-primary" onClick={() => { setMediaTarget("logoSrc"); setIsMediaModalOpen(true); }}>Logo</button>
                      </div>
                      {pointForm.logoSrc && <img src={pointForm.logoSrc} alt="" className="media-thumb-preview" />}
                    </div>
                    {/* Image */}
                    <div className="media-col">
                      <div className="input-group">
                        <input type="text" className="form-control" value={pointForm.imageSrc} readOnly style={{fontSize: 12}}/>
                        <button type="button" className="btn btn-primary" onClick={() => { setMediaTarget("imageSrc"); setIsMediaModalOpen(true); }}>Ảnh</button>
                      </div>
                      {pointForm.imageSrc && <img src={pointForm.imageSrc} alt="" className="media-thumb-preview" />}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ảnh 360 Panorama</label>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="URL Panorama..." value={pointForm.panoramaUrl} onChange={(e) => setPointForm(prev => ({ ...prev, panoramaUrl: e.target.value }))} />
                    <button type="button" className="btn btn-primary" onClick={() => { setMediaTarget("panoramaUrl"); setIsMediaModalOpen(true); }}>Chọn 360</button>
                  </div>
                </div>

                {/* Website */}
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input 
                    type="text" className="form-control"
                    value={pointForm.website || ''} 
                    onChange={(e) => setPointForm(prev => ({ ...prev, website: e.target.value }))} 
                    placeholder="https://..."
                  />
                </div>

                {/* Schedule Toggle */}
                <div className="section-header-toggle">
                  <h3 className="section-title" style={{border: 'none', margin: 0, padding: 0}}>Giờ mở cửa</h3>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span className={`toggle-status-label ${pointForm.enableSchedule ? 'on' : ''}`}>
                      {pointForm.enableSchedule ? 'Đang Hiển thị' : 'Đang Ẩn'}
                    </span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={pointForm.enableSchedule}
                        onChange={(e) => setPointForm(prev => ({ ...prev, enableSchedule: e.target.checked }))} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {pointForm.enableSchedule ? (
                  <div className="schedule-grid" style={{ marginBottom: '24px' }}>
                    {Object.keys(pointForm.schedule).map(day => (
                      <div key={day} className="schedule-item">
                        <span className="schedule-label" style={{textTransform: 'capitalize'}}>{day}:</span>
                        <input 
                          type="text" className="form-control schedule-input"
                          value={pointForm.schedule[day]} 
                          onChange={(e) => setPointForm(prev => ({...prev, schedule: {...prev.schedule, [day]: e.target.value}}))} 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '15px', background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '8px', marginBottom: '20px', color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
                      Thông tin giờ mở cửa sẽ bị ẩn.
                  </div>
                )}

                {/* Contact */}
                <h3 className="section-title">Thông tin liên hệ</h3>
                <div className="contact-grid">
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input 
                      type="text" className="form-control"
                      value={pointForm.contact?.phone || ''} 
                      onChange={(e) => setPointForm(prev => ({ ...prev, contact: {...prev.contact, phone: e.target.value} }))} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" className="form-control"
                      value={pointForm.contact?.email || ''} 
                      onChange={(e) => setPointForm(prev => ({ ...prev, contact: {...prev.contact, email: e.target.value} }))} 
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions-footer">
                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? "Đang xử lý..." : isEditingPoint ? "LƯU CẬP NHẬT" : "TẠO ĐIỂM MỚI"}
                  </button>
                </div>

              </form>
            </div>
          </main>

          {/* CỘT PHẢI: LIVE PREVIEW */}
          <aside className="panel preview-sticky-sidebar">
            <div className="panel-header preview-header-gradient">
              <span>Xem trước trực tiếp</span>
            </div>
            <div className="preview-content-wrapper">
              <PointPreview formData={pointForm} />
            </div>
          </aside>

        </div>
      </div>

      {/* --- MODALS --- */}
      {isPickerOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{width: '90vw', height: '90vh', maxWidth: 'none'}}>
            <Suspense fallback={<div>Đang tải bản đồ...</div>}>
              <MapPicker 
                onPick={(x,y,z) => { 
                  setPointForm(prev => ({ ...prev, posX: x, posY: y, posZ: z })); 
                  setIsPickerOpen(false); 
                }} 
                onClose={() => setIsPickerOpen(false)} 
              />
            </Suspense>
          </div>
        </div>
      )}

      {isMediaModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{width: '800px'}}>
             <div className="modal-header">Chọn hình ảnh</div>
             <MediaSelector 
               onSelect={(url) => { 
                 setPointForm(prev => ({ ...prev, [mediaTarget]: url })); 
                 setIsMediaModalOpen(false); 
               }} 
               onClose={() => setIsMediaModalOpen(false)} 
               mediaBaseUrl={MEDIA_BASE_URL} 
             />
          </div>
        </div>
      )}
    </>
  );
}