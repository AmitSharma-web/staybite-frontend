import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageCarousel = ({ images = [], height = "220px" }) => {
    if (!images || images.length === 0) return null;

    return (
        <div className="image-carousel" style={{ height }}>
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                loop={images.length > 1}
                style={{ height: "100%", borderRadius: "inherit" }}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={img}
                            alt={`Slide ${idx + 1}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                            onError={(e) =>
                            (e.target.src =
                                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800")
                            }
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageCarousel;
