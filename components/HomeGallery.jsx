"use client";

import { useState } from "react";
import ImageGalleryModal from "./ImageGalleryModal";
import VerifiedImage from "./VerifiedImage";
import { SpeakerIcon, MapPinIcon } from "./Icons";
import { useA11y } from "./A11yProvider";

const GALLERY_IMAGES = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Huc_Bridge.jpg",
    alt: "Cầu Thê Húc màu đỏ son uốn cong dẫn vào Đền Ngọc Sơn giữa lòng Hồ Hoàn Kiếm, xung quanh là mặt nước xanh biếc và bóng cây cổ thụ thanh bình.",
    title: "Cầu Thê Húc & Hồ Hoàn Kiếm",
    credit: "David Stanley · Wikimedia Commons · CC BY 2.0",
    link: "/destination?d=ho-guom",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Temple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg/1280px-Temple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg",
    alt: "Khuôn viên Văn Miếu – Quốc Tử Giám rợp bóng cây xanh, cổng tam quan cổ kính với mái ngói đỏ rêu phong và sân gạch son truyền thống.",
    title: "Văn Miếu – Quốc Tử Giám",
    credit: "xiquinhosilva · Wikimedia Commons · CC BY 2.0",
    link: "/destination?d=van-mieu",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/31/Vietnam_hanoi_old_quarter.jpg",
    alt: "Một con phố tấp nập trong Phố cổ Hà Nội với những ngôi nhà ống mái ngói cổ, cửa hàng nhỏ buôn bán nhộn nhịp và xe cộ qua lại.",
    title: "Phố cổ Hà Nội",
    credit: "Wikimedia Commons · Public Domain",
    link: "/destination?d=pho-co",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/West_Lake_Hanoi.jpg/1280px-West_Lake_Hanoi.jpg",
    alt: "Khung cảnh mặt hồ Tây mênh mông lộng gió lúc chiều tà, mặt nước phẳng lặng phản chiếu ánh hoàng hôn vàng ươm dịu mát.",
    title: "Hồ Tây thanh bình",
    credit: "Wikimedia Commons · CC BY-SA 3.0",
    link: "/destination?d=ho-tay",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Hanoi_Opera_House_2019.jpg/1280px-Hanoi_Opera_House_2019.jpg",
    alt: "Nhà hát Lớn Hà Nội với kiến trúc Tân cổ điển Pháp màu vàng ngà sang trọng, các hàng cột vươn cao uy nghi tại Quảng trường Cách mạng Tháng Tám.",
    title: "Nhà hát Lớn Hà Nội",
    credit: "Wikimedia Commons · CC BY-SA 4.0",
    link: "/destination?d=nha-hat-lon",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Doan_Mon_Gate%2C_Imperial_Citadel_of_Thang_Long.jpg/1280px-Doan_Mon_Gate%2C_Imperial_Citadel_of_Thang_Long.jpg",
    alt: "Cổng Đoan Môn sừng sững tại Hoàng thành Thăng Long, xây bằng đá và gạch vòm kiên cố, chứng tích ngàn năm lịch sử kinh kỳ.",
    title: "Hoàng thành Thăng Long",
    credit: "Wikimedia Commons · CC BY-SA 4.0",
    link: "/destination?d=hoang-thanh",
  },
];

export default function HomeGallery() {
  const { speak } = useA11y();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  function openImage(index) {
    setCurrentIndex(index);
    setModalOpen(true);
    speak(`Mở ảnh ${GALLERY_IMAGES[index].title}. Bấm Escape để đóng hoặc phím mũi tên để chuyển ảnh.`);
  }

  return (
    <section className="container-page py-12" aria-labelledby="gallery-heading">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="chip hc-surface hc-border text-xs font-bold text-primary">Bộ sưu tập xúc giác & hình ảnh</span>
          <h2 id="gallery-heading" className="mt-2 text-3xl sm:text-4xl">
            Hà Nội qua <span className="text-[#eb5d27]">lăng kính tiếp cận</span>
          </h2>
          <p className="hc-muted mt-1 max-w-2xl text-ink-soft">
            Mỗi bức ảnh đều đi kèm văn bản mô tả hình ảnh chi tiết (Alt text) và hỗ trợ giọng đọc thuyết minh âm thanh để người khiếm thị dễ dàng cảm nhận vẻ đẹp của thủ đô.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openImage(0)}
          className="btn-ghost hc-border !min-h-[42px] !px-5 !py-2 text-sm"
        >
          <SpeakerIcon size={18} /> Mở trình xem & nghe ảnh
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {GALLERY_IMAGES.map((img, idx) => (
          <button
            key={img.title}
            type="button"
            onClick={() => openImage(idx)}
            className="group relative overflow-hidden rounded-2xl border border-line bg-white shadow-card text-left transition hover:-translate-y-1 hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-primary hc-surface hc-border"
            aria-label={`Xem chi tiết và nghe thuyết minh ảnh: ${img.title}`}
          >
            <div className="relative h-40 w-full overflow-hidden bg-black/5">
              <VerifiedImage
                src={img.src}
                fallback="/assets/images/location-image-unavailable.svg"
                alt={img.alt}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm opacity-90 transition group-hover:bg-primary group-hover:text-ink">
                <SpeakerIcon size={14} />
              </span>
            </div>
            <div className="p-3">
              <p className="text-xs font-bold line-clamp-1">{img.title}</p>
              <p className="hc-muted mt-0.5 text-[11px] text-ink-soft line-clamp-2">{img.alt}</p>
            </div>
          </button>
        ))}
      </div>

      <ImageGalleryModal
        isOpen={modalOpen}
        images={GALLERY_IMAGES}
        currentIndex={currentIndex}
        onClose={() => setModalOpen(false)}
        onSelectIndex={(newIdx) => setCurrentIndex(newIdx)}
      />
    </section>
  );
}
