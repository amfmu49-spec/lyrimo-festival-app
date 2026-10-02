import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1kaqThA1IHbHB9yFrHeY5gBfXYhPgc14",
  authDomain: "lyrimofes.firebaseapp.com",
  projectId: "lyrimofes",
  storageBucket: "lyrimofes.firebasestorage.app",
  messagingSenderId: "329084639921",
  appId: "1:329084639921:web:8b50856245237ae86ea090"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      name: "Test", text: "Test message", createdAt: new Date()
    });
    console.log("Added doc:", docRef.id);
    
    const querySnapshot = await getDocs(collection(db, "messages"));
    console.log("Documents:");
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
test();
