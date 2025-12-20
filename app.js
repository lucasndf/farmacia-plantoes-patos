</head>

<body>
<div id="app">

  <header>
    <div>
      <h1>Farmácia de Plantão</h1>
      <p id="subtitle">Saiba rapidamente qual farmácia está de plantão hoje em Patos-PB.</p>
    </div>

    <div class="header-right">
      <span class="pill">📍 Patos-PB</span>
      <a href="login.html" class="admin-link">Área administrativa</a>
    </div>
  </header>

  <section id="todayCard" class="today-card"></section>

  <h3 class="sub-title">📅 Próximos plantões deste mês</h3>
  <section id="nextList"></section>

  <footer>
    Dados oficiais fornecidos pelo <strong>PROCON de Patos-PB</strong>.
    Horários de plantão: segunda a sexta, 23h às 06h • finais de semana, 22h às 06h.
    <br><br>
    Projeto desenvolvido por
    <a href="https://lucasndf.github.io/portfolio/" target="_blank" class="dev-link">
      <strong>Lucas Nascimento</strong>
    </a>.
  </footer>

</div>

<!-- BASE DE DADOS -->
<script src="data.js"></script>

<!-- LÓGICA DO SITE -->
<script src="app.js"></script>

</body>
</html>
