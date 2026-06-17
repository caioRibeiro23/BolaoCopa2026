import countries from "i18n-iso-countries";
import pt from "i18n-iso-countries/langs/pt.json";

countries.registerLocale(pt);

export default function Flag({ country }: { country: string }) {
    const nomesPadronizados: Record<string, string> = {
        "Holanda": "Países Baixos",
        "Estados Unidos": "Estados Unidos da América",
        "Irã": "Irão",
        "RD Congo": "República Democrática do Congo",
        "República Tcheca": "Chéquia",
    };
    const nomeBuscado = nomesPadronizados[country] || country;
    let cod = countries.getAlpha2Code(nomeBuscado, "pt");
    if (country.toLowerCase() === "inglaterra") {
        cod = "gb-eng"; 
    }
    if (country.toLowerCase() === "escócia") {
        cod = "gb-sct"; 
    } else if (country.toLowerCase() === "rd congo" || country.toLowerCase() === "congo" || country.toLowerCase() === "república democrática do congo") {
        cod = "cd"; // 🔥 Força o código ISO correto da República Democrática do Congo
    }
    return (
        <div className="w-12 h-12 px-3 bg-azulCinzado rounded-2xl shadow-xl flex items-center justify-center">
            <img 
                src={`https://flagcdn.com/w40/${cod?.toLowerCase()}.png`} 
                alt={country}
                className="w-7 h-4 rounded-sm hover:scale-110 transition-transform duration-200 shadow-md"
            />
        </div>
    );
}