import nodemailer from 'nodemailer';
import MailServerData from '@database/base/mail/server';
import schemas from '@database/base/mail/server/schemas';
import { pickBy } from 'lodash';
import { dates } from '@lib/dates';

/** Retorna un objeto de conexión al servidor de correo en base a los datos de conexión indicados*/
const conexionSMTP = ({ smtp, port, email, password }) => {
  if (!smtp) throw new Error('Servidor de correo no definido');
  return nodemailer.createTransport({
    host: smtp,
    port: port,
    secure: false,
    tls: { ciphers: 'SSLv3' },
    auth: {
      user: email,
      pass: password,
    },
  });
};

/** Verifica si es posible la conexión con el servidor de correo */
const checkMailServer = async (data, customError) => {
  try {
    return await conexionSMTP(data).verify();
  } catch (err) {
    throw new Error(customError ? customError : err);
  }
};

/** Retorna el nombre de la institución indicado como UpperCase */
const getIntitution = (name) => {
  return name ? name.toUpperCase() : name;
};

/** Retorna el logo institucional */
const getLogo = (logo) => {
  // return 'https://www.uea.edu.ec/wp-content/uploads/2021/07/cropped-logo_2021.png';
  return `${process.env.BASE_URL}/${logo}`;
};

/** Realiza el envío de un correo
 * @param personalEmail Email al cual se envía el correo,
 * @param personName Nombre del destinatario
 * @param username Nombre de usuario del destinatario
 * @param token Token enviado al usuario
 * @param date Fecha de creación del token
 * @param ldap Objeto con datos del servidor ldap
 * @param customError Mensaje de error a mostrar en caso de fallar la operación
 */
const sendMAilServerNotification = async (
  personalEmail,
  userEmail,
  personName,
  username,
  token,
  institution,
  customError,
) => {
  const url = `${process.env.BASE_URL}/auth/reset/${token}`;
  if (process.env.NODE_ENV === 'development' && process.env.MOCK_RECOVER_MAIL) {
    personalEmail = process.env.MOCK_RECOVER_MAIL;
    userEmail = undefined;
  }
  const mailServerData = new MailServerData();
  let server = await mailServerData.select(schemas.PUBLIC).getFirst();
  const transport = conexionSMTP(server);
  const dueHours = (process.env.RECOVERY_TOKEN_EXPIRE_MINUTES || 0) / 60;
  const message = pickBy({
    from: '"Notificación SGU" <' + server.email + '>',
    to: personalEmail,
    cc: userEmail,
    subject: 'Recuperar la contraseña',
    text: 'Recuperar la contraseña',
    html: `
      <table style="height: auto; with: 620px;">
        <tbody><tr style="height: auto;">
          <td style="width: auto; height: auto; vertical-align: middle;">
            <h1 style="text-align: left;">
              <img style="vertical-align: middle;" src="${getLogo(
                institution?.logo,
              )}" width="144" height="46"/>
              &nbsp; 
              <strong><span style="color: #384152;">Notificaci&oacute;n</span></strong>
            </h1>
          </td>
        </tr>
        <tr style="height: auto;">
          <td style="width: auto; height: auto; padding: 1em;">
            <p style="text-align: justify;">
              <span style="color: #384152;">Estimado usuario,</span>
              <br/>
              <span style="color: #384152;">Se ha solicitado recuperar la contrase&ntilde;a de la cuenta institucional de ${getIntitution(
                institution?.name,
              )}</span>
            </p>
            <p style="text-align: justify;">
              <span style="color: #384152;">
                <strong>Nombres/Apellidos:</strong> ${personName}
              </span>
              <br/>
              <span style="color: #384152;">
                <strong>Cuenta institucional:</strong> ${username}
              </span>
            </p>
          </td>
        </tr>
        <tr style="height: auto;">
          <td style="width: auto; height: auto; padding: 1em;">
            <p><span style="color: #384152;">Haga clic en el siguiente enlace para restaurar su contrase&ntilde;a:</span></p>
            <p style="text-align: justify;"><a href="${url}"><span style="color: #384152;">${url}</span></a></p>
          </td>
        </tr>
        
        <tr style="height: auto;">
          <td style="width: auto; height: auto; padding: 1em;">
            <p><span style="color: #384152;">Si cree que no debería haber recibido este correo por favor cambie su contraseña o contacte con el administrador del sistema</span></p>
            <br/>
            <p style="text-align: justify;">
              <span style="color: #384152;"><strong>NOTA:</strong> El enlace de recuperación es v&aacute;lido por ${dueHours} hora(s) desde que fue generado</span>
            </p>
            <p><span style="color: #384152;">Correo enviado por el Sistema de Gesti&oacute;n Universitario.</span></p>
            <p><span style="color: #384152;"><strong>NO RESPONDA ESTE CORREO</strong></span></p>
          </td>
        </tr>
      </tbody>
    </table>`,
  });
  try {
    return await transport.sendMail(message);
  } catch (error) {
    throw new Error(customError ? customError : error);
  }
};

