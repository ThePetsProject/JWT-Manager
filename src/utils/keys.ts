import fs from 'fs'

const vaultSecretsPath = process.env.VAULT_SECRET_FILE_PATH

export const privateKey = fs.readFileSync(`${vaultSecretsPath}pk.pem`)
export const publicKey = fs.readFileSync(`${vaultSecretsPath}pubk.pem`)
