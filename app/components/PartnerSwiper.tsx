"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { clientLogosExtended } from "@/lib/data";

export default function PartnerSwiper() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      slidesPerView={2}
      spaceBetween={40}
      loop
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      breakpoints={{
        480: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 6 },
      }}
    >
      {clientLogosExtended.map((logo, i) => (
        <SwiperSlide key={logo.name + i}>
          <div className="flex items-center justify-center h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <Image
              src={logo.src}
              alt={`${logo.name} logo`}
              width={130}
              height={52}
              className="object-contain max-h-11 w-auto"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
