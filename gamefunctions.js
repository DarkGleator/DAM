document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;


                    // VARIAVEIS //


    const backgroundMusic = new Audio('sprites/fundo.mp3');
    backgroundMusic.loop = true; 


    const coinSound = new Audio('sprites/moeda.mp3');
    const shieldSound = new Audio('sprites/escudo.mp3');

    const shieldImage = new Image();
    shieldImage.src = 'sprites/escudo.png';

    const coinImage = new Image();
    coinImage.src = 'sprites/moeda.png'; 

    const backgroundImagePhase2 = new Image();
    backgroundImagePhase2.src = 'sprites/fundo2.png';


    const backgroundImagePhase3 = new Image();
    backgroundImagePhase3.src = 'sprites/fundo3.png';

    const backgroundImagePhase4 = new Image();
    backgroundImagePhase4.src = 'sprites/fundo4.jpg';

    const backgroundImagePhase5 = new Image();
    backgroundImagePhase5.src = 'sprites/fundo5.png';

    const backgroundImagePhase6 = new Image();
    backgroundImagePhase6.src = 'sprites/fundo6.png';

    const backgroundImg = new Image();
    backgroundImg.src = 'sprites/fundo.jpg';

    const loboEsquerdaImg = new Image();
    loboEsquerdaImg.src = 'sprites/lobo.png'; 

    const loboDireitaImg = new Image();
    loboDireitaImg.src = 'sprites/lobo1.png'; 

    const loboImages = [loboEsquerdaImg, loboDireitaImg];

    const cabraImage = new Image();
    cabraImage.src = 'sprites/goat.png'; 

    const cowImage = new Image();
    cowImage.src = 'sprites/cow.png'; 
        const pigImage = new Image();
        pigImage.src = 'sprites/pig.png'; 
    
        const sheepImage = new Image();
        sheepImage.src = 'sprites/sheep.png'; 
    
        const donkeyImage = new Image();
        donkeyImage.src = 'sprites/donkey.png';
    
        const dogImage = new Image();
        dogImage.src = 'sprites/dog.png'; 
    
        const pauseButton = document.getElementById('pauseButton');

        const modal = document.getElementById('modal');

        const continueBtn = document.getElementById('continueBtn');

        const menuBtn = document.getElementById('menuBtn');

        let isPaused = false;

        let lastProgressUpdateTime = Date.now(); 

        let lastProgress = 0; 

        let animationId; 

        const MAX_SHIELDS = 2;

        let backgroundImageY = 0; 

        let collectedShields = [];

        let gameWon = false;

        let animalAttacks = [];

        let score = 0;

        let isGameOver = false;

        let coins = [];

        let shields = [];

        const MAX_COW_SPEED = 5;

        const cow = {
            x: WIDTH / 2, 
            y: 50, 
            width: 160, 
            height: 100, 
            speed: 3, 
};

        const MAX_PIG_SPEED = 5;

        const pig = {
            x: WIDTH / 2, 
            y: 50, 
            width: 100, 
            height: 100, 
            speed: 1, 
            attackInterval: 2000, 
            lastAttackTime: Date.now(), 
};

        const MAX_SHEEP_SPEED = 5;

        const sheep = {
            x: WIDTH / 2, 
            y: 50, 
            width: 120, 
            height: 100, 
            speed: 3, 
            attackInterval: 2000, 
            lastAttackTime: Date.now(), 
};

        const MAX_DONKEY_SPEED = 7;
        const donkey = {
            x: WIDTH / 2, 
            y: 50, 
            width: 160, 
            height: 100, 
            speed: 6, 
            attackInterval: 2000, 
            lastAttackTime: Date.now(),
};

        const MAX_DOG_SPEED = 7;
        const dog = {
            x: WIDTH / 2, 
            y: 50, 
            width: 80, 
            height: 80, 
            speed: 3,
            attackInterval: 2000, 
            lastAttackTime: Date.now(), 
};


        let lastUpdateTime = Date.now(); 

        let currentWolfImageIndex = 0; 

        const GAME_DURATION = 6000; 



        const MAX_OTHER_ANIMAL_SPEED = 5;

        const MIN_ATTACK_INTERVAL = 500;

        let startTime;

        let currentAttackInterval = 2000; 

        let lastAttackTime = Date.now(); 

        const wolfMargin = 50;

        const itemMargin = 50;

        const backgroundSpeed = 1; 


        let lastWolfAnimationTime = Date.now(); 

        //FIM DAS VARIAVEIS //

        //COMEÇA O JOGO //
    
    document.getElementById('new-game').addEventListener('click', function() {
        resetGame(); // Reinicia o jogo
        gameLoop(); // Inicia o loop do jogo
    });

        //FIM DO COMEÇA O JOGO//



                //LOBO / PLAYER//

// Função para desenhar o lobo
function drawWolf() {
    // Limita o movimento do lobo dentro dos limites do canvas
    if (wolf.x < wolfMargin) {
        wolf.x = wolfMargin;
    } else if (wolf.x + wolf.width > WIDTH - wolfMargin) {
        wolf.x = WIDTH - wolf.width - wolfMargin;
    }
    if (wolf.y < wolfMargin) {
        wolf.y = wolfMargin;
    } else if (wolf.y + wolf.height > HEIGHT - wolfMargin) {
        wolf.y = HEIGHT - wolf.height - wolfMargin;
    }

    // Desenha a imagem do lobo atual
    ctx.drawImage(loboImages[currentWolfImageIndex], wolf.x, wolf.y, wolf.width, wolf.height);
}

 // Função para atualizar a animação do lobo
 function updateWolfAnimation() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastWolfAnimationTime;

    // Defina o intervalo de tempo entre cada troca de imagem do lobo (em milissegundos)
    const WOLF_ANIMATION_INTERVAL = 100; // 100ms

    if (elapsedTime >= WOLF_ANIMATION_INTERVAL) {
        // Troca para a próxima imagem na lista
        currentWolfImageIndex = (currentWolfImageIndex + 1) % loboImages.length;
        lastWolfAnimationTime = currentTime; // Atualiza o tempo da última atualização de animação
    }
}

                    //FIM DO LOBO //
                    
                    //BODE OU OUTRO ANIMAL OU INICIAL //


