import { NextResponse } from "next/server";
import { storage } from "../../../../firebase/firebase"; // Import your initialized Firebase storage
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const storageRef = ref(
      storage,
      `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`,
    );

    // Wrap the upload process in a Promise so we can await it
    const downloadURL = await new Promise<string>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can track progress here, but it's not necessary for your response
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error); // Reject if an error occurs
        },
        () => {
          // Get the download URL once the upload is complete
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url); // Resolve the Promise with the download URL
          });
        },
      );
    });

    // Return response with the download URL once upload completes
    return NextResponse.json(
      {
        message: "File uploaded successfully",
        downloadURL,
        fileId: storageRef.fullPath,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
