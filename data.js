// ======================================================
// DATA.JS — Leitura pública (Firestore)
// ======================================================

const db = firebase.firestore();

window.PlantoesStore = {
  async get() {
    try {
      const snap = await db
        .collection("plantoes")
        .orderBy("date")
        .get();

      return snap.docs.map(doc => doc.data());

    } catch (err) {
      console.error("Erro Firestore:", err);
      return [];
    }
  }
};
