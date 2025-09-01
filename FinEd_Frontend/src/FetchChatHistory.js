import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // your firebase.js config file

// Fetch all posts
export const fetchChatHistory = async () => {
  try {
    const postsRef = collection(db, "chatHistory");
    const q = query(postsRef, orderBy("id", "desc"));
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,     // Firestore doc ID
      ...doc.data(),  // Spread the fields inside
    }));
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};