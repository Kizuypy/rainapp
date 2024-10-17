const apiKey = '83fbb9362b015b46487c71f63bf820e9';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const searchBox = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const bodyElement = document.body;
const cardElement = document.querySelector('.card');
const timeElement = document.querySelector('.local-time'); // Seleciona o elemento do horário
const weatherCard = document.querySelector('.weather'); // Seleciona o card do clima

// Função para formatar o horário local
function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

// Função para obter o horário local da cidade
function getLocalTime(timezoneOffset) {
    const currentUtcTime = new Date(); // Obtém a hora atual no UTC
    const utcTimestamp = currentUtcTime.getTime() + (currentUtcTime.getTimezoneOffset() * 60000); // Corrige o UTC local
    const localTime = new Date(utcTimestamp + timezoneOffset * 1000); // Aplica o offset do timezone em milissegundos
    return localTime;
}

// Função para mudar o estilo do card baseado nas condições climáticas e horário
function mudarCard(condicao, temperatura, hora) {
    // Limpar estilos do card
    cardElement.style.background = ''; // Limpa o fundo do card

    // Define cores com base na condição e temperatura
    if (hora >= 6 && hora < 18) { // Dia
        if (temperatura < 20) {
            cardElement.style.background = 'linear-gradient(135deg, #a0c1ff, #00feba)'; // Frio durante o dia
        } else {
            cardElement.style.background = 'linear-gradient(135deg, #ffcc00, #ff7f50)'; // Quente durante o dia
        }
    } else { // Noite
        if (temperatura < 20) {
            cardElement.style.background = 'linear-gradient(135deg, #001f4d, #005f8d)'; // Frio durante a noite (azul)
        } else {
            cardElement.style.background = 'linear-gradient(135deg, #001f4d, #005f8d)'; // Quente durante a noite (azul)
        }
    }
}

// Função para verificar o clima
async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        const data = await response.json();
        
        if (response.ok) {
            document.querySelector(".city").innerHTML = data.name;
            const temperature = Math.round(data.main.temp);
            document.querySelector(".temp").innerHTML = temperature + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            // Obtenha o horário local da cidade usando o offset do timezone
            const timezoneOffset = data.timezone; // Timezone em segundos fornecido pela API
            const localTime = getLocalTime(timezoneOffset);
            
            const time = formatTime(localTime); // Formata a hora local
            timeElement.innerHTML = `Horário Local: ${time}`; // Atualiza o campo com o horário

            const hour = localTime.getHours();

            // Modifique a condição do clima com base na temperatura
            let weatherCondition;
            if (temperature < 20) {
                weatherCondition = 'Snow';
            } else if (temperature >= 21 && temperature <= 25) {
                weatherCondition = 'Clouds';
            } else if (temperature > 25) {
                weatherCondition = 'Clear';
            } else {
                weatherCondition = data.weather[0].main; // Caso não se encaixe nas condições acima
            }

            // Atualiza o card de acordo com a condição climática e a temperatura
            mudarCard(weatherCondition, temperature, hour);

            // Atualiza o ícone e o fundo do corpo com base na condição
            updateWeatherIcon(weatherCondition);

            // Remover a classe 'hidden' para mostrar a seção de clima
            weatherCard.classList.remove('hidden'); // Mostra o cartão de clima
            weatherCard.classList.add('visible'); // Adiciona a classe "visible" para transição suave

        } else {
            console.error("Cidade não encontrada:", data.message);
            alert("Cidade não encontrada. Por favor, tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados da API:", error);
        alert("Ocorreu um erro ao buscar os dados. Tente novamente.");
    }
}

// Função para atualizar o ícone e o fundo do corpo com base nas condições climáticas
function updateWeatherIcon(condition) {
    let iconSrc;
    let backgroundImage;

    switch (condition) {
        case 'Rain':
            iconSrc = 'imgs/cloudrain.png';
            backgroundImage = 'imgs/diachuva.gif';
            break;
        case 'Snow':
            iconSrc = 'imgs/snowflake.png';
            backgroundImage = 'imgs/diafrio.gif';
            break;
        case 'Clouds':
            iconSrc = 'imgs/cloudy.png'; // Ícone de nuvens
            backgroundImage = 'imgs/clouds.gif'; // Fundo para dia nublado
            break;
        case 'Clear':
            iconSrc = 'imgs/clear_sky.png';
            backgroundImage = 'imgs/diasol.gif';
            break;
        default:
            iconSrc = 'imgs/default.png'; // Ícone padrão
            backgroundImage = 'imgs/diasol.gif'; // Fundo padrão
            break;
    }

    weatherIcon.src = iconSrc; // Atualiza o ícone
    bodyElement.style.backgroundImage = `url(${backgroundImage})`; // Atualiza o fundo do corpo
}

// Adiciona evento ao clicar no botão de pesquisa
searchBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Impede o envio do formulário
    const city = searchBox.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        alert("Por favor, insira o nome de uma cidade.");
    }
});

// Adiciona evento ao pressionar 'Enter' no campo de pesquisa
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});
