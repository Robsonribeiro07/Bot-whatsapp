import mongoose from 'mongoose'

const mongoDBUri =
  'mongodb+srv://robsonrodriguez007:GkpqvboX9NBzzwfg@bot.pkizo4a.mongodb.net/BotWhatasapp?retryWrites=true&w=majority'

async function connectDB() {
  try {
    await mongoose.connect(mongoDBUri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('MongoDB conectado!')
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error)
  }
}

export { connectDB }
