export default function Footer() {
  return (
    <footer style={{ background: "#1A1209", color: "rgba(255,255,255,0.7)", padding: "4rem 0 2rem" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 800, color: "white", display: "block", marginBottom: 16 }}>Furniro<span style={{ color: "#B8860B" }}>.</span></span>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 240 }}>400 University Drive Suite 200, Coral Gables, FL 33134 USA</p>
          </div>
          {[
            { title: "Links", links: ["Home", "Shop", "About", "Contact"] },
            { title: "Help", links: ["Payment Options", "Returns", "Privacy Policy", "FAQ"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>{col.title}</h4>
              {col.links.map(link => (
                <a key={link} href="#" style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#B8860B"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}>{link}</a>
              ))}
            </div>
          ))}
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Newsletter</h4>
            <div style={{ display: "flex", gap: 0, overflow: "hidden", borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)" }}>
              <input type="email" placeholder="Your email" style={{ flex: 1, background: "transparent", border: "none", padding: "10px 14px", color: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none" }} />
              <button style={{ background: "#B8860B", color: "white", border: "none", padding: "10px 16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap" }}>Subscribe</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>© 2024 Furniro. All rights reserved. Crafted with passion.</p>
        </div>
      </div>
    </footer>
  );
}