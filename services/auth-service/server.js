require("dotenv").config();
const { db } = require("./src/config/firebase");

// db.collection("test")
//   .doc("hello")
//   .set({ ok: true })
//   .then(() => console.log("✅ Firestore fonctionne"))
//   .catch(err => console.error("❌ Firestore erreur:", err));


const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
