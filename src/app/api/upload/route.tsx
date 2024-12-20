import { NextResponse } from "next/server";
import { storage } from "../../../../firebase/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create a storage reference for the file
    const storageRef = ref(storage, `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`);
    
    // Upload file using uploadBytesResumable
    const uploadTask = uploadBytesResumable(storageRef, file);

    const downloadURL = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Log the upload progress
          console.log("Upload progress:", (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + "%");
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });

    // Immediately respond with download URL once upload completes
    return NextResponse.json({
      message: "File uploaded successfully",
      downloadURL,
      fileId: storageRef.fullPath,
    }, { status: 200 });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
