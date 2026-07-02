export function getPhaseLabel(phase: string) {
    switch (phase) {
        case "group_stage":
            return "Grupo";
        case "last_32":
            return "16 avos de final";
        case "last_16":
            return "Oitavas de final";
        case "quarter_finals":
            return "Quartas de final";
        case "semi_finals":
            return "Semifinais";
        case "third_place":
            return "Disputa do 3º lugar";
        case "final":
            return "Final";
        default:
            return "Partida";
    }
}
