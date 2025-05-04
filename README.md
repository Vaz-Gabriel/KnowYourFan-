# 🧠 KnowYourFanApp

**KnowYourFanApp** é uma aplicação web criada para coletar e validar dados de fãs de e-sports (tema: FURIA eSports). O objetivo é verificar se o CPF informado por um fã está presente no conteúdo de um documento escaneado enviado em PDF.

## 🚀 Funcionalidades

- Formulário de envio com CPF e arquivo PDF
- Validação de documentos com suporte a OCR via OpenAI
- Interface personalizada com a identidade da FURIA eSports
- Extração de texto de PDFs usando `pdf-parse`
- Upload seguro com `Multer`

---

## 🧱 Tecnologias Utilizadas

### Frontend:
- HTML5
- CSS3 (customizado com tema FURIA)
- JavaScript

---

### Backend:
- Node.js
- Express.js
- Multer (upload de arquivos)
- pdf-parse (extração de texto)
- OpenAI API (validação do CPF no texto)


## 📁 Estrutura de Pastas

```
KNOWYOURFANAPP/
├── knowyourfan-backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
|   ├── package-lock.json
│   ├── /uploads
│   └── /public
│       ├── index.html
│       ├── furia-style.css
│       ├── dados.js
|       ├── furia-logo.png
```
---

## ⚙️ Como Rodar Localmente

### 1. Clone o projeto

```bash
git clone https://github.com/VAZ-GABRIEL/KNOWYOURFAN.git

```

### 2. Acessar pasta do projeto

```bash
cd KNOWYOURFAN

```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor

```bash
node server.js
```

### 5. Acesse no navegador

```
http://localhost:3000
```

---

## 📬 Endpoint da API

### `POST /upload`

- **Body (form-data):**
  - `cpf`: string
  - `pdf`: arquivo (formato PDF)

- **Resposta:**
```json
{
  "message": "CPF encontrado no documento!"
}
```

---

## 👨‍💻 Desenvolvedor

| Nome     | GitHub                           |
|----------|----------------------------------|
| Gabriel Franco Vaz | [@Vaz-Gabriel](https://github.com/Vaz-Gabriel) |