function updateOtherAnimal() {
    if (currentPhaseIndex === 0) {
    // Defina o progresso do jogo
    const progress = calculateGameProgress();

    // Defina a nova velocidade com base no progresso do jogo
    const targetSpeed = progress <= 0.5 ? progress * (MAX_OTHER_ANIMAL_SPEED - 2) * 2 + 2 : MAX_OTHER_ANIMAL_SPEED;

    // Ajuste a velocidade atual em direção à nova velocidade alvo
    if (otherAnimal.speed < targetSpeed) {
        otherAnimal.speed += 0.01; // Ajuste a taxa de aumento da velocidade conforme necessário
    } else if (otherAnimal.speed > targetSpeed) {
        otherAnimal.speed = targetSpeed;
    }

    // Defina a nova frequência de ataque com base no progresso do jogo
    const targetAttackInterval = progress >= 0.5 ? MIN_ATTACK_INTERVAL / (2 * progress) : MIN_ATTACK_INTERVAL;

    // Ajuste a frequência de ataque atual em direção à nova frequência alvo
    if (currentAttackInterval > targetAttackInterval) {
        currentAttackInterval -= 0.1; // Ajuste a taxa de diminuição da frequência de ataque conforme necessário
    } else if (currentAttackInterval < targetAttackInterval) {
        currentAttackInterval = targetAttackInterval;
    }

    // Mova o outro animal com base na velocidade atual
    const margin = 50;
    const loboCenterX = wolf.x + wolf.width / 2;
    const directionToLobo = Math.sign(loboCenterX - otherAnimal.x);
    const dx = directionToLobo * otherAnimal.speed;
    otherAnimal.x += dx;

    // Limita o movimento do outro animal dentro dos limites do canvas
    if (otherAnimal.x < margin) {
        otherAnimal.x = margin;
    } else if (otherAnimal.x + otherAnimal.width > WIDTH - margin) {
        otherAnimal.x = WIDTH - otherAnimal.width - margin;
    }

    // Disparar ataques com base na frequência atual
    if (Date.now() - lastAttackTime > currentAttackInterval) {
        animalAttacks.push({
            x: otherAnimal.x + otherAnimal.width / 2,
            y: otherAnimal.y + otherAnimal.height,
            width: 10,
            height: 10,
        });
        lastAttackTime = Date.now();
    }
}
}

// Função para desenhar o outro animal
function drawOtherAnimal() {
    if (currentPhaseIndex === 0) {
        // Verifica se o outro animal não ultrapassa os limites do canvas
        if (otherAnimal.x < 0) {
            otherAnimal.x = 0;
        } else if (otherAnimal.x + otherAnimal.width > WIDTH) {
            otherAnimal.x = WIDTH - otherAnimal.width;
        }
        
        // Define a largura e altura desejadas para a cabra
        const cabraWidth = otherAnimal.width * 1.5; // Aumenta a largura em 50%
        const cabraHeight = otherAnimal.height * 1.5; // Aumenta a altura em 50%

        // Desenha a imagem da cabra com o tamanho aumentado
        ctx.drawImage(cabraImage, otherAnimal.x, otherAnimal.y, cabraWidth, cabraHeight);
    }
}


