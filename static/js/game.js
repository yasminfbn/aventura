
const telaJogo = document.getElementById("tela-jogo");
const contexto = telaJogo.getContext("2d");

const modalGameOver = document.getElementById("modal-game-over");
const botaoTentarNovamente = document.getElementById("botao-tentar-novamente");
const modalVitoria = document.getElementById("modal-vitoria");

const imagemPorquinho = new Image();
imagemPorquinho.src = "/static/img/porquinho.png";

imagemPorquinho.onload = () => {
    console.log("Imagem do porquinho carregada!");
};

imagemPorquinho.onerror = () => {
    console.error("Não foi possível carregar a imagem do porquinho.");
};

contexto.imageSmoothingEnabled = true;

const personagem = {
    x: 70,
    y: 390,
    largura: 68,
    altura: 58,
    velocidade: 4,
    velocidadeY: 0,
    forcaPulo: -13,
    gravidade: 0.6,
    noChao: false,
    posicaoInferiorAnterior: 0,
    direcao: 1,
    andando: false,
    quadroAnimacao: 0
};

let cenourasColetadas = 0;
let vidas = 3;
let inimigosDerrotados = 0;

const teclas = {};

let fimDeJogo = false;
let faseConcluida = false;

let tempoProtecao = 0;
let tempoDisparo = 0;
let tempoAnimacao = 0;

let cameraX = 0;
const larguraMundo = 3000;

const inimigos = [
    {
        tipo: "voador",
        x: 350, y: 230,
        largura: 35, altura: 44,
        velocidade: 2, direcao: 1,
        vivo: true,
        limiteEsquerdo: 300,
        limiteDireito: 480,
        alturaInicial: 230,
        movimentoVoo: 0,
        intervaloAtaque: 360,
        tempoAtaque: 0,
        velocidadeProjetil: 2.2
    },
    {
        tipo: "terrestre",
        x: 800, y: 436,
        largura: 35, altura: 44,
        velocidade: 2, direcao: 1,
        vivo: true,
        limiteEsquerdo: 650,
        limiteDireito: 950,
        intervaloAtaque: 0,
        tempoAtaque: 0,
        velocidadeProjetil: 0
    },
    {
        tipo: "voador",
        x: 1200, y: 200,
        largura: 35, altura: 44,
        velocidade: 2.5, direcao: -1,
        vivo: true,
        limiteEsquerdo: 1100,
        limiteDireito: 1350,
        alturaInicial: 200,
        movimentoVoo: 1,
        intervaloAtaque: 420,
        tempoAtaque: 0,
        velocidadeProjetil: 2.3
    },
    {
        tipo: "terrestre",
        x: 1650, y: 436,
        largura: 35, altura: 44,
        velocidade: 2.3, direcao: 1,
        vivo: true,
        limiteEsquerdo: 1500,
        limiteDireito: 1800,
        intervaloAtaque: 0,
        tempoAtaque: 0,
        velocidadeProjetil: 0
    },
    {
        tipo: "voador",
        x: 2150, y: 210,
        largura: 35, altura: 44,
        velocidade: 3, direcao: 1,
        vivo: true,
        limiteEsquerdo: 2050,
        limiteDireito: 2300,
        alturaInicial: 210,
        movimentoVoo: 0,
        intervaloAtaque: 480,
        tempoAtaque: 0,
        velocidadeProjetil: 2.5
    },
    {
        tipo: "terrestre",
        x: 2600, y: 436,
        largura: 35, altura: 44,
        velocidade: 2.5, direcao: -1,
        vivo: true,
        limiteEsquerdo: 2450,
        limiteDireito: 2750,
        intervaloAtaque: 0,
        tempoAtaque: 0,
        velocidadeProjetil: 0
    }
];

const posicoesIniciaisInimigos = inimigos.map(inimigo => ({
    x: inimigo.x,
    y: inimigo.y,
    direcao: inimigo.direcao,
    velocidade: inimigo.velocidade
}));

const projeteisInimigos = [];
const projeteisPersonagem = [];

