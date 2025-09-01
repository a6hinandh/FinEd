import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "./firebase";

export const fetchChatHistory = async (uid) => {
  if (!uid) return []; // safety check

  try {
    const postsRef = collection(db, "chatHistory");
    const q = query(
      postsRef,
      where("userId", "==", uid),
      orderBy("createdAt", "desc") // use timestamp instead of 'id'
    );

    const querySnapshot = await getDocs(q);

    console.log("UID:", uid);
    console.log("Docs found:", querySnapshot.docs.length);

    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(posts)

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
