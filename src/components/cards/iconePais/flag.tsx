import countries from "i18n-iso-countries";
import pt from "i18n-iso-countries/langs/pt.json";

countries.registerLocale(pt);

export default function Flag({ country }: { country: string }) {
    const cod = countries.getAlpha2Code(country, "pt");
    return (
        <div className="w-12 h-12 px-3 bg-azulCinzado rounded-2xl shadow-xl flex items-center justify-center">
            <img 
                src={`https://flagcdn.com/w40/${cod?.toLowerCase()}.png`} 
                alt={country}
                className="w-6 h-auto rounded-sm hover:scale-110 transition-transform duration-200"
            />
        </div>
    );
}