import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Cơ quan chủ quản</h4>
                    <p>Công Ty TNHH Đào Tạo Robot Robotone</p>
                    <p>Chi Nhánh: Phòng Đào Tạo - UAV Lab</p>
                    <p>Địa chỉ: 572 Liên Phương, Long Thượng, Hồ Chí Minh</p>
                </div>
                <div className="footer-section">
                    <h4>Hỗ trợ</h4>
                    <a href="mailto:khaodao@uavtrainingcenter.vn">Email: khaodao@uavtrainingcenter.vn</a>
                    <p>Thời gian: 8:00 - 17:00 | Thứ 2 - Thứ 6</p>
                </div>
                <div className="footer-section">
                    <h4>Văn bản pháp lý</h4>
                    <a href="#">Luật Phòng không Nhân Dân Số 56/2024/QH15</a>
                    <a href="#">Nghị Định 288/2025/NĐ-CP Quy Định về CL Tàu Bay Không Người Lái và Tàu Bay Khác</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 Hệ thống Đào tạo và Cấp Chứng chỉ Điều khiển UAV Quốc gia. Bản quyền thuộc về Không-Việt UAV Việt Nam.</p>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {/* Sử dụng className link-button từ CSS global để có màu vàng khi hover */}
                    <a href="#" className="link-button" style={{ color: '#aaa', fontWeight: 'normal' }}>Chính sách bảo mật</a>
                    <span style={{ color: '#555' }}>|</span>
                    <a href="#" className="link-button" style={{ color: '#aaa', fontWeight: 'normal' }}>Điều khoản sử dụng</a>
                    <span style={{ color: '#555' }}>|</span>
                    <a href="#" className="link-button" style={{ color: '#aaa', fontWeight: 'normal' }}>Sitemap</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;