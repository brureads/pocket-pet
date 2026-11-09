
import './style.css';

type Humor = 'feliz' | 'triste' | 'cansado' | 'faminto';
type Cor = 'branco' | 'rosa' | 'lilas' | 'creme';
type Acessorio = 'lacinho' | 'oculos' | 'coroa';
type Equipado = Acessorio | 'nenhum';

interface Pet {
  nome: string;
  cor: Cor;
  fome: number;
  felicidade: number;
  energia: number;
  moedas: number;
  inventario: Acessorio[];
  equipado: Equipado;
}

interface Produto {
  id: Acessorio;
  nome: string;
  preco: number;
  descricao: string;
}

const produtos: Produto[] = [
  {
    id: 'lacinho',
    nome: 'Lacinho',
    preco: 30,
    descricao: 'Um toque delicado.'
  },
  {
    id: 'oculos',
    nome: 'Óculos',
    preco: 50,
    descricao: 'Para os dias de estilo.'
  },
  {
    id: 'coroa',
    nome: 'Coroa',
    preco: 100,
    descricao: 'Para a realeza.'
  }
];

const petInicial: Pet = {
  nome: 'Mochi',
  cor: 'branco',
  fome: 75,
  felicidade: 90,
  energia: 80,
  moedas: 20,
  inventario: [],
  equipado: 'nenhum'
};

const INTERVALO = 30000;
const CHAVE_SALVAMENTO = 'pocket-pet-save';

const cores: Cor[] = ['branco', 'rosa', 'lilas', 'creme'];
const acessorios: Acessorio[] = ['lacinho', 'oculos', 'coroa'];

function limitar(valor: number): number {
  return Math.max(0, Math.min(100, valor));
}

function ehAcessorio(valor: unknown): valor is Acessorio {
  return typeof valor === 'string' &&
    acessorios.includes(valor as Acessorio);
}

function carregarPet(): Pet {
  const dados = localStorage.getItem(CHAVE_SALVAMENTO);

  if (dados) {
    try {
      const salvo: unknown = JSON.parse(dados);

      if (typeof salvo === 'object' && salvo !== null) {
        const valores = salvo as Record<string, unknown>;

        const inventario: Acessorio[] = Array.isArray(valores.inventario)
          ? [...new Set(valores.inventario.filter(ehAcessorio))]
          : [];

        const equipado: Equipado =
          ehAcessorio(valores.equipado) &&
          inventario.includes(valores.equipado)
            ? valores.equipado
            : 'nenhum';

        const numeroValido = (
          valor: unknown,
          padrao: number
        ): number => {
          return typeof valor === 'number' &&
            Number.isFinite(valor)
              ? limitar(valor)
              : padrao;
        };

        return {
          nome:
            typeof valores.nome === 'string' &&
            valores.nome.trim()
              ? valores.nome.trim().slice(0, 20)
              : petInicial.nome,

          cor: cores.includes(valores.cor as Cor)
            ? valores.cor as Cor
            : petInicial.cor,

          fome: numeroValido(valores.fome, petInicial.fome),

          felicidade: numeroValido(
            valores.felicidade,
            petInicial.felicidade
          ),

          energia: numeroValido(
            valores.energia,
            petInicial.energia
          ),

          moedas:
            typeof valores.moedas === 'number' &&
            Number.isSafeInteger(valores.moedas) &&
            valores.moedas >= 0
              ? valores.moedas
              : petInicial.moedas,

          inventario,
          equipado
        };
      }
    } catch {
      console.warn('Não foi possível carregar o progresso.');
    }
  }

  return { ...petInicial };
}

const pet: Pet = carregarPet();

function salvarPet(): void {
  localStorage.setItem(
    CHAVE_SALVAMENTO,
    JSON.stringify(pet)
  );
}

