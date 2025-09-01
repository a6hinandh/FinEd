import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "./firebase"; // your firebase.js config file

// Fetch all posts
export const fetchExpenses = async (uid) => {
  try {
    const postsRef = collection(db, "expenses");
    const q = query(
          postsRef,
          where("userId", "==", uid), // use timestamp instead of 'id'
        );
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

export const fetchSavings = async (uid) => {
  try {
    const postsRef = collection(db, "savings");
    const q = query(
          postsRef,
          where("userId", "==", uid), // use timestamp instead of 'id'
        );
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