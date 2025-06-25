import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_URL_TEST 
      : process.env.MONGODB_URL;
console.log(`🔗 Connexion à MongoDB: ${MONGODB_URL}`);
    const conn = await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB connecté: ${conn.connection.host}`);
    
    // Événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📊 MongoDB déconnecté');
    });

    // Fermeture propre
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📊 Connexion MongoDB fermée via SIGINT');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;