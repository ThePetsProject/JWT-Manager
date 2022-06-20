import { createClient, RedisClientType } from 'redis'
import fs from 'fs'

export const redisConnect = async (): Promise<RedisClientType> => {
  const redisStrinfFilePath = process.env.VAULT_SECRET_FILE_PATH

  const redisString = fs
    .readFileSync(`${redisStrinfFilePath}redisstring.txt`)
    .toString()
  return createClient({
    url: redisString,
    socket: {
      connectTimeout: 30000,
    },
  })
}
