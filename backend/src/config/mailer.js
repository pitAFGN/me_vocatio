const { google } = require('googleapis');
require("dotenv").config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redireccin usada para generar el token
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

const transporter = {
  // Simulamos la misma firma de nodemailer para no romper el resto de servicios
  sendMail: async (options) => {
    try {
      const subject = options.subject;
      // Codificacin en UTF-8 para asuntos con acentos y 
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      
      const messageParts = [
        `From: "MeVocatio" <${process.env.EMAIL_USER}>`,
        `To: ${options.to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        options.html,
      ];
      
      const message = messageParts.join('\n');
      
      // La API de Gmail requiere base64url encoding (reemplazar + por - y / por _)
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Enviamos el mensaje por HTTPS, puenteando completamente puertos SMTP de Railway
      const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      
      console.log('Correo HTTPS enviado exitosamente:', res.data);
      return res;
    } catch (error) {
      console.error('Error al enviar correo via Gmail API HTTPS:', error);
      throw error;
    }
  }
};

module.exports = transporter;
