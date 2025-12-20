// =======================================================
// ADMIN.JS — Painel Administrativo (Firestore)
// =======================================================

// FIRESTORE
const db = firebase.firestore();

// ESTADO
let listaAtual = [];
let editId = null;

// ELEMENTOS
const tabela = document.querySelector("#tabela tbody");
const filtroMes = document.getElementById("filtroMes");

const modalBg = document.getElementById("modalBg");
const modalImportBg = document.getElementById("modalImportBg");

const importTextarea = document.getElementById("importTextarea");

const inpDate = document.getElementById("inpDate");
const inpFarm = document.getElementById("inpFarm");
const inpEnd = document.getElementById("inpEnd");
const inpTel = document.getElementById("inpTel");
const inpArea = document.getElementById("inpArea");

const modalTitle = document.getElementById("modalTitle");

// =======================================================
// MODAL NOVO / EDITAR
// =======================================================
window.openModal = function (id = null) {
  editId = id;

  if (id) {
    const p = listaAtual.find(x => x.id === id);
    if (!p) return;

    modalTitle.textContent = "Editar Plantão";
    inpDate.value = p.date;
    inpFarm.value = p.farmacia;
    inpEnd.value = p.endereco || "";
    inpTel.value = p.telefone || "";
    inpArea.value = p.area;
  } else {
    modalTitle.textContent = "Novo Plantão";
    inpDate.value = "";
    inpFarm.value = "";
    inpEnd.value = "";
    inpTel.value = "";
    inpArea.value = "";
  }

  modalBg.style.display = "flex";
};

modalBg.addEventListener("click", e => {
  if (e.target === modalBg) modalBg.style.display = "none";
});

// =======================================================
// MODAL IMPORTAÇÃO
// =======================================================
window.openImportModal = function () {
  importTextarea.value = "";
  modalImportBg.style.display = "flex";
};

modalImportBg.addEventListener("click", e => {
  if (e.target === modalImportBg) modalImportBg.style.display = "none";
});

// =======================================================
// IMPORTAR LISTA (JSON → FIRESTORE)
// =======================================================
window.importarLista = async function () {
  const texto = importTextarea.value.trim();
  if (!texto) {
    alert("Cole o JSON da lista.");
    return;
  }

  let json;
  try {
    json = JSON.parse(texto);
    if (!Array.isArray(json)) throw new Error();
  } catch {
    alert("JSON inválido.");
    return;
  }

  try {
    const batch = db.batch();

    json.forEach(p => {
      if (!p.date || !p.farmacia || !p.area) return;

      const ref = db.collection("plantoes").doc(p.date);
      batch.set(ref, {
        date: p.date,
        farmacia: p.farmacia,
        endereco: p.endereco || "",
        telefone: p.telefone || "",
        area: p.area.toUpperCase()
      });
    });

    await batch.commit();

    modalImportBg.style.display = "none";
    importTextarea.value = "";
    alert("Lista importada com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao importar lista.");
  }
};

// =======================================================
// SALVAR (CRIAR / EDITAR)
// =======================================================
window.savePlantao = async function () {
  const novo = {
    date: inpDate.value,
    farmacia: inpFarm.value.trim(),
    endereco: inpEnd.value.trim(),
    telefone: inpTel.value.trim(),
    area: inpArea.value.trim().toUpperCase()
  };

  if (!novo.date || !novo.farmacia || !novo.area) {
    alert("Preencha data, farmácia e área.");
    return;
  }

  await db.collection("plantoes").doc(novo.date).set(novo);
  modalBg.style.display = "none";
};

// =======================================================
// EXCLUIR
// =======================================================
window.excluir = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este plantão?")) return;
  await db.collection("plantoes").doc(id).delete();
};

// =======================================================
// FILTRO POR MÊS
// =======================================================
function atualizarFiltroMes(lista) {
  const meses = [...new Set(lista.map(p => p.date.slice(0, 7)))].sort();

  filtroMes.innerHTML =
    `<option value="">Todos</option>` +
    meses.map(m => `<option value="${m}">${m}</option>`).join("");
}

filtroMes.addEventListener("change", renderTabela);

// =======================================================
// RENDER TABELA
// =======================================================
function renderTabela() {
  let lista = [...listaAtual];
  const mes = filtroMes.value;

  if (mes) {
    lista = lista.filter(p => p.date.startsWith(mes));
  }

  tabela.innerHTML = lista
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(p => `
      <tr>
        <td>${p.date}</td>
        <td>${p.farmacia}</td>
        <td>${p.area}</td>
        <td>${p.telefone || "-"}</td>
        <td>
          <button class="btn-small" onclick="openModal('${p.id}')">Editar</button>
          <button class="btn-small" onclick="excluir('${p.id}')">Excluir</button>
        </td>
      </tr>
    `)
    .join("");
}

// =======================================================
// LISTENER EM TEMPO REAL (CORE)
// =======================================================
db.collection("plantoes")
  .orderBy("date")
  .onSnapshot(snapshot => {
    listaAtual = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    atualizarFiltroMes(listaAtual);
    renderTabela();
  });

// =======================================================
// PUBLICAR JSON PARA SITE PÚBLICO
// =======================================================
window.publicarJSON = async function () {
  const snap = await db.collection("plantoes").orderBy("date").get();
  const dados = snap.docs.map(doc => doc.data());

  const blob = new Blob(
    [JSON.stringify(dados, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "plantoes.json";
  a.click();

  URL.revokeObjectURL(url);
};
