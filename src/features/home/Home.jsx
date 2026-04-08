import { useState } from "react";
import Top5Products from "../product/Top5Products.jsx";
import { useNavigate } from "react-router";


// --- Real Image URLs from Unsplash ---
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
  asgaard: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
  blog1: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
  blog2: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80",
  blog3: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
  insta1: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=300&q=80",
  insta2: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=300&q=80",
  insta3: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=300&q=80",
  insta4: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&q=80",
  insta5: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80",
  insta6: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80",
};



const blogs = [
  { id: 1, title: "Going all-in with millennial design", excerpt: "Discover how millennial aesthetics are redefining modern interiors with bold choices.", img: IMAGES.blog1, date: "01 Oct 2023", read: "5 min" },
  { id: 2, title: "Styling your home for the seasons", excerpt: "Simple swaps and layering techniques to refresh any living space as the seasons shift.", img: IMAGES.blog2, date: "14 Oct 2023", read: "4 min" },
  { id: 3, title: "Minimalism: less is more at home", excerpt: "A deep dive into achieving warmth and personality while keeping clutter at bay.", img: IMAGES.blog3, date: "28 Oct 2023", read: "6 min" },
];


// --- Hero ---
function Hero() {
  const nav = useNavigate();
  return (
    <section style={{ background: "#FBF3E3", overflow: "hidden", position: "relative", minHeight: 520 }}>
      {/* Decorative circle */}
      <div style={{ position: "absolute", right: -80, top: -80, width: 500, height: 500, borderRadius: "50%", background: "rgba(184,134,11,0.06)", pointerEvents: "none" }} />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="grid-cols-responsive">
          {/* Text side */}
          <div style={{ zIndex: 1, position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,134,11,0.1)", borderRadius: 50, padding: "6px 16px", marginBottom: "1.25rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B8860B" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#B8860B", letterSpacing: "0.1em", textTransform: "uppercase" }}>New Arrival</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#1A1209", lineHeight: 1.1, marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
              Rocket Single<br />
              <em style={{ fontStyle: "italic", color: "#B8860B" }}>Seater</em>
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#7A6A52", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 380 }}>
              Timeless craftsmanship meets modern comfort. Elevate your space with furniture that tells a story.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button onClick={() => nav('/shop')} style={{ background: "#B8860B", color: "white", border: "none", borderRadius: 4, padding: "14px 32px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(184,134,11,0.3)" }}
                onMouseEnter={e => { e.target.style.background = "#9A6E08"; e.target.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.target.style.background = "#B8860B"; e.target.style.transform = "translateY(0)"; }}>
                Shop Now
              </button>
              <button onClick={() => nav('/shop')} style={{ background: "transparent", color: "#1A1209", border: "2px solid #E8DCC8", borderRadius: 4, padding: "14px 32px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.target.style.borderColor = "#B8860B"; e.target.style.color = "#B8860B"; }}
                onMouseLeave={e => { e.target.style.borderColor = "#E8DCC8"; e.target.style.color = "#1A1209"; }}>
                Explore All
              </button>
            </div>
          </div>

          {/* Image side */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: "40% 60% 60% 40% / 50% 50% 50% 50%", overflow: "hidden", aspectRatio: "1", background: "#F0E8D4", boxShadow: "0 30px 80px rgba(0,0,0,0.12)" }}>
              <img src={IMAGES.hero} alt="Luxury sofa" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* Floating badge */}
            <div style={{ position: "absolute", bottom: 24, left: -16, background: "white", borderRadius: 12, padding: "12px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden" }}>
                <img src={IMAGES.pick1} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#999", margin: 0 }}>Best Seller</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#1A1209", margin: 0 }}>Trenton Sofa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-cols-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}



// --- Asgaard Banner ---
function AsgaardBanner() {
  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: 440 }}>
      <img src={IMAGES.asgaard} alt="Asgaard sofa" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(26,18,9,0.75) 0%, rgba(26,18,9,0.2) 60%, transparent 100%)" }} />
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1, height: "100%", minHeight: 440, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 480 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>New Arrivals</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Asgaard<br /><em style={{ fontStyle: "italic", color: "#E8C84A" }}>Sofa Collection</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 380 }}>
            Inspired by Scandinavian heritage. Built for the modern home. Experience unparalleled comfort.
          </p>
          <button style={{ background: "#B8860B", color: "white", border: "none", borderRadius: 4, padding: "14px 36px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(184,134,11,0.4)" }}
            onMouseEnter={e => { e.target.style.background = "#E8C84A"; e.target.style.color = "#1A1209"; }}
            onMouseLeave={e => { e.target.style.background = "#B8860B"; e.target.style.color = "white"; }}>
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
}