// Função para desenhar os ataques dos animais
function drawAnimalAttacks() {
    ctx.fillStyle = 'red'; // Mudando a cor para vermelho
    animalAttacks.forEach(attack => {
        ctx.beginPath();
        ctx.arc(attack.x + attack.width / 2, attack.y + attack.height / 2, attack.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

                    //FIM DO OUTRO ANIMAL//

                    // VACA //


// Defina as variáveis de controle de tempo para os ataques da vaca
let lastCowAttackTime = Date.now();
const cowAttackInterval = 3000; // Intervalo de tempo entre os ataques da vaca em milissegundos
let cowAttacks = []; // Array para armazenar os ataques da vaca


// Função para desenhar a vaca
function drawCow() {
    // Verifique se a vaca não ultrapassa os limites do canvas
    if (cow.x < 0) {
        cow.x = 0;
    } else if (cow.x + cow.width > WIDTH) {
        cow.x = WIDTH - cow.width;
    }

    // Desenhe a imagem da vaca
    ctx.drawImage(cowImage, cow.x, cow.y, cow.width, cow.height);
}

// Função para atualizar o movimento da vaca
function moveCow() {
    // Defina o progresso do jogo
    const progress = calculateGameProgress();

    // Defina a nova velocidade com base no progresso do jogo
    const targetSpeed = progress <= 0.5 ? progress * (MAX_COW_SPEED - 2) * 2 + 2 : MAX_COW_SPEED;

    // Ajuste a velocidade atual em direção à nova velocidade alvo
    if (cow.speed < targetSpeed) {
        cow.speed += 0.10; // Ajuste a taxa de aumento da velocidade conforme necessário
    } else if (cow.speed > targetSpeed) {
        cow.speed = targetSpeed;
    }

    // Mova a vaca com base na velocidade atual
    const margin = 50;
    const loboCenterX = wolf.x + wolf.width / 2;
    const directionToLobo = Math.sign(loboCenterX - cow.x);
    const dx = directionToLobo * cow.speed;
    cow.x += dx;

    // Limita o movimento da vaca dentro dos limites do canvas
    if (cow.x < margin) {
        cow.x = margin;
    } else if (cow.x + cow.width > WIDTH - margin) {
        cow.x = WIDTH - cow.width - margin;
    }
}


const larguraDoAtaque = 25;
const alturaDoAtaque = 25;

// Função para atualizar os ataques da vaca
function cowAttack() {
    if (!gameOver){
    // Velocidade do ataque da vaca
    const attackSpeed = 5;

    // Intervalo de tempo entre os ataques da vaca
    const cowAttackInterval = 1000; 

    // Verifica se é hora de a vaca disparar um ataque
    const currentTime = Date.now();
    if (currentTime - lastCowAttackTime > cowAttackInterval) {
        // Cria um novo ataque da vaca
        const newAttack = {
            x: cow.x + cow.width / 2, // Posição inicial X do ataque
            y: cow.y + cow.height / 2, // Posição inicial Y do ataque
            width: larguraDoAtaque, // Largura do ataque
            height: alturaDoAtaque, // Altura do ataque
        };

        // Adiciona o novo ataque à matriz cowAttacks
        cowAttacks.push(newAttack);

        // Atualiza o tempo do último ataque da vaca
        lastCowAttackTime = currentTime;
    }

   // Atualiza a posição dos ataques da vaca e verifica colisões com o lobo
   cowAttacks.forEach(attack => {
    attack.y += attackSpeed;

        // Verifica se o ataque atingiu o lobo
        if (
            attack.x < wolf.x + wolf.width &&
            attack.x + attack.width > wolf.x &&
            attack.y < wolf.y + wolf.height &&
            attack.y + attack.height > wolf.y
        ) {
            // Se o lobo tiver escudos disponíveis, remover um escudo
            if (collectedShields.length > 0) {
                collectedShields.pop(); // Remove o último escudo da lista
            } else {
                // Se o lobo não tiver escudos, diminuir uma vida
                wolf.lives--;
            }
            // Remove o ataque que acertou o lobo
            const index = cowAttacks.indexOf(attack);
            if (index !== -1) {
                cowAttacks.splice(index, 1);
            }
            // Se o lobo ficar sem vidas, exibe "Game Over" e reinicia o jogo
            if (wolf.lives === 0) {
                console.log('Game Over! O lobo perdeu todas as vidas.');
                // Exibir "Game Over"
                gameOver = true;
            }
        }
    });
}
}

// Função para desenhar os ataques da vaca
function drawCowAttacks() {
    ctx.fillStyle = 'green'; // Cor dos ataques da vaca
    const attackSize = 25; // Tamanho dos ataques da vaca

    cowAttacks.forEach(attack => {
        // Desenha o ataque da vaca
        ctx.beginPath();
        ctx.arc(attack.x, attack.y, attackSize, 0, Math.PI * 2);
        ctx.fill();
    });
}

                // PORCO //

// Defina as variáveis de controle de tempo para os ataques da vaca
let lastPigAttackTime = Date.now();
const PigAttackInterval = 3000; // Intervalo de tempo entre os ataques da vaca em milissegundos
let pigAttacks = []; // Array para armazenar os ataques da vaca


// Função para desenhar o porco
function drawPig() {
    // Verifique se a vaca não ultrapassa os limites do canvas
    if (pig.x < 0) {
        pig.x = 0;
    } else if (pig.x + pig.width > WIDTH) {
        pig.x = WIDTH - pig.width;
    }

    // Desenhe a imagem da vaca
    ctx.drawImage(pigImage, pig.x, pig.y, pig.width, pig.height);
}

// Função para movimento horizontal do porco
function movePig() {
    // Defina o progresso do jogo
    const progress = calculateGameProgress();

    // Defina a nova velocidade com base no progresso do jogo
    const targetSpeed = progress <= 0.5 ? progress * (MAX_PIG_SPEED - 2) * 2 + 2 : MAX_PIG_SPEED;

    // Ajuste a velocidade atual em direção à nova velocidade alvo
    if (pig.speed < targetSpeed) {
        pig.speed += 0.05; // Ajuste a taxa de aumento da velocidade conforme necessário
    } else if (pig.speed > targetSpeed) {
        pig.speed = targetSpeed;
    }

    // Move o porco com base na velocidade atual
    const margin = 50;
    const loboCenterX = wolf.x + wolf.width / 2;
    const directionToLobo = Math.sign(loboCenterX - pig.x);
    const dx = directionToLobo * pig.speed;
    pig.x += dx;

    // Limita o movimento da vaca dentro dos limites do canvas
    if (pig.x < margin) {
        pig.x = margin;
    } else if (pig.x + pig.width > WIDTH - margin) {
        pig.x = WIDTH - pig.width - margin;
    }
}


// Função para o ataque do porco
function pigAttack() {
    if (!gameOver){
    // Velocidade do ataque da vaca
    const attackSpeed = 5;

    // Intervalo de tempo entre os ataques da vaca
    const pigAttackInterval = 1000; // 3 segundos

        // Verifica se é hora de o porco disparar um ataque
        const currentTime = Date.now();
        if (currentTime - lastPigAttackTime > pigAttackInterval) {
            // Cria três novos ataques do porco
            for (let i = 0; i < 3; i++) {
                const newAttack = {
                    x: pig.x + pig.width / 2, // Posição inicial X do ataque
                    y: pig.y + pig.height / 2, // Posição inicial Y do ataque
                    width: larguraDoAtaque, // Largura do ataque
                    height: alturaDoAtaque, // Altura do ataque
                    speedY: 5 // Velocidade vertical do ataque
                };

                // Ajusta a posição dos ataques para que estejam ligeiramente separados
                newAttack.x += (i - 1) * 20;

                // Adiciona os novos ataques à matriz pigAttacks
                pigAttacks.push(newAttack);
            }

        // Atualiza o tempo do último ataque da vaca
        lastPigAttackTime = currentTime;
    }

   // Atualiza a posição dos ataques da vaca e verifica colisões com o lobo
   pigAttacks.forEach(attack => {
    attack.y += attackSpeed;

        // Verifica se o ataque atingiu o lobo
        if (
            attack.x < wolf.x + wolf.width &&
            attack.x + attack.width > wolf.x &&
            attack.y < wolf.y + wolf.height &&
            attack.y + attack.height > wolf.y
        ) {
            // Se o lobo tiver escudos disponíveis, remover um escudo
            if (collectedShields.length > 0) {
                collectedShields.pop(); // Remove o último escudo da lista
            } else {
                // Se o lobo não tiver escudos, diminuir uma vida
                wolf.lives--;
            }
            // Remove o ataque que acertou o lobo
            const index = pigAttacks.indexOf(attack);
            if (index !== -1) {
                pigAttacks.splice(index, 1);
            }
            // Se o lobo ficar sem vidas, exibe "Game Over" e reinicia o jogo
            if (wolf.lives === 0) {
                console.log('Game Over! O lobo perdeu todas as vidas.');
                // Exibir "Game Over"
                gameOver = true;
            }
        }
    });
}
}

// Função para desenhar os ataques da vaca
function drawPigAttacks() {
    ctx.fillStyle = 'Beige'; // Cor dos ataques do porco
    const attackSize = 10; // Tamanho dos ataques da vaca

    pigAttacks.forEach(attack => {
        // Desenha o ataque da vaca
        ctx.beginPath();
        ctx.arc(attack.x, attack.y, attackSize, 0, Math.PI * 2);
        ctx.fill();
    });
}


                // OVELHA //

// Defina as variáveis de controle de tempo para os ataques da vaca
let lastSheepAttackTime = Date.now();
const SheepAttackInterval = 3000; // Intervalo de tempo entre os ataques da vaca em milissegundos
let sheepAttacks = []; // Array para armazenar os ataques do carneiro


// Função para desenhar o porco
function drawSheep() {
    // Verifique se a vaca não ultrapassa os limites do canvas
    if (sheep.x < 0) {
        sheep.x = 0;
    } else if (sheep.x + sheep.width > WIDTH) {
        sheep.x = WIDTH - sheep.width;
    }

    // Desenhe a imagem da vaca
    ctx.drawImage(sheepImage, sheep.x, sheep.y, sheep.width, sheep.height);
}

// Função para movimento horizontal do porco
function moveSheep() {
    // Defina o progresso do jogo
    const progress = calculateGameProgress();

    // Defina a nova velocidade com base no progresso do jogo
    const targetSpeed = progress <= 0.5 ? progress * (MAX_SHEEP_SPEED - 2) * 2 + 2 : MAX_SHEEP_SPEED;

    // Ajuste a velocidade atual em direção à nova velocidade alvo
    if (sheep.speed < targetSpeed) {
        sheep.speed += 0.10; // Ajuste a taxa de aumento da velocidade conforme necessário
    } else if (sheep.speed > targetSpeed) {
        sheep.speed = targetSpeed;
    }

    // Move o porco com base na velocidade atual
    const margin = 50;
    const loboCenterX = wolf.x + wolf.width / 2;
    const directionToLobo = Math.sign(loboCenterX - sheep.x);
    const dx = directionToLobo * sheep.speed;
    sheep.x += dx;

    // Limita o movimento da vaca dentro dos limites do canvas
    if (sheep.x < margin) {
        sheep.x = margin;
    } else if (sheep.x + sheep.width > WIDTH - margin) {
        sheep.x = WIDTH - sheep.width - margin;
    }
}


// Função para o ataque do porco
function sheepAttack() {
    if (!gameOver){
    // Velocidade do ataque da vaca
    const attackSpeed = 5;

    // Intervalo de tempo entre os ataques da vaca
    const sheepAttackInterval = 750; // 3 segundos

    // Verifica se é hora de a vaca disparar um ataque
    const currentTime = Date.now();
    if (currentTime - lastSheepAttackTime > sheepAttackInterval) {
        // Cria um novo ataque da vaca
        const newAttack = {
            x: sheep.x + sheep.width / 2, // Posição inicial X do ataque
            y: sheep.y + sheep.height / 2, // Posição inicial Y do ataque
            width: larguraDoAtaque, // Largura do ataque
            height: alturaDoAtaque, // Altura do ataque
        };

        // Adiciona o novo ataque à matriz cowAttacks
        sheepAttacks.push(newAttack);

        // Atualiza o tempo do último ataque da vaca
        lastSheepAttackTime = currentTime;
    }

   // Atualiza a posição dos ataques da vaca e verifica colisões com o lobo
   sheepAttacks.forEach(attack => {
    attack.y += attackSpeed;

        // Verifica se o ataque atingiu o lobo
        if (
            attack.x < wolf.x + wolf.width &&
            attack.x + attack.width > wolf.x &&
            attack.y < wolf.y + wolf.height &&
            attack.y + attack.height > wolf.y
        ) {
            // Se o lobo tiver escudos disponíveis, remover um escudo
            if (collectedShields.length > 0) {
                collectedShields.pop(); // Remove o último escudo da lista
            } else {
                // Se o lobo não tiver escudos, diminuir uma vida
                wolf.lives--;
            }
            // Remove o ataque que acertou o lobo
            const index = sheepAttacks.indexOf(attack);
            if (index !== -1) {
                sheepAttacks.splice(index, 1);
            }
            // Se o lobo ficar sem vidas, exibe "Game Over" e reinicia o jogo
            if (wolf.lives === 0) {
                console.log('Game Over! O lobo perdeu todas as vidas.');
                // Exibir "Game Over"
                gameOver = true;
            }
        }
    });
}
}

// Função para desenhar os ataques da vaca
function drawSheepAttacks() {
    ctx.fillStyle = 'Black'; // Cor dos ataques do porco
    const attackSize = 10; // Tamanho dos ataques da vaca

    sheepAttacks.forEach(attack => {
        // Desenha o ataque da vaca
        ctx.beginPath();
        ctx.arc(attack.x, attack.y, attackSize, 0, Math.PI * 2);
        ctx.fill();
    });
}
                // BURRO //

// Defina as variáveis de controle de tempo para os ataques da vaca
let lastDonkeyAttackTime = Date.now();
const DonkeyAttackInterval = 3000; // Intervalo de tempo entre os ataques da vaca em milissegundos
let donkeyAttacks = [];

// Função para desenhar o porco
function drawDonkey() {
    // Verifique se a vaca não ultrapassa os limites do canvas
    if (donkey.x < 0) {
        donkey.x = 0;
    } else if (donkey.x + donkey.width > WIDTH) {
        donkey.x = WIDTH - donkey.width;
    }

    // Desenhe a imagem da vaca
    ctx.drawImage(donkeyImage, donkey.x, donkey.y, donkey.width, donkey.height);
}

// Função para movimento horizontal do porco
function moveDonkey() {
    // Defina o progresso do jogo
    const progress = calculateGameProgress();

    // Defina a nova velocidade com base no progresso do jogo
    const targetSpeed = progress <= 0.5 ? progress * (MAX_DONKEY_SPEED - 2) * 2 + 2 : MAX_DONKEY_SPEED;

    // Ajuste a velocidade atual em direção à nova velocidade alvo
    if (donkey.speed < targetSpeed) {
        donkey.speed += 0.10; // Ajuste a taxa de aumento da velocidade conforme necessário
    } else if (donkey.speed > targetSpeed) {
        donkey.speed = targetSpeed;
    }

    // Move o porco com base na velocidade atual
    const margin = 50;
    const loboCenterX = wolf.x + wolf.width / 2;
    const directionToLobo = Math.sign(loboCenterX - donkey.x);
    const dx = directionToLobo * donkey.speed;
    donkey.x += dx;

    // Limita o movimento da vaca dentro dos limites do canvas
    if (donkey.x < margin) {
        donkey.x = margin;
    } else if (donkey.x + donkey.width > WIDTH - margin) {
        donkey.x = WIDTH - donkey.width - margin;
    }
}


// Função para o ataque do porco
function donkeyAttack() {
    if (!gameOver){
    // Velocidade do ataque da vaca
    const attackSpeed = 3;

    // Intervalo de tempo entre os ataques da vaca
    const donkeyAttackInterval = 860; // 3 segundos

    // Verifica se é hora de a vaca disparar um ataque
    const currentTime = Date.now();
    if (currentTime - lastDonkeyAttackTime > donkeyAttackInterval) {
        // Cria um novo ataque da vaca
        const newAttack = {
            x: donkey.x + donkey.width / 2, // Posição inicial X do ataque
            y: donkey.y + donkey.height / 2, // Posição inicial Y do ataque
            width: larguraDoAtaque, // Largura do ataque
            height: alturaDoAtaque, // Altura do ataque
        };

        // Adiciona o novo ataque à matriz cowAttacks
        donkeyAttacks.push(newAttack);

        // Atualiza o tempo do último ataque da vaca
        lastDonkeyAttackTime = currentTime;
    }

   // Atualiza a posição dos ataques da vaca e verifica colisões com o lobo
   donkeyAttacks.forEach(attack => {
    attack.y += attackSpeed;

        // Verifica se o ataque atingiu o lobo
        if (
            attack.x < wolf.x + wolf.width &&
            attack.x + attack.width > wolf.x &&
            attack.y < wolf.y + wolf.height &&
            attack.y + attack.height > wolf.y
        ) {
            // Se o lobo tiver escudos disponíveis, remover um escudo
            if (collectedShields.length > 0) {
                collectedShields.pop(); // Remove o último escudo da lista
            } else {
                // Se o lobo não tiver escudos, diminuir uma vida
                wolf.lives--;
            }
            // Remove o ataque que acertou o lobo
            const index = donkeyAttacks.indexOf(attack);
            if (index !== -1) {
                donkeyAttacks.splice(index, 1);
            }
            // Se o lobo ficar sem vidas, exibe "Game Over" e reinicia o jogo
            if (wolf.lives === 0) {
                console.log('Game Over! O lobo perdeu todas as vidas.');
                // Exibir "Game Over"
                gameOver = true;
            }
        }
    });
}
}


// Função para desenhar os ataques da vaca
function drawDonkeyAttacks() {
    ctx.fillStyle = 'Orange'; // Cor dos ataques do porco
    const attackSize = 15; // Tamanho dos ataques da vaca

    donkeyAttacks.forEach(attack => {
        // Desenha o ataque da vaca
        ctx.beginPath();
        ctx.arc(attack.x, attack.y, attackSize, 0, Math.PI * 2);
        ctx.fill();
    });
}

         // CÂES //

// Defina as variáveis de controle de tempo para os ataques da vaca
let lastDogAttackTime = Date.now();
const DogAttackInterval = 3000; // Intervalo de tempo entre os ataques da vaca em milissegundos
let dogAttacks = [];

// Função para desenhar o porco
function drawDog() {
    // Verifique se a vaca não ultrapassa os limites do canvas
    if (dog.x < 0) {
        dog.x = 0;
    } else if (dog.x + dog.width > WIDTH) {
        dog.x = WIDTH - dog.width;
    }

    // Desenhe a imagem da vaca
    ctx.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height);
}

// Função para movimento horizontal do porco
function moveDog() {
    // Defina o progresso do jogo
    const progress = calculateGameProgress();

    // Defina a nova velocidade com base no progresso do jogo
    const targetSpeed = progress <= 0.5 ? progress * (MAX_DOG_SPEED - 2) * 2 + 2 : MAX_DOG_SPEED;

    // Ajuste a velocidade atual em direção à nova velocidade alvo
    if (dog.speed < targetSpeed) {
        dog.speed += 0.10; // Ajuste a taxa de aumento da velocidade conforme necessário
    } else if (dog.speed > targetSpeed) {
        dog.speed = targetSpeed;
    }

    // Move o porco com base na velocidade atual
    const margin = 50;
    const loboCenterX = wolf.x + wolf.width / 2;
    const directionToLobo = Math.sign(loboCenterX - dog.x);
    const dx = directionToLobo * dog.speed;
    dog.x += dx;

    // Limita o movimento da vaca dentro dos limites do canvas
    if (dog.x < margin) {
        dog.x = margin;
    } else if (dog.x + dog.width > WIDTH - margin) {
        dog.x = WIDTH - dog.width - margin;
    }
}


// Função para o ataque do porco
function dogAttack() {
    if (!gameOver){
    // Velocidade do ataque da vaca
    const attackSpeed = 3;

    // Intervalo de tempo entre os ataques da vaca
    const dogAttackInterval = 860; // 3 segundos

    // Verifica se é hora de a vaca disparar um ataque
    const currentTime = Date.now();
    if (currentTime - lastDogAttackTime > dogAttackInterval) {
        // Cria um novo ataque da vaca
        const newAttack = {
            x: dog.x + dog.width / 2, // Posição inicial X do ataque
            y: dog.y + dog.height / 2, // Posição inicial Y do ataque
            width: larguraDoAtaque, // Largura do ataque
            height: alturaDoAtaque, // Altura do ataque
        };

        // Adiciona o novo ataque à matriz cowAttacks
        dogAttacks.push(newAttack);

        // Atualiza o tempo do último ataque da vaca
        lastDogAttackTime = currentTime;
    }

   // Atualiza a posição dos ataques da vaca e verifica colisões com o lobo
   dogAttacks.forEach(attack => {
    attack.y += attackSpeed;

        // Verifica se o ataque atingiu o lobo
        if (
            attack.x < wolf.x + wolf.width &&
            attack.x + attack.width > wolf.x &&
            attack.y < wolf.y + wolf.height &&
            attack.y + attack.height > wolf.y
        ) {
            // Se o lobo tiver escudos disponíveis, remover um escudo
            if (collectedShields.length > 0) {
                collectedShields.pop(); // Remove o último escudo da lista
            } else {
                // Se o lobo não tiver escudos, diminuir uma vida
                wolf.lives--;
            }
            // Remove o ataque que acertou o lobo
            const index = dogAttacks.indexOf(attack);
            if (index !== -1) {
                dogAttacks.splice(index, 1);
            }
            // Se o lobo ficar sem vidas, exibe "Game Over" e reinicia o jogo
            if (wolf.lives === 0) {
                console.log('Game Over! O lobo perdeu todas as vidas.');
                gameOver = true;
            }
        }
    });
}
}


function drawDogAttacks() {
    ctx.fillStyle = 'Purple'; 
    const attackSize = 15; 

    dogAttacks.forEach(attack => {
        ctx.beginPath();
        ctx.arc(attack.x, attack.y, attackSize, 0, Math.PI * 2);
        ctx.fill();
    });
}



                //FUNDOS//

// Função para desenhar o fundo
function drawBackground() {
    // Desenha a imagem de fundo
    ctx.drawImage(backgroundImg, 0, backgroundImageY, WIDTH, HEIGHT);
    ctx.drawImage(backgroundImg, 0, backgroundImageY - HEIGHT, WIDTH, HEIGHT); // Desenha uma segunda cópia em cima da primeira
}

// Função para atualizar a posição vertical do fundo na primeira fase
function updateBackground() {
    // Ajusta a posição vertical do fundo para simular movimento
    backgroundImageY += backgroundSpeed; // Ajuste a velocidade do movimento

    // Se a primeira cópia do fundo se moveu completamente para baixo, reinicia a posição
    if (backgroundImageY >= canvas.height) {
        backgroundImageY = 0;
    }
}

// Define as propriedades do fundo na segunda fase
const backgroundPhase2 = {
    x: 0, // Posição inicial X 
    y: 0, // Posição inicial Y
    speed: 1, // Velocidade de movimento do fundo
};

function drawBackgroundPhase2() {
    ctx.drawImage(backgroundImagePhase2, 0, backgroundPhase2.y, WIDTH, HEIGHT);
    ctx.drawImage(backgroundImagePhase2, 0, backgroundPhase2.y - HEIGHT, WIDTH, HEIGHT); 
}

function updateBackgroundPhase2() {
    backgroundPhase2.y += backgroundPhase2.speed; 

    if (backgroundPhase2.y >= canvas.height) {
        backgroundPhase2.y = 0;
    }
}

const backgroundPhase3 = {
    x: 0, 
    y: 0, 
    speed: 1, 
};

function drawBackgroundPhase3() {
    ctx.drawImage(backgroundImagePhase3, 0, backgroundPhase3.y, WIDTH, HEIGHT);
    ctx.drawImage(backgroundImagePhase3, 0, backgroundPhase3.y - HEIGHT, WIDTH, HEIGHT); 
}


function updateBackgroundPhase3() {
    backgroundPhase3.y += backgroundPhase3.speed; 

    if (backgroundPhase3.y >= canvas.height) {
        backgroundPhase3.y = 0;
    }
}

const backgroundPhase4 = {
    x: 0, 
    y: 0, 
    speed: 1, 
};


function drawBackgroundPhase4() {
    ctx.drawImage(backgroundImagePhase4, 0, backgroundPhase4.y, WIDTH, HEIGHT);
    ctx.drawImage(backgroundImagePhase4, 0, backgroundPhase4.y - HEIGHT, WIDTH, HEIGHT); 
}

function updateBackgroundPhase4() {
    backgroundPhase4.y += backgroundPhase4.speed; 

    if (backgroundPhase4.y >= canvas.height) {
        backgroundPhase4.y = 0;
    }
}

const backgroundPhase5 = {
    x: 0, 
    y: 0, 
    speed: 1, 
};

function drawBackgroundPhase5() {
    ctx.drawImage(backgroundImagePhase5, 0, backgroundPhase5.y, WIDTH, HEIGHT);
    ctx.drawImage(backgroundImagePhase5, 0, backgroundPhase5.y - HEIGHT, WIDTH, HEIGHT); 
}

function updateBackgroundPhase5() {
    backgroundPhase5.y += backgroundPhase5.speed; 

    if (backgroundPhase5.y >= canvas.height) {
        backgroundPhase5.y = 0;
    }
}


// Define as propriedades do fundo da segunda fase
const backgroundPhase6 = {
    x: 0, // Posição inicial X 
    y: 0, // Posição inicial Y
    speed: 1, // Velocidade de movimento do fundo
};

// Função para desenhar a imagem de fundo da segunda fase
function drawBackgroundPhase6() {
    ctx.drawImage(backgroundImagePhase6, 0, backgroundPhase6.y, WIDTH, HEIGHT);
    ctx.drawImage(backgroundImagePhase6, 0, backgroundPhase6.y - HEIGHT, WIDTH, HEIGHT); 
}

// Função para atualizar a posição da imagem de fundo da segunda fase
function updateBackgroundPhase6() {
    // Ajusta a posição vertical do fundo para simular o movimento
    backgroundPhase6.y += backgroundPhase6.speed; // Ajuste a velocidade do movimento do background

    // Se a primeira cópia do fundo se moveu completamente para baixo, reinicia a posição
    if (backgroundPhase6.y >= canvas.height) {
        backgroundPhase6.y = 0;
    }
}

                // FIM DOS FUNDOS //



            // VÍDEO FINAL //

// Função para mostrar os créditos
function displayCredits() {
    backgroundMusic.pause(); // Pausa a música de fundo

    const creditsVideo = document.getElementById('creditsVideo');
    creditsVideo.style.display = 'block'; // Mostra o vídeo

    creditsVideo.style.width = '800px';

    // Centraliza o vídeo no canvas
    creditsVideo.style.position = 'absolute';
    creditsVideo.style.top = '50%';
    creditsVideo.style.left = '50%';
    creditsVideo.style.transform = 'translate(-50%, -50%)';


    // Inicia o vídeo
    creditsVideo.play();

    // Após 10 segundos, volta ao menu inicial
    setTimeout(function() {
        window.location.href = 'jogo.html';
    }, 10000); 
}

                    //  FIM DO VÍDEO FINAL //
  
                    //      PONTUAÇÂO       //

// Função para atualizar a pontuação ao longo do tempo
function updateScoreOverTime() {
    if (!isPaused) { // Verifica se o jogo não está em pausa
        const currentTime = Date.now(); // Obtém o tempo atual
        const elapsedTime = currentTime - lastUpdateTime; // Calcula o tempo decorrido desde a última atualização

        if (!gameOver && elapsedTime >= 1000) { // Se não estiver em estado de game over e passou pelo menos um segundo
            score += 10; // Adiciona 10 pontos à pontuação
            lastUpdateTime = currentTime; // Atualiza o tempo da última atualização
        } else {
            // Se estiver em estado de game over, mantém o tempo da última atualização para evitar que a pontuação seja atualizada
            lastUpdateTime = currentTime;
        }
    }
}

// Função para calcular o progresso do jogo
function calculateGameProgress() {
    if (!isPaused && !gameOver) { // Verifica se o jogo não está pausado e não acabou
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / GAME_DURATION, 1);  
        lastProgressUpdateTime = currentTime;
        return progress;
    }
    return lastProgress; // Retorna o último progresso conhecido quando o jogo está pausado ou acabou
}

// Função para desenhar a barra de progresso dentro do canvas
function drawProgressBar(progress) {
    if (!isPaused) { // Verifica se o jogo não está pausado
        const barWidth = 20; // Largura da barra de progresso
        const barHeight = HEIGHT * progress; // Altura da barra de progresso com base no progresso do jogo
        const barX = 10; // Posição X da barra de progresso
        const barrierX = 0; // Posição X da barreira
        const barY = HEIGHT - Math.min(barHeight, HEIGHT - barrierX); // Posição Y da barra de progresso limitada pela posição da barreira

        // Desenha a barra de progresso no contexto do canvas
        ctx.fillStyle = 'green'; // Cor verde para a barra de progresso
        ctx.fillRect(barX, barY, barWidth, Math.min(barHeight, HEIGHT - barrierX)); 
    }
}

// Função para desenhar a pontuação na tela
function drawScore() {
    ctx.fillStyle = 'yellow'; // Define a cor amarela para a pontuação
    ctx.font = '24px Stencil, sans-serif'; 
    ctx.textAlign = 'right'; // Alinhamento à direita
    ctx.fillText(` ${score}`, WIDTH - 10, 30); 
}


                    //FIM DA PONTUAÇÃO //

                        //ITEMS//

// Carrega a imagem do coração
const heartImage = new Image();
heartImage.src = 'sprites/cora.png'; 

// Função para desenhar as vidas na tela (corações)
function drawHearts() {
    for (let i = 0; i < wolf.lives; i++) {
        ctx.drawImage(heartImage, 50 + i * 40, HEIGHT - 60, 40, 40);
    }
}

// Função para desenhar os escudos na tela
function drawShields() {
    // Desenha os escudos
    shields.forEach(shield => {
        ctx.drawImage(shieldImage, shield.x - shield.radius, shield.y - shield.radius, shield.radius * 2, shield.radius * 2);
    });


 // Desenha os escudos apanhados no canto inferior direito
 collectedShields.forEach(collectedShield => {
    ctx.drawImage(shieldImage, collectedShield.x - collectedShield.radius, collectedShield.y - collectedShield.radius, collectedShield.radius * 2, collectedShield.radius * 2);
});
}

// Função para spawnar escudos periodicamente
function generateShields() {
    // Verifica se o jogador já tem o número máximo de escudos
    if (collectedShields.length >= MAX_SHIELDS) {
        return;
    }

    if (Math.random() < 0.0001) { // Ajuste a probabilidade para que os escudos apareçam com menos frequência
        const shield = {
            x: Math.max(itemMargin, Math.min(Math.random() * (WIDTH - 2 * itemMargin) + itemMargin, WIDTH - itemMargin)), // Limita a posição horizontal dentro dos limites do canvas
            y: -50, 
            radius: 20, // Raio do escudo
            speed: 3, // Velocidade de queda do escudo
        };
        shields.push(shield);
    }
}



// Função para desenhar as moedas na tela
function drawCoins() {
    coins.forEach(coin => {
        const coinSize = coin.radius * 2 + 20; 
        ctx.drawImage(coinImage, coin.x - coinSize / 2, coin.y - coinSize / 2, coinSize, coinSize);
    });
}

function updateCoins() {
    coins.forEach(coin => {
        coin.y += 3; // Velocidade de queda das moedas
        // Verifica a colisão com o jogador
        if (
            coin.x < wolf.x + wolf.width &&
            coin.x + coin.radius > wolf.x &&
            coin.y < wolf.y + wolf.height &&
            coin.y + coin.radius > wolf.y
        ) {
            // Se o jogador apanhar a moeda, adiciona 500 pontos à pontuação
            score += 500;
            // Reproduz o som de moeda apanhada
            coinSound.play();
            // Remove a moeda da lista
            coins.splice(coins.indexOf(coin), 1);
        }
    });
}

// Função para spawnar moedas periodicamente
function generateCoins() {
    if (Math.random() < 0.001) { // Ajusta o valor para controlar a frequência de spawns da moeda
        const coin = {
            x: Math.max(itemMargin, Math.min(Math.random() * WIDTH, WIDTH - itemMargin)), // Limita a posição horizontal dentro dos limites do canvas
            y: -50, // Começa na parte de cima do canvas
            radius: 15, // Raio da moeda
        };
        coins.push(coin);
    }
}

// Função para verificar a colisão do lobo com os escudos
function checkShieldCollision() {
    shields.forEach((shield, index) => {
        // Verifica se o lobo está dentro do raio do escudo
        const distance = Math.sqrt(Math.pow(wolf.x + wolf.width / 2 - shield.x, 2) + Math.pow(wolf.y + wolf.height / 2 - shield.y, 2));
        if (distance < wolf.width / 2 + shield.radius) {
            // Se o lobo estiver protegido pelo escudo e ainda não tiver o máximo de escudos, remove o escudo e aumenta o número de escudos do lobo
            if (collectedShields.length < MAX_SHIELDS) {
                // Reproduz o som de escudo apanhado
                shieldSound.play();
                console.log('Tocou o som do escudo');
                shields.splice(index, 1);
                collectedShields.push({ x: WIDTH - 40 * (collectedShields.length + 1), y: HEIGHT - 40, radius: 20 });
            }
        }
    });
}

// Função para atualizar a posição dos escudos
function updateShields() {
    shields.forEach(shield => {
        shield.y += shield.speed; // Move o escudo para baixo
    });
}



            //FIM DOS ITEMS //

            //SOM E VOLUMES//


// Função para ajustar o volume dos efeitos sonoros
function setSoundVolume(volume) {
    soundVolume = volume;
    coinSound.volume = volume / 100;
    shieldSound.volume = volume / 100;

}

// Função para ajustar o volume da música de fundo
function setMusicVolume(volume) {
    musicVolume = volume;
    backgroundMusic.volume = volume / 100; 
}


const soundVolumeInput = document.getElementById('sound-volume');
soundVolumeInput.addEventListener('input', function() {
    const volume = parseInt(this.value);
    setSoundVolume(volume);
});


const musicVolumeInput = document.getElementById('music-volume');
musicVolumeInput.addEventListener('input', function() {
    const volume = parseInt(this.value);
    setMusicVolume(volume);
});

const newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', function() {
    // Inicia a reprodução da música de fundo
    backgroundMusic.play();
});


            //FIM DO SOM E VOLUMES//

            //MENU DE PAUSA//

