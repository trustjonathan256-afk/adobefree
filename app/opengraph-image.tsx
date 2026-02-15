import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Adobe Free Download - Get All Adobe Apps for Free";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(to bottom right, #000000, #1a1a1a)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "sans-serif",
                    color: "white",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "2.5rem",
                    }}
                >
                    {/* Simple Adobe-like square or logo placeholder */}
                    <div
                        style={{
                            width: "5rem",
                            height: "5rem",
                            backgroundColor: "#FF0000",
                            borderRadius: "1rem",
                            marginRight: "1.25rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "3.125rem",
                            fontWeight: "bold",
                        }}
                    >
                        A
                    </div>
                    <h1 style={{ fontSize: "5rem", fontWeight: "bold", margin: 0 }}>
                        Adobe Free
                    </h1>
                </div>
                <p style={{ fontSize: "2.5rem", opacity: 0.8, maxWidth: "50rem", textAlign: "center" }}>
                    Get Photoshop, Illustrator, Premiere Pro & more for free.
                </p>
                <div
                    style={{
                        marginTop: "2.5rem",
                        padding: "0.9375rem 2.5rem",
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "3.125rem",
                        fontSize: "1.875rem",
                        fontWeight: "bold",
                    }}
                >
                    Download Now
                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}
