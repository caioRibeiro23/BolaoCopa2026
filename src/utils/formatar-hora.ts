export const formatarHoraBR = (dataIso: string) => {
    if (!dataIso) return "";

    // Só adiciona o 'Z' se a string já não terminar com 'Z' ou '+00:00'
    const stringUtc = dataIso.endsWith('Z') || dataIso.includes('+') 
        ? dataIso 
        : `${dataIso}Z`;

    const data = new Date(stringUtc);
    return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo', // Garante o horário de Brasília
    });
};