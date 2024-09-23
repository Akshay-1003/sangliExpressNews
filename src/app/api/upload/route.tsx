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

    // Define a timeout promise that rejects after a certain time
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("File upload timed out")), 15000) // 15 seconds timeout
    );

    // Create the upload process as a promise
    const uploadPromise = new Promise<string>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error); // Reject if an error occurs
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject); // Resolve with download URL
        }
      );
    });

    // Use Promise.race to race between upload and timeout
    const downloadURL = await Promise.race([uploadPromise, timeoutPromise]);

    // Respond with the download URL if successful
    return NextResponse.json(
      {
        message: "File uploaded successfully",
        downloadURL,
        fileId: storageRef.fullPath,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    
    return NextResponse.json(
      { error: error || "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Optional: Increase timeout in Next.js config if required
 const config = {
  api: {
    bodyParser: false,
    responseLimit: '4mb', // Adjust as per your file size needs
  },
};
