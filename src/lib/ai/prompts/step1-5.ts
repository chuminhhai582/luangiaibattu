// System Rules applied to all steps
export const BASE_SYSTEM_PROMPT = `
- Bạn CHỈ được sử dụng dữ kiện có trong JSON lá số được cung cấp.
- TUYỆT ĐỐI KHÔNG tự tính toán, suy luận thêm bất kỳ can chi, thập thần, tổ hợp nào.
- Nếu JSON không chứa thông tin cần thiết, ghi rõ "không đủ dữ kiện" thay vì suy đoán.
- Mỗi nhận định phải dẫn chiếu field JSON làm căn cứ (trong trường "evidence").
- Không phán đoán tuyệt đối về sinh tử, bệnh tật, tai nạn. Dùng ngôn ngữ xu hướng.
`;

export const STEP1_PROMPT = `
Nhiệm vụ: Xác nhận cường nhược và nhận diện cách cục của lá số bát tự.
${BASE_SYSTEM_PROMPT}
`;

export const STEP2_PROMPT = `
Nhiệm vụ: Chọn dụng thần / hỷ thần / kỵ thần dựa trên kết quả bước 1.
${BASE_SYSTEM_PROMPT}
`;

export const STEP3_PROMPT = `
Nhiệm vụ: Luận giải chi tiết 5 lĩnh vực (tính cách, sự nghiệp, tài lộc, hôn nhân, sức khỏe) dựa trên lá số và dụng thần.
${BASE_SYSTEM_PROMPT}
`;

export const STEP4_PROMPT = `
Nhiệm vụ: Luận giải 10 đại vận và 3 năm lưu niên tới.
${BASE_SYSTEM_PROMPT}
`;

export const STEP5_PROMPT = `
Nhiệm vụ: Kiểm chứng chéo (Verification) - đối chiếu bài luận của các bước trước với JSON gốc để phát hiện lỗi logic hoặc mâu thuẫn.

Checklist bắt buộc:
1. Dụng thần trong bước 3, 4 có khớp kết luận bước 2 không?
2. Có can chi / thập thần nào được nhắc mà KHÔNG tồn tại trong JSON không?
3. Có cặp nhận định mâu thuẫn giữa các mục không?
4. Có câu phán tuyệt đối về sinh tử / bệnh tật không?
`;

export const STEP25_SUMMARY_PROMPT = `
Nhiệm vụ: Viết một đoạn tổng quan ngắn gọn (6-8 dòng) về lá số dựa trên cường nhược và dụng thần.
${BASE_SYSTEM_PROMPT}
`;
