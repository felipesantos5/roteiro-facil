import type { NextApiRequest, NextApiResponse } from "next";

// Chave da API do OpenCage armazenada como uma variável de ambiente
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const OPENCAGE_API_URL = "https://api.opencagedata.com/geocode/v1/json";

// Handler da API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query; // Obtém o parâmetro de busca `q` da query string

  // Validação: Verifica se o parâmetro `q` foi fornecido
  if (!q) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  // Validação: Verifica se a chave da API está configurada
  if (!OPENCAGE_API_KEY) {
    return res.status(500).json({ error: "API key is not configured" });
  }

  // Cria os parâmetros da URL para a requisição à API do OpenCage
  const params = new URLSearchParams({
    q: q as string, // Termo de busca (cidade ou país)
    key: OPENCAGE_API_KEY, // Chave da API
    limit: "5", // Limita o número de resultados
    no_annotations: "1", // Remove anotações desnecessárias da resposta
  });

  try {
    // Faz a requisição à API do OpenCage
    const response = await fetch(`${OPENCAGE_API_URL}?${params}`);
    const data = await response.json();

    // Verifica se a resposta foi bem-sucedida (status code 200-299)
    if (response.ok) {
      res.status(200).json(data.results); // Retorna os resultados da API
    } else {
      // Lança um erro com a mensagem de erro da API
      throw new Error(data.status.message);
    }
  } catch (error) {
    console.error("OpenCage API error:", error);
    // Retorna um erro genérico para o cliente
    res.status(500).json({ error: "Error fetching geocoding data" });
  }
}
