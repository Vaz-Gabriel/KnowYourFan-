require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cria a pasta de uploads se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do Multer para upload de PDF
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Apenas arquivos PDF são permitidos.'));
        }
        cb(null, true);
    }
});

// Endpoint para receber e analisar o PDF
app.post('/api/analisar-pdf', upload.single('pdf'), async (req, res) => {
    const cpfInformado = req.body.cpf;

    if (!req.file || !cpfInformado) {
        return res.status(400).json({ resposta: 'Arquivo PDF e CPF são obrigatórios.' });
    }

    // Remove pontos e traço do CPF
    const cpfLimpo = cpfInformado.replace(/[.\-]/g, '');

    try {
        const filePath = path.join(uploadDir, req.file.filename);
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        const textoExtraido = pdfData.text.trim();

        if (!textoExtraido) {
            return res.status(400).json({ resposta: 'Não foi possível extrair texto do PDF.' });
        }

        // Log do conteúdo extraído do PDF
        console.log("Texto extraído do PDF:", textoExtraido);

        // Log da chave da OpenAI para depuração
        console.log("Chave OpenAI:", process.env.OPENAI_API_KEY);

        // Chamada à API da OpenAI com CPF e texto
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Você é um assistente que ajuda a validar documentos escaneados. Sua tarefa é verificar se o número de CPF fornecido pelo usuário aparece corretamente no texto extraído de um PDF.
O CPF pode estar com ou sem formatação (pontos e traço), e pode estar em qualquer parte do texto.
Responda apenas com "CPF válido no documento" ou "CPF não encontrado no documento", seguido de uma explicação rápida.`
                    },
                    {
                        role: 'user',
                        content: `CPF informado pelo usuário: ${cpfLimpo}
Texto extraído do documento:
${textoExtraido}

O CPF informado aparece corretamente no documento?`
                    }
                ],
                max_tokens: 500,
                temperature: 0.3
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        res.json({ resposta: openaiResponse.data.choices[0].message.content });

    } catch (error) {
        console.error("Erro ao processar PDF ou na API:", error.response?.data || error.message);
        res.status(500).json({
            resposta: error.response?.data?.error?.message || 'Erro ao processar PDF ou na comunicação com a OpenAI.'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
