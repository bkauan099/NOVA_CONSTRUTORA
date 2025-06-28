const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_DESTINO, // ← e-mail fixo
  subject: 'Relatório de Vistoria',
  text: 'Segue em anexo o relatório gerado.',
  attachments: [{
    filename: nomeArquivo,
    path: caminhoDoArquivo
  }]
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email enviado: ' + info.response);
  }
});
