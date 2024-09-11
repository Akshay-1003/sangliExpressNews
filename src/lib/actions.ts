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

export const getAllDocuments = async () => {
  try {
    

    const querySnapshot = await getDocs(
      query(
        collection(db, 'news')
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
    const docRef = doc(db, 'news', id);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", id);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const deleteDocument = async (id: string) => {
  try {
    const docRef = doc(db, 'news', id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
export const getDocumentById = async ( id: string) => {
  const docRef = doc(db, 'news', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("No such document!");
  }
};
export const getUserInfo = async (id: string) => {
  try {
    const userRef = doc(db, 'Users', id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      throw new Error("User not found!");
    }
  } catch (error) {
    console.error("Error getting user info: ", error);
    throw error;
  }
};
export const getAllNewsIds = async () => {
  try {
    const newsCollection = collection(db, 'news');
    const newsSnapshot = await getDocs(newsCollection);
    const newsIds = newsSnapshot.docs.map(doc => doc.id);
    return newsIds;
  } catch (error) {
    console.error("Error getting all news IDs: ", error);
    throw error;
  }
};
