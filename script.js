const campoQuantidade = document.getElementById('quantidade');
const botaoSortear = document.getElementById('botao-sortear');
const botaoLimpar = document.getElementById('botao-limpar');
const resultado = document.getElementById('resultado');
const mensagem = document.getElementById('mensagem');

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

function sortearJogos() {
    const quantidade = Number(campoQuantidade.value);

    mensagem.textContent = '';

    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 10) {
        mensagem.textContent = 'Digite uma quantidade entre 1 e 10.';
        resultado.innerHTML = '';
        return;
    }

    // Sorteia todos os números de uma vez.
    // Assim, não há repetição entre os jogos.
    const numerosSorteados = sortearNumeros(quantidade * 6);

    resultado.innerHTML = `<h3>SORTEANDO ${quantidade} JOGO(S)</h3>`;

    for (let indice = 0; indice < quantidade; indice++) {
        const inicio = indice * 6;
        const numerosDoJogo = numerosSorteados
            .slice(inicio, inicio + 6)
            .sort((a, b) => a - b);

        const linhaJogo = document.createElement('p');
        linhaJogo.innerHTML = `<strong>Jogo ${indice + 1}:</strong> `;

        numerosDoJogo.forEach((numero) => {
            linhaJogo.innerHTML += `
                <span class="bola">${String(numero).padStart(2, '0')}</span>
            `;
        });

        resultado.appendChild(linhaJogo);
    }
}

function limparResultado() {
    campoQuantidade.value = 1;
    mensagem.textContent = '';
    resultado.innerHTML = 'Seus jogos aparecerão aqui.';
}

botaoSortear.addEventListener('click', sortearJogos);
botaoLimpar.addEventListener('click', limparResultado);
