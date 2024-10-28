import { NextResponse } from "next/server";
import { storage } from "../../../../firebase/firebase"; // Your initialized Firebase storage
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

    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`);
    // Start the file upload using Firebase's `uploadBytesResumable`
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Return a promise that resolves when the upload is complete and retrieves the download URL
    const downloadURL = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: You can track upload progress here if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Reject the promise if an error occurs during the upload
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          // On successful upload, get the download URL
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (error) {
            reject(error);
          }
        }
      );
    });

    // Respond with a success message and the download URL once the upload is complete
    return NextResponse.json({
      message: "File uploaded successfully",
      downloadURL,
      fileId: storageRef.fullPath, // Return the file path for future reference
    }, { status: 200 });

  } catch (error) {
    // Handle any errors that occur during the upload process
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: error || "Failed to upload file" }, { status: 500 });
  }
}