// Função para mostrar o modal
function showModal() {
    modal.classList.add('show');
}

// Função para esconder o modal
function hideModal() {
    modal.classList.remove('show');
}



document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (modal.classList.contains('show')) {
            hideModal(); // Fecha o modal se estiver visível
            togglePause(); // Tira a pausa do jogo
        } else {
            showModal(); // Mostra o modal se não estiver visível
            togglePause(); // Pausa o jogo
        }
    }
});


// Função para colocar em pausa e tirar
function togglePause() {
    isPaused = !isPaused; // Inverte o estado de pausa

    if (isPaused) {
        // Se o jogo está pausado, para o loop do jogo
        cancelAnimationFrame(animationId); // Para a animação do jogo
    } else {
        // Se o jogo não está pausado, retome o loop do jogo
        const elapsedPausedTime = Date.now() - lastProgressUpdateTime; // Calcula o tempo decorrido durante a pausa
        startTime += elapsedPausedTime; // Adiciona o tempo pausado ao tempo de início do jogo
        animationId = requestAnimationFrame(gameLoop); // Retoma a animação do jogo
    }
}


continueBtn.addEventListener('click', function() {
    // Esconde o modal e continua o jogo
    hideModal();
    togglePause();
});


menuBtn.addEventListener('click', function() {
    // Redireciona para o menu inicial
    window.location.href = 'jogo.html';
});