const plataformas = [
    { x: 0, y: 480, largura: larguraMundo, altura: 60 },
    { x: 220, y: 390, largura: 150, altura: 18 },
    { x: 470, y: 320, largura: 150, altura: 18 },
    { x: 720, y: 390, largura: 150, altura: 18 },
    { x: 1050, y: 370, largura: 160, altura: 18 },
    { x: 1300, y: 300, largura: 160, altura: 18 },
    { x: 1580, y: 380, largura: 160, altura: 18 },
    { x: 1850, y: 330, largura: 160, altura: 18 },
    { x: 2150, y: 390, largura: 160, altura: 18 },
    { x: 2450, y: 310, largura: 160, altura: 18 },
    { x: 2700, y: 380, largura: 160, altura: 18 }
];

const cenouras = [
    { x: 270, y: 350, coletada: false },
    { x: 320, y: 350, coletada: false },
    { x: 520, y: 280, coletada: false },
    { x: 570, y: 280, coletada: false },
    { x: 770, y: 350, coletada: false },
    { x: 1100, y: 330, coletada: false },
    { x: 1150, y: 330, coletada: false },
    { x: 1350, y: 260, coletada: false },
    { x: 1630, y: 340, coletada: false },
    { x: 1680, y: 340, coletada: false },
    { x: 1900, y: 290, coletada: false },
    { x: 2200, y: 350, coletada: false },
    { x: 2250, y: 350, coletada: false },
    { x: 2500, y: 270, coletada: false },
    { x: 2700, y: 340, coletada: false }
];

const arvores = [
    { x: 130, altura: 190, largura: 65 },
    { x: 290, altura: 300, largura: 75 },
    { x: 550, altura: 350, largura: 80 },
    { x: 790, altura: 260, largura: 70 },
    { x: 1120, altura: 300, largura: 80 },
    { x: 1370, altura: 370, largura: 85 },
    { x: 1650, altura: 270, largura: 75 },
    { x: 1900, altura: 340, largura: 85 },
    { x: 2200, altura: 270, largura: 80 },
    { x: 2500, altura: 370, largura: 85 },
    { x: 2750, altura: 280, largura: 80 },
    { x: 2920, altura: 200, largura: 70 }
];

function verificarColisao(objetoA, objetoB) {
    return (
        objetoA.x < objetoB.x + objetoB.largura &&
        objetoA.x + objetoA.largura > objetoB.x &&
        objetoA.y < objetoB.y + objetoB.altura &&
        objetoA.y + objetoA.altura > objetoB.y
    );
}

document.addEventListener("keydown", evento => {
    const tecla = evento.key.toLowerCase();

    if (evento.key === " " || evento.key.startsWith("Arrow")) {
        evento.preventDefault();
    }

    if (tecla === "r") {
        reiniciarJogo();
        return;
    }

    if (fimDeJogo || faseConcluida) return;

    teclas[tecla] = true;

    if (tecla === "x" && !evento.repeat) {
        dispararPersonagem();
    }

    if (
        (evento.key === " " ||
         evento.key === "ArrowUp" ||
         tecla === "w") &&
        personagem.noChao
    ) {
        personagem.velocidadeY = personagem.forcaPulo;
        personagem.noChao = false;
    }
});

document.addEventListener("keyup", evento => {
    teclas[evento.key.toLowerCase()] = false;
});

function moverPersonagem() {
    personagem.andando = false;

    if (teclas["arrowright"] || teclas["d"]) {
        personagem.x += personagem.velocidade;
        personagem.direcao = 1;
        personagem.andando = true;
    }

    if (teclas["arrowleft"] || teclas["a"]) {
        personagem.x -= personagem.velocidade;
        personagem.direcao = -1;
        personagem.andando = true;
    }

    personagem.x = Math.max(
        0,
        Math.min(
            personagem.x,
            larguraMundo - personagem.largura
        )
    );

    if (personagem.andando && personagem.noChao) {
        personagem.quadroAnimacao += 0.25;
    }
}

