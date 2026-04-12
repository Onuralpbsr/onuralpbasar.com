import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ONR Dijital Medya Ajansı — Video Prodüksiyon & Sosyal Medya Yönetimi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Subtle orange corner glows */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(248,152,33,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(248,152,33,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Top orange line */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "3px",
            background: "linear-gradient(to right, transparent, #f89821, transparent)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            ONR DİJİTAL
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#f89821",
              letterSpacing: "6px",
              lineHeight: 1,
            }}
          >
            MEDYA AJANSI
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "64px",
            height: "2px",
            background: "#f89821",
            marginBottom: "32px",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "1px",
            marginBottom: "48px",
            textAlign: "center",
          }}
        >
          Video Prodüksiyon & Sosyal Medya Yönetimi
        </div>

        {/* Service pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "48px",
          }}
        >
          {["Drone Çekimi", "Reklam Filmi", "Meta Ads", "Sosyal Medya"].map(
            (service) => (
              <div
                key={service}
                style={{
                  padding: "10px 24px",
                  border: "1px solid rgba(248,152,33,0.4)",
                  borderRadius: "100px",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "rgba(248,152,33,0.9)",
                  background: "rgba(248,152,33,0.08)",
                }}
              >
                {service}
              </div>
            )
          )}
        </div>

        {/* Location */}
        <div
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "3px",
          }}
        >
          ADANA · MERSİN · GAZİANTEP
        </div>

        {/* Bottom orange line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "3px",
            background: "linear-gradient(to right, transparent, #f89821, transparent)",
          }}
        />

        {/* URL bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "40px",
            fontSize: "14px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "1px",
          }}
        >
          onuralpbasar.com
        </div>
      </div>
    ),
    { ...size }
  );
}