// Adiciona um ouvinte de evento de clique ao botão
pauseButton.addEventListener('click', function() {
    togglePause(); // Chama a função para pausar ou tirar a pausa
});




            // FUNÇÃO DRAW //

// Função para desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Desenha o fundo primeiro
    if (currentPhaseIndex === 0) {
        drawBackground();
    } else if (currentPhaseIndex === 1) {
        drawBackgroundPhase2();
        drawCowAttacks(); // Desenha a vaca
    } else if (currentPhaseIndex === 2) {
        drawBackgroundPhase3();
        drawDonkey(); // Desenha o burro
        drawDonkeyAttacks();
    } else if (currentPhaseIndex === 3) {
        drawBackgroundPhase4();
        drawSheep(); // Desenha a ovelha
        drawSheepAttacks();
    } else if (currentPhaseIndex === 4) {
        drawBackgroundPhase5();
        drawPig(); // Desenha o porco
        drawPigAttacks();
    } else if (currentPhaseIndex === 5) {
        drawBackgroundPhase6();
        drawDog(); // Desenha o cão
        drawDogAttacks();
    }
    // Desenha os elementos do jogo
    drawOtherAnimal();
    drawAnimalAttacks();
    drawCoins();
    drawHearts();
    drawShields();
    drawScore();
    drawWolf();

    // Desenha o menu de vitória se o jogo foi ganho
    if (gameOver && gameWon) {
        displayCredits();
    }

    // Desenha o menu de "Game Over" se o jogo foi perdido
    if (gameOver && !gameWon) {
        drawGameOverScreen();
    }
}

            //FIM DA FUNÇÂO DRAW //

            //DESENHAR GAME OVER // 

