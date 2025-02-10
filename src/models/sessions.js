import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.CRYPTO_KEY || '12345678901234567890123456789012'; // Debe ser de 32 bytes para AES-256
const IV = process.env.CRYPTO_IV || '1234567890123456'; // Debe ser de 16 bytes para AES

// Función para encriptar
const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), Buffer.from(IV, 'utf8'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Función para desencriptar
const decrypt = (text) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), Buffer.from(IV, 'utf8'));
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Definir el esquema de Mongoose
const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    email: { 
        type: String, 
        required: true, 
        set: encrypt, // Encripta antes de guardar
        get: decrypt   // Desencripta al leer
    },
    nickname: { 
        type: String, 
        required: true, 
        set: encrypt,
        get: decrypt
    },
    status: {
        type: String,
        enum: ["Activa", "Inactiva", "Finalizada por el Usuario", "Finalizada por falla de Sistema"],
        required: true,
        default: "Activa",
    },
    createdAt: { type: Date, default: Date.now },
    lastAccessed: { type: Date, default: Date.now },
    clientData: {
        clientIp: { type: String, set: encrypt, get: decrypt },
        clientMac: { type: String, set: encrypt, get: decrypt },
    },
    serverData: {
        serverIp: { type: String, set: encrypt, get: decrypt },
        serverMac: { type: String, set: encrypt, get: decrypt },
    }
}, { toJSON: { getters: true }, toObject: { getters: true } }); 

const Session = mongoose.model('Session', sessionSchema);
export default Session;