const NotificationAssing = async (
  code,
  name,
  reason,
  type,
  email,
  emailInstitucional,
  reemplace,
  customError,
) => {
  const mailServerData = new MailServerData();
  let server = await mailServerData.select(schemas.PUBLIC).getFirst();
  const transport = conexionSMTP(server);
  const logo = '/assets/images/logo.png';
  const message = pickBy({
    from: '"Notificación SGU" <' + server.email + '>',
    to: emailInstitucional,
    cc: email,
    subject: 'Asignación como revisor',
    text: 'Asignación como revisor',
    html: `
    <div style="backgroundColor: #ffffff">
    <h1 style="font-size: 2vw; color: #384152;"><img src="${getLogo(
      logo,
    )}" alt="img" width="41" height="41" align="left" /> &nbsp; Notificaci&oacute;n</h1>
    <p style="font-size: 1vw; color: #384152; text-align: justify;">Estimado usuario,</p>
    <p style="font-size: 1vw; color: #384152; text-align: justify;">Se ha asignado como revisor <b>${
      reemplace === true ? 'por que quieren asignar un REEMPLAZO' : ''
    }</b> para la solicitud de <strong>${type}</strong> con c&oacute;digo <strong># ${code}</strong> por motivos de <strong>${reason}</strong> emitido por el funcionario <strong>${name}</strong>, dicha solicitud para ser aprobada o rechazada deber&aacute; verificarla en el <a style="color: #BDCA32;" href="https://app.uea.edu.ec/auth/signin"><strong>SISTEMA SGU</strong></a> en la parte de seguimiento de permisos, comprobar el registro y la evidencia proporcionada.</p>
    <p style="font-size: 1vw; color: #384152; text-align: justify;"><strong>NO RESPONDA A ESTE CORREO.</strong></p>
    </div>
    `,
  });
  try {
    return await transport.sendMail(message);
  } catch (error) {
    throw new Error(customError ? customError : error);
  }
};
const NotificationNotAssing = async (
  code,
  name,
  reason,
  type,
  email,
  emailInstitucional,
  customError,
) => {
  const mailServerData = new MailServerData();
  let server = await mailServerData.select(schemas.PUBLIC).getFirst();
  const transport = conexionSMTP(server);
  const logo = '/assets/images/logo.png';
  const message = pickBy({
    from: '"Notificación SGU" <' + server.email + '>',
    to: emailInstitucional,
    cc: email,
    subject: 'Desvinculación como revisor',
    text: 'Desvinculación como revisor',
    html: `
    <h1 style="font-size: 2vw; color: #384152;"><img src="${getLogo(
      logo,
    )}" alt="img" width="41" height="41" align="left" /> &nbsp; Notificaci&oacute;n</h1>
    <p style="font-size: 1vw; color: #384152; text-align: justify;">Estimado usuario,</p>
    <p style="font-size: 1vw; color: #384152; text-align: justify;">Se ha <b>DESVINCULADO (No se requiere reemplazo)</b> como revisor para la solicitud de <strong>${type}</strong> con c&oacute;digo <strong># ${code}</strong> por motivos de <strong>${reason}</strong> emitido por el funcionario <strong>${name}</strong>.</p>
    <p style="font-size: 1vw; color: #384152; text-align: justify;"><strong>NO RESPONDA A ESTE CORREO.</strong></p>
    `,
  });
  try {
    return await transport.sendMail(message);
  } catch (error) {
    throw new Error(customError ? customError : error);
  }
};

const NotificationChecker = async (
  code,
  state,
  dateinit,
  dateout,
  reason,
  type,
  email,
  name,
  emailInstitucional,
  emailRector,
  customError,
) => {
  const mailServerData = new MailServerData();
  let server = await mailServerData.select(schemas.PUBLIC).getFirst();
  const transport = conexionSMTP(server);
  const logo = '/assets/images/logo.png';
  const message = pickBy({
    from: '"Notificación SGU" <' + server.email + '>',
    to: emailInstitucional,
    cc: email,
    bcc: state === 'approved' ? emailRector : null,
    subject: `Solicitud de ${type} - ${code}`,
    text: `Solicitud de ${type} - ${code}`,
    html: `
    <h1 style="font-size: 2vw; color: #384152;"><img src="${getLogo(
      logo,
    )}" alt="img" width="41" height="41" align="left" /> &nbsp; Notificaci&oacute;n</h1>
    <p style="font-size: 1vw; color: #384152; text-align: justify;">Estimado usuario ${name},</p>
    <p style="font-size: 1vw; color: #384152; text-align: justify;">Se ha <strong>${
      state === 'approved' ? 'APROBADO' : 'RECHAZADO'
    }</strong> su solicitud de <strong>${type}</strong> con c&oacute;digo <strong># ${code}</strong> por motivos de <strong>${reason}</strong>, ${
      state === 'approved'
        ? `la cual va estar&aacute; vigente desde el d&iacute;a: <strong>${dates.toStringDate(
            dateinit,
          )}</strong> hasta: <strong>${dates.toStringDate(dateout)}</strong>.`
        : 'la cual no fue autorizada'
    }</p>
    <p style="font-size: 1vw; color: #384152; text-align: justify;"><strong>NO RESPONDA A ESTE CORREO.</strong></p>
    `,
  });
  try {
    return await transport.sendMail(message);
  } catch (error) {
    throw new Error(customError ? customError : error);
  }
};

