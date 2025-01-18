"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = (0, nodemailer_1.createTransport)({
        host: process.env.EMAIL_PROVIDER_HOST,
        port: +process.env.EMAIL_PROVIDER_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_PROVIDER_USERNAME,
            pass: process.env.EMAIL_PROVIDER_PASSWORD,
        },
    });
    const mailOptions = {
        from: "Natours.io",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendMail = sendMail;
//# sourceMappingURL=Emails.js.map