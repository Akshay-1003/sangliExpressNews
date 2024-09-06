import { db } from "../../firebase/firebase";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
export const createDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const getAllDocuments = async (collectionName: string) => {
  try {
    

    const querySnapshot = await getDocs(
      query(
        collection(db, collectionName)
        // where("date", "==", new Date().toLocaleDateString())
      ),
    );

    
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return documents;
  } catch (error) {
    console.error("Error getting today's documents: ", error);
    throw error;
  }
};

export const updateDocument = async (
  collectionName: string,
  id: string,
  data: any,
) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", id);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
export const getDocumentById = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("No such document!");
  }
};