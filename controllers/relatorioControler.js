const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const OpenAI = require("openai");
const nodemailer = require("nodemailer");
const db = require("../Db");
const fetch = require("node-fetch");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

async function gerarRelatorio(req, res) {
  const {
    nomeVistoriador,
    localizacao,
    dataVistoria,
    idVistoria,
    ...dadosTecnicos
  } = req.body;

  try {
    const prompt = `Gere um relatório técnico claro e objetivo com base nas informações técnicas a seguir e as deixe enumeradas, organizadas e explicadas detalhadamente e no final coloque a conclusão e as recomendações e também análise e responda o que se pode no campo de observações gerais: ${JSON.stringify(dadosTecnicos)}. Não inclua assinatura, nem nome do vistoriador, nem localização, nem data de vistoria, nem o nome Relatório Técnico de Vistoria.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um engenheiro civil que escreve relatórios técnicos claros, objetivos e bem estruturados.",
        },
        { role: "user", content: prompt },
      ],
    });

    const texto = response.choices[0].message.content;
    const nomeArquivo = `relatorio_${Date.now()}.pdf`;
    const caminho = path.join(__dirname, "../relatorios", nomeArquivo);
    const assinaturaPath = path.join(__dirname, "../assets/assinatura.png");
    const fundoPath = path.join(__dirname, "../assets/vistoria.png");

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(caminho);
    doc.pipe(stream);

    const desenharFundo = () => {
      if (fs.existsSync(fundoPath)) {
        doc.image(fundoPath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height,
        });
      }
    };

    desenharFundo();
    doc.on("pageAdded", desenharFundo);

    doc.moveDown(2);
    doc.fontSize(14).text("Relatório Técnico de Vistoria", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Data da Vistoria: ${dataVistoria}`);
    doc.text(`Localização do Imóvel: ${localizacao}`);
    doc.text(`Responsável Técnico: ${nomeVistoriador}`);
    doc.moveDown();
    doc.fontSize(12).text(texto, { align: "left" });
    doc.moveDown(2);

    if (fs.existsSync(assinaturaPath)) {
      doc.image(assinaturaPath, { width: 120 });
    }

    doc.text(nomeVistoriador);
    doc.text("Engenheiro Responsável");
    doc.end();

    stream.on("finish", async () => {
      try {
        // Envio de e-mail
        const destino = process.env.EMAIL_DESTINO;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: destino,
          subject: "Relatório Técnico de Vistoria",
          text: "Segue em anexo o relatório técnico.",
          attachments: [{ filename: nomeArquivo, path: caminho }],
        });

        console.log("Relatório enviado para:", destino);

        // Upload manual para Supabase com fetch
        const storageUrl = 'https://sictbgrpkhacrukvpopz.supabase.co/storage/v1/object';
        const bucketName = 'relatorios';
        const filePath = `relatorios/${nomeArquivo}`;
        const pdfBuffer = fs.readFileSync(caminho);

        const uploadResponse = await fetch(`${storageUrl}/${filePath}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/pdf',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: pdfBuffer
        });

        if (!uploadResponse.ok) {
          console.error("Erro ao enviar PDF para Supabase via fetch:", await uploadResponse.text());
          return res.status(500).json({ erro: "Erro ao subir PDF para Supabase Storage" });
        }

        // URL pública manualmente gerada (para bucket público)
        const publicUrl = `https://sictbgrpkhacrukvpopz.supabase.co/storage/v1/object/public/${filePath}`;

        // Atualiza URL no banco
        await db`
          UPDATE vistoria
          SET relatorio_url = ${publicUrl}
          WHERE idvistoria = ${idVistoria}
        `;

        // Atualiza status do imóvel
        await db`
          UPDATE imovel
          SET status = 'Aguardando Validação da Vistoria'
          FROM vistoria
          WHERE vistoria.idvistoria = ${idVistoria}
          AND vistoria.idimovel = imovel.idimovel
        `;

        // Envia resposta final
        res.json({
          mensagem: "Relatório gerado, enviado, salvo e status do imóvel atualizado com sucesso",
          arquivo: nomeArquivo,
          url: publicUrl
        });

      } catch (emailError) {
        console.error("Erro ao enviar e-mail:", emailError);
        res.status(500).json({ erro: "Erro ao enviar e-mail com o relatório" });
      }
    });

  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    res.status(500).json({ erro: "Erro ao gerar relatório" });
  }
}

module.exports = { gerarRelatorio };