function moverInimigos() {
    for (const inimigo of inimigos) {
        if (!inimigo.vivo) continue;

        inimigo.x += inimigo.velocidade * inimigo.direcao;

        if (inimigo.x >= inimigo.limiteDireito) {
            inimigo.x = inimigo.limiteDireito;
            inimigo.direcao = -1;
        }

        if (inimigo.x <= inimigo.limiteEsquerdo) {
            inimigo.x = inimigo.limiteEsquerdo;
            inimigo.direcao = 1;
        }

        if (inimigo.tipo === "voador") {
            inimigo.movimentoVoo += 0.05;

            inimigo.y =
                inimigo.alturaInicial +
                Math.sin(inimigo.movimentoVoo) * 45;
        }
    }
}

function dispararPersonagem() {
    if (tempoDisparo > 0) return;

    projeteisPersonagem.push({
        x: personagem.x + (
            personagem.direcao === 1
                ? personagem.largura
                : -12
        ),
        y: personagem.y + 25,
        largura: 14,
        altura: 10,
        velocidadeX: 8 * personagem.direcao
    });

    tempoDisparo = 18;
}

function atacarInimigos() {
    for (const inimigo of inimigos) {
        if (!inimigo.vivo || inimigo.tipo !== "voador") {
            continue;
        }

        inimigo.tempoAtaque++;

        if (inimigo.tempoAtaque < inimigo.intervaloAtaque) {
            continue;
        }

        inimigo.tempoAtaque = 0;

        const diferencaX =
            personagem.x + personagem.largura / 2 -
            (inimigo.x + inimigo.largura / 2);

        const diferencaY =
            personagem.y + personagem.altura / 2 -
            (inimigo.y + inimigo.altura / 2);

        const distancia = Math.hypot(diferencaX, diferencaY);

        if (distancia === 0) continue;

        projeteisInimigos.push({
            x: inimigo.x + inimigo.largura / 2 - 8,
            y: inimigo.y + inimigo.altura / 2 - 8,
            largura: 16,
            altura: 16,
            velocidadeX:
                (diferencaX / distancia) * inimigo.velocidadeProjetil,
            velocidadeY:
                (diferencaY / distancia) * inimigo.velocidadeProjetil
        });
    }
}

function moverProjeteisInimigos() {
    for (let i = projeteisInimigos.length - 1; i >= 0; i--) {
        const projetil = projeteisInimigos[i];

        projetil.x += projetil.velocidadeX;
        projetil.y += projetil.velocidadeY;

        if (
            projetil.x < 0 ||
            projetil.x > larguraMundo ||
            projetil.y < -50 ||
            projetil.y > telaJogo.height + 200
        ) {
            projeteisInimigos.splice(i, 1);
            continue;
        }

        if (verificarColisao(personagem, projetil)) {
            projeteisInimigos.splice(i, 1);
            receberDano(projetil.x);
        }
    }
}

function moverProjeteisPersonagem() {
    for (let i = projeteisPersonagem.length - 1; i >= 0; i--) {
        const projetil = projeteisPersonagem[i];

        projetil.x += projetil.velocidadeX;

        if (projetil.x < 0 || projetil.x > larguraMundo) {
            projeteisPersonagem.splice(i, 1);
            continue;
        }

        for (const inimigo of inimigos) {
            if (!inimigo.vivo) continue;

            if (verificarColisao(projetil, inimigo)) {
                inimigo.vivo = false;
                inimigosDerrotados++;

                projeteisPersonagem.splice(i, 1);
                break;
            }
        }
    }
}

function receberDano(origemX) {
    if (tempoProtecao > 0 || fimDeJogo || faseConcluida) {
        return;
    }

    vidas--;

    document.getElementById("vidas").textContent = vidas;

    personagem.x += personagem.x < origemX ? -30 : 30;

    personagem.x = Math.max(
        0,
        Math.min(
            personagem.x,
            larguraMundo - personagem.largura
        )
    );

    personagem.velocidadeY = -7;
    tempoProtecao = 60;

    if (vidas <= 0) {
        fimDeJogo = true;
        modalGameOver.hidden = false;
    }
}