function descobrirHumor(): Humor {
  if (pet.fome <= 20) return 'faminto';
  if (pet.energia <= 20) return 'cansado';
  if (pet.felicidade <= 20) return 'triste';

  return 'feliz';
}

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <main class="game-container">
      <header class="game-header">
        <span class="eyebrow">YOUR LITTLE COMPANION</span>
        <h1 class="game-title">pocket pet<span>.</span></h1>
        <p class="subtitle">
          Um cantinho especial para cuidar do seu bichinho.
        </p>

        <div class="wallet">
          <span class="coin-symbol">C</span>
          <span id="coin-value">20</span>
          <span>moedas</span>
        </div>
      </header>

      <section class="pet-area">
        <span class="pet-status" id="pet-status">Feliz</span>

        <div class="pet-scene">
          <div class="pet feliz" id="pet">
            <div class="ear ear-left"></div>
            <div class="ear ear-right"></div>

            <div class="pet-body">
              <div class="face">
                <div class="eyes">
                  <span class="eye"></span>
                  <span class="eye"></span>
                </div>

                <div class="cheeks">
                  <span></span>
                  <span></span>
                </div>

                <div class="mouth"></div>
              </div>
            </div>

            <div class="accessory" id="pet-accessory"></div>
          </div>

          <div class="pet-shadow"></div>
        </div>

        <h2 class="pet-name" id="pet-name"></h2>

        <p class="pet-description" id="pet-description">
          Seu pequeno melhor amigo.
        </p>

        <button class="customize-button" id="customize">
          Personalizar
        </button>
      </section>

      <section class="stats">
        <div class="stat">
          <div class="stat-label">
            <span>Saciedade</span>
            <span id="hunger-value">0%</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill hunger-fill"
                 id="hunger-bar"></div>
          </div>
        </div>

        <div class="stat">
          <div class="stat-label">
            <span>Felicidade</span>
            <span id="happy-value">0%</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill happy-fill"
                 id="happy-bar"></div>
          </div>
        </div>

        <div class="stat">
          <div class="stat-label">
            <span>Energia</span>
            <span id="energy-value">0%</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill energy-fill"
                 id="energy-bar"></div>
          </div>
        </div>
      </section>

      <section class="actions">
        <button class="action-button" id="feed">
          Alimentar
        </button>

        <button class="action-button" id="play">
          Brincar
        </button>

        <button class="action-button" id="sleep">
          Dormir
        </button>
      </section>

      <button class="shop-button" id="open-shop">
        Abrir lojinha
      </button>

      <p class="message" id="message" aria-live="polite"></p>

      <footer class="game-footer">
        MADE WITH LOVE · POCKET PET
      </footer>
    </main>

    <dialog class="customize-modal" id="customize-modal"
            aria-labelledby="modal-title">
      <form id="customize-form">
        <h2 id="modal-title">Personalizar bichinho</h2>

        <p class="modal-description">
          Deixe seu companheiro com a sua cara.
        </p>

        <label for="pet-name-input">Nome</label>

        <input
          type="text"
          id="pet-name-input"
          maxlength="20"
          placeholder="Nome do bichinho"
          required
        />

        <p class="color-label">Escolha uma cor</p>

        <div class="color-options">
          <label class="color-option">
            <input type="radio" name="pet-color" value="branco" />
            <span class="color-circle branco"></span>
            <span>Branco</span>
          </label>

          <label class="color-option">
            <input type="radio" name="pet-color" value="rosa" />
            <span class="color-circle rosa"></span>
            <span>Rosa</span>
          </label>

          <label class="color-option">
            <input type="radio" name="pet-color" value="lilas" />
            <span class="color-circle lilas"></span>
            <span>Lilás</span>
          </label>

          <label class="color-option">
            <input type="radio" name="pet-color" value="creme" />
            <span class="color-circle creme"></span>
            <span>Creme</span>
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-button" id="cancel">
            Cancelar
          </button>

          <button type="submit" class="save-button">
            Salvar
          </button>
        </div>
      </form>
    </dialog>

    <dialog class="shop-modal" id="shop-modal"
            aria-labelledby="shop-title">
      <div class="shop-header">
        <span class="eyebrow">POCKET PET SHOP</span>
        <h2 id="shop-title">Little Boutique</h2>
        <p>Pequenos presentes para seu bichinho.</p>

        <div class="shop-wallet">
          <span class="coin-symbol">C</span>
          <span id="shop-coins">20</span>
          <span>moedas disponíveis</span>
        </div>
      </div>

      <div class="shop-products" id="shop-products"></div>

      <p class="shop-message" id="shop-message" aria-live="polite">
        Escolha algo especial.
      </p>

      <button class="close-shop" id="close-shop">
        Voltar ao jogo
      </button>
    </dialog>
  `;
}

function atualizarStatus(
  barraId: string,
  valorId: string,
  valor: number
): void {
  const barra = document.getElementById(barraId);
  const texto = document.getElementById(valorId);

  if (barra) barra.style.width = `${valor}%`;
  if (texto) texto.textContent = `${valor}%`;
}

function atualizarHumor(): void {
  const bichinho = document.getElementById('pet');
  const status = document.getElementById('pet-status');
  const descricao = document.getElementById('pet-description');

  const humor = descobrirHumor();

  const estados: Record<Humor, {
    nome: string;
    descricao: string;
  }> = {
    feliz: {
      nome: 'Feliz',
      descricao: 'Aproveitando o dia.'
    },
    triste: {
      nome: 'Tristinho',
      descricao: 'Um pouco de atenção faria bem.'
    },
    cansado: {
      nome: 'Sonolento',
      descricao: 'Uma soneca seria perfeita.'
    },
    faminto: {
      nome: 'Com fome',
      descricao: 'Está na hora de comer.'
    }
  };

  if (bichinho) {
    bichinho.className = `pet ${humor} cor-${pet.cor}`;
  }

  if (status) {
    status.textContent = estados[humor].nome;
  }

  if (descricao) {
    descricao.textContent = estados[humor].descricao;
  }
}

function atualizarAcessorio(): void {
  const elemento = document.getElementById('pet-accessory');

  if (elemento) {
    elemento.className = 'accessory';

    if (pet.equipado !== 'nenhum') {
      elemento.classList.add(`accessory-${pet.equipado}`);
    }
  }
}

function atualizarMoedas(): void {
  const carteira = document.getElementById('coin-value');
  const carteiraLoja = document.getElementById('shop-coins');

  if (carteira) carteira.textContent = String(pet.moedas);

  if (carteiraLoja) {
    carteiraLoja.textContent = String(pet.moedas);
  }
}

function atualizarTela(): void {
  atualizarStatus('hunger-bar', 'hunger-value', pet.fome);
  atualizarStatus('happy-bar', 'happy-value', pet.felicidade);
  atualizarStatus('energy-bar', 'energy-value', pet.energia);

  const nome = document.getElementById('pet-name');

  if (nome) nome.textContent = pet.nome;

  atualizarHumor();
  atualizarAcessorio();
  atualizarMoedas();
}

function mostrarMensagem(texto: string): void {
  const mensagem = document.getElementById('message');

  if (mensagem) mensagem.textContent = texto;
}

function verificarNecessidades(): void {
  const humor = descobrirHumor();

  if (humor === 'faminto') {
    mostrarMensagem(`${pet.nome} precisa comer.`);
  } else if (humor === 'cansado') {
    mostrarMensagem(`${pet.nome} precisa descansar.`);
  } else if (humor === 'triste') {
    mostrarMensagem(`${pet.nome} gostaria de brincar.`);
  } else if (pet.fome <= 40) {
    mostrarMensagem(`${pet.nome} está ficando com fome.`);
  } else if (pet.energia <= 40) {
    mostrarMensagem(`${pet.nome} está ficando cansadinho.`);
  } else {
    mostrarMensagem('Tudo tranquilo por aqui.');
  }
}

function ganharMoedas(): void {
  pet.moedas += 5;
}

document.querySelector('#feed')?.addEventListener('click', () => {
  if (pet.fome === 100) {
    mostrarMensagem(`${pet.nome} já está satisfeito.`);
    return;
  }

  pet.fome = limitar(pet.fome + 15);
  ganharMoedas();

  atualizarTela();
  salvarPet();

  mostrarMensagem(`${pet.nome} adorou a refeição! +5 moedas.`);
});

document.querySelector('#play')?.addEventListener('click', () => {
  if (pet.energia < 10) {
    mostrarMensagem(`${pet.nome} está cansado demais para brincar.`);
    return;
  }

  if (pet.felicidade === 100) {
    mostrarMensagem(`${pet.nome} já está muito feliz.`);
    return;
  }

  pet.felicidade = limitar(pet.felicidade + 15);
  pet.energia = limitar(pet.energia - 10);

  ganharMoedas();

  atualizarTela();
  salvarPet();

  mostrarMensagem(`${pet.nome} se divertiu! +5 moedas.`);
});

document.querySelector('#sleep')?.addEventListener('click', () => {
  if (pet.energia === 100) {
    mostrarMensagem(`${pet.nome} já está descansado.`);
    return;
  }

  pet.energia = limitar(pet.energia + 20);
  ganharMoedas();

  atualizarTela();
  salvarPet();

  mostrarMensagem(`${pet.nome} descansou! +5 moedas.`);
});

// Personalização

const modal = document.querySelector<HTMLDialogElement>(
  '#customize-modal'
);

const formulario = document.querySelector<HTMLFormElement>(
  '#customize-form'
);

const nomeInput = document.querySelector<HTMLInputElement>(
  '#pet-name-input'
);

document.querySelector('#customize')?.addEventListener('click', () => {
  if (!modal || !nomeInput || !formulario) return;

  nomeInput.value = pet.nome;

  const corAtual = formulario.querySelector<HTMLInputElement>(
    `input[name="pet-color"][value="${pet.cor}"]`
  );

  if (corAtual) corAtual.checked = true;

  modal.showModal();
});

document.querySelector('#cancel')?.addEventListener('click', () => {
  modal?.close();
});

formulario?.addEventListener('submit', (evento) => {
  evento.preventDefault();

  if (!nomeInput) return;

  const novoNome = nomeInput.value.trim();

  if (!novoNome) {
    nomeInput.setCustomValidity('Digite um nome.');
    nomeInput.reportValidity();
    return;
  }

  const corSelecionada = formulario.querySelector<HTMLInputElement>(
    'input[name="pet-color"]:checked'
  );

  const novaCor = corSelecionada?.value as Cor | undefined;

  pet.nome = novoNome.slice(0, 20);

  if (novaCor && cores.includes(novaCor)) {
    pet.cor = novaCor;
  }

  atualizarTela();
  salvarPet();

  modal?.close();

  mostrarMensagem(`${pet.nome} está de visual novo!`);
});

nomeInput?.addEventListener('input', () => {
  nomeInput.setCustomValidity('');
});

// Lojinha e inventário

const loja = document.querySelector<HTMLDialogElement>('#shop-modal');

function mensagemLoja(texto: string): void {
  const mensagem = document.getElementById('shop-message');

  if (mensagem) mensagem.textContent = texto;
}

function renderizarLoja(): void {
  const container = document.getElementById('shop-products');

  if (!container) return;

  container.innerHTML = produtos.map((produto) => {
    const comprado = pet.inventario.includes(produto.id);
    const equipado = pet.equipado === produto.id;

    let textoBotao = `Comprar · ${produto.preco}`;
    let desabilitado = pet.moedas < produto.preco;

    if (comprado) {
      textoBotao = equipado ? 'Remover' : 'Equipar';
      desabilitado = false;
    }

    return `
      <article class="product-card">
        <div class="product-preview preview-${produto.id}">
          <div class="product-icon icon-${produto.id}"></div>
        </div>

        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>

        <button
          class="product-button"
          data-product="${produto.id}"
          ${desabilitado ? 'disabled' : ''}
        >
          ${textoBotao}
        </button>
      </article>
    `;
  }).join('');

  atualizarMoedas();
}

function selecionarProduto(id: Acessorio): void {
  const produto = produtos.find((item) => item.id === id);

  if (!produto) return;

  const comprado = pet.inventario.includes(id);

  if (comprado) {
    if (pet.equipado === id) {
      pet.equipado = 'nenhum';
      mensagemLoja(`${produto.nome} removido.`);
    } else {
      pet.equipado = id;
      mensagemLoja(`${produto.nome} equipado!`);
    }
  } else {
    if (pet.moedas < produto.preco) {
      mensagemLoja('Você ainda não tem moedas suficientes.');
      return;
    }

    pet.moedas -= produto.preco;
    pet.inventario.push(id);
    pet.equipado = id;

    mensagemLoja(`${produto.nome} comprado e equipado!`);
  }

  salvarPet();
  atualizarTela();
  renderizarLoja();
}

document.querySelector('#open-shop')?.addEventListener('click', () => {
  renderizarLoja();
  mensagemLoja('Escolha algo especial.');
  loja?.showModal();
});

document.querySelector('#close-shop')?.addEventListener('click', () => {
  loja?.close();
});

document.querySelector('#shop-products')?.addEventListener(
  'click',
  (evento) => {
    const alvo = evento.target;

    if (!(alvo instanceof Element)) return;

    const botao = alvo.closest<HTMLButtonElement>(
      '[data-product]'
    );

    if (!botao || botao.disabled) return;

    const id = botao.dataset.product;

    if (ehAcessorio(id)) {
      selecionarProduto(id);
    }
  }
);

// Passagem do tempo

function passarTempo(): void {
  pet.fome = limitar(pet.fome - 5);
  pet.felicidade = limitar(pet.felicidade - 3);
  pet.energia = limitar(pet.energia - 4);

  atualizarTela();
  salvarPet();
  verificarNecessidades();
}

setInterval(passarTempo, INTERVALO);

atualizarTela();
verificarNecessidades();
