import { ImageResponse } from "next/og";

export const alt = "Viliahazo — sehatra ofisialy ho an'ny mponina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image de partage (Facebook, WhatsApp, X, LinkedIn...). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #1b3b1f 0%, #25582b 55%, #3f8b45 100%)",
          color: "#f2f8f1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#fbf7f0",
              color: "#25582b",
              fontSize: 52,
              fontWeight: 800,
            }}
          >
            V
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>Viliahazo</div>
            <div style={{ fontSize: 22, color: "#c2dfc3" }}>
              Kaominina ambanivohitra · Madagasikara
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.5 }}>
            Ny vaovao sy ny serivisy rehetra
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.5 }}>
            ao Viliahazo, amin&apos;ny toerana iray.
          </div>
          <div style={{ marginTop: 26, fontSize: 26, color: "#e0efe0" }}>
            Vaovao · Taratasy · Trano sy fanampiana · Fitaterana · Asa · Hetsika
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#c2dfc3",
            borderTop: "2px solid rgba(194,223,195,0.35)",
            paddingTop: 22,
          }}
        >
          <span>Ben&apos;ny tanàna : RANDRIAMANANTENA Gabriel Rolland</span>
          <span>viliahazo.org</span>
        </div>
      </div>
    ),
    size,
  );
}
