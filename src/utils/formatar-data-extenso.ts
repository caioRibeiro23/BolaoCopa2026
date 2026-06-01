export const formatarExtensoBR = (data: Date) => {
    const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
    const diaEmesAno = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    // Capitaliza a primeira letra do dia da semana (ex: segunda-feira -> Segunda-feira)
    const diaSemanaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
    return `${diaSemanaCapitalizado} - ${diaEmesAno}`;
  };