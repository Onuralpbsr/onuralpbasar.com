import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "32px",
          height: "32px",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          border: "1.5px solid #f89821",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: 900,
            color: "#f89821",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          O
        </span>
      </div>
    ),
    { ...size }
  );
}
