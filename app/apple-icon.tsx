import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
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

        {/* ONR text */}
        <span
          style={{
            fontSize: "52px",
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          ONR
        </span>

        {/* Orange underline */}
        <div
          style={{
            width: "40px",
            height: "2px",
            background: "#f89821",
          }}
        />

        {/* Subtext */}
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#f89821",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            letterSpacing: "3px",
            lineHeight: 1,
          }}
        >
          DİJİTAL
        </span>
      </div>
    ),
    { ...size }
  );
}
