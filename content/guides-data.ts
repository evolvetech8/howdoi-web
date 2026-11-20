export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  category:
    | "Vay mua nhà & Lãi suất"
    | "Thẩm định trước đặt cọc"
    | "Dòng tiền gia đình"
    | "Tiết kiệm"
    | "Đầu tư"
    | "Quản lý nợ"
    | "Tâm lý tiền bạc"
    | "Bảo hiểm";
  readTime: string;
  date: string;
  author: string;
  relatedTool?: string;
  infographicUrl?: string;
  scenarioBadge?: string;
  isHomebuyerFeatured?: boolean;
  content: {
    introduction: string;
    keyTakeaways: string[];
    sections: {
      heading: string;
      body: string[];
      tip?: string;
    }[];
    conclusion: string;
  };
}

export const GUIDES: Guide[] = [
  {
    slug: "cu-nhay-lai-suat-thang-13-va-25",
    title:
      "Điều gì xảy ra với khoản vay mua nhà sau 12–24 tháng đầu ưu đãi? Giải phẫu cú sốc lãi thả nổi",
    excerpt:
      "Vì sao năm đầu trả nợ 20 triệu/tháng rất nhẹ nhàng nhưng sang tháng thứ 13 lại vọt lên 27,33 triệu/tháng? Phân tích toán học về vách đá lãi suất thả nổi và bẫy ân hạn nợ gốc.",
    category: "Vay mua nhà & Lãi suất",
    readTime: "7 phút đọc",
    date: "14/11/2026",
    author: "EvolveTech / Archonic",
    relatedTool: "/kiem-tra-mua-nha",
    infographicUrl:
      "/media/infographics/fg_05_grace_period_month_25_cliff_4x5.png",
    scenarioBadge: "Kịch bản chuẩn: Vay 2,0 tỷ • 240 tháng • 7% → 12%/năm",
    isHomebuyerFeatured: true,
    content: {
      introduction:
        "Khi đi xem căn hộ hoặc nhà phố tại Việt Nam, con số mà người mua thường được nghe nhiều nhất là mức lãi suất ưu đãi năm đầu: chỉ từ 6,0% đến 7,5%/năm. Nhưng hợp đồng tín dụng mua nhà kéo dài 15 đến 25 năm, trong khi lãi suất ưu đãi chỉ tồn tại đúng 12 hoặc 24 tháng đầu tiên.",
      keyTakeaways: [
        "Sau thời gian ưu đãi, lãi suất chuyển sang thả nổi = Lãi suất cơ sở / Tiết kiệm 12T + Biên độ (theo hợp đồng); mức lãi sau ưu đãi cần xác nhận với ngân hàng.",
        "Với khoản vay 2,0 tỷ (240 tháng, gốc đều), tiền trả tháng 1 là 20,00 triệu nhưng tháng 13 nhảy vọt lên 27,33 triệu (+7,33 triệu/tháng).",
        "Nếu kết hợp ân hạn nợ gốc 24 tháng, tháng thứ 25 sẽ chịu 'cú sốc kép': vừa bắt đầu trả nợ gốc bị nén vào 18 năm còn lại, vừa chịu lãi suất thả nổi.",
      ],
      sections: [
        {
          heading: "1. Giải phẫu bài toán vay 2,0 tỷ đồng: Tháng 1 vs Tháng 13",
          body: [
            "Giả sử gia đình bạn mua căn hộ 2,5 – 2,8 tỷ đồng, vay ngân hàng 2.000.000.000 ₫ trong 240 tháng (20 năm) theo phương thức dư nợ giảm dần (trả gốc đều 8.333.333 ₫/tháng).",
            "• Trong 12 tháng đầu (Lãi suất ưu đãi 7,0%/năm): Tiền lãi tháng 1 là 2.000.000.000 × (7% / 12) = 11.666.667 ₫. Tổng trả ngân hàng tháng 1 = 20.000.000 ₫. Nếu thu nhập ròng gia đình là 55 triệu và chi phí sinh hoạt thiết yếu là 30 triệu, mỗi tháng gia đình vẫn dư +5.000.000 ₫.",
            "• Bước sang Tháng thứ 13 (Hết ưu đãi, lãi thả nổi 12,0%/năm): Dư nợ gốc đầu tháng 13 còn 1.900.000.000 ₫. Tiền lãi tháng 13 lập tức nhảy lên 1.900.000.000 × (12% / 12) = 19.000.000 ₫. Cộng với 8.333.333 ₫ tiền gốc, tổng nghĩa vụ trả nợ vọt lên 27.333.333 ₫/tháng.",
            "• Hệ quả dòng tiền: 55.000.000 ₫ (thu nhập) - 30.000.000 ₫ (sinh hoạt) - 27.333.333 ₫ (trả nợ) = ÂM 2.333.333 ₫/tháng!",
          ],
          tip: "Tuyệt đối không lấy số tiền trả ngân hàng của năm đầu tiên làm thước đo khả năng mua nhà. Hãy lấy số tiền trả tại Tháng 13 (hoặc Tháng 25) ở kịch bản lãi suất thả nổi cộng thêm 2% biên độ dự phòng.",
        },
        {
          heading: "2. Ảo giác từ chính sách 'Ân hạn nợ gốc 24 tháng'",
          body: [
            "Nhiều dự án quảng cáo 'Chỉ trả lãi, không trả gốc trong 2 năm đầu'. Điều cần hiểu rõ là: ân hạn nợ gốc KHÔNG phải là miễn nợ gốc.",
            "Khi bạn không trả đồng nợ gốc nào trong 24 tháng đầu, toàn bộ 2.000.000.000 ₫ nợ gốc sẽ bị dồn vào 216 tháng còn lại (18 năm). Nghĩa là tiền gốc mỗi tháng sau ân hạn tăng từ 8,33 triệu lên 9,26 triệu/tháng, cộng trực tiếp với mức lãi thả nổi tính trên 100% dư nợ gốc chưa hề giảm.",
          ],
        },
        {
          heading:
            "3. Cách dùng DepositGuard để tìm điểm cân bằng trước khi đặt cọc",
          body: [
            "Trước khi ký thỏa thuận đặt cọc, hãy nhập thông số gói vay vào bộ mô phỏng DepositGuard và bật nút 'Sốc lãi suất +2%' trên trang kết quả.",
            "Nếu dòng tiền tháng 13 bị âm, Bộ giải ngược (Reverse Affordability Solver) sẽ chỉ rõ bạn cần giảm khoản vay xuống bao nhiêu (ví dụ từ 2,0 tỷ về 1,64 tỷ) để dòng tiền gia đình luôn dương ngay cả khi hết ưu đãi.",
          ],
        },
      ],
      conclusion:
        "Biết trước con số của tháng thứ 13 và tháng thứ 25 giúp bạn hoàn toàn làm chủ quyết định đàm phán giá nhà, chuẩn bị thêm vốn tự có hoặc chọn căn hộ vừa sức trước khi xuống tiền cọc.",
    },
  },
  {
    slug: "thu-nhap-rong-vs-ty-le-tra-no-dti-dsr",
    title:
      "Thu nhập ròng vs Nghĩa vụ trả nợ: Tỷ lệ DTI/DSR nói lên điều gì (và bỏ sót điều gì)?",
    excerpt:
      "Ngân hàng duyệt cho bạn vay 70% giá trị căn nhà không có nghĩa là gia đình bạn sẽ sống ổn sau khi trả nợ. Sự khác biệt sống còn giữa chuẩn duyệt vay ngân hàng và dòng tiền sinh tồn của hộ gia đình.",
    category: "Dòng tiền gia đình",
    readTime: "8 phút đọc",
    date: "14/11/2026",
    author: "EvolveTech / Archonic",
    relatedTool: "/kiem-tra-mua-nha",
    infographicUrl:
      "/media/infographics/fg_03_reverse_affordability_matrix_4x5.png",
    scenarioBadge: "Ma trận tra cứu: Lương 25tr – 80tr → Trần vay an toàn",
    isHomebuyerFeatured: true,
    content: {
      introduction:
        "Một ngộ nhận rất phổ biến của người mua nhà lần đầu là: 'Ngân hàng thẩm định kỹ lắm, ngân hàng đã đồng ý cho vay 2 tỷ nghĩa là mình hoàn toàn đủ sức trả'. Thực tế, mục tiêu quản trị rủi ro của ngân hàng và mục tiêu an toàn cuộc sống của gia đình bạn hoàn toàn khác nhau.",
      keyTakeaways: [
        "Ngân hàng duyệt vay dựa trên tài sản thế chấp (căn nhà của bạn) và trần DSR nội bộ (có thể lên tới 60–70% tổng thu nhập).",
        "Dòng tiền gia đình chỉ thực sự an toàn khi: Thu nhập thực nhận (Net) - Chi phí sinh hoạt thiết yếu - Nợ hiện hữu - Trả nợ mua nhà (ở mức lãi thả nổi) >= 0.",
        "Tỷ lệ DTI hộ gia đình nên giữ ở mức <= 35% – 40% thu nhập ròng khi tính theo lãi suất thả nổi sau ưu đãi.",
      ],
      sections: [
        {
          heading:
            "1. Vì sao DTI 45% với người độc thân thì ổn, nhưng với gia đình có 2 con nhỏ lại là khủng hoảng?",
          body: [
            "Chỉ số DTI (Debt-to-Income — Tỷ lệ trả nợ trên thu nhập) truyền thống chỉ lấy Tổng tiền trả nợ chia cho Thu nhập.",
            "Nhưng một gia đình tại TP.HCM hoặc Hà Nội có 2 con nhỏ phải chi cố định 28 – 35 triệu/tháng cho tiền ăn học, sữa bỉm, điện nước, phí quản lý chung cư và hiếu hỉ. Nếu tổng thu nhập Net là 55 triệu mà tiền trả nợ tháng 13 chiếm 27,33 triệu (DTI ~ 49,7%), gia đình sẽ lập tức thiếu hụt tiền mặt dù DTI vẫn dưới mốc 50%!",
          ],
          tip: "Trên DepositGuard, chúng tôi không bao giờ phán xét khả năng vay chỉ bằng một con số % DTI đơn lẻ, mà luôn đối chiếu trực tiếp với Chi phí sinh hoạt thiết yếu và Quỹ dự phòng của chính gia đình bạn.",
        },
        {
          heading:
            "2. Ma trận tham khảo: Thu nhập bao nhiêu thì nên vay tối đa bấy nhiêu?",
          body: [
            "Với giả định kỳ hạn 20 năm và lãi suất thả nổi sau ưu đãi ở mức 11,5% – 12,0%/năm, ngưỡng vay an toàn (để nghĩa vụ trả nợ sau ưu đãi không vượt quá ~38–40% thu nhập ròng) thường nằm trong khoảng:",
            "• Thu nhập ròng 35 – 40 triệu/tháng: Khoản vay an toàn khoảng 900 triệu – 1,15 tỷ đồng.",
            "• Thu nhập ròng 55 – 60 triệu/tháng: Khoản vay an toàn khoảng 1,50 tỷ – 1,75 tỷ đồng.",
            "• Thu nhập ròng 75 – 80 triệu/tháng: Khoản vay an toàn khoảng 2,10 tỷ – 2,45 tỷ đồng.",
          ],
        },
      ],
      conclusion:
        "Đừng hỏi 'Ngân hàng cho tôi vay tối đa bao nhiêu?'. Hãy hỏi: 'Ở mức lãi suất thả nổi 12–14%/năm, sau khi trả ngân hàng và lo cho con cái, mỗi tháng gia đình tôi còn giữ lại được bao nhiêu tiền dự phòng?'.",
    },
  },
  {
    slug: "5-hang-muc-tai-chinh-truoc-khi-dat-coc",
    title:
      "5 hạng mục tài chính sống còn phải kiểm tra trước khi xuống tiền đặt cọc mua nhà",
    excerpt:
      "Đặt cọc 100–300 triệu nhưng ngân hàng định giá thấp hơn giá mua hoặc thiếu 350 triệu tiền thuế phí & quỹ bảo trì lúc nhận nhà? Checklist 5 bước bảo vệ tiền cọc cho người mua nhà Việt Nam.",
    category: "Thẩm định trước đặt cọc",
    readTime: "9 phút đọc",
    date: "14/11/2026",
    author: "EvolveTech / Archonic",
    relatedTool: "/kiem-tra-mua-nha",
    infographicUrl:
      "/media/infographics/fg_01_bank_valuation_shortfall_trap_4x5.png",
    scenarioBadge: "Checklist thực chiến: Bảo vệ 100–300 triệu tiền cọc",
    isHomebuyerFeatured: true,
    content: {
      introduction:
        "Tại Việt Nam, hợp đồng đặt cọc mua bán nhà đất thường quy định mức phạt cọc 100% nếu người mua không thanh toán đúng tiến độ. Rất nhiều trường hợp mất trắng hàng trăm triệu tiền cọc không phải vì người mua đổi ý, mà vì hụt dòng tiền giải ngân hoặc phát sinh các khoản phí tiền mặt ngoài dự kiến.",
      keyTakeaways: [
        "Ngân hàng cho vay 70% trên GIÁ THẨM ĐỊNH của ngân hàng, không phải 70% trên giá mua bán bạn thỏa thuận với chủ nhà.",
        "Ngoài 30% vốn tự có, bạn cần thêm 6% – 8% giá trị nhà bằng tiền mặt cho thuế phí, quỹ bảo trì 2%, nội thất cơ bản và tối thiểu 3–6 tháng quỹ dự phòng.",
        "Luôn đàm phán điều khoản bảo lưu hoàn cọc trong hợp đồng đặt cọc nếu ngân hàng từ chối giải ngân hoặc định giá thấp.",
      ],
      sections: [
        {
          heading:
            "1. Bẫy chênh lệch định giá ngân hàng (Valuation Shortfall Trap)",
          body: [
            "Ví dụ bạn mua căn hộ hoặc nhà phố giá 3,0 tỷ đồng và dự tính có sẵn 900 triệu (30%), còn lại vay ngân hàng 2,1 tỷ (70%).",
            "Tuy nhiên, sau khi bạn đã chuyển 200 triệu tiền đặt cọc, công ty thẩm định giá của ngân hàng chỉ định giá tài sản đó ở mức 2,5 tỷ đồng theo khung giá an toàn. Khi đó, 70% của 2,5 tỷ chỉ là 1,75 tỷ đồng. Bạn lập tức bị hụt 350.000.000 ₫ tiền mặt phải tự xoay xở trong vòng 15–20 ngày trước hạn công chứng!",
          ],
          tip: "Trước khi đặt cọc số tiền lớn, hãy gửi thông tin căn nhà cho ít nhất 2 ngân hàng thẩm định giá sơ bộ (Pre-valuation) và hỏi rõ tỷ lệ LTV thực tế áp dụng trên giá định giá.",
        },
        {
          heading: "2. Bóc tách 7 khoản tiền mặt ngoài giá mua nhà",
          body: [
            "Đừng bao giờ gom toàn bộ 100% số tiền tiết kiệm của gia đình vào khoản trả trước 30%. Bạn bắt buộc phải tách riêng các khoản tiền mặt sau:",
            "1) Vốn tự có trả cho bên bán (bao gồm tiền đặt cọc).",
            "2) Kinh phí bảo trì chung cư 2% (đối với căn hộ nhận bàn giao từ chủ đầu tư).",
            "3) Lệ phí trước bạ (0,5%), phí thẩm định hồ sơ cấp sổ hồng và phí công chứng.",
            "4) Phí thẩm định tài sản ngân hàng & Bảo hiểm cháy nổ bắt buộc.",
            "5) Chi phí hoàn thiện nội thất cơ bản & điện máy thiết yếu.",
            "6) Phí quản lý vận hành & chi phí chuyển nhà ban đầu.",
            "7) Quỹ dự phòng khẩn cấp tối thiểu 3 – 6 tháng chi phí sinh hoạt gia đình.",
          ],
        },
      ],
      conclusion:
        "Một bản mô phỏng đầy đủ trên DepositGuard chỉ tốn của bạn 2 phút nhưng có thể cứu gia đình khỏi nguy cơ mất hàng trăm triệu đồng tiền cọc hoặc rơi vào khủng hoảng thanh khoản ngay ngày nhận nhà.",
    },
  },
  {
    slug: "cach-doc-bang-chao-lai-suat-ngan-hang",
    title:
      "Cách đọc bảng chào lãi suất ngân hàng: Lãi ưu đãi, biên độ thả nổi, ân hạn gốc và phí phạt trả trước",
    excerpt:
      "Giải mã tờ rơi và hợp đồng tín dụng ngân hàng: Khi nào nên chọn Dư nợ giảm dần, khi nào chọn Niên kim (trả góp đều), và 5 câu hỏi bắt buộc phải hỏi tín dụng viên bằng văn bản.",
    category: "Vay mua nhà & Lãi suất",
    readTime: "8 phút đọc",
    date: "14/11/2026",
    author: "EvolveTech / Archonic",
    relatedTool: "/kiem-tra-mua-nha",
    infographicUrl:
      "/media/infographics/fg_02_equal_principal_vs_annuity_4x5.png",
    scenarioBadge: "So sánh trực quan: Dư nợ giảm dần vs Niên kim",
    isHomebuyerFeatured: true,
    content: {
      introduction:
        "Khi nhận được bảng tính minh họa từ nhân viên tín dụng hoặc môi giới, bạn thường thấy những con số rất đẹp ở các tháng đầu tiên. Để đọc xuyên qua các thuật ngữ tài chính và hiểu đúng tổng chi phí thực sự của khoản vay, bạn cần nắm vững 4 thông số cốt lõi dưới đây.",
      keyTakeaways: [
        "Phương thức Dư nợ giảm dần (Equal Principal) trả gốc cố định hàng tháng nên tiền lãi giảm dần đều; tổng lãi cả kỳ thấp hơn đáng kể so với Niên kim.",
        "Phương thức Niên kim (Annuity) giúp số tiền trả những tháng đầu thấp hơn, nhưng trong 5 năm đầu tới 75–80% số tiền bạn đóng hàng tháng là tiền lãi.",
        "Luôn kiểm tra biểu phí trả nợ trước hạn (thường 1% – 3% trong 3–5 năm đầu) và điều kiện ràng buộc mua bảo hiểm nhân thọ/bảo hiểm khoản vay.",
      ],
      sections: [
        {
          heading:
            "1. Dư nợ giảm dần (Gốc đều) vs Niên kim (Trả góp đều): Chọn cách nào?",
          body: [
            "• Dư nợ giảm dần (Equal Principal): Tiền gốc trả mỗi tháng bằng nhau (= Tổng vay / Số tháng). Tiền lãi tính trên dư nợ thực tế còn lại nên giảm dần qua từng tháng. Tháng đầu tiên áp lực cao nhất, nhưng càng về sau càng nhẹ và khi lãi suất thả nổi tăng ở tháng 13, dư nợ gốc đã giảm được một phần.",
            "• Trả góp đều / Niên kim (Annuity): Tổng số tiền (Gốc + Lãi) mỗi tháng bằng nhau trong cùng một mức lãi suất. Nhờ vậy tháng đầu tiên số tiền phải đóng thấp hơn phương thức gốc đều khoảng 12–18%. Tuy nhiên, phần gốc trả được trong những năm đầu rất ít, nên khi bước sang tháng 13 với lãi suất thả nổi cao, khoản thanh toán niên kim được tính lại trên dư nợ còn rất lớn.",
          ],
          tip: "Trên Bước 3 của công cụ DepositGuard (/kiem-tra-mua-nha), bạn có thể chuyển đổi qua lại giữa 2 phương thức chỉ bằng 1 cú nhấp chuột để so sánh ngay chênh lệch dòng tiền tháng 1 và tháng 13.",
        },
        {
          heading: "2. 4 điều khoản ẩn cần yêu cầu làm rõ bằng văn bản",
          body: [
            "1) Chỉ số tham chiếu sau ưu đãi là gì? (Lãi suất tiết kiệm 12 tháng trả sau của ngân hàng đó hay 'Lãi suất cơ sở theo thông báo từng thời kỳ'?).",
            "2) Biên độ cộng thêm cố định suốt đời khoản vay hay có thể thay đổi?",
            "3) Quy ước tính ngày lãi của ngân hàng là actual/365 hay actual/360?",
            "4) Gói lãi suất ưu đãi này có kèm điều kiện phải duy trì gói bảo hiểm hàng năm không?",
          ],
        },
      ],
      conclusion:
        "Mọi lời hứa miệng về lãi suất đều không có giá trị pháp lý khi bước sang năm thứ 2. Hãy lấy các điều khoản bằng văn bản và đưa vào DepositGuard để kiểm chứng.",
    },
  },
  {
    slug: "mua-nha-gia-dinh-tre-cu-soc-thu-nhap",
    title:
      "Mua nhà khi có gia đình trẻ: Cú sốc giảm 20% thu nhập hoặc tăng chi phí nuôi con thay đổi sức chịu đựng ra sao?",
    excerpt:
      "Trong 20 năm trả nợ mua nhà, xác suất một trong hai vợ chồng nghỉ thai sản, chuyển việc hoặc giảm thu nhập trong 3–6 tháng là gần như chắc chắn. Cách thiết kế bộ đệm tài chính không bao giờ gãy.",
    category: "Dòng tiền gia đình",
    readTime: "7 phút đọc",
    date: "14/11/2026",
    author: "EvolveTech / Archonic",
    relatedTool: "/kiem-tra-mua-nha",
    infographicUrl:
      "/media/infographics/fg_06_rent_vs_buy_10yr_wealth_matrix_4x5.png",
    scenarioBadge: "Stress-Test: Sốc thu nhập -20% & Bài toán Thuê vs Mua",
    isHomebuyerFeatured: true,
    content: {
      introduction:
        "Khi lập bảng tính mua nhà, 95% người mua giả định rằng thu nhập của cả hai vợ chồng sẽ luôn giữ nguyên hoặc tăng đều suốt 20 năm, và chi phí sinh hoạt không bao giờ đột biến. Nhưng cuộc sống của một gia đình trẻ luôn có những khúc cua: sinh thêm con, nghỉ thai sản 6 tháng, công ty cắt giảm thưởng hoặc bố mẹ hai bên cần chăm sóc y tế.",
      keyTakeaways: [
        "Một kế hoạch vay mua nhà chỉ thực sự bền vững khi chịu được kịch bản tổng thu nhập gia đình giảm 20% trong 6 tháng liên tiếp mà quỹ dự phòng không bị thủng đáy.",
        "Khi chuẩn bị đón con nhỏ, chi phí sinh hoạt thiết yếu thường tăng thêm 15% – 25% trong khi thu nhập của một người có thể tạm giảm.",
        "Nếu phương án mua nhà hiện tại quá mỏng manh trước biến cố, việc thuê nhà thêm 12–24 tháng để tích lũy dày vốn tự có là một chiến lược tài chính hoàn toàn khôn ngoan.",
      ],
      sections: [
        {
          heading:
            "1. Kịch bản Stress-Test: Khi cú nhảy lãi suất Tháng 13 gặp lúc giảm 20% thu nhập",
          body: [
            "Hãy xét một cặp vợ chồng trẻ có tổng thu nhập ròng 55 triệu/tháng, chi tiêu 30 triệu/tháng và khoản trả nợ tháng 13 là 27,33 triệu/tháng.",
            "Nếu đúng vào năm thứ 2, người vợ nghỉ sinh hoặc một người bị giảm thu nhập khiến tổng thu nhập gia đình giảm 20% (từ 55 triệu xuống 44 triệu/tháng) trong 6 tháng: Dòng tiền hàng tháng sẽ thâm hụt tới -13,33 triệu/tháng. Chỉ trong vòng 6 tháng, gần 80 triệu đồng tiền tiết kiệm sẽ bốc hơi hoàn toàn.",
          ],
          tip: "Trên bảng kết quả /ket-qua của DepositGuard, hãy luôn bật đồng thời công tắc 'Giảm thu nhập -20% (6 tháng)' để kiểm tra xem quỹ dự phòng của bạn trụ được đến tháng thứ mấy.",
        },
        {
          heading: "2. Thuê nhà hay Mua nhà ngay: Góc nhìn toán học 10 năm",
          body: [
            "Nếu việc mua nhà ngay lập tức buộc gia đình phải vay quá 60–70% giá trị tài sản và vét sạch quỹ khẩn cấp về 0 đồng, rủi ro đổ vỡ dòng tiền là rất lớn.",
            "Ngược lại, nếu tiếp tục thuê nhà ở mức chi phí hợp lý và gửi phần vốn tự có + tiền tiết kiệm hàng tháng vào các kênh tích lũy an toàn trong 18–24 tháng để nâng tỷ lệ vốn tự có lên 45–50% rồi mới mua, áp lực lãi vay suốt 20 năm sau đó sẽ giảm đi gần một nửa.",
          ],
        },
      ],
      conclusion:
        "Mua nhà là để nâng cao chất lượng sống và sự an tâm cho gia đình, không phải để đánh đổi giấc ngủ suốt 20 năm. Hãy dùng các bài Stress-Test để chọn thời điểm và quy mô khoản vay vững chắc nhất.",
    },
  },
  {
    slug: "quy-khan-cap-3-6-thang",
    title:
      "Làm thế nào để xây dựng quỹ khẩn cấp 3–6 tháng khi thu nhập còn khiêm tốn?",
    excerpt:
      "Quỹ khẩn cấp không phải là tiền để giàu lên, mà là 'tấm khiên' giữ cho bạn không rơi vào nợ nần khi biến cố ập đến. Hướng dẫn từng bước cho người mới.",
    category: "Tiết kiệm",
    readTime: "6 phút đọc",
    date: "08/09/2026",
    author: "Archonic (EvolveTech)",
    relatedTool: "/kiem-tra-mua-nha",
    infographicUrl: "/media/infographics/edu_02_quy_du_phong_sau_mua_4x5.png",
    content: {
      introduction:
        "Nhiều người Việt chúng ta thường bắt đầu hành trình tài chính bằng việc hỏi 'Đầu tư gì để nhanh giàu?'. Nhưng sự thật cay đắng là: khi chưa có tấm khiên bảo vệ, một sự cố xe hỏng, ốm đau hay mất việc có thể cuốn phăng toàn bộ số tiền bạn tích góp được, thậm chí đẩy bạn vào vòng xoáy thẻ tín dụng và vay nặng lãi.",
      keyTakeaways: [
        "Quỹ khẩn cấp tương đương 3-6 tháng chi tiêu thiết yếu tối thiểu (không phải toàn bộ lương).",
        "Để ở nơi an toàn, thanh khoản cao (tài khoản thanh toán ngân hàng số, gửi tiết kiệm kỳ hạn ngắn 1 tháng, chứng chỉ tiền gửi).",
        "Tuyệt đối không dùng quỹ này để đầu tư chứng khoán, mua đất hay mua sắm bốc đồng.",
      ],
      sections: [
        {
          heading: "1. Tính đúng số tiền quỹ khẩn cấp bạn cần",
          body: [
            "Đừng tính dựa trên tổng thu nhập. Hãy tính trên 'Chi phí sinh tồn tối thiểu' mỗi tháng (Tiền trọ/nhà, ăn uống cơ bản, tiền điện nước, xăng xe và thuốc men tối thiểu).",
            "Ví dụ: Lương bạn 15 triệu, nhưng chi phí sinh tồn cơ bản của bạn là 8 triệu/tháng. Thì quỹ khẩn cấp 3 tháng của bạn là 24 triệu, 6 tháng là 48 triệu.",
          ],
          tip: "Nếu bạn độc thân và công việc ổn định: 3 tháng là vừa đủ. Nếu bạn có con nhỏ hoặc làm freelancer thu nhập bấp bênh: nên chuẩn bị 6 tháng.",
        },
        {
          heading: "2. Chiến lược 'Pay Yourself First' (Trả cho mình trước)",
          body: [
            "Sai lầm lớn nhất là: Thu nhập - Chi tiêu = Tiết kiệm. Vì tiêu đến cuối tháng thường không còn đồng nào.",
            "Quy tắc đúng: Ngay ngày lương về, tự động chuyển 10% - 20% vào một tài khoản ngân hàng riêng biệt không gắn thẻ ATM để chi tiêu.",
          ],
        },
        {
          heading: "3. Để tiền quỹ khẩn cấp ở đâu để không bị mất giá?",
          body: [
            "Nguyên tắc số 1 của quỹ khẩn cấp: An toàn và Thanh khoản cao hơn Lợi nhuận.",
            "Gợi ý: Chia làm 2 phần. 30% để ở tài khoản thanh toán hoặc sinh lời theo ngày (lãi suất không kỳ hạn 3-4%/năm). 70% gửi tiết kiệm online kỳ hạn 1 tháng quay vòng.",
          ],
          tip: "Không bao giờ để quỹ khẩn cấp vào cổ phiếu, crypto hay bất động sản vì khi cần gấp, thị trường đang giảm bạn sẽ buộc phải cắt lỗ.",
        },
      ],
      conclusion:
        "Có trong tay 30-50 triệu tiền quỹ khẩn cấp sẽ mang lại cho bạn một cảm giác bình an lạ kỳ. Bạn sẽ không còn giật mình thon thót mỗi khi nhận tin báo viện phí hay sự cố bất ngờ.",
    },
  },
  {
    slug: "phan-bo-luong-10-15-trieu",
    title:
      "Phân bổ lương 10–15 triệu: Làm sao để vừa sống thoải mái vừa có tích lũy?",
    excerpt:
      "Thu nhập 10-15 triệu ở các đô thị lớn như Hà Nội hay TP.HCM là mức lương của hàng triệu bạn trẻ. Đây là công thức chi tiêu thực tế nhất.",
    category: "Quản lý nợ",
    readTime: "7 phút đọc",
    date: "05/09/2026",
    author: "Archonic (EvolveTech)",
    relatedTool: "/kiem-tra-mua-nha",
    content: {
      introduction:
        "Lương 10 đến 15 triệu ở TP.HCM hay Hà Nội có vẻ như 'vừa đủ sống', nhưng nếu không kiểm soát, bạn sẽ rơi vào cái bẫy sống mòn từ kỳ lương này sang kỳ lương khác (Paycheck to paycheck).",
      keyTakeaways: [
        "Áp dụng linh hoạt quy tắc 50/30/20 hoặc điều chỉnh thành 60/20/20 cho người mới lập nghiệp.",
        "Kiểm soát chi phí cố định (Tiền phòng trọ không được vượt quá 25-30% thu nhập).",
        "Tách bạch tài khoản chi tiêu và tài khoản tích lũy để chặn hành vi quẹt thẻ vô thức.",
      ],
      sections: [
        {
          heading: "1. Hiểu đúng lương Gross sang Net",
          body: [
            "Khi thỏa thuận lương 15 triệu Gross, số tiền thực tế vào tài khoản của bạn sau khi trừ 10.5% bảo hiểm (BHXH, BHYT, BHTN) và thuế TNCN sẽ rơi vào khoảng 13.4 triệu.",
            "Hãy luôn lập kế hoạch chi tiêu dựa trên con số Net thực nhận, không tính trên con số Gross.",
          ],
        },
        {
          heading: "2. Phân bổ thực tế cho ngân sách 13.4 triệu Net",
          body: [
            "• 55% Nhu cầu thiết yếu (khoảng 7.3 triệu): Tiền nhà + điện nước (tối đa 3.5 - 4 triệu nếu ở ghép), ăn uống tự nấu (2.5 triệu), xăng xe điện thoại (1 triệu).",
            "• 25% Nhu cầu cá nhân & Mối quan hệ (khoảng 3.3 triệu): Cà phê bạn bè, mua sắm cơ bản, đám cưới, giải trí.",
            "• 20% Tích lũy & Đầu tư tương lai (khoảng 2.7 triệu): Gửi vào quỹ khẩn cấp hoặc tích sản chứng chỉ quỹ ETF.",
          ],
          tip: "2.7 triệu mỗi tháng nghe có vẻ nhỏ, nhưng sau 3 năm với mức tăng trưởng 10%/năm, bạn sẽ có hơn 115 triệu đồng!",
        },
        {
          heading:
            "3. 'Cắt giảm' có giới hạn, nhưng 'Gia tăng thu nhập' là vô hạn",
          body: [
            "Bạn không thể tiết kiệm nhiều hơn số tiền bạn kiếm được. Khi đã tối ưu hóa chi tiêu cơ bản, 80% năng lượng của bạn nên dành cho việc nâng cấp kỹ năng nghề nghiệp để tăng lương từ 15 triệu lên 25 triệu.",
          ],
        },
      ],
      conclusion:
        "Tự do tài chính bắt đầu từ sự kỷ luật với những khoản tiền nhỏ nhất. Hãy thử áp dụng công thức này ngay trong kỳ lương sắp tới!",
    },
  },
  {
    slug: "lai-kep-ky-quan-cho-nguoi-tre",
    title:
      "Sức mạnh của lãi kép: Tại sao bắt đầu với 1 triệu/tháng lúc 22 tuổi hơn đứt 5 triệu lúc 35 tuổi?",
    excerpt:
      "Toán học không biết nói dối. Hiểu về lãi kép và thời gian là vũ khí mạnh nhất giúp người bình thường có thể đạt được tự do tài chính.",
    category: "Đầu tư",
    readTime: "5 phút đọc",
    date: "01/09/2026",
    author: "Archonic (EvolveTech)",
    relatedTool: "/kiem-tra-mua-nha",
    content: {
      introduction:
        "Albert Einstein từng gọi lãi kép là kỳ quan thứ 8 của thế giới: 'Người hiểu nó sẽ kiếm được tiền từ nó; người không hiểu nó sẽ phải trả tiền cho nó'. Trong tài chính cá nhân, tài sản lớn nhất của bạn không phải là tiền, mà là THỜI GIAN.",
      keyTakeaways: [
        "Yếu tố số mũ (thời gian) quan trọng hơn số tiền gốc bỏ ra ban đầu.",
        "Đầu tư đều đặn (DCA) giúp loại bỏ áp lực đoán đỉnh đoán đáy thị trường.",
        "Đừng rút tiền lãi ra tiêu sớm trong 7-10 năm đầu tiên.",
      ],
      sections: [
        {
          heading: "1. Câu chuyện của Minh (22 tuổi) và Hùng (32 tuổi)",
          body: [
            "Minh bắt đầu đầu tư từ năm 22 tuổi, mỗi tháng đều đặn 1.5 triệu đồng vào chứng chỉ quỹ với lợi nhuận trung bình 11%/năm. Đến năm 30 tuổi (sau 8 năm), Minh dừng góp thêm và để tiền tự sinh lãi đến năm 50 tuổi.",
            "Hùng đợi đến năm 32 tuổi mới bắt đầu, góp mỗi tháng 3 triệu đồng liên tục suốt 18 năm đến năm 50 tuổi.",
            "Kết quả: Dù Hùng bỏ ra tổng vốn gốc nhiều hơn Minh gấp đôi, nhưng số tài sản cuối cùng của Minh lại vượt trội hơn Hùng nhờ 10 năm sinh lãi kép sớm hơn!",
          ],
        },
        {
          heading: "2. Ba quy tắc để kích hoạt lãi kép thành công",
          body: [
            "Quy tắc 1: Bắt đầu ngay hôm nay, dù chỉ với 500.000đ hay 1.000.000đ mỗi tháng.",
            "Quy tắc 2: Tái đầu tư toàn bộ cổ tức/tiền lãi. Lãi mẹ đẻ lãi con.",
            "Quy tắc 3: Kiên nhẫn vượt qua 'vùng phẳng'. Trong 5 năm đầu, biểu đồ tài sản tăng rất chậm. Nhưng từ năm thứ 10 trở đi, đường cong sẽ dốc đứng.",
          ],
          tip: "Hãy dùng hệ thống công cụ tài chính của EvolveTech để tận mắt nhìn thấy tương lai tài sản và dòng tiền của bạn sau 10, 20 năm.",
        },
      ],
      conclusion:
        "Thời điểm tốt nhất để trồng cây là 20 năm trước. Thời điểm tốt thứ hai chính là ngay BÂY GIỜ.",
    },
  },
  {
    slug: "5-bay-tai-chinh-lua-dao-pho-bien",
    title:
      "5 bẫy tâm lý và chiêu trò lừa đảo tài chính người Việt hay mắc phải nhất",
    excerpt:
      "Từ các hội nhóm phím hàng cam kết lợi nhuận khủng 30%/tháng đến bẫy thẻ tín dụng trả góp 0%. Cách nhận diện để giữ chặt đồng tiền mồ hôi nước mắt.",
    category: "Tâm lý tiền bạc",
    readTime: "8 phút đọc",
    date: "28/08/2026",
    author: "Archonic (EvolveTech)",
    content: {
      introduction:
        "Kiếm tiền đã khó, giữ tiền còn khó hơn gấp mười lần. Ở Việt Nam, lòng tham và nỗi sợ bị bỏ lại phía sau (FOMO) là hai tử huyệt khiến hàng ngàn người mất sạch số tiền tích cóp cả đời.",
      keyTakeaways: [
        "Bất kỳ ai cam kết lợi nhuận > 15-20%/năm mà bảo 'không có rủi ro' đều là lừa đảo (Ponzi).",
        "Thẻ tín dụng là công cụ tài chính tuyệt vời nếu trả hết 100% đúng hạn, nhưng là 'hố đen nợ nần' nếu chỉ trả số tiền tối thiểu.",
        "Đừng đầu tư vào những thứ bạn không hiểu rõ cách nó tạo ra tiền.",
      ],
      sections: [
        {
          heading: "1. Bẫy cam kết lợi nhuận phi thực tế (Mô hình Ponzi)",
          body: [
            "Lãi suất tiền gửi ngân hàng chỉ khoảng 5-6%/năm. Các quỹ đầu tư huyền thoại thế giới như Warren Buffett cũng chỉ đạt trung bình ~20%/năm.",
            "Nếu có một ứng dụng hay 'chuyên gia' hứa hẹn trả lãi cho bạn 2% - 5%/ngày hay 20%/tháng, họ đang lấy tiền của người vào sau trả cho người vào trước. Sớm muộn gì hệ thống cũng sập.",
          ],
          tip: "Quy tắc vàng: Nếu lợi nhuận nghe có vẻ quá tốt để là thật, chắc chắn đó là bẫy.",
        },
        {
          heading: "2. Bẫy 'Trả góp 0%' và thanh toán tối thiểu thẻ tín dụng",
          body: [
            "Phí chuyển đổi trả góp thường bị ẩn đi dưới dạng phí quản lý 3-5%.",
            "Đặc biệt, nếu bạn chỉ thanh toán 'Khoản thanh toán tối thiểu' (Minimum payment 5%), ngân hàng sẽ tính lãi suất 30% - 40%/năm trên TOÀN BỘ dư nợ ban đầu tính từ ngày quẹt thẻ.",
          ],
        },
        {
          heading: "3. Bẫy 'Mua theo hội nhóm' (FOMO)",
          body: [
            "Vào các nhóm Zalo/Telegram thấy mọi người khoe lệnh lãi hàng chục triệu, bạn sốt ruột và nạp tiền theo. Đến khi bạn vào lệnh lớn, các 'đội lái' xả hàng và nhóm bốc hơi.",
          ],
        },
      ],
      conclusion:
        "Bảo vệ vốn luôn là ưu tiên số một. Mất tiền có thể kiếm lại, nhưng mất niềm tin vào cuộc sống là cái giá quá đắt. Hãy trang bị kiến thức trước khi xuống tiền.",
    },
  },
  {
    slug: "bao-hiem-nhan-tho-hieu-dung",
    title:
      "Bảo hiểm nhân thọ: Mua đúng để bảo vệ gia đình, tránh biến thành gánh nặng tài chính",
    excerpt:
      "Rất nhiều người Việt bị mua sai gói bảo hiểm, đóng phí quá sức rồi bỏ dở mất trắng. Đây là cẩm nang giúp bạn hiểu đúng bản chất thật của bảo hiểm.",
    category: "Bảo hiểm",
    readTime: "7 phút đọc",
    date: "20/08/2026",
    author: "Archonic (EvolveTech)",
    content: {
      introduction:
        "Bảo hiểm nhân thọ sinh ra không phải để sinh lời hay làm giàu. Mục đích duy nhất của nó là BẢO VỆ THU NHẬP của người trụ cột khi có rủi ro lớn về tính mạng hay sức khỏe xảy ra.",
      keyTakeaways: [
        "Chỉ nên trích 8% - 12% thu nhập năm cho toàn bộ chi phí bảo hiểm của gia đình.",
        "Ưu tiên mua cho người trụ cột (người tạo ra tiền chính trong gia đình) trước tiên.",
        "Kê khai trung thực 100% tiền sử bệnh tật để tránh bị từ chối bồi thường sau này.",
      ],
      sections: [
        {
          heading: "1. Ai là người cần mua bảo hiểm nhân thọ nhất?",
          body: [
            "Sai lầm phổ biến ở Việt Nam: Bố mẹ mua bảo hiểm nhân thọ cho con nhỏ mới sinh, trong khi bố mẹ (người kiếm ra tiền nuôi con) lại không có bảo hiểm!",
            "Nếu người trụ cột gặp rủi ro, ai sẽ đóng phí tiếp cho con? Ai nuôi con ăn học? Vì vậy, hãy bảo vệ người tạo ra dòng tiền trước.",
          ],
        },
        {
          heading: "2. Đừng nhầm lẫn giữa 'Bảo vệ' và 'Đầu tư'",
          body: [
            "Các sản phẩm bảo hiểm liên kết đầu tư thường có chi phí quản lý và phí ban đầu rất cao trong những năm đầu (có thể chiếm 50-70% phí đóng năm đầu).",
            "Nếu bạn muốn đầu tư sinh lời, hãy mua bảo hiểm thuần bảo vệ (hoặc bảo hiểm sức khỏe rời) và đem số tiền còn lại tự đầu tư vào chứng chỉ quỹ hoặc tiết kiệm.",
          ],
        },
      ],
      conclusion:
        "Một hợp đồng bảo hiểm tốt là hợp đồng bạn hiểu rõ từng điều khoản loại trừ và có mức phí vừa vặn với túi tiền để duy trì được suốt 15-20 năm.",
    },
  },
];