// Função para desenhar a tela de "Game Over" e o botão de tentar novamente
function drawGameOverScreen() {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', WIDTH / 2, HEIGHT / 2);

    // Botão "Tentar outra vez"
    ctx.fillStyle = 'blue';
    ctx.fillRect(WIDTH / 2 - 100, HEIGHT / 2 + 50, 200, 50);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Tentar outra vez', WIDTH / 2, HEIGHT / 2 + 85);
}

// Evento de clique no botão "Tentar outra vez"
canvas.addEventListener('click', tryAgainButtonClick);

// Função para lidar com o clique no botão "Tentar outra vez"
function tryAgainButtonClick(event) {
    if (gameOver && event.offsetX >= WIDTH / 2 - 100 && event.offsetX <= WIDTH / 2 + 100 &&
        event.offsetY >= HEIGHT / 2 + 50 && event.offsetY <= HEIGHT / 2 + 100) {
        resetGame();
    }
}

                //FIM DO GAME OVER //



// Função para atualizar a posição dos ataques dos animais
function updateAnimalAttacks() {
    if (!gameOver) { // Verificação para evitar que os ataques sejam atualizados quando o jogo estiver no estado de game over
        animalAttacks.forEach(attack => {
            attack.y += 3; // Ajuste a velocidade do ataque
            // Verifica se o ataque atingiu o lobo
            if (
                attack.x < wolf.x + wolf.width &&
                attack.x + attack.width > wolf.x &&
                attack.y < wolf.y + wolf.height &&
                attack.y + attack.height > wolf.y
            ) {
                // Se o lobo tiver escudos disponíveis, remove um escudo
                if (collectedShields.length > 0) {
                    collectedShields.pop(); // Remove o último escudo da lista
                } else {
                    // Se o lobo não tiver escudos, diminui uma vida
                    wolf.lives--;
                }
                // Remove o ataque que acertou o lobo
                const index = animalAttacks.indexOf(attack);
                if (index !== -1) {
                    animalAttacks.splice(index, 1);
                }
                // Se o lobo ficar sem vidas, dá "Game Over" e reinicia o jogo
                if (wolf.lives === 0) {
                    console.log('Game Over! O lobo perdeu todas as vidas.');
                    // Mostra o "Game Over"
                    gameOver = true;
                }
            }
        });
    }
}

            //FASES DO JOGO //

