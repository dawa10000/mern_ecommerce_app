import { useState, useRef } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetTop5Query } from "./productApi.js";
import { useNavigate } from "react-router";



export default function Top5Products() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const CARD_W = 380;
  const nav = useNavigate();
  const { isLoading, data, error } = useGetTop5Query();
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>{error.data?.message || error.error}</p>



  const scrollTo = (idx) => {
    const clamped = Math.max(0, Math.min(idx, data.length - 1));
    setActiveIdx(clamped);
    trackRef.current?.scrollTo({ left: clamped * CARD_W, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    setActiveIdx(Math.round(trackRef.current.scrollLeft / CARD_W));
  };

  return (
    <div>
      <section style={{ background: "#FAF7F2", padding: "5rem 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#B8860B", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Handpicked</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#1A1209", letterSpacing: "-0.02em" }}>Top Picks For You</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#9A8A72", fontSize: "0.95rem", marginTop: 12, maxWidth: 420, margin: "12px auto 0" }}>
              Find a bright ideal to suit your taste with our great selection of suspension, floor and table lights.
            </p>
          </div>
        </div>


        <div className="relative max-w-7xl mx-auto px-6">

          <div
            ref={trackRef}
            onScroll={handleScroll}
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              paddingBottom: "1rem",
            }}
          >
            {data.map(({ title, image, _id, price, description }) => (
              <div
                key={_id}
                style={{ flex: "0 0 360px", scrollSnapAlign: "start" }} onClick={() => nav(`/product/${_id}`)} className="cursor-pointer"
              >

                <div className='relative rounded-xl bg-gradient-to-r from-neutral-600 to-violet-300 pt-0 shadow-lg'>
                  <div className='flex h-60 items-center justify-center'>
                    <img
                      src={image[0].url}
                      alt={title}
                      className='w-75'
                    />
                  </div>
                  <Card className='border-none flex flex-col'>
                    <CardHeader>
                      <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {description}
                      </p>
                    </CardContent>
                    <CardFooter className='justify-between gap-3 max-sm:flex-col max-sm:items-stretch'>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium uppercase'>Price</span>
                        <span className='text-xl font-semibold'>Rs{price}</span>
                      </div>

                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
          </div>


          <button
            onClick={() => scrollTo(activeIdx - 1)}
            disabled={activeIdx === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollTo(activeIdx + 1)}
            disabled={activeIdx === data.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>


        <div className="flex justify-center gap-2 mt-6">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              style={{
                width: activeIdx === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: activeIdx === i ? "#B8860B" : "#D4C8E8",
                border: "none",
                cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}