const lista = document.getElementsByClassName("img_items")[0];
const btnLogin = document.querySelector("#btnLogin");

const logout = () => {
	sessionStorage.removeItem("Token");
	window.location = "login.html";
};

btnLogin.addEventListener("click", logout);

const fetchComidas = async () => {
	const response = await fetch("http://localhost:3333/comidas/", {
		headers: { "Access-Control-Allow-Origin": "https://imgbox.com/" },
	});
	const comidas = await response.json();
	console.log(comidas);
	return comidas;
};

const isLogged = async () => {
	const token = sessionStorage.getItem("Token");
	const response = await fetch(`http://localhost:3333/verify/${token}`);
	const logado = await response.json();
	if (!logado) {

	} else {
    const center = document.getElementsByTagName("center")[0];
    lista.removeChild(center);
		btnLogin.innerText = "Sair";
		cardapioConstructor();
	}
};

const createElement = (element) => {
	return document.createElement(element);
};

const divRowConstructor = (comida) => {
	const li = createElement("li");

	const div1 = createElement("div");
	div1.classList.add("img_1");

	const img = createElement("img");
	img.src = comida.imagem;

	const div2 = createElement("div");

	const title = createElement("h3");
	title.innerText = comida.nome;

	const preco = createElement("p");
	preco.innerText = "Preço";
	const valor = createElement("h4");
	valor.innerText = `R$${comida.valor}`;

	div2.appendChild(title);
	div2.appendChild(preco);
	div2.appendChild(valor);

	div1.appendChild(img);
	div1.appendChild(div2);
	li.appendChild(div1);
	lista.appendChild(li);
};

const cardapioConstructor = async () => {
	const comidas = await fetchComidas();
	comidas.forEach((comida) => {
		divRowConstructor(comida);
	});
};

document.addEventListener("DOMContentLoaded", () => {
	isLogged();
});
