const traducaoPaises: { [key: string]: string } = {
    // Anfitriões
    "Canada": "Canadá",
    "USA": "Estados Unidos",
    "United States": "Estados Unidos",
    "United States of America": "Estados Unidos",
    "Mexico": "México",

    // América do Sul (CONMEBOL)
    "Argentina": "Argentina",
    "Brazil": "Brasil",
    "Colombia": "Colômbia",
    "Ecuador": "Equador",
    "Paraguay": "Paraguai",
    "Uruguay": "Uruguai",

    // Europa (UEFA)
    "Germany": "Alemanha",
    "Austria": "Áustria",
    "Belgium": "Bélgica",
    "Bosnia-Herzegovina": "Bósnia-Herzegovina",
    "Croatia": "Croácia",
    "Scotland": "Escócia",
    "Spain": "Espanha",
    "France": "França",
    "Netherlands": "Holanda",
    "England": "Inglaterra",
    "Norway": "Noruega",
    "Portugal": "Portugal",
    "Czech Republic": "República Tcheca",
    "Czechia": "República Tcheca",
    "Sweden": "Suécia",
    "Switzerland": "Suíça",
    "Turkey": "Turquia",

    // África (CAF)
    "South Africa": "África do Sul",
    "Algeria": "Argélia",
    "Cape Verde Islands": "Cabo Verde",
    "Ivory Coast": "Costa do Marfim",
    "Egypt": "Egito",
    "Ghana": "Gana",
    "Morocco": "Marrocos",
    "DR Congo": "RD Congo",
    "Congo DR": "RD Congo",
    "Senegal": "Senegal",
    "Tunisia": "Tunísia",

    // Ásia (AFC)
    "Saudi Arabia": "Arábia Saudita",
    "Australia": "Austrália",
    "Qatar": "Qatar",
    "South Korea": "Coreia do Sul",
    "Korea Republic": "Coreia do Sul",
    "Iran": "Irã",
    "Iraq": "Iraque",
    "Japan": "Japão",
    "Jordan": "Jordânia",
    "Uzbekistan": "Uzbequistão",

    // América do Norte/Caribe (CONCACAF)
    "Curaçao": "Curaçao",
    "Haiti": "Haiti",
    "Panama": "Panamá",

    // Oceania (OFC)
    "New Zealand": "Nova Zelândia"
};

export const t = (nome: string | undefined | null) => {
  if (!nome) return "TBD"; // "To Be Defined" para jogos sem time
  return traducaoPaises[nome] || nome;
};