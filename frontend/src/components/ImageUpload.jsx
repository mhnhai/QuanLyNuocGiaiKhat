import { useState } from "react";

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null); // Lưu ảnh trên server

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Hiển thị ảnh preview
        }
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Vui lòng chọn ảnh trước khi upload!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", image);
        if (uploadedImage) {
            formData.append("old_filename", uploadedImage); // Gửi ảnh cũ để xóa
        }

        try {
            const response = await fetch("http://localhost:8000/upload-image", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setUploadedImage(data.filename); // Lưu tên ảnh mới
            alert("Ảnh đã được upload thành công!");
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Upload Ảnh</h2>

            {/* Preview Image */}
            {preview && (
                <div className="mb-4">
                    <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded shadow" />
                </div>
            )}

            {/* Input Chọn Ảnh */}
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

            {/* Button Upload */}
            <button
                onClick={handleUpload}
                className="btn btn-primary"
                disabled={loading}
            >
                {loading ? "Đang tải lên..." : "Upload Ảnh"}
            </button>

            {/* Hiển thị ảnh đã upload */}
            {uploadedImage && (
                <div className="mt-4">
                    <p className="text-sm">Ảnh đã upload:</p>
                    <img
                        src={`http://localhost:8000/upload-image/${uploadedImage}`}
                        alt="Uploaded"
                        className="w-40 h-40 object-cover rounded shadow"
                    />
                </div>
            )}
        </div>
    );
};

export default UploadImage;
