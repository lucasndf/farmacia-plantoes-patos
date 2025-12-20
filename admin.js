// =======================================================
//  ADMIN.JS — Painel Administrativo (Firestore)
// =======================================================

let editId = null;

// FIRESTORE
const db = firebase.firestore();
const colRef = db.collection("plantoes");

// ELEMENTOS
const tabela = document.querySelector("#tabela tbody");
const modalBg = document.getElementById("modalBg");
const modalImportBg = document.getElementById("modalImportBg");
const importTextarea = document.getElementById("importTextarea");
const filtroMes = document.getElementById("filtroMes");

const inpDate = document.getElementById("inpDate");
const inpFarm = document.getElementById("inpFarm");
const inpEnd = document.getElementById("inpEnd");
const inpTel = document.getElementById("inpTel");
const inpArea = document.getElementById("inpArea");

const modalTitle = document.getElementById("modalTitle");

// CACHE EM MEMÓRIA (não é LocalStorage)
let listaCache = [];

// =======================================================
//  ABRIR MODAL
// =======================================================
window.openModal = function (id = null) {
  editId = id;

  if (id) {
    const p = listaCache.find(x => x.id === id);
    modalTitle.textContent = "Editar Plantão";

    inpDate.value = p.date;
    inpFarm.value = p.farmacia;
    inpEnd.value = p.endereco;
    inpTel.value = p.telefone;
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
//  MODAL IMPORTAÇÃO
// =======================================================
window.openImportModal = function () {
  importTextarea.value = "";
  modalImportBg.style.display = "flex";
};

modalImportBg.addEventListener("click", e => {
  if (e.target === modalImportBg) modalImportBg.style.display = "none";
});

// =======================================================
//  IMPORTAR LISTA → FIRESTORE
// =======================================================
window.importarLista = async function () {
  const texto = importTextarea.value.trim();
  if (!texto) return alert("Cole o JSON da lista.");

  try {
    const json = JSON.parse(texto);
    if (!Array.isArray(json)) throw "";

    const batch = db.batch();

    json.forEach(p => {
      const ref = colRef.doc(p.date); // usa a data como ID
      batch.set(ref, {
        date: p.date,
        farmacia: p.farmacia,
        endereco: p.endereco,
        telefone: p.telefone,
        area: p.area.toUpperCase()
      });
    });

    await batch.commit();

    modalImportBg.style.display = "none";
    await carregarDados();
    alert("Lista importada com sucesso!");

  } catch {
    alert("JSON inválido.");
  }
};

// =======================================================
//  FILTRO POR MÊS
// =======================================================
function atualizarFiltroMes() {
  const meses = [...new Set(listaCache.map(p => p.date.slice(0, 7)))].sort();

  filtroMes.innerHTML =
    `<option value="">Todos</option>` +
    meses.map(m => `<option value="${m}">${m}</option>`).join("");
}

filtroMes.addEventListener("change", renderTabela);

// =======================================================
//  RENDER TABELA
// =======================================================
function renderTabela() {
  let lista = [...listaCache];
  const mes = filtroMes.value;

  if (mes) lista = lista.filter(p => p.date.startsWith(mes));

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
//  EXCLUIR
// =======================================================
window.excluir = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este plantão?")) return;

  await colRef.doc(id).delete();
  await carregarDados();
};

// =======================================================
//  SALVAR
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

  const ref = colRef.doc(novo.date);
  await ref.set(novo);

  modalBg.style.display = "none";
  await carregarDados();
};

// =======================================================
//  CARREGAR DADOS DO FIRESTORE
// =======================================================
async function carregarDados() {
  const snap = await colRef.get();
  listaCache = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  atualizarFiltroMes();
  renderTabela();
}

// =======================================================
//  INIT
// =======================================================
carregarDados();
