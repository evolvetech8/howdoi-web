import type { TopicId, ToolSlug } from "./tools";

export interface Source {
  label: string;
  url?: string;
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  topic: TopicId;
  readTime: string;
  publishedAt: string;   // ISO date
  updatedAt: string;     // ISO date, đổi mỗi khi sửa nội dung hoặc số liệu
  author: string;
  relatedTool?: ToolSlug;
  sources?: Source[];
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
    slug: "quy-khan-cap-3-6-thang",
    title: "Làm thế nào để xây dựng quỹ khẩn cấp 3–6 tháng khi thu nhập còn khiêm tốn?",
    excerpt: "Quỹ khẩn cấp không phải là tiền để giàu lên, mà là 'tấm khiên' giữ cho bạn không rơi vào nợ nần khi biến cố ập đến. Hướng dẫn từng bước cho người mới.",
    topic: "tiet-kiem-dau-tu",
    readTime: "6 phút đọc",
    publishedAt: "2026-09-08",
    updatedAt: "2026-09-08",
    author: "Frank",
    relatedTool: "ngan-sach-50-30-20",
    content: {
      introduction: "Nhiều người Việt chúng ta thường bắt đầu hành trình tài chính bằng việc hỏi 'Đầu tư gì để nhanh giàu?'. Nhưng sự thật cay đắng là: khi chưa có tấm khiên bảo vệ, một sự cố xe hỏng, ốm đau hay mất việc có thể cuốn phăng toàn bộ số tiền bạn tích góp được, thậm chí đẩy bạn vào vòng xoáy thẻ tín dụng và vay nặng lãi.",
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
      conclusion: "Có trong tay 30-50 triệu tiền quỹ khẩn cấp sẽ mang lại cho bạn một cảm giác bình an lạ kỳ. Bạn sẽ không còn giật mình thon thót mỗi khi nhận tin báo viện phí hay sự cố bất ngờ.",
    },
  },
  {
    slug: "phan-bo-luong-10-15-trieu",
    title: "Phân bổ lương 10–15 triệu: Làm sao để vừa sống thoải mái vừa có tích lũy?",
    excerpt: "Thu nhập 10-15 triệu ở các đô thị lớn như Hà Nội hay TP.HCM là mức lương của hàng triệu bạn trẻ. Đây là công thức chi tiêu thực tế nhất.",
    topic: "ngan-sach",
    readTime: "7 phút đọc",
    publishedAt: "2026-09-05",
    updatedAt: "2026-10-13",
    author: "Frank",
    relatedTool: "ngan-sach-50-30-20",
    sources: [
      { label: "Luật Bảo hiểm xã hội số 41/2024/QH15 (tỷ lệ đóng bảo hiểm của người lao động)" },
      { label: "Nghị quyết 110/2025/UBTVQH15 (giảm trừ gia cảnh từ năm 2026)" },
      { label: "Luật Thuế thu nhập cá nhân số 109/2025/QH15 (biểu thuế 5 bậc)" },
    ],
    content: {
      introduction: "Lương 10 đến 15 triệu ở TP.HCM hay Hà Nội có vẻ như 'vừa đủ sống', nhưng nếu không kiểm soát, bạn sẽ rơi vào cái bẫy sống mòn từ kỳ lương này sang kỳ lương khác (Paycheck to paycheck).",
      keyTakeaways: [
        "Áp dụng linh hoạt quy tắc 50/30/20 hoặc điều chỉnh thành 60/20/20 cho người mới lập nghiệp.",
        "Kiểm soát chi phí cố định (Tiền phòng trọ không được vượt quá 25-30% thu nhập).",
        "Tách bạch tài khoản chi tiêu và tài khoản tích lũy để chặn hành vi quẹt thẻ vô thức.",
      ],
      sections: [
        {
          heading: "1. Hiểu đúng lương Gross sang Net",
          body: [
            "Khi thỏa thuận lương 15 triệu Gross, số tiền thực tế vào tài khoản của bạn sau khi trừ 10,5% bảo hiểm (BHXH 8%, BHYT 1,5%, BHTN 1%) là khoảng 13,4 triệu. Từ năm 2026, mức giảm trừ gia cảnh cho bản thân là 15,5 triệu/tháng nên mức lương này chưa phải nộp thuế TNCN.",
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
          heading: "3. 'Cắt giảm' có giới hạn, nhưng 'Gia tăng thu nhập' là vô hạn",
          body: [
            "Bạn không thể tiết kiệm nhiều hơn số tiền bạn kiếm được. Khi đã tối ưu hóa chi tiêu cơ bản, 80% năng lượng của bạn nên dành cho việc nâng cấp kỹ năng nghề nghiệp để tăng lương từ 15 triệu lên 25 triệu.",
          ],
        },
      ],
      conclusion: "Tự do tài chính bắt đầu từ sự kỷ luật với những khoản tiền nhỏ nhất. Hãy thử áp dụng công thức này ngay trong kỳ lương sắp tới!",
    },
  },
  {
    slug: "lai-kep-ky-quan-cho-nguoi-tre",
    title: "Sức mạnh của lãi kép: Tại sao bắt đầu với 1 triệu/tháng lúc 22 tuổi hơn đứt 5 triệu lúc 35 tuổi?",
    excerpt: "Toán học không biết nói dối. Hiểu về lãi kép và thời gian là vũ khí mạnh nhất giúp người bình thường có thể đạt được tự do tài chính.",
    topic: "tiet-kiem-dau-tu",
    readTime: "5 phút đọc",
    publishedAt: "2026-09-01",
    updatedAt: "2026-10-13",
    author: "Frank",
    relatedTool: "lai-kep",
    content: {
      introduction: "Albert Einstein từng gọi lãi kép là kỳ quan thứ 8 của thế giới: 'Người hiểu nó sẽ kiếm được tiền từ nó; người không hiểu nó sẽ phải trả tiền cho nó'. Trong tài chính cá nhân, tài sản lớn nhất của bạn không phải là tiền, mà là THỜI GIAN.",
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
            "Kết quả (lãi kép theo tháng): đến năm 50 tuổi, Minh có khoảng 2,07 tỷ, Hùng có khoảng 2,04 tỷ. Hùng bỏ ra 648 triệu tiền gốc, gấp hơn 4 lần con số 144 triệu của Minh, nhưng tài sản cuối cùng vẫn thấp hơn Minh, vì tiền của Minh có thêm 10 năm để sinh lãi.",
          ],
        },
        {
          heading: "2. Ba quy tắc để kích hoạt lãi kép thành công",
          body: [
            "Quy tắc 1: Bắt đầu ngay hôm nay, dù chỉ với 500.000đ hay 1.000.000đ mỗi tháng.",
            "Quy tắc 2: Tái đầu tư toàn bộ cổ tức/tiền lãi. Lãi mẹ đẻ lãi con.",
            "Quy tắc 3: Kiên nhẫn vượt qua 'vùng phẳng'. Trong 5 năm đầu, biểu đồ tài sản tăng rất chậm. Nhưng từ năm thứ 10 trở đi, đường cong sẽ dốc đứng.",
          ],
          tip: "Hãy dùng công cụ Tính Lãi Kép của HowDoI để tận mắt nhìn thấy tương lai tài sản của bạn sau 10, 20 năm.",
        },
      ],
      conclusion: "Thời điểm tốt nhất để trồng cây là 20 năm trước. Thời điểm tốt thứ hai chính là ngay BÂY GIỜ.",
    },
  },
  {
    slug: "5-bay-tai-chinh-lua-dao-pho-bien",
    title: "5 bẫy tâm lý và chiêu trò lừa đảo tài chính người Việt hay mắc phải nhất",
    excerpt: "Từ các hội nhóm phím hàng cam kết lợi nhuận khủng 30%/tháng đến bẫy thẻ tín dụng trả góp 0%. Cách nhận diện để giữ chặt đồng tiền mồ hôi nước mắt.",
    topic: "bao-ve-tai-chinh",
    readTime: "8 phút đọc",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    author: "Frank",
    relatedTool: "ke-hoach-tra-no",
    content: {
      introduction: "Kiếm tiền đã khó, giữ tiền còn khó hơn gấp mười lần. Ở Việt Nam, lòng tham và nỗi sợ bị bỏ lại phía sau (FOMO) là hai tử huyệt khiến hàng ngàn người mất sạch số tiền tích cóp cả đời.",
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
      conclusion: "Bảo vệ vốn luôn là ưu tiên số một. Mất tiền có thể kiếm lại, nhưng mất niềm tin vào cuộc sống là cái giá quá đắt. Hãy trang bị kiến thức trước khi xuống tiền.",
    },
  },
  {
    slug: "bao-hiem-nhan-tho-hieu-dung",
    title: "Bảo hiểm nhân thọ: Mua đúng để bảo vệ gia đình, tránh biến thành gánh nặng tài chính",
    excerpt: "Rất nhiều người Việt bị mua sai gói bảo hiểm, đóng phí quá sức rồi bỏ dở mất trắng. Đây là cẩm nang giúp bạn hiểu đúng bản chất thật của bảo hiểm.",
    topic: "bao-ve-tai-chinh",
    readTime: "7 phút đọc",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    author: "Frank",
    content: {
      introduction: "Bảo hiểm nhân thọ sinh ra không phải để sinh lời hay làm giàu. Mục đích duy nhất của nó là BẢO VỆ THU NHẬP của người trụ cột khi có rủi ro lớn về tính mạng hay sức khỏe xảy ra.",
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
      conclusion: "Một hợp đồng bảo hiểm tốt là hợp đồng bạn hiểu rõ từng điều khoản loại trừ và có mức phí vừa vặn với túi tiền để duy trì được suốt 15-20 năm.",
    },
  },
];
