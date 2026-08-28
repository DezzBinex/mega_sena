const campoQuantidade = document.getElementById('quantidade');
const botaoSortear = document.getElementById('botao-sortear');
const botaoLimpar = document.getElementById('botao-limpar');
const resultado = document.getElementById('resultado');
const mensagem = document.getElementById('mensagem');

// Será preenchido depois que o historico.json for carregado.
let combinacoesHistoricas = new Set();
let historicoCarregado = false;

function criarChave(jogo) {
    return jogo
        .map(Number)
        .sort((a, b) => a - b)
        .map((numero) => String(numero).padStart(2, '0'))
        .join('-');
}

async function carregarHistorico() {
    try {
        // O await fica corretamente dentro da função async.
        const resposta = await fetch('./historico.json');

        if (!resposta.ok) {
            throw new Error('Arquivo historico.json não encontrado.');
        }

        const historico = await resposta.json();

        combinacoesHistoricas = new Set(
            historico.map((concurso) => criarChave(concurso.dezenas))
        );

        historicoCarregado = true;
        botaoSortear.disabled = false;
        mensagem.textContent = `${combinacoesHistoricas.size} combinações históricas carregadas.`;

        console.log('Histórico carregado com sucesso.');
    } catch (erro) {
        console.error('Erro ao carregar o histórico:', erro);
        mensagem.textContent = 'Erro: não foi possível carregar historico.json.';
    }
}

function sortearNumeros(total) {
    const numeros = [];

    while (numeros.length < total) {
        const numero = Math.floor(Math.random() * 60) + 1;

        if (!numeros.includes(numero)) {
            numeros.push(numero);
        }
    }

    return numeros;
}

function gerarJogosSemRepetir(quantidade) {
    const limiteTentativas = 10000;

    for (let tentativa = 0; tentativa < limiteTentativas; tentativa++) {
        // Sorteia todos os números de uma vez.
        // Assim, nenhum número individual se repete entre os jogos.
        const numerosSorteados = sortearNumeros(quantidade * 6);
        const jogos = [];
        let combinacaoValida = true;

        for (let indice = 0; indice < quantidade; indice++) {
            const inicio = indice * 6;
            const jogo = numerosSorteados
                .slice(inicio, inicio + 6)
                .sort((a, b) => a - b);

            const chave = criarChave(jogo);
            const jogoJaFoiGerado = jogos.some(
                (outroJogo) => criarChave(outroJogo) === chave
            );

            // Rejeita combinações que já saíram ou que se repetiram nesta rodada.
            if (combinacoesHistoricas.has(chave) || jogoJaFoiGerado) {
                combinacaoValida = false;
                break;
            }

            jogos.push(jogo);
        }

        if (combinacaoValida) {
            return jogos;
        }
    }

    throw new Error('Não foi possível gerar jogos válidos.');
}

function mostrarJogos(jogos) {
    resultado.innerHTML = `<h3>SORTEANDO ${jogos.length} JOGO(S)</h3>`;

    jogos.forEach((jogo, indice) => {
        const linhaJogo = document.createElement('p');
        linhaJogo.innerHTML = `<strong>Jogo ${indice + 1}:</strong> `;

        jogo.forEach((numero) => {
            linhaJogo.innerHTML += `
                <span class="bola">${String(numero).padStart(2, '0')}</span>
            `;
        });

        resultado.appendChild(linhaJogo);
    });
}

function sortearJogos() {
    const quantidade = Number(campoQuantidade.value);
    mensagem.textContent = '';

    if (!historicoCarregado) {
        mensagem.textContent = 'Aguarde o histórico ser carregado.';
        return;
    }

    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 10) {
        mensagem.textContent = 'Digite uma quantidade entre 1 e 10.';
        resultado.innerHTML = '';
        return;
    }

    try {
        const jogos = gerarJogosSemRepetir(quantidade);
        mostrarJogos(jogos);
    } catch (erro) {
        mensagem.textContent = erro.message;
        resultado.innerHTML = '';
    }
}

function limparResultado() {
    campoQuantidade.value = 1;
    mensagem.textContent = '';
    resultado.innerHTML = 'Seus jogos aparecerão aqui.';
}

// Desativa o botão enquanto o historico.json é carregado.
botaoSortear.disabled = true;

botaoSortear.addEventListener('click', sortearJogos);
botaoLimpar.addEventListener('click', limparResultado);

// Inicia o carregamento do histórico ao abrir a página.
carregarHistorico();
