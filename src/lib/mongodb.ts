import mongoose, { Mongoose as MongooseInstanceType } from "mongoose";

const MONGODB_URI = "mongodb+srv://felipesantosmarcelino2004:QMZJ7lDRkDbVhkK4@cluster0.vvyiq.mongodb.net/";

if (!MONGODB_URI) {
  throw new Error("Por favor, defina a variável de ambiente MONGODB_URI em seu arquivo .env.local");
}

/**
 * Armazenamento em cache global para a conexão/promessa do Mongoose.
 * Isso é para evitar múltiplas conexões em ambientes serverless (como Vercel)
 * durante o hot-reloading ou entre invocações de funções serverless.
 */
interface MongooseCache {
  conn: MongooseInstanceType | null;
  promise: Promise<MongooseInstanceType> | null;
}

// Estendendo o objeto global do Node.js para incluir nossa propriedade de cache.
// Isso informa ao TypeScript sobre 'mongooseCache' no objeto global.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cachedConnection: MongooseCache;

// Inicializa o cache. Em desenvolvimento, o objeto global pode persistir
// entre recargas de módulo devido ao hot-reloading, então verificamos se já existe.
// Em produção, cada invocação serverless é um novo ambiente, mas o cache global
// ajuda se o mesmo container/instância for reutilizado para múltiplas requisições.
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}
cachedConnection = global.mongooseCache;

/**
 * Função assíncrona para conectar ao banco de dados.
 * Reutiliza uma conexão existente em cache ou cria uma nova se necessário.
 * @returns {Promise<MongooseInstanceType>} Uma promessa que resolve para a instância do Mongoose conectada.
 */
async function dbConnect(): Promise<MongooseInstanceType> {
  // Se já temos uma conexão em cache, retorna ela.
  if (cachedConnection.conn) {
    // console.log('MongoDB: Utilizando conexão em cache existente.');
    return cachedConnection.conn;
  }

  // Se não há uma conexão, mas já existe uma promessa de conexão em andamento,
  // aguarda essa promessa resolver.
  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false, // Desabilitar buffer de comandos é recomendado para produção.
      // As opções useNewUrlParser e useUnifiedTopology são true por padrão no Mongoose 6+
      // e não são mais opções válidas, podendo causar erros se usadas.
    };

    // console.log('MongoDB: Criando nova promessa de conexão.');
    cachedConnection.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        // console.log('MongoDB: Conexão estabelecida com sucesso.');
        return mongooseInstance;
      })
      .catch((error) => {
        // console.error('MongoDB: Erro ao conectar (dentro da promessa):', error);
        // Limpa a promessa em caso de erro para permitir uma nova tentativa na próxima chamada.
        cachedConnection.promise = null;
        throw error; // Re-lança o erro para ser tratado pelo chamador da dbConnect.
      });
  }

  try {
    // console.log('MongoDB: Aguardando resolução da promessa de conexão.');
    cachedConnection.conn = await cachedConnection.promise;
  } catch (e) {
    // Se a promessa foi rejeitada, ela já deve ter sido limpa no bloco .catch acima.
    // Apenas re-lançamos o erro para o chamador.
    // console.error('MongoDB: Erro ao aguardar a promessa de conexão.', e);
    throw e;
  }

  // Verificação final para garantir que a conexão não é nula.
  if (!cachedConnection.conn) {
    // Este cenário não deveria ser alcançado se a lógica da promessa estiver correta,
    // mas é uma salvaguarda.
    throw new Error("MongoDB: A conexão não pôde ser estabelecida e cachedConnection.conn é nulo após aguardar a promessa.");
  }

  return cachedConnection.conn;
}

export default dbConnect;
