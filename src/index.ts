import app from './app'
import { redisConnect } from './infrastructure/database/connect'

const port = process.env.PORT

app.listen(port, async () => {
  console.log(`server is listening on ${port}`)
})
