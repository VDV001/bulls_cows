// Функция для генерации четырехзначного числа с разными цифрами
function generateNumber() {
    let digits = [];
    while (digits.length < 4) {
        const digit = Math.floor(Math.random() * 10);
        // Проверяем, чтобы цифры были уникальными и не начинались с нуля
        if (!digits.includes(digit) && (digits.length > 0 || digit !== 0)) {
            digits.push(digit);
        }
    }
    return digits.join('');
}

// Функция для проверки введенного числа
function checkGuess(secret, guess) {
    let bulls = 0; // Счетчик быков
    let cows = 0; // Счетчик коров
    const secretArr = secret.split('');
    const guessArr = guess.split('');

    // Проверяем быков
    for (let i = 0; i < 4; i++) {
        if (secretArr[i] === guessArr[i]) {
            bulls++;
            secretArr[i] = null; // Убираем быка из дальнейшей проверки
            guessArr[i] = null; // Убираем быка из дальнейшей проверки
        }
    }

    // Проверяем коров
    for (let i = 0; i < 4; i++) {
        if (guessArr[i] !== null && secretArr.includes(guessArr[i])) {
            cows++;
            secretArr[secretArr.indexOf(guessArr[i])] = null; // Убираем корову из дальнейшей проверки
        }
    }

    return { bulls, cows };
}

// Основная функция игры
function playGame() {
    const secretNumber = generateNumber(); // Генерируем секретное число
    let history = []; // История запросов

    console.log("Загадано число. Начинайте угадывать!");

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askGuess() {
        readline.question('Введите четырехзначное число с разными цифрами: ', (guess) => {
            // Проверка на корректность ввода
            if (!/^\d{4}$/.test(guess) || new Set(guess).size !== 4) {
                console.log(`Некорректный запрос: число должно быть четырехзначным и содержать разные цифры.`);
                history.push({ guess, response: 'Некорректный запрос' });
                askGuess();
                return;
            }

            // Проверяем угадали ли число
            if (guess === secretNumber) {
                console.log('Число угадано!');
                history.push({ guess, response: 'Число угадано!' });
                console.log("История запросов:", history);
                readline.close();
                return;
            }

            // Получаем количество быков и коров
            const { bulls, cows } = checkGuess(secretNumber, guess);
            const response = `${bulls} бык., ${cows} кор.`;
            console.log(response);
            history.push({ guess, response });
            askGuess(); // Запрашиваем следующий ввод
        });
    }

    askGuess(); // Начинаем игру с первого запроса
}

// Запускаем игру
playGame();