const NotificationCheckIfInsideEcuador = async (
  emailtthh,
  email,
  dni,
  name,
  position,
  customError,
) => {
  const mailServerData = new MailServerData();
  let server = await mailServerData.select(schemas.PUBLIC).getFirst();
  const transport = conexionSMTP(server);
  const logo = '/assets/images/logo.png';
  const message = pickBy({
    from:
      '"Notificación SGU - Funcionarios fuera de Ecuador" <' +
      server.email +
      '>',
    to: emailtthh,
    cc: email,
    bcc: ['dgtic@uea.edu.ec', 'wp.leonesz@uea.edu.ec'],
    subject: `Notificación Funcionarios fuera de Ecuador`,
    text: `Notificación Funcionarios fuera de Ecuador`,
    html: `
    <h1 style="color: #384152;"><img style="vertical-align: middle;" src="${getLogo(
      logo,
    )}" alt="Logo" width="41" height="41" /> &nbsp; Notificaci&oacute;n</h1>
    <p>Estimado Talento Humano,</p>
    <p>Mediante la Aplicaci&oacute;n m&oacute;vil se ha detectado que el funcionario: <strong>${name}</strong> est&aacute; realizando sus marcaciones fuera del Ecuador.</p>
    <p><strong>Cédula:</strong> ${dni}</p>
    <p><strong>Correo:</strong> ${email}</p>
    <p><strong>Fecha:</strong> ${dates.toString(position.datetime)}</p>
    <p><strong>Ubicaci&oacute;n:</strong> ${position.city}</p>
    <p><strong>Lugar:</strong> ${position.place}</p>
    <p style="font-size: 1vw; color: #384152; text-align: justify;"><strong>NO RESPONDA A ESTE CORREO.</strong></p>
    `,
  });
  try {
    return await transport.sendMail(message);
  } catch (error) {
    throw new Error(customError ? customError : error);
  }
};

const NotificationCheckIfInsideEcuador2 = async (
  email,
  dni,
  name,
  datetime,
  city,
  place,
  customError,
) => {
  const mailServerData = new MailServerData();
  let server = await mailServerData.select(schemas.PUBLIC).getFirst();
  const transport = conexionSMTP(server);
  const logo = '/assets/images/logo.png';
  const message = pickBy({
    from:
      '"Notificación SGU - Funcionarios fuera de Ecuador" <' +
      server.email +
      '>',
    to: 'talentohumano@uea.edu.ec',
    cc: email,
    bcc: ['dgtic@uea.edu.ec', 'wp.leonesz@uea.edu.ec'],
    subject: `Notificación Funcionarios fuera de Ecuador`,
    text: `Notificación Funcionarios fuera de Ecuador`,
    html: `
    <h1 style="color: #384152;"><img style="vertical-align: middle;" src="${getLogo(
      logo,
    )}" alt="Logo" width="41" height="41" /> &nbsp; Notificaci&oacute;n</h1>
    <p>Estimado Talento Humano,</p>
    <p>Mediante la Aplicaci&oacute;n m&oacute;vil se ha detectado que el funcionario: <strong>${name}</strong> est&aacute; realizando sus marcaciones fuera del Ecuador.</p>
    <p><strong>Cédula:</strong> ${dni}</p>
    <p><strong>Correo:</strong> ${email}</p>
    <p><strong>Fecha:</strong> ${dates.toString(datetime)}</p>
    <p><strong>Ubicaci&oacute;n:</strong> ${city}</p>
    <p><strong>Lugar:</strong> ${place}</p>
    <p style="font-size: 1vw; color: #384152; text-align: justify;"><strong>NO RESPONDA A ESTE CORREO.</strong></p>
    `,
  });
  try {
    return await transport.sendMail(message);
  } catch (error) {
    throw new Error(customError ? customError : error);
  }
};

export const smtpSever = {
  conexionSMTP,
  checkMailServer,
  sendMAilServerNotification,
  NotificationAssing,
  NotificationChecker,
  NotificationNotAssing,
  NotificationCheckIfInsideEcuador,
  NotificationCheckIfInsideEcuador2,
};
