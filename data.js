// ======================================================
// DATA.JS — Leitura pública do Firebase
// ======================================================

async function carregarPlantoesFirebase() {
  const db = firebase.firestore();

  const snap = await db
    .collection("plantoes")
    .orderBy("date")
    .get();

  return snap.docs.map(doc => doc.data());
}

window.PlantoesStore = {
  async get() {
    try {
      return await carregarPlantoesFirebase();
    } catch (err) {
      console.error("Erro Firebase:", err);
      return [];
    }
  }
};
