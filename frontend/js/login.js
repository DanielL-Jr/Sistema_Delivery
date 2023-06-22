const formCadastro = document.querySelector("#formCadastro");
const selectEstados = document.getElementById("estado");
const selectCidades = document.getElementById("cidade");
const inputTel = document.getElementById("telefone");
const inputCPF = document.getElementById("cpf");
const inputCEP = document.getElementById("cep");
const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", (event) => {
	event.preventDefault();
	login();
});

const login = async () => {
	var email = document.getElementById("loginEmail").value;
	var password = document.getElementById("loginSenha").value;
	var user = { email, password };

	var response = await fetch("http://localhost:3333/verify/", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user),
	});

	const token = await response.json();

	if (!token) {
		alert("Email ou senha incorretos!");
	} else {
		response = await fetch(`http://localhost:3333/verify/${token}`);

		const sub = await response.json();
		if (sub) {
			sessionStorage.setItem("Token", token);
			window.location = "home.html";
		} else {
			alert("Token inválido");
		}
	}
};

formCadastro.addEventListener("submit", (event) => {
	event.preventDefault();
	createUser();
});

function verificarCampo(campo) {
	if (campo.value == "") {
		if (campo.id == "complemento") {
			return false;
		} else {
			console.log(`${campo.id} cannot be empty`);
			return true;
		}
	}
}

inputCPF.addEventListener("keyup", (event) => {
	event.preventDefault();
	verificarCPF();
});

function verificarCPF() {
	var cpf = inputCPF.value;
	cpf = cpf.replace(/\D/g, ""); // Remove tudo que não é dígito

	//Vai gradualmente formatando conforme o usuário digita
	if (cpf.length == 3) {
		inputCPF.value = cpf.replace(/(\d{3})/, "$1.");
	}
	if (cpf.length == 6) {
		inputCPF.value = cpf.replace(/(\d{3})(\d{3})/, "$1.$2.");
	}
	if (cpf.length == 9) {
		inputCPF.value = cpf.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-");
	}
	if (cpf.length == 11) {
		inputCPF.value = cpf.replace(
			/(\d{3})(\d{3})(\d{3})(\d{2})/,
			"$1.$2.$3-$4"
		);
	}
}

inputTel.addEventListener("keyup", (event) => {
	event.preventDefault();
	verificarTel();
});

const verificarTel = async () => {
	var telefone = inputTel.value;
	telefone = telefone.replace(/\D/g, ""); // Remove tudo que não é dígito
	if (telefone.length == 2) {
		inputTel.value = telefone.replace(/(\d{2})/, "($1) ");
	}
	if (telefone.length == 7) {
		inputTel.value = telefone.replace(/(\d{2})(\d{5})/, "($1) $2-");
	}
	if (telefone.length == 11) {
		inputTel.value = telefone.replace(
			/(\d{2})(\d{5})(\d{4})/,
			"($1) $2-$3"
		);
	}
};

inputCEP.addEventListener("keyup", (event) => {
	event.preventDefault();
	verificarCEP();
});

const verificarCEP = async () => {
	var cep = inputCEP.value;
	cep = cep.replace(/\D/g, "");
	if (cep.length == 5) {
		inputCEP.value = cep.replace(/(\d{5})/, "$1-");
	}
	if (cep.length == 8) {
		inputCEP.value = cep.replace(/(\d{5})(\d{3})/, "$1-$2");
		cep = await fetchCEP(cep);
		selectEstados.value = cep.uf;
		await selectCidadeConstructor();
		selectCidades.value = cep.localidade;
		document.querySelector("#bairro").value = cep.bairro;
	}
};

const fetchUser = async () => {
	const response = await fetch("http://localhost:3333/users");
	const users = await response.json();
	return users;
};

const createUser = async () => {
	let formValues = {
		cpf: inputCPF,
		nome: document.getElementById("nome"),
		email: document.getElementById("email"),
		password: document.getElementById("senha"),
		password_confirmation: document.getElementById("confirmSenha"),
		telefone: inputTel,
		cep: inputCEP,
		estado: document.getElementById("estado"),
		cidade: document.getElementById("cidade"),
		bairro: document.getElementById("bairro"),
		endereco: document.getElementById("endereco"),
		numero: document.getElementById("numero"),
		complemento: document.getElementById("complemento"),
	};
	for (var i in formValues) {
		if (verificarCampo(formValues[i])) {
			alert("Preencha todos os campos obrigatórios!");
			return null;
		}
	}
	const cpf = formValues.cpf.value;
	const nome = formValues.nome.value;
	const email = formValues.email.value;
	const password = formValues.password.value;
	const password_confirmation = formValues.password_confirmation.value;
	const telefone = formValues.telefone.value;
	const cep = formValues.cep.value;
	const estado = formValues.estado.value;
	const cidade = formValues.cidade.value;
	const bairro = formValues.bairro.value;
	const endereco = formValues.endereco.value;
	const numero = formValues.numero.value;
	const complemento = formValues.complemento.value;

	const user = {
		cpf,
		nome,
		email,
		password,
		password_confirmation,
		telefone,
		cep,
		estado,
		cidade,
		bairro,
		endereco,
		numero,
		complemento,
	};

	const creation = await fetch("http://localhost:3333/users/", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user),
	});

	if (creation.status == 409) {
		alert("Usuário com o CPF infomado já cadastrado.");
	}
};

const fetchEstados = async () => {
	const response = await fetch(
		"https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
	);
	const estados = await response.json();
	return estados;
};

const createElement = (tag) => {
	const element = document.createElement(tag);
	return element;
};

const selectEstadoConstructor = async () => {
	const estados = await fetchEstados();
	selectEstados.innerHTML = "";
	const optionDefault = createElement("option");
	optionDefault.innerText = "Estado";
	selectEstados.appendChild(optionDefault);
	estados.forEach((estado) => {
		const option = createElement("option");
		option.innerText = estado.sigla;
		option.value = estado.sigla;
		selectEstados.appendChild(option);
	});
	selectCidadeConstructor();
};

selectEstados.addEventListener("change", (event) => {
	event.preventDefault();
	selectCidadeConstructor();
});

const fetchCidades = async (estado) => {
	const response = await fetch(
		`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`
	);
	const cidades = await response.json();
	return cidades;
};

const getNomesCidades = (cidades) => {
	var nomeCidades = new Array();
	cidades.forEach((cidade) => {
		const nomeCidade = cidade.nome;
		nomeCidades.push(nomeCidade);
	});
	return nomeCidades;
};

const removerRepetidos = (nomes) => {
	var nomesWithoutReps = nomes.filter(function (este, i) {
		return nomes.indexOf(este) === i;
	});
	return nomesWithoutReps;
};

const selectCidadeConstructor = async () => {
	const cidades = await fetchCidades(selectEstados.value);
	selectCidades.innerHTML = "";
	const nomeCidades = getNomesCidades(cidades);
	const nomesWithoutReps = removerRepetidos(nomeCidades);

	await nomesWithoutReps.forEach(async (cidade) => {
		const option = createElement("option");
		option.innerText = cidade;
		option.value = cidade;
		selectCidades.appendChild(option);
	});
};

const fetchCEP = async (cep) => {
	const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
	const local = await response.json();
	return local;
};

selectEstadoConstructor();
