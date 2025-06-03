import { v4 as uuidv4 } from "uuid";

export function generateSlug(text: string): string {
  const baseSlug = text
    .toString() // Garante que é uma string
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/[^\w-]+/g, "") // Remove caracteres não alfanuméricos (exceto hífens)
    .replace(/--+/g, "-") // Substitui múltiplos hífens por um único
    .replace(/^-+/, "") // Remove hífens do início
    .replace(/-+$/, ""); // Remove hífens do fim

  if (!baseSlug) {
    // Se o texto original for apenas caracteres especiais, por exemplo
    return uuidv4().slice(0, 8); // Retorna um UUID curto como fallback
  }

  // Adiciona um hash curto para aumentar a unicidade, mas ainda manter o slug legível
  // Em produção, você pode querer verificar no DB se o slug já existe e adicionar um contador.
  return `${baseSlug}-${uuidv4().slice(0, 6)}`;
}
