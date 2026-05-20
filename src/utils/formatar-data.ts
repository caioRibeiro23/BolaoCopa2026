export const formatarDataBR = (dataIso: string) => {
  if (!dataIso) return "";
  
  const stringUtc = dataIso.endsWith('Z') || dataIso.includes('+') 
    ? dataIso 
    : `${dataIso}Z`;

  const data = new Date(stringUtc);
  
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });
};