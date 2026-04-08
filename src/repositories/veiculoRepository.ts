import {supabase} from "../config/dataBaseConfig";
import HttError from "../utils/HttpsError";
import {Veiculo} from "../models/Veiculo";
import {CarroEstoque} from "../models/CarroEstoque";

// Função para buscar carros do estoque (para exibir na home)
export const getAllCarrosEstoque = async (): Promise<CarroEstoque[]> => {
  const {data, error} = await supabase.from("carro_estoque").select("*");
  if (error)
    throw new HttError(
      Number(error.code) || 500,
      "Erro ao buscar carros do estoque"
    );
  return data as CarroEstoque[];
};

// Função para buscar veículos COM suas fotos
export const getAllVeiculosComFotos = async () => {
  try {
    console.log("📡 Buscando todos os veículos com fotos...");
    
    const { data, error } = await supabase
      .from("veiculos")
      .select(`
        *,
        fotos:fotos!veiculo_id (
          id,
          url,
          ordem,
          criado_em
        )
      `)
      .order("data_cadastro", { ascending: false });

    if (error) {
      console.error("❌ Erro no Supabase:", error);
      throw new HttError(
        Number(error.code) || 500,
        `Erro ao buscar veículos com fotos: ${error.message}`
      );
    }

    // ✅ GARANTE QUE CADA VEÍCULO TENHA SUAS FOTOS ORDENADAS
    if (data && Array.isArray(data)) {
      data.forEach((veiculo: any) => {
        if (veiculo.fotos && Array.isArray(veiculo.fotos)) {
          // Ordena as fotos pela coluna 'ordem'
          veiculo.fotos.sort((a: any, b: any) => {
            const ordemA = a.ordem || 999; // Fotos sem ordem vão pro final
            const ordemB = b.ordem || 999;
            return ordemA - ordemB;
          });
          
          console.log(`📸 Veículo ${veiculo.id}: ${veiculo.fotos.length} foto(s) ordenadas`);
        }
      });
    }

    console.log(`✅ ${data?.length || 0} veículos encontrados`);
    return data;
  } catch (error) {
    console.error("❌ Erro na função getAllVeiculosComFotos:", error);
    throw error;
  }
};

// Função para buscar veículos cadastrados (tabela veiculos)
export const getAllVeiculos = async (): Promise<Veiculo[]> => {
  const {data: veiculos, error} = await supabase.from("veiculos").select("*");
  if (error)
    throw new HttError(Number(error.code) || 500, "Erro ao buscar veículos");
  return veiculos as Veiculo[];
};

export const getVeiculoById = async (id: string): Promise<Veiculo | null> => {
  const {data: veiculos, error} = await supabase
    .from("veiculos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") {
      return null; // Veículo não encontrado
    }
    throw new HttError(
      Number(error.code),
      `Erro ao buscar veículo: ${error.message}`
    );
  }
  return veiculos as Veiculo;
};

export const getVeiculoByIdComFotos = async (id: string) => {
  try {
    console.log(`📡 Buscando veículo ID ${id} com fotos...`);
    
    const { data, error } = await supabase
      .from("veiculos")
      .select(`
        *,
        fotos:fotos!veiculo_id (
          id,
          url,
          ordem,
          criado_em
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Erro no Supabase:", error);
      
      if (error.code === "PGRST116") {
        console.log("⚠️ Veículo não encontrado");
        return null;
      }
      
      throw new HttError(
        Number(error.code) || 500,
        `Erro ao buscar veículo: ${error.message}`
      );
    }

    console.log(`✅ Veículo encontrado:`, data);

    // ✅ ORDENA AS FOTOS PELA COLUNA 'ordem'
    if (data && data.fotos && Array.isArray(data.fotos)) {
      data.fotos.sort((a: any, b: any) => {
        const ordemA = a.ordem || 999;
        const ordemB = b.ordem || 999;
        return ordemA - ordemB;
      });
      
      console.log(`📸 ${data.fotos.length} foto(s) ordenada(s)`);
      
      // 🔍 LOG DETALHADO DA ORDEM
      data.fotos.forEach((foto: any, index: number) => {
        console.log(`  [${index}] Ordem: ${foto.ordem} | URL: ${foto.url.substring(0, 50)}...`);
      });
    } else {
      console.log("ℹ️ Nenhuma foto encontrada para este veículo");
      data.fotos = [];
    }

    return data;
  } catch (error) {
    console.error("❌ Erro na função getVeiculoByIdComFotos:", error);
    throw error;
  }
};

export const createVeiculo = async (novoVeiculo: Veiculo): Promise<Veiculo> => {
  const {data: veiculos, error} = await supabase
    .from("veiculos")
    .insert(novoVeiculo)
    .select()
    .single();
  console.log("Rota /veiculos chamada", novoVeiculo);
  if (error) {
    if (error.code === "23505") {
      throw new HttError(Number(error.code), "Placa já cadastrada no sistema");
    }
    // Trata erro de violação de constraint
    if (error.code === "23514") {
      throw new HttError(
        Number(error.code),
        "Dados inválidos: verifique os campos obrigatórios"
      );
    }
    // Erro genérico
    throw new HttError(
      Number(error.code),
      `Erro ao criar veículo: ${error.message}`
    );
  }

  return veiculos as Veiculo;
};

export const atualizarVeiculo = async (
  id: string,
  veiculoAtualizado: Partial<Veiculo>
) => {
  const {data: veiculos, error} = await supabase
    .from("veiculos")
    .update(veiculoAtualizado)
    .eq("id", id)
    .select()
    .single();
  if (error)
    throw new HttError(
      Number(error.code),
      `Erro ao atualizar veículo: ${error.message}`
    );
  return veiculos as Veiculo;
};

export const deleteVeiculo = async (id: string): Promise<boolean> => {
  const {error} = await supabase.from("veiculos").delete().eq("id", id);
  if (error) {
    if (error.code === "PGRST116") {
      return false; // Veículo não encontrado
    }
    throw error; // Outro erro ocorreu
  }
  return true; // Exclusão bem-sucedida
};