function aplicarGravidade() {
    personagem.velocidadeY += personagem.gravidade;
    personagem.y += personagem.velocidadeY;

    personagem.noChao = false;

    for (const plataforma of plataformas) {
        const colisao = verificarColisao(personagem, plataforma);

        const pouso =
            personagem.posicaoInferiorAnterior <= plataforma.y &&
            personagem.velocidadeY >= 0;

        if (colisao && pouso) {
            personagem.y = plataforma.y - personagem.altura;
            personagem.velocidadeY = 0;
            personagem.noChao = true;
        }
    }
}

function atualizarCamera() {
    cameraX = personagem.x - telaJogo.width / 2;

    cameraX = Math.max(
        0,
        Math.min(
            cameraX,
            larguraMundo - telaJogo.width
        )
    );
}

function coletarCenouras() {
    for (const cenoura of cenouras) {
        if (cenoura.coletada) continue;

        const areaCenoura = {
            x: cenoura.x - 10,
            y: cenoura.y - 12,
            largura: 20,
            altura: 24
        };

        if (verificarColisao(personagem, areaCenoura)) {
            cenoura.coletada = true;
            cenourasColetadas++;

            document.getElementById("cenouras").textContent =
                cenourasColetadas;
        }
    }
}

function verificarColisaoInimigos() {
    if (tempoProtecao > 0) return;

    for (const inimigo of inimigos) {
        if (!inimigo.vivo) continue;

        const colisao = verificarColisao(personagem, inimigo);

        if (!colisao) continue;

        const pulouSobre =
            personagem.velocidadeY > 0 &&
            personagem.posicaoInferiorAnterior <= inimigo.y + 12;

        if (pulouSobre) {
            inimigo.vivo = false;
            inimigosDerrotados++;

            personagem.velocidadeY = -8;
            personagem.y = inimigo.y - personagem.altura;

            return;
        }

        receberDano(inimigo.x);
        return;
    }
}

function desenharFundo() {
    const gradiente = contexto.createLinearGradient(
        0, 0, 0, telaJogo.height
    );

    gradiente.addColorStop(0, "#64c9ff");
    gradiente.addColorStop(1, "#d0f1ff");

    contexto.fillStyle = gradiente;

    contexto.fillRect(
        0, 0,
        telaJogo.width,
        telaJogo.height
    );

    contexto.fillStyle = "#ffe680";

    contexto.beginPath();
    contexto.arc(820, 85, 38, 0, Math.PI * 2);
    contexto.fill();

    contexto.fillStyle = "#9bd6c5";

    for (let i = 0; i < 7; i++) {
        const x = i * 190 - (cameraX * 0.15) % 190;

        contexto.beginPath();
        contexto.moveTo(x - 100, 390);
        contexto.lineTo(x + 50, 180 + (i % 3) * 35);
        contexto.lineTo(x + 210, 390);
        contexto.closePath();
        contexto.fill();
    }

    contexto.fillStyle = "#69b77a";

    for (let i = 0; i < 6; i++) {
        const x = i * 230 - (cameraX * 0.3) % 230;

        contexto.beginPath();
        contexto.moveTo(x - 100, 450);

        contexto.quadraticCurveTo(
            x + 70,
            280 + (i % 2) * 30,
            x + 250,
            450
        );

        contexto.closePath();
        contexto.fill();
    }

    contexto.fillStyle = "#ffffff";

    for (let i = 0; i < 7; i++) {
        let x = (i * 230 - cameraX * 0.2) %
            (telaJogo.width + 200);

        if (x < -100) {
            x += telaJogo.width + 200;
        }

        const y = 65 + (i % 3) * 65;

        contexto.beginPath();
        contexto.arc(x, y, 20, 0, Math.PI * 2);
        contexto.arc(x + 25, y - 12, 25, 0, Math.PI * 2);
        contexto.arc(x + 52, y, 20, 0, Math.PI * 2);
        contexto.fill();
    }
}

