// ======================================================
// DATA.JS — Leitura pública dos plantões (Firestore)
// ======================================================

// 🔥 inicialização do Firestore
const db = firebase.firestore();

// ======================================================
// BUSCAR TODOS OS PLANTÕES
// ======================================================
async function carregarPlantoes() {
  try {
    const snap = await db
      .collection("plantoes")
      .orderBy("date")
      .get();

    return snap.docs.map(doc => doc.data());
  } catch (err) {
    console.error("Erro ao carregar plantões:", err);
    return [];
  }
}

// ======================================================
// EXPÕE GLOBAL PARA O SITE
// ======================================================
window.PlantoesStore = {
  async get() {
    return await carregarPlantoes();
  }
};
