// alert("Bem-vindo ao meu perfil!");
// alert("Espero que goste!");
// let nome = prompt("Qual o seu nome?");
// alert("Prazer em te conhecer, " + nome + "!");
// let num1 = parseInt(prompt("Digite um número:"));
// let num2 = parseInt(prompt("Digite outro número:")); ;
// let soma = num1 + num2;
// if (soma == 13) {
//     alert("Uau! A soma dos números que você digitou é 13! acesso liberado ao conteúdo secreto!");
//     window.open("https://www.youtube.com/watch?v=47dtFZ8CFo8&list=RD47dtFZ8CFo8&start_radio=1", "_blank");
// } else {
//     alert("A soma dos números que você digitou é: " + soma + " uma pena que nao é 13, acesso negado ao conteúdo secreto.");
//     alert("Mas você ainda pode explorar o restante do meu perfil! redirecionando...");
// }
const botao = document.getElementById('botao');
const musica = document.getElementById('musica');
botao.addEventListener('click', () => {
    if (musica.paused) {
        musica.play();
        botao.textContent = 'Pausar música';
    } else {
        musica.pause();
        botao.textContent = 'Tocar uma musiquinha';
    }
});
botao2.onclick = function() {
    alert("Obrigado pelo click!");
}
function mudar() {
    document.getElementById("texto").style.color = "red";
    document.getElementById("texto").innerHTML = "Texto alterado com sucesso!";
}