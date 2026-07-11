import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadDocument } from "../api/upload";
import { setUploadResult } from "../services/uploadState";

export default function Upload() {
    const navigate = useNavigate();

    const inputRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progressText, setProgressText] = useState("");
    const [error, setError] = useState("");

    async function handleUpload(file) {
        if (!file) return;

        setLoading(true);
        setError("");

        try {
            setProgressText("Uploading document...");

            const response = await uploadDocument(file);

            setProgressText("Building health intelligence...");

            setUploadResult(response);

            setTimeout(() => {
                navigate("/health");
            }, 700);
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                    "Unable to process document."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">

            <section className="upload-section">

                <h1 className="hero-title">
                    Upload Medical Records
                </h1>

                <p className="hero-subtitle">
                    Upload prescriptions, lab reports,
                    discharge summaries or scanned
                    medical documents.
                </p>

                <div
                    className={
                        dragging
                            ? "upload-box dragging"
                            : "upload-box"
                    }
                    onClick={() => inputRef.current.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => {
                        setDragging(false);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);

                        const file =
                            e.dataTransfer.files[0];

                        handleUpload(file);
                    }}
                >
                    <input
                        ref={inputRef}
                        hidden
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                            handleUpload(
                                e.target.files[0]
                            )
                        }
                    />

                    {!loading && (
                        <>
                            <h2>
                                Drop your medical
                                records here
                            </h2>

                            <p>
                                or click anywhere
                                to browse
                            </p>

                            <small>
                                PDF • PNG • JPG • JPEG
                            </small>
                        </>
                    )}

                    {loading && (
                        <div className="upload-loading">

                            <div className="loader" />

                            <h3>
                                Processing...
                            </h3>

                            <p>
                                {progressText}
                            </p>

                        </div>
                    )}
                </div>

                {error && (
                    <div className="upload-error">
                        {error}
                    </div>
                )}

            </section>

        </div>
    );
}