const phases = ["Fase 1", "Fase 2", "Fase 3", "Fase 4", "Fase 5", "Fase 6"];
let currentPhaseIndex = 0;

// Função para verificar se o jogo foi concluído
function checkGameCompletion() {
    const totalTimeElapsed = Date.now() - startTime;

    if (!gameOver) { // Verificação para evitar que o tempo seja atualizado quando o jogo estiver no estado de game over
        // Verifica se o tempo total de jogo excedeu o limite para esta fase
        if (totalTimeElapsed >= GAME_DURATION) {
            // Verifica se ainda há fases para serem jogadas
            if (currentPhaseIndex < phases.length - 1) {
                currentPhaseIndex++; // Avanca para a próxima fase
                resetGame(); // Reinicia o jogo para a nova fase
                console.log("Avançando para a próxima fase:", phases[currentPhaseIndex]);
            } else {
                // Se não houver mais fases, o jogo é concluído
                console.log("Parabéns! Você concluiu todas as fases!");
                gameWon = true;
                gameOver = true;
            }
        }
    }
}

        // GAMELOOP //

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// Função para atualizar o jogo
function update() {
    if (!gameOver) {
        updateAnimalAttacks();
        updateOtherAnimal();
        updateCoins();
        checkShieldCollision(); // Verifica a colisão com os escudos
        updateShields(); // Atualiza a posição dos escudos 
    }
}