function desenharArvores() {
    for (const arvore of arvores) {
        const x = arvore.x - cameraX;

        if (x < -180 || x > telaJogo.width + 180) continue;

        const base = 480;
        const topo = base - arvore.altura;

        contexto.fillStyle = "#79502f";

        contexto.fillRect(
            x, topo + 35,
            arvore.largura,
            arvore.altura - 35
        );

        contexto.fillStyle = "#a87545";
        contexto.fillRect(
            x + 10, topo + 40,
            9, arvore.altura - 45
        );

        contexto.fillStyle = "#593b29";
        contexto.fillRect(x + 25, topo + 75, 5, 30);
        contexto.fillRect(x + 42, topo + 135, 5, 25);

        contexto.fillStyle = "#79502f";
        contexto.fillRect(
            x - 35, topo + 100,
            arvore.largura + 70, 13
        );

        contexto.fillRect(
            x - 20, topo + 160,
            arvore.largura + 40, 11
        );

        contexto.fillStyle = "#277b42";

        contexto.beginPath();
        contexto.arc(
            x + arvore.largura / 2,
            topo + 20,
            arvore.largura * 0.8,
            0, Math.PI * 2
        );
        contexto.fill();

        contexto.fillStyle = "#399b50";

        contexto.beginPath();

        contexto.arc(
            x + 10, topo + 35,
            arvore.largura * 0.42,
            0, Math.PI * 2
        );

        contexto.arc(
            x + arvore.largura - 5, topo + 30,
            arvore.largura * 0.45,
            0, Math.PI * 2
        );

        contexto.fill();

        contexto.fillStyle = "#72c96b";
        contexto.fillRect(x + 10, topo + 5, 16, 9);
        contexto.fillRect(
            x + arvore.largura - 25,
            topo + 35, 13, 8
        );
        contexto.fillRect(x + 30, topo + 55, 12, 7);
    }
}

function desenharPlataformas() {
    for (const plataforma of plataformas) {
        const x = plataforma.x - cameraX;

        if (
            x > telaJogo.width ||
            x + plataforma.largura < 0
        ) {
            continue;
        }

        if (plataforma.y === 480) {
            contexto.fillStyle = "#7543a6";

            contexto.fillRect(
                x, plataforma.y,
                plataforma.largura,
                plataforma.altura
            );

            contexto.fillStyle = "#b58ae8";
            contexto.fillRect(
                x, plataforma.y,
                plataforma.largura, 7
            );

            contexto.fillStyle = "#593b29";

            for (
                let i = 20;
                i < plataforma.largura;
                i += 90
            ) {
                contexto.fillRect(
                    x + i, plataforma.y + 30, 8, 4
                );
            }

            contexto.fillStyle = "#c4a1ef";

            for (
                let i = 15;
                i < plataforma.largura;
                i += 65
            ) {
                contexto.fillRect(
                    x + i, plataforma.y + 14, 4, 5
                );
            }
        } else {
            contexto.fillStyle = "#75452b";

            contexto.fillRect(
                x, plataforma.y,
                plataforma.largura,
                plataforma.altura
            );

            contexto.fillStyle = "#a87545";

            contexto.fillRect(
                x, plataforma.y,
                plataforma.largura, 5
            );

            contexto.fillStyle = "#593b29";

            contexto.fillRect(
                x + 20, plataforma.y + 10, 25, 3
            );

            contexto.fillRect(
                x + plataforma.largura - 45,
                plataforma.y + 10, 25, 3
            );

            contexto.fillStyle = "#399b50";

            contexto.fillRect(
                x + 12, plataforma.y - 7, 25, 7
            );

            contexto.fillRect(
                x + plataforma.largura - 40,
                plataforma.y - 7, 25, 7
            );

            contexto.fillStyle = "#80c342";

            contexto.fillRect(
                x + 20, plataforma.y - 10, 10, 4
            );

            contexto.fillRect(
                x + plataforma.largura - 32,
                plataforma.y - 10, 10, 4
            );
        }
    }
}

