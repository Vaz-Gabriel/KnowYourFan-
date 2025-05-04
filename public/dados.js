// Função para processar o PDF e enviar para análise
async function processarPdf() {
    const file = document.getElementById("pdf-upload").files[0];
    const cpf = document.getElementById("cpf").value.trim(); // <-- Obtem o CPF

    if (!file || !cpf) {
        alert("Por favor, selecione um arquivo PDF e informe o CPF.");
        return;
    }

    // Apenas chama a função de análise (o backend processa o PDF)
    await analisarDocumento(cpf);
}

// Função para enviar o PDF ao servidor Node.js para análise
async function analisarDocumento(cpf) {
    const file = document.getElementById("pdf-upload").files[0];
    if (!file) {
        alert("Por favor, selecione um arquivo PDF.");
        return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("cpf", cpf); // <-- Adiciona o CPF ao FormData

    document.getElementById("resultado").innerText = "Analisando documento...";

    try {
        const response = await fetch("/api/analisar-pdf", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("resultado").innerText = result.resposta;
        } else {
            console.error("Erro ao analisar o PDF:", result);
            document.getElementById("resultado").innerText = "Erro na análise do documento: " + result.resposta;
        }
    } catch (err) {
        console.error("Erro de comunicação com o servidor:", err);
        document.getElementById("resultado").innerText = "Erro ao conectar com o servidor.";
    }
}

// Função para tratar o envio do formulário
document.getElementById('fanForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('endereco').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const interests = document.getElementById('interesses').value.trim();
    const events = document.getElementById('eventos').value.trim();
    const purchases = document.getElementById('compras').value.trim();
    const socialMediaLink = document.getElementById('socialMedia').value.trim();
    const esportsProfileLink = document.getElementById('esportsProfile').value.trim();

    if (!name || !address || !cpf || !interests || !events || !purchases || !socialMediaLink || !esportsProfileLink) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    let socialMediaValidationResult = 'Link inválido.';
    if (socialMediaLink.includes('twitter.com') || socialMediaLink.includes('instagram.com')) {
        socialMediaValidationResult = 'Link de rede social válido!';
    }
    document.getElementById('socialMediaValidation').textContent = socialMediaValidationResult;
    document.getElementById('socialMediaValidation').className = socialMediaValidationResult.includes('válido') ? 'valid' : 'invalid';

    let esportsProfileValidationResult = 'Perfil inválido.';
    if (esportsProfileLink.includes('hltv.org') || esportsProfileLink.includes('liquipedia.net')) {
        esportsProfileValidationResult = 'Perfil de E-sports válido!';
    }
    document.getElementById('esportsProfileValidation').textContent = esportsProfileValidationResult;
    document.getElementById('esportsProfileValidation').className = esportsProfileValidationResult.includes('válido') ? 'valid' : 'invalid';

    const resultText = `
        <strong>Nome:</strong> ${name}<br>
        <strong>Endereço:</strong> ${address}<br>
        <strong>CPF:</strong> ${cpf}<br>
        <strong>Jogos Favoritos:</strong> ${interests}<br>
        <strong>Eventos Assistidos:</strong> ${events}<br>
        <strong>Compras:</strong> ${purchases}<br>
        <strong>Redes Sociais:</strong> ${socialMediaValidationResult}<br>
        <strong>Perfil de E-sports:</strong> ${esportsProfileValidationResult}
    `;
    document.getElementById('resultText').innerHTML = resultText;
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