// Função para o loop do jogo
function gameLoop() {
    if (!isPaused && !isGameOver) {
        clearCanvas(); 

        
        if (currentPhaseIndex === 0) {
            drawBackground();
            updateBackground();
        } else if (currentPhaseIndex === 1) {
            drawBackgroundPhase2();
            updateBackgroundPhase2();
        } else if (currentPhaseIndex === 2) {
            drawBackgroundPhase3();
            updateBackgroundPhase3();
        } else if (currentPhaseIndex === 3) {
            drawBackgroundPhase4();
            updateBackgroundPhase4();
        } else if (currentPhaseIndex === 4) {
            drawBackgroundPhase5();
            updateBackgroundPhase5();
        } else if (currentPhaseIndex === 5) {
            drawBackgroundPhase6();
            updateBackgroundPhase6();

        }
        
        
        draw();
        update();
        updateScoreOverTime();
        generateCoins();
        generateShields();
        updateWolfAnimation();
        const progress = calculateGameProgress();
        drawProgressBar(progress);
        checkGameCompletion();

       
        if (currentPhaseIndex === 1) {
            drawCoins();
            drawShields();
            drawWolf();
            drawCow();
            moveCow();
            cowAttack();
            drawCowAttacks();
        } else if (currentPhaseIndex === 2) {
            drawDonkey();
            moveDonkey();
            donkeyAttack();
            drawDonkeyAttacks();
           
          
        } else if (currentPhaseIndex === 3) {
            drawSheep();
            moveSheep();
            sheepAttack();
            drawSheepAttacks();
            
        } else if (currentPhaseIndex === 4) {
            drawPig();
            movePig();
            pigAttack();
            drawPigAttacks();
           
        } else if (currentPhaseIndex === 5) {
            drawDog();
            moveDog();
            dogAttack();
            drawDogAttacks();
           
        }
        
        animationId = requestAnimationFrame(gameLoop);
 } else if (isGameOver) {
        drawGameOverScreen(); // Desenha a tela de "Game Over" e os botões para reiniciar
        cancelAnimationFrame(animationId); // Para o loop do jogo
    } else {
        const progress = calculateGameProgress();
        drawProgressBar(progress);
    }
}

// Função para reiniciar o jogo
function resetGame() {

    // Reinicia as variáveis para o estado inicial
    
    wolf = {
        x: WIDTH / 2,
        y: HEIGHT - 50,
        width: 50,
        height: 50,
        lives: 3,
        shields: 0,
    };
    otherAnimal = {
        x: WIDTH / 2,
        y: 50,
        width: 50,
        height: 50,
        speed: 3,
    };
    gameWon = false; 
    animalAttacks = [];
    gameOver = false;
    score = 0; 
    startTime = Date.now(); 
}


    document.getElementById('new-game').addEventListener('click', function() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
});

            //FIM DO GAMELOOP //

            // CONTROLOS //

document.getElementById('controls').addEventListener('click', function() {
    document.getElementById('controlsPopup').style.display = 'block';
});


function confirmControlMethod(canvas) {
    const controlMethod = document.querySelector('input[name="controlMethod"]:checked').value;
    if (controlMethod === 'mouse') {

        // Ativa os controlos do rato e desativa o das teclas

        canvas.removeEventListener('mousemove', moveWithKeyboard);
        document.removeEventListener('keydown', moveWithKeyboard);
        canvas.addEventListener('mousemove', moveWithMouse);
    } else if (controlMethod === 'keyboard') {

        // Ativa os controlos das teclas e desativa os do rato

        canvas.removeEventListener('mousemove', moveWithMouse);
        canvas.removeEventListener('click', moveWithMouse);
        document.removeEventListener('keydown', moveWithKeyboard);
        document.addEventListener('keydown', moveWithKeyboard);
    }
    // Esconde o popup após a escolha
    document.getElementById('controlsPopup').style.display = 'none'; 
}

document.getElementById('confirmControl').addEventListener('click', function() {
    confirmControlMethod(canvas); 
});


// Função para movimentar o lobo com o rato
function moveWithMouse(event) {
    // Verifica se o lobo ainda tem vidas restantes
    if (wolf.lives > 0) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        // Movimenta o lobo para as cordenadas do rato
        wolf.x = mouseX - wolf.width / 2;
        wolf.y = mouseY - wolf.height / 2;
    }
}

// Função para movimentar o lobo com as teclas
function moveWithKeyboard(event) {
    const key = event.key;
    let dx = 0;
    let dy = 0;
    const speed = 20; 

    // Define os movimentos com as teclas

    if (key === 'ArrowLeft' || key === 'a') {
        dx = -speed;
    } else if (key === 'ArrowRight' || key === 'd') {
        dx = speed;
    } else if (key === 'ArrowUp' || key === 'w') {
        dy = -speed;
    } else if (key === 'ArrowDown' || key === 's') {
        dy = speed;
    }

    // Aplica o movimento ao lobo
    wolf.x += dx;
    wolf.y += dy;
}

});

        // BOTÂO DE AJUDA //

// Referência ao botão de ajuda
const helpButton = document.getElementById('helpButton');

// Evento de clique no botão de ajuda
helpButton.addEventListener('click', function() {
    // Exibe o popup de ajuda
    document.getElementById('helpPopup').style.display = 'block';
});

// Função para fechar o popup de ajuda
function closeHelpPopup() {
    // Oculta o popup de ajuda
    document.getElementById('helpPopup').style.display = 'none';

}

            //FIM DO BOTÃO DE AJUDA //