function desenharCenouras() {
    for (const cenoura of cenouras) {
        if (cenoura.coletada) continue;

        const x = cenoura.x - cameraX;
        const y = cenoura.y;

        if (x < -30 || x > telaJogo.width + 30) continue;

        contexto.save();
        contexto.translate(x, y);
        contexto.rotate(0.3);

        contexto.fillStyle = "#65c943";
        contexto.fillRect(-3, -12, 5, 9);
        contexto.fillRect(2, -13, 5, 9);
        contexto.fillRect(-7, -10, 5, 7);

        contexto.fillStyle = "#ff8c32";

        contexto.beginPath();
        contexto.moveTo(-7, -7);
        contexto.lineTo(7, -7);
        contexto.lineTo(0, 13);
        contexto.closePath();
        contexto.fill();

        contexto.fillStyle = "#ffd18a";
        contexto.fillRect(-3, -3, 5, 2);
        contexto.fillRect(-2, 3, 4, 2);

        contexto.restore();
    }
}

function desenharPersonagem() {
    if (
        tempoProtecao > 0 &&
        Math.floor(tempoProtecao / 5) % 2 === 0
    ) {
        return;
    }

    if (
        !imagemPorquinho.complete ||
        imagemPorquinho.naturalWidth === 0
    ) {
        return;
    }

    const x = personagem.x - cameraX;
    const y = personagem.y;

    const movimento = personagem.noChao
        ? Math.sin(tempoAnimacao / 5) *
          (personagem.andando ? 2 : 0.5)
        : 0;

    contexto.save();

    contexto.translate(
        x + personagem.largura / 2,
        y + personagem.altura / 2 + movimento
    );

    contexto.scale(personagem.direcao, 1);

    const proporcao = Math.min(
        personagem.largura / imagemPorquinho.naturalWidth,
        personagem.altura / imagemPorquinho.naturalHeight
    );

    const larguraImagem =
        imagemPorquinho.naturalWidth * proporcao;

    const alturaImagem =
        imagemPorquinho.naturalHeight * proporcao;

    contexto.drawImage(
        imagemPorquinho,
        -larguraImagem / 2,
        -alturaImagem / 2,
        larguraImagem,
        alturaImagem
    );

    contexto.restore();
}

function desenharInimigos() {
    for (const inimigo of inimigos) {
        if (!inimigo.vivo) continue;

        const x = inimigo.x - cameraX;
        const y = inimigo.y;

        if (x < -70 || x > telaJogo.width + 70) continue;

        contexto.save();

        const balanco = Math.sin(tempoAnimacao / 8) * 1.5;

        if (inimigo.tipo === "voador") {
            contexto.fillStyle = "#c084fc";

            contexto.beginPath();

            contexto.ellipse(
                x - 5, y + 20,
                10, 13 + balanco,
                -0.5, 0, Math.PI * 2
            );

            contexto.ellipse(
                x + 40, y + 20,
                10, 13 - balanco,
                0.5, 0, Math.PI * 2
            );

            contexto.fill();
        }

        contexto.strokeStyle = "#a8795b";
        contexto.lineWidth = 8;

        contexto.beginPath();
        contexto.moveTo(x + 5, y + 31);

        contexto.quadraticCurveTo(
            x - 15, y + 20 + balanco,
            x - 8, y + 8
        );

        contexto.stroke();

        contexto.fillStyle = "#c6a17e";

        contexto.beginPath();
        contexto.ellipse(
            x + 19, y + 29 + balanco,
            20, 13, 0, 0, Math.PI * 2
        );
        contexto.fill();

        contexto.fillStyle = "#45312e";
        contexto.fillRect(x + 5, y + 35, 9, 9);
        contexto.fillRect(x + 25, y + 35, 9, 9);

        contexto.fillStyle = "#c6a17e";

        contexto.beginPath();
        contexto.arc(
            x + 19, y + 14 + balanco,
            17, 0, Math.PI * 2
        );
        contexto.fill();

        contexto.fillStyle = "#392a2b";

        contexto.beginPath();
        contexto.moveTo(x + 4, y + 8);
        contexto.lineTo(x + 2, y - 11);
        contexto.lineTo(x + 16, y + 1);
        contexto.closePath();
        contexto.fill();

        contexto.beginPath();
        contexto.moveTo(x + 22, y + 1);
        contexto.lineTo(x + 35, y - 11);
        contexto.lineTo(x + 34, y + 10);
        contexto.closePath();
        contexto.fill();

        contexto.fillStyle = "#392a2b";

        contexto.beginPath();
        contexto.ellipse(
            x + 19, y + 17 + balanco,
            13, 12, 0, 0, Math.PI * 2
        );
        contexto.fill();

        contexto.fillStyle = "#9de9f5";

        contexto.beginPath();
        contexto.arc(
            x + 13, y + 13 + balanco,
            3.5, 0, Math.PI * 2
        );

        contexto.arc(
            x + 25, y + 13 + balanco,
            3.5, 0, Math.PI * 2
        );

        contexto.fill();

        contexto.fillStyle = "#17212b";
        contexto.fillRect(x + 12, y + 12 + balanco, 2, 4);
        contexto.fillRect(x + 24, y + 12 + balanco, 2, 4);

        contexto.fillStyle = "#d9a9a2";

        contexto.beginPath();
        contexto.arc(
            x + 19, y + 23 + balanco,
            3, 0, Math.PI * 2
        );
        contexto.fill();

        contexto.strokeStyle = "#eee5df";
        contexto.lineWidth = 1;

        contexto.beginPath();

        contexto.moveTo(x + 5, y + 23);
        contexto.lineTo(x - 3, y + 20);

        contexto.moveTo(x + 5, y + 26);
        contexto.lineTo(x - 3, y + 28);

        contexto.moveTo(x + 32, y + 23);
        contexto.lineTo(x + 40, y + 20);

        contexto.moveTo(x + 32, y + 26);
        contexto.lineTo(x + 40, y + 28);

        contexto.stroke();

        if (inimigo.tipo === "voador") {
            contexto.fillStyle = "#c084fc";

            contexto.beginPath();
            contexto.arc(
                x + 19, y + 34,
                4, 0, Math.PI * 2
            );
            contexto.fill();
        }

        contexto.restore();
    }
}

function desenharProjeteisInimigos() {
    for (const projetil of projeteisInimigos) {
        const x = projetil.x - cameraX;
        const y = projetil.y;

        contexto.fillStyle = "#a78bfa";

        contexto.beginPath();
        contexto.arc(x + 8, y + 8, 9, 0, Math.PI * 2);
        contexto.fill();

        contexto.fillStyle = "#f5d0fe";

        contexto.beginPath();
        contexto.arc(x + 8, y + 8, 4, 0, Math.PI * 2);
        contexto.fill();
    }
}

function desenharProjeteisPersonagem() {
    for (const projetil of projeteisPersonagem) {
        const x = projetil.x - cameraX;
        const y = projetil.y;

        contexto.fillStyle = "#fb7185";

        contexto.beginPath();
        contexto.arc(x + 7, y + 5, 9, 0, Math.PI * 2);
        contexto.fill();

        contexto.fillStyle = "#fff1f2";

        contexto.beginPath();
        contexto.arc(x + 7, y + 5, 4, 0, Math.PI * 2);
        contexto.fill();
    }
}

function desenharCasa() {
    const x = larguraMundo - 180 - cameraX;
    const y = 355;

    contexto.fillStyle = "#e8b6a0";
    contexto.fillRect(x, y + 55, 110, 70);

    contexto.fillStyle = "#8b3d91";

    contexto.beginPath();
    contexto.moveTo(x - 15, y + 60);
    contexto.lineTo(x + 55, y);
    contexto.lineTo(x + 125, y + 60);
    contexto.closePath();
    contexto.fill();

    contexto.fillStyle = "#c084fc";
    contexto.fillRect(x + 15, y + 42, 80, 7);

    contexto.fillStyle = "#75452f";
    contexto.fillRect(x + 43, y + 83, 27, 42);

    contexto.fillStyle = "#ffd166";

    contexto.beginPath();
    contexto.arc(x + 64, y + 104, 3, 0, Math.PI * 2);
    contexto.fill();

    contexto.fillStyle = "#a5e5ff";
    contexto.fillRect(x + 12, y + 75, 22, 22);

    contexto.strokeStyle = "#ffffff";
    contexto.lineWidth = 3;
    contexto.strokeRect(x + 12, y + 75, 22, 22);

    contexto.beginPath();
    contexto.moveTo(x + 23, y + 75);
    contexto.lineTo(x + 23, y + 97);
    contexto.moveTo(x + 12, y + 86);
    contexto.lineTo(x + 34, y + 86);
    contexto.stroke();

    contexto.fillStyle = "#a65e54";
    contexto.fillRect(x + 82, y + 12, 17, 35);

    contexto.fillStyle = "#b58ae8";
    contexto.fillRect(x - 10, y + 123, 130, 7);
}

