// ======================================================
// DATA.JS — Leitura pública (JSON gerado pelo admin)
// ======================================================

const DATA_URL = "./plantoes.json";

window.PlantoesStore = {
  async get() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao carregar JSON");
      return await res.json();
    } catch (err) {
      console.error("Erro ao carregar plantões:", err);
      return [];
    }
  }
};
