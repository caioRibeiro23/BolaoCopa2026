'use client'

import { useState } from "react";
import Image from "next/image";
import { Star, Camera, Loader2, User } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  initialData: {
    id: string;
    name: string;
    pts: number;
    avatarUrl: string;
  };
};

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [name, setName] = useState(initialData.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let currentAvatarUrl = previewUrl;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${initialData.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        currentAvatarUrl = publicUrl;
      }

      const { data: { user }, error } = await supabase.auth.updateUser({
        data: { 
          full_name: name,
          avatar_url: currentAvatarUrl
        }
      });

      if (error) throw error;

      if (user?.user_metadata) {
        setName(user.user_metadata.full_name || name);
        setPreviewUrl(user.user_metadata.avatar_url || currentAvatarUrl);
      }
      
      setAvatarFile(null);
      alert("Perfil updated com sucesso!");
      router.refresh();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Erro ao salvar:", error);
      alert(`Erro ao salvar: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    // Removido max-w-md e adicionado w-full para o card esticar por completo horizontalmente
    <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm overflow-hidden">
      
      {/* Cabeçalho */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 border-b border-azulCinzado/40">
        <h2 className="text-[#E8EDF5] font-bebas-neue text-xl tracking-[1px]">Editar Perfil</h2>
        
        <div className="flex bg-[#FFD7001F] px-3 py-1.5 gap-2 rounded-full border border-[#FFD70066] outline outline-verdeNeon items-center">
          <Star color="#FFD700" fill="#FFD700" size={14} />
          <span className="text-[#FFD700] text-xs font-black tracking-wide">
            {initialData.pts} pts
          </span>
        </div>
      </div>

      {/* Conteúdo Alongado */}
      {/* md:flex-row divide o card em colunas horizontais em telas maiores */}
      <form onSubmit={handleSave} className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 p-6 w-full">
        
        {/* Lado Esquerdo: Foto de Perfil */}
        <div className="flex flex-col items-center md:items-start gap-2 shrink-0">
          <div className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-azulCinzado bg-white shadow-inner">
            <Image src={previewUrl} alt="Perfil" fill className="object-cover" unoptimized={!!avatarFile} />
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs gap-1 font-semibold">
              <Camera size={16} className="text-verdeNeon" />
              Alterar Foto
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <span className="text-[10px] text-cinzaSuave font-inter uppercase tracking-wider md:pl-2">Foto do Avatar</span>
        </div>

        {/* Centro: Nome do Jogador (Cresce dinamicamente ocupando o espaço alongado) */}
        <div className="flex flex-col gap-2 w-full md:flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-cinzaSuave font-inter flex items-center gap-2">
            <User size={14} className="text-verdeNeon" />
            Nome do Jogador
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-azulEscuro border border-azulCinzado rounded-xl px-4 py-2.5 text-[#E8EDF5] font-medium font-inter focus:outline-none focus:border-verdeNeon transition-colors text-sm"
            required
          />
        </div>

        {/* Lado Direito: Botão de Salvar (Ajustado para o fluxo horizontal) */}
        <div className="w-full md:w-auto shrink-0">
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full md:w-44 bg-verdeNeon/10 border border-verdeNeon/40 hover:bg-verdeNeon/20 text-verdeNeon font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:cursor-pointer active:scale-[0.98]"
          >
            {isUpdating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </div>

      </form>

      {/* Rodapé */}
      <div className="px-6 py-3 bg-[#FFFFFF]/2 border-t border-azulCinzado/40">
        <p className="text-[11px] text-cinzaSuave font-inter text-center md:text-left">
          Seu nome ficará visível no ranking geral do campeonato.
        </p>
      </div>

    </div>
  );
}