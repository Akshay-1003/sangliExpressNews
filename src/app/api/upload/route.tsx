import { NextResponse } from "next/server";
import { storage } from "../../../../firebase/firebase"; // Firebase initialized
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export async function POST(request: Request) {
  try {
    // Parse form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    // Handle case where no file is provided
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Early response for long-running operations
    const responseSent = false;

    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`);

    // Start the resumable file upload using Firebase's `uploadBytesResumable`
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Track the upload progress and return it to the client (optional)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);

        // Optionally, update client-side with progress (or store progress in DB)
      },
      (error) => {
        console.error("Upload failed:", error);

        // Optionally, handle errors here, like notifying client of failed upload
        if (!responseSent) {
          return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
        }
      },
      async () => {
        // Upload completed successfully, get the download URL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          if (!responseSent) {
            return NextResponse.json({
              message: "File uploaded successfully",
              downloadURL,
              fileId: storageRef.fullPath, // Return the file path for future reference
            }, { status: 200 });
          }
        } catch (error) {
          if (!responseSent) {
            return NextResponse.json({ error: "Failed to retrieve download URL" }, { status: 500 });
          }
        }
      }
    );

    // You can return a response immediately to the client
    if (!responseSent) {
      return NextResponse.json({
        message: "File upload in progress",
        status: "uploading",
      }, { status: 202 });
    }

  } catch (error) {
    // Catch any other errors that occur during the upload process
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: error || "Failed to upload file" }, { status: 500 });
  }
}