function verificarChegada() {
    const inicioCasa = larguraMundo - 180;

    if (
        !fimDeJogo &&
        !faseConcluida &&
        personagem.x + personagem.largura >= inicioCasa
    ) {
        faseConcluida = true;

        document.getElementById("total-cenouras-vitoria").textContent =
            cenourasColetadas;

        document.getElementById("total-inimigos-vitoria").textContent =
            inimigosDerrotados;

        modalVitoria.hidden = false;
    }
}

function atualizarJogo() {
    if (fimDeJogo || faseConcluida) return;

    tempoAnimacao++;

    personagem.posicaoInferiorAnterior =
        personagem.y + personagem.altura;

    if (tempoProtecao > 0) tempoProtecao--;
    if (tempoDisparo > 0) tempoDisparo--;

    moverPersonagem();
    aplicarGravidade();
    atualizarCamera();
    coletarCenouras();
    moverInimigos();
    atacarInimigos();
    moverProjeteisInimigos();
    moverProjeteisPersonagem();
    verificarColisaoInimigos();

    if (!fimDeJogo) {
        verificarChegada();
    }
}

function desenharJogo() {
    desenharFundo();
    desenharArvores();
    desenharPlataformas();
    desenharCenouras();
    desenharCasa();
    desenharInimigos();
    desenharProjeteisInimigos();
    desenharProjeteisPersonagem();
    desenharPersonagem();
}

function reiniciarJogo() {
    personagem.x = 70;
    personagem.y = 390;
    personagem.velocidadeY = 0;
    personagem.noChao = false;
    personagem.posicaoInferiorAnterior = 0;
    personagem.direcao = 1;
    personagem.andando = false;
    personagem.quadroAnimacao = 0;

    cameraX = 0;

    vidas = 3;
    cenourasColetadas = 0;
    inimigosDerrotados = 0;

    document.getElementById("vidas").textContent = vidas;
    document.getElementById("cenouras").textContent =
        cenourasColetadas;

    for (const cenoura of cenouras) {
        cenoura.coletada = false;
    }

    for (let i = 0; i < inimigos.length; i++) {
        const inimigo = inimigos[i];
        const inicial = posicoesIniciaisInimigos[i];

        inimigo.x = inicial.x;
        inimigo.y = inicial.y;
        inimigo.direcao = inicial.direcao;
        inimigo.velocidade = inicial.velocidade;
        inimigo.vivo = true;
        inimigo.movimentoVoo = 0;
        inimigo.tempoAtaque = 0;
    }

    projeteisInimigos.length = 0;
    projeteisPersonagem.length = 0;

    fimDeJogo = false;
    faseConcluida = false;

    modalGameOver.hidden = true;
    modalVitoria.hidden = true;

    tempoProtecao = 0;
    tempoDisparo = 0;
    tempoAnimacao = 0;

    for (const tecla in teclas) {
        teclas[tecla] = false;
    }
}

botaoTentarNovamente.addEventListener("click", () => {
    reiniciarJogo();
});

let ultimoTempo = 0;
let acumulador = 0;

const passo = 1000 / 60;

function iniciarJogo(tempo = 0) {
    if (ultimoTempo === 0) {
        ultimoTempo = tempo;
    }

    const delta = Math.min(tempo - ultimoTempo, 100);

    ultimoTempo = tempo;
    acumulador += delta;

    while (acumulador >= passo) {
        atualizarJogo();
        acumulador -= passo;
    }

    desenharJogo();

    requestAnimationFrame(iniciarJogo);
}

requestAnimationFrame(iniciarJogo);