// --- Blog Section ---
function BlogSection() {
  const [hovered, setHovered] = useState(null);
  return (
    <section style={{ background: "white", padding: "5rem 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#B8860B", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Our Journal</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#1A1209", letterSpacing: "-0.02em" }}>From The Blog</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {blogs.map((blog) => (
            <article key={blog.id} style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(blog.id)} onMouseLeave={() => setHovered(null)}>
              <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "3/2", marginBottom: "1.25rem" }}>
                <img src={blog.img} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", transform: hovered === blog.id ? "scale(1.05)" : "scale(1)", display: "block" }} />
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#B8860B", fontWeight: 600 }}>⏱ {blog.read} read</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#9A8A72" }}>📅 {blog.date}</span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, marginBottom: 8, lineHeight: 1.3, transition: "color 0.2s", color: hovered === blog.id ? "#B8860B" : "#1A1209" }}>{blog.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#9A8A72", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: 12 }}>{blog.excerpt}</p>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#1A1209", borderBottom: "2px solid #B8860B", paddingBottom: 2 }}>Read More →</span>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button style={{ background: "transparent", color: "#1A1209", border: "2px solid #1A1209", borderRadius: 4, padding: "12px 36px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.background = "#1A1209"; e.target.style.color = "white"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#1A1209"; }}>
            View All Posts
          </button>
        </div>
      </div>
    </section>
  );
}

// --- Instagram Section ---
function InstagramSection() {
  const instaImgs = [IMAGES.insta1, IMAGES.insta2, IMAGES.insta3, IMAGES.insta4, IMAGES.insta5, IMAGES.insta6];
  return (
    <section style={{ background: "#FAF7F2", padding: "5rem 0" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#B8860B", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Share your setup with</p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#1A1209", letterSpacing: "-0.02em", marginBottom: 16 }}>Our Instagram</h2>
        <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#B8860B", fontWeight: 600, textDecoration: "none" }}>@furniro_official</a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4 }}>
        {instaImgs.map((img, i) => (
          <div key={i} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.querySelector("img").style.transform = "scale(1.1)"; e.currentTarget.querySelector(".ig-overlay").style.opacity = 1; }}
            onMouseLeave={e => { e.currentTarget.querySelector("img").style.transform = "scale(1)"; e.currentTarget.querySelector(".ig-overlay").style.opacity = 0; }}>
            <img src={img} alt={`Instagram ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }} />
            <div className="ig-overlay" style={{ position: "absolute", inset: 0, background: "rgba(184,134,11,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <button style={{ background: "#1A1209", color: "white", border: "none", borderRadius: 50, padding: "12px 32px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8 }}
          onMouseEnter={e => e.target.style.background = "#B8860B"}
          onMouseLeave={e => e.target.style.background = "#1A1209"}>
          Follow Us on Instagram
        </button>
      </div>
    </section>
  );
}





export default function FurnitureHomepage() {

  return (
    <div>


      <Hero />
      <Top5Products />
      <AsgaardBanner />
      <BlogSection />
      <InstagramSection />

    </div>
  );
}