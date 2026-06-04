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
  // Mantemos o estado com o que o usuário digitou/escolheu
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
      setPreviewUrl(URL.createObjectURL(file)); // Atualiza a preview visual na hora
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let currentAvatarUrl = previewUrl;

      // 1. SE HOUVER UMA NOVA IMAGEM, FAZ O UPLOAD PARA O SUPABASE STORAGE
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${initialData.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Faz o upload para um bucket chamado 'avatars' (certifique-se de criá-lo no Supabase como público)
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        // Pega a URL pública da imagem recém-enviada
        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        currentAvatarUrl = publicUrl;
      }

      // 2. ATUALIZA OS METADADOS DO USUÁRIO (NOME E AVATAR)
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: { 
          full_name: name,
          avatar_url: currentAvatarUrl
        }
      });

      if (error) throw error;

      // 3. ATUALIZA OS ESTADOS LOCAIS COM OS DADOS RETORNADOS DO BANCO
      // Isso impede que o campo volte a ser "Jogador" ou resete
      if (user?.user_metadata) {
        setName(user.user_metadata.full_name || name);
        setPreviewUrl(user.user_metadata.avatar_url || currentAvatarUrl);
      }
      
      setAvatarFile(null); // Limpa o arquivo temporário
      alert("Perfil atualizado com sucesso!");
      
      // Avisa os Server Components (Navbar, etc) para se atualizarem sem resetar os inputs do usuário
      router.refresh();

    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(`Erro ao salvar: ${error.message || error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full max-w-md mx-auto shadow-sm overflow-hidden">
      
      {/* Cabeçalho */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 border-b border-azulCinzado/40">
        <h2 className="text-[#E8EDF5] font-bebas-neue text-xl">Editar Perfil</h2>
        
        <div className="flex bg-[#FFD7001F] px-3 py-1.5 gap-2 rounded-full border border-[#FFD70066] outline outline-verdeNeon items-center">
          <Star color="#FFD700" fill="#FFD700" size={14} />
          <span className="text-[#FFD700] text-xs font-black tracking-wide">
            {initialData.pts} pts
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <form onSubmit={handleSave} className="flex flex-col items-center gap-6 p-6 w-full">
        
        {/* Foto de Perfil */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative group cursor-pointer w-28 h-28 rounded-full overflow-hidden border-2 border-azulCinzado bg-white shadow-inner">
            <Image src={previewUrl} alt="Perfil" fill className="object-contain p-1" unoptimized={!!avatarFile} />
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs gap-1 font-semibold">
              <Camera size={18} className="text-verdeNeon" />
              Alterar Foto
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <span className="text-[10px] text-cinzaSuave font-inter uppercase tracking-wider">Foto do Avatar</span>
        </div>

        {/* Nome do Jogador */}
        <div className="flex flex-col gap-2 w-full">
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

        {/* Botão de Salvar */}
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-verdeNeon/10 border border-verdeNeon/40 hover:bg-verdeNeon/20 text-verdeNeon font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:cursor-pointer"
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
      </form>

      <div className="px-6 py-3 bg-[#FFFFFF]/2 border-t border-azulCinzado/40 text-center">
        <p className="text-[11px] text-cinzaSuave font-inter">
          Seu nome ficará visível no ranking geral do campeonato.
        </p>
      </div>

    </div>
  );
}