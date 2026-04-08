"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/app.ts
var import_express7 = __toESM(require("express"), 1);

// src/routes/veiculoRoutes.ts
var import_express = __toESM(require("express"), 1);

// src/utils/HttpsError.ts
var HttpsError = class extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/config/dataBaseConfig.ts
var import_supabase_js = require("@supabase/supabase-js");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var supabaseUrl = process.env.SUPABASE_URL || "";
var supabaseKey = process.env.SUPABASE_KEY || "";
var supabase = (0, import_supabase_js.createClient)(supabaseUrl, supabaseKey);
(() => __async(null, null, function* () {
  const { error } = yield supabase.from("carro_estoque").select("id").limit(1);
  if (!error) {
    console.log("Conex\xE3o com o banco Supabase estabelecida com sucesso!");
  } else {
    console.error("Erro ao conectar ao banco Supabase:", error.message);
  }
}))();

// src/repositories/veiculoRepository.ts
var getAllCarrosEstoque = () => __async(null, null, function* () {
  const { data, error } = yield supabase.from("carro_estoque").select("*");
  if (error)
    throw new HttpsError(
      Number(error.code) || 500,
      "Erro ao buscar carros do estoque"
    );
  return data;
});
var getAllVeiculosComFotos = () => __async(null, null, function* () {
  try {
    console.log("\u{1F4E1} Buscando todos os ve\xEDculos com fotos...");
    const { data, error } = yield supabase.from("veiculos").select(`
        *,
        fotos:fotos!veiculo_id (
          id,
          url,
          ordem,
          criado_em
        )
      `).order("data_cadastro", { ascending: false });
    if (error) {
      console.error("\u274C Erro no Supabase:", error);
      throw new HttpsError(
        Number(error.code) || 500,
        `Erro ao buscar ve\xEDculos com fotos: ${error.message}`
      );
    }
    if (data && Array.isArray(data)) {
      data.forEach((veiculo) => {
        if (veiculo.fotos && Array.isArray(veiculo.fotos)) {
          veiculo.fotos.sort((a, b) => {
            const ordemA = a.ordem || 999;
            const ordemB = b.ordem || 999;
            return ordemA - ordemB;
          });
          console.log(`\u{1F4F8} Ve\xEDculo ${veiculo.id}: ${veiculo.fotos.length} foto(s) ordenadas`);
        }
      });
    }
    console.log(`\u2705 ${(data == null ? void 0 : data.length) || 0} ve\xEDculos encontrados`);
    return data;
  } catch (error) {
    console.error("\u274C Erro na fun\xE7\xE3o getAllVeiculosComFotos:", error);
    throw error;
  }
});
var getAllVeiculos = () => __async(null, null, function* () {
  const { data: veiculos, error } = yield supabase.from("veiculos").select("*");
  if (error)
    throw new HttpsError(Number(error.code) || 500, "Erro ao buscar ve\xEDculos");
  return veiculos;
});
var getVeiculoById = (id) => __async(null, null, function* () {
  const { data: veiculos, error } = yield supabase.from("veiculos").select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new HttpsError(
      Number(error.code),
      `Erro ao buscar ve\xEDculo: ${error.message}`
    );
  }
  return veiculos;
});
var getVeiculoByIdComFotos = (id) => __async(null, null, function* () {
  try {
    console.log(`\u{1F4E1} Buscando ve\xEDculo ID ${id} com fotos...`);
    const { data, error } = yield supabase.from("veiculos").select(`
        *,
        fotos:fotos!veiculo_id (
          id,
          url,
          ordem,
          criado_em
        )
      `).eq("id", id).single();
    if (error) {
      console.error("\u274C Erro no Supabase:", error);
      if (error.code === "PGRST116") {
        console.log("\u26A0\uFE0F Ve\xEDculo n\xE3o encontrado");
        return null;
      }
      throw new HttpsError(
        Number(error.code) || 500,
        `Erro ao buscar ve\xEDculo: ${error.message}`
      );
    }
    console.log(`\u2705 Ve\xEDculo encontrado:`, data);
    if (data && data.fotos && Array.isArray(data.fotos)) {
      data.fotos.sort((a, b) => {
        const ordemA = a.ordem || 999;
        const ordemB = b.ordem || 999;
        return ordemA - ordemB;
      });
      console.log(`\u{1F4F8} ${data.fotos.length} foto(s) ordenada(s)`);
      data.fotos.forEach((foto, index) => {
        console.log(`  [${index}] Ordem: ${foto.ordem} | URL: ${foto.url.substring(0, 50)}...`);
      });
    } else {
      console.log("\u2139\uFE0F Nenhuma foto encontrada para este ve\xEDculo");
      data.fotos = [];
    }
    return data;
  } catch (error) {
    console.error("\u274C Erro na fun\xE7\xE3o getVeiculoByIdComFotos:", error);
    throw error;
  }
});
var createVeiculo = (novoVeiculo) => __async(null, null, function* () {
  const { data: veiculos, error } = yield supabase.from("veiculos").insert(novoVeiculo).select().single();
  console.log("Rota /veiculos chamada", novoVeiculo);
  if (error) {
    if (error.code === "23505") {
      throw new HttpsError(Number(error.code), "Placa j\xE1 cadastrada no sistema");
    }
    if (error.code === "23514") {
      throw new HttpsError(
        Number(error.code),
        "Dados inv\xE1lidos: verifique os campos obrigat\xF3rios"
      );
    }
    throw new HttpsError(
      Number(error.code),
      `Erro ao criar ve\xEDculo: ${error.message}`
    );
  }
  return veiculos;
});
var atualizarVeiculo = (id, veiculoAtualizado) => __async(null, null, function* () {
  const { data: veiculos, error } = yield supabase.from("veiculos").update(veiculoAtualizado).eq("id", id).select().single();
  if (error)
    throw new HttpsError(
      Number(error.code),
      `Erro ao atualizar ve\xEDculo: ${error.message}`
    );
  return veiculos;
});
var deleteVeiculo = (id) => __async(null, null, function* () {
  const { error } = yield supabase.from("veiculos").delete().eq("id", id);
  if (error) {
    if (error.code === "PGRST116") {
      return false;
    }
    throw error;
  }
  return true;
});

// src/utils/http-helper.ts
var ok = (data) => __async(null, null, function* () {
  return {
    statusCode: 200,
    body: data
  };
});
var created = (data) => __async(null, null, function* () {
  return {
    statusCode: 201,
    body: data || { message: "Recurso criado com sucesso" }
  };
});
var noContent = () => __async(null, null, function* () {
  return {
    statusCode: 204,
    body: null
  };
});
var unauthorized = (message = "N\xE3o autorizado") => __async(null, null, function* () {
  return {
    statusCode: 401,
    body: {
      success: false,
      error: message
    }
  };
});
var badRequest = (error) => __async(null, null, function* () {
  return {
    statusCode: 400,
    body: {
      error: typeof error === "string" ? error : error.message
    }
  };
});
var internalServerError = (error) => __async(null, null, function* () {
  return {
    statusCode: 500,
    body: {
      error: "Erro interno do servidor",
      details: typeof error === "string" ? error : error.message
    }
  };
});

// src/repositories/fotosVeiculoRepository.ts
var uploadAndCreateFoto = (veiculo_id, buffer, path2, contentType, ordem) => __async(null, null, function* () {
  const bucket = "veiculos";
  const { error: uploadError } = yield supabase.storage.from(bucket).upload(path2, buffer, {
    contentType,
    upsert: false
  });
  if (uploadError) {
    throw new Error(`Erro ao subir imagem para storage: ${uploadError.message}`);
  }
  const { data: publicData } = yield supabase.storage.from(bucket).getPublicUrl(path2);
  const url = (publicData == null ? void 0 : publicData.publicUrl) || null;
  const { data, error: insertError } = yield supabase.from("fotos").insert({
    veiculo_id,
    url,
    ordem,
    criado_em: /* @__PURE__ */ new Date()
  }).select().single();
  if (insertError) {
    yield supabase.storage.from(bucket).remove([path2]).catch(() => {
    });
    throw new Error(`Erro ao inserir registro de foto: ${insertError.message}`);
  }
  return data;
});

// src/services/veiculoServices.ts
var toLowerSafe = (value) => {
  if (!value) return "";
  return String(value).trim().toLowerCase();
};
var toNumberSafe = (value) => {
  if (value === null || value === void 0 || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};
var toIntSafe = (value) => {
  const num = toNumberSafe(value);
  return num !== null ? Math.floor(num) : null;
};
var getCarrosEstoque = () => __async(null, null, function* () {
  const data = yield getAllCarrosEstoque();
  let response = null;
  if (data) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getAllVeiculos2 = () => __async(null, null, function* () {
  const data = yield getAllVeiculos();
  let response = null;
  if (data) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getVeiculoById2 = (id) => __async(null, null, function* () {
  const veiculo = yield getVeiculoById(id);
  let response = null;
  if (veiculo) {
    response = yield ok(veiculo);
  } else {
    response = yield noContent();
  }
  return response;
});
var createVeiculo2 = (novoVeiculo, files) => __async(null, null, function* () {
  console.log("\u{1F50D} Iniciando cria\xE7\xE3o de ve\xEDculo...");
  console.log("\u{1F4E6} Dados recebidos:", JSON.stringify(novoVeiculo, null, 2));
  console.log(`\u{1F4F8} Arquivos recebidos: ${(files == null ? void 0 : files.length) || 0}`);
  if (!novoVeiculo) {
    return yield badRequest("Dados do ve\xEDculo s\xE3o obrigat\xF3rios");
  }
  let marca = novoVeiculo.marca || "";
  let modelo = novoVeiculo.modelo || "";
  if (novoVeiculo.marcaModelo && !marca) {
    const partes = String(novoVeiculo.marcaModelo).trim().split(" ");
    marca = partes[0] || "";
    modelo = partes.slice(1).join(" ") || partes[0] || "";
  }
  const statusRaw = toLowerSafe(novoVeiculo.status);
  const status = ["usado", "novo"].includes(statusRaw) ? statusRaw : "usado";
  let tipo = toLowerSafe(novoVeiculo.tipo);
  if (!["carro", "moto"].includes(tipo)) {
    const especieRaw = toLowerSafe(novoVeiculo.especie);
    tipo = especieRaw.includes("motocicleta") || especieRaw.includes("moto") ? "moto" : "carro";
  }
  const cambioRaw = toLowerSafe(novoVeiculo.cambio);
  const cambio = ["manual", "automatico"].includes(cambioRaw) ? cambioRaw : "manual";
  const combustivelRaw = toLowerSafe(novoVeiculo.combustivel);
  const combustivel = combustivelRaw || null;
  const anoAtual = (/* @__PURE__ */ new Date()).getFullYear();
  const fabricacao = toIntSafe(novoVeiculo.fabricacao) || toIntSafe(novoVeiculo.anoFabricacao) || anoAtual;
  const ano_modelo = toIntSafe(novoVeiculo.ano_modelo) || toIntSafe(novoVeiculo.anoModelo) || null;
  const preco = toNumberSafe(novoVeiculo.preco) || 0;
  const km = toNumberSafe(novoVeiculo.km);
  const portas = toIntSafe(novoVeiculo.portas);
  const placa = String(novoVeiculo.placa || "").toUpperCase().trim();
  const cor = String(novoVeiculo.cor || "").trim() || null;
  const renavam = String(novoVeiculo.renavam || "").trim();
  const chassi = String(novoVeiculo.chassi || "").trim();
  const numero_motor = String(novoVeiculo.numero_motor || "").trim() || null;
  const numero_cambio = String(novoVeiculo.numero_cambio || "").trim() || null;
  const descricao = String(novoVeiculo.descricao || "").trim() || null;
  const posicao = novoVeiculo.posicao !== void 0 ? !!novoVeiculo.posicao : true;
  const veiculoParaSalvar = {
    placa,
    marca,
    fabricacao,
    modelo,
    cor,
    combustivel,
    km,
    status,
    tipo,
    portas,
    renavam,
    chassi,
    ano_modelo,
    preco,
    cambio,
    posicao,
    numero_motor,
    numero_cambio,
    data_cadastro: /* @__PURE__ */ new Date(),
    descricao
  };
  console.log("\u{1F4CB} Dados processados:", JSON.stringify(veiculoParaSalvar, null, 2));
  const camposObrigatorios = {
    placa: "Placa",
    marca: "Marca",
    fabricacao: "Ano de fabrica\xE7\xE3o",
    modelo: "Modelo",
    status: "Status",
    tipo: "Tipo",
    renavam: "RENAVAM",
    chassi: "Chassi",
    preco: "Pre\xE7o"
  };
  for (const [campo, nome] of Object.entries(camposObrigatorios)) {
    const valor = veiculoParaSalvar[campo];
    if (valor === null || valor === void 0 || valor === "") {
      return yield badRequest(
        `Campo obrigat\xF3rio ausente: ${nome} (${campo})`
      );
    }
  }
  const placaRegex = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  if (!placaRegex.test(placa)) {
    return yield badRequest(
      `Placa inv\xE1lida: "${placa}". Use formato ABC1234 ou ABC1D23`
    );
  }
  if (chassi.length !== 17) {
    return yield badRequest(
      `Chassi inv\xE1lido: deve ter 17 caracteres (recebido: ${chassi.length})`
    );
  }
  if (!/^\d{11}$/.test(renavam)) {
    return yield badRequest(
      `RENAVAM inv\xE1lido: deve ter 11 d\xEDgitos num\xE9ricos (recebido: "${renavam}")`
    );
  }
  if (fabricacao < 1900 || fabricacao > anoAtual + 1) {
    return yield badRequest(
      `Ano de fabrica\xE7\xE3o inv\xE1lido: ${fabricacao} (deve estar entre 1900 e ${anoAtual + 1})`
    );
  }
  if (preco < 0) {
    return yield badRequest("Pre\xE7o n\xE3o pode ser negativo");
  }
  if (km !== null && km < 0) {
    return yield badRequest("Quilometragem n\xE3o pode ser negativa");
  }
  try {
    console.log("\u{1F50D} DIAGN\xD3STICO DO CAMPO PORTAS:");
    console.log("  - Valor recebido do frontend:", novoVeiculo.portas);
    console.log("  - Valor processado:", portas);
    console.log("  - Objeto completo que ser\xE1 salvo:", JSON.stringify(veiculoParaSalvar, null, 2));
    console.log("\u{1F4BE} Salvando ve\xEDculo no banco...");
    const veiculoCriado = yield createVeiculo(veiculoParaSalvar);
    console.log("\u2705 Ve\xEDculo criado com ID:", veiculoCriado.id);
    if (!files || files.length === 0) {
      console.log("\u2139\uFE0F Nenhuma foto foi enviada");
      return yield ok({
        veiculo: veiculoCriado,
        fotos: {
          total_enviadas: 0,
          sucesso: 0,
          falhas: 0,
          lista_sucesso: [],
          lista_erros: null
        },
        message: "Ve\xEDculo cadastrado com sucesso! (sem fotos)"
      });
    }
    console.log(`\u{1F4F8} Iniciando upload de ${files.length} foto(s)...`);
    if (!veiculoCriado.id) {
      console.error("\u274C Ve\xEDculo criado sem ID num\xE9rico!");
      return yield badRequest(
        "Erro: Ve\xEDculo criado mas sem ID. N\xE3o \xE9 poss\xEDvel vincular fotos."
      );
    }
    const fotosUpload = [];
    const fotosErro = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedMimes.includes(file.mimetype)) {
          fotosErro.push({
            index: i + 1,
            nome: file.originalname,
            erro: `Formato inv\xE1lido (${file.mimetype}). Use JPEG, PNG ou WebP`
          });
          console.warn(`\u26A0\uFE0F Foto ${i + 1} rejeitada: formato inv\xE1lido`);
          continue;
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          fotosErro.push({
            index: i + 1,
            nome: file.originalname,
            erro: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB). M\xE1ximo: 10MB`
          });
          console.warn(`\u26A0\uFE0F Foto ${i + 1} rejeitada: muito grande`);
          continue;
        }
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const extensao = file.mimetype.split("/")[1] || "jpg";
        const fileName = `${placa}_${i + 1}_${timestamp}_${random}.${extensao}`;
        const path2 = `veiculos/${placa}/${fileName}`;
        console.log(`\u{1F4E4} Uploading foto ${i + 1}/${files.length}: ${fileName}`);
        const fotoRecord = yield uploadAndCreateFoto(
          String(veiculoCriado.id),
          file.buffer,
          path2,
          file.mimetype,
          i + 1
        );
        fotosUpload.push(fotoRecord);
        console.log(`\u2705 Foto ${i + 1}/${files.length} salva`);
      } catch (fotoError) {
        console.error(`\u274C Erro ao processar foto ${i + 1}:`, fotoError);
        fotosErro.push({
          index: i + 1,
          nome: file.originalname,
          erro: fotoError instanceof Error ? fotoError.message : "Erro desconhecido"
        });
      }
    }
    console.log(`\u2705 Upload conclu\xEDdo: ${fotosUpload.length}/${files.length} foto(s)`);
    const resposta = {
      veiculo: veiculoCriado,
      fotos: {
        total_enviadas: files.length,
        sucesso: fotosUpload.length,
        falhas: fotosErro.length,
        lista_sucesso: fotosUpload,
        lista_erros: fotosErro.length > 0 ? fotosErro : null
      },
      message: fotosErro.length === 0 ? `Ve\xEDculo cadastrado com sucesso! ${fotosUpload.length} foto(s) enviada(s).` : `Ve\xEDculo cadastrado! ${fotosUpload.length} foto(s) enviada(s), ${fotosErro.length} falharam.`
    };
    return yield ok(resposta);
  } catch (error) {
    console.error("\u274C Erro ao cadastrar ve\xEDculo:", error);
    return yield badRequest(
      error instanceof Error ? error.message : "Erro ao cadastrar ve\xEDculo"
    );
  }
});
var updateVeiculo = (id, veiculoAtualizado) => __async(null, null, function* () {
  const data = yield atualizarVeiculo(
    id,
    veiculoAtualizado
  );
  const response = yield ok(data);
  return response;
});
var deleteVeiculo2 = (id) => __async(null, null, function* () {
  if (id) {
    yield deleteVeiculo(id);
    return yield ok({ message: "Ve\xEDculo deletado com sucesso" });
  }
});
var getAllVeiculosComFotos2 = () => __async(null, null, function* () {
  try {
    const data = yield getAllVeiculosComFotos();
    if (!data || data.length === 0) {
      return yield noContent();
    }
    const veiculosFormatados = data.map((veiculo) => {
      var _a;
      const fotosOrdenadas = (veiculo.fotos || []).sort(
        (a, b) => (a.ordem || 999) - (b.ordem || 999)
      );
      return __spreadProps(__spreadValues({}, veiculo), {
        fotos: fotosOrdenadas,
        foto_principal: ((_a = fotosOrdenadas[0]) == null ? void 0 : _a.url) || null,
        // ✅ Primeira foto ordenada
        total_fotos: fotosOrdenadas.length
      });
    });
    return yield ok(veiculosFormatados);
  } catch (error) {
    console.error("Erro ao buscar ve\xEDculos com fotos:", error);
    throw error;
  }
});
var getVeiculoByIdComFotos2 = (id) => __async(null, null, function* () {
  var _a;
  try {
    console.log(`\u{1F50E} Service: Buscando ve\xEDculo ID: ${id}`);
    if (!id || id.trim() === "") {
      console.error("\u274C ID inv\xE1lido ou vazio");
      return yield badRequest("ID do ve\xEDculo \xE9 obrigat\xF3rio");
    }
    const veiculo = yield getVeiculoByIdComFotos(id);
    if (!veiculo) {
      console.warn(`\u26A0\uFE0F Ve\xEDculo n\xE3o encontrado: ${id}`);
      return yield noContent();
    }
    console.log(`\u2705 Ve\xEDculo encontrado: ${veiculo.marca} ${veiculo.modelo}`);
    const fotosOrdenadas = (veiculo.fotos || []).sort(
      (a, b) => (a.ordem || 999) - (b.ordem || 999)
    );
    const veiculoFormatado = __spreadProps(__spreadValues({}, veiculo), {
      fotos: fotosOrdenadas,
      foto_principal: ((_a = fotosOrdenadas[0]) == null ? void 0 : _a.url) || null,
      // ✅ Primeira foto = ordem 1
      total_fotos: fotosOrdenadas.length
    });
    return yield ok(veiculoFormatado);
  } catch (error) {
    console.error("\u274C Erro no service ao buscar ve\xEDculo:", error);
    throw error;
  }
});

// src/controllers/veiculoController.ts
var getVeiculoByIdComFotos3 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = req.params.id;
    if (!id || id.trim() === "") {
      return res.status(400).json({
        error: "ID \xE9 obrigat\xF3rio",
        details: "O par\xE2metro 'id' n\xE3o foi fornecido na URL"
      });
    }
    console.log(`\u{1F4E1} Controller: Buscando ve\xEDculo ID: ${id}`);
    const response = yield getVeiculoByIdComFotos2(id);
    if (!response || response.statusCode === 204) {
      return res.status(404).json({
        error: "Ve\xEDculo n\xE3o encontrado",
        id,
        message: `Nenhum ve\xEDculo encontrado com ID ${id}`
      });
    }
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.error("\u274C Erro no controller:", error);
    next(new HttpsError(500, "Erro ao buscar ve\xEDculo com fotos", error));
  }
});
var getVeiculoById3 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = req.params.id;
    const response = yield getVeiculoById2(id);
    if (!response || response.statusCode === 204) {
      return res.status(404).json({ error: "Ve\xEDculo n\xE3o encontrado" });
    }
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
});
var updateVeiculo2 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = req.params.id;
    const veiculoAtualizado = req.body;
    const response = yield updateVeiculo(id, veiculoAtualizado);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao atualizar ve\xEDculo", error));
  }
});
var deleteVeiculo3 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = req.params.id;
    const response = yield deleteVeiculo2(id);
    if (response) {
      res.status(response.statusCode).json(response.body);
    } else {
      next(new HttpsError(500, "Resposta inesperada do servi\xE7o"));
    }
  } catch (error) {
    next(new HttpsError(500, "Erro ao deletar ve\xEDculo", error));
  }
});
var getAllVeiculos3 = (req, res, next) => __async(null, null, function* () {
  try {
    const response = yield getAllVeiculos2();
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao buscar ve\xEDculos", error));
  }
});
var getCarrosEstoque2 = (req, res, next) => __async(null, null, function* () {
  try {
    const response = yield getCarrosEstoque();
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao buscar carros do estoque", error));
  }
});
var getAllVeiculosComFotos3 = (req, res, next) => __async(null, null, function* () {
  try {
    const response = yield getAllVeiculosComFotos2();
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao buscar ve\xEDculos com fotos", error));
  }
});
var createVeiculo3 = (req, res, next) => __async(null, null, function* () {
  try {
    const novoVeiculo = req.body;
    const files = req.files || [];
    const response = yield createVeiculo2(novoVeiculo, files);
    if (response && typeof response.statusCode === "number") {
      res.status(response.statusCode).json(response.body);
    } else {
      res.status(201).json(response);
    }
  } catch (error) {
    console.error("\u274C Erro no controller ao criar ve\xEDculo:", error);
    next(new HttpsError(500, "Erro ao criar ve\xEDculo", error));
  }
});

// src/routes/veiculoRoutes.ts
var import_multer = __toESM(require("multer"), 1);
var router = import_express.default.Router();
var storage = import_multer.default.memoryStorage();
var upload = (0, import_multer.default)({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    // Limite de 10MB por arquivo
    files: 8
    // Máximo de 8 arquivos
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Formato inv\xE1lido: ${file.mimetype}. Use JPEG, PNG ou WebP.`));
    }
  }
});
router.get("/estoque", getCarrosEstoque2);
router.get("/veiculos", getAllVeiculos3).get("/veiculos-com-fotos", getAllVeiculosComFotos3).get("/veiculos/:id/completo", getVeiculoByIdComFotos3).post("/veiculos", upload.array("foto", 8), createVeiculo3).get("/veiculos/:id", getVeiculoById3).patch("/veiculos/:id", updateVeiculo2).delete("/veiculos/:id", deleteVeiculo3);
var veiculoRoutes_default = router;

// src/routes/clienteRoutes.ts
var import_express2 = __toESM(require("express"), 1);

// src/repositories/clienteRespository.ts
var getClienteRepository = () => __async(null, null, function* () {
  const { data, error } = yield supabase.from("clientes").select("*");
  if (error) throw error;
  return data;
});
var getClienteByIdRepository = (cpf) => __async(null, null, function* () {
  const { data, error } = yield supabase.from("clientes").select("*").eq("cpf", cpf).single();
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }
  return data;
});
var createClienteRepository = (cliente) => __async(null, null, function* () {
  const { data, error } = yield supabase.from("clientes").insert(cliente).select().single();
  if (error) throw error;
  return data;
});
var updateClienteRepository = (cpf, clienteAtualizado) => __async(null, null, function* () {
  const { data, error } = yield supabase.from("clientes").update(clienteAtualizado).eq("cpf", cpf).select().single();
  if (error) throw error;
  return data;
});
var deleteClienteRepository = (cpf) => __async(null, null, function* () {
  const { error } = yield supabase.from("clientes").delete().eq("cpf", cpf);
  if (error) {
    if (error.code === "PGRST116") {
      return false;
    }
    throw error;
  }
  return true;
});

// src/services/clienteService.ts
var getClientesService = () => __async(null, null, function* () {
  const data = yield getClienteRepository();
  let response = null;
  if (data) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getClienteByIdService = (cpf) => __async(null, null, function* () {
  const data = yield getClienteByIdRepository(cpf);
  let response = null;
  if (data) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var createClienteService = (cliente) => __async(null, null, function* () {
  if (cliente) {
    if (cliente.nascimento && !cliente.data_nascimento) {
      cliente.data_nascimento = new Date(cliente.nascimento);
    }
    yield createClienteRepository(cliente);
    return yield created();
  } else {
    return yield badRequest(new Error("Cliente inv\xE1lido"));
  }
});
var updateClienteService = (cpf, clienteAtualizado) => __async(null, null, function* () {
  const data = yield updateClienteRepository(
    cpf,
    clienteAtualizado
  );
  const response = yield ok(data);
  return response;
});
var deleteClienteService = (cpf) => __async(null, null, function* () {
  if (cpf) {
    yield deleteClienteRepository(cpf);
    return yield ok({ message: "Cliente deletado com sucesso" });
  }
});

// src/controllers/clienteController.ts
var getAllClientes = (req, res) => __async(null, null, function* () {
  const response = yield getClientesService();
  res.status(response.statusCode).json(response.body);
});
var getClienteById = (req, res) => __async(null, null, function* () {
  const cpf = req.params.cpf;
  const response = yield getClienteByIdService(cpf);
  res.status(response.statusCode).json(response.body);
});
var createCliente = (req, res) => __async(null, null, function* () {
  const novoCliente = req.body;
  const response = yield createClienteService(novoCliente);
  if (response) {
    res.status(response.statusCode).json(response.body);
  }
});
var updateCliente = (req, res) => __async(null, null, function* () {
  const cpf = req.params.cpf;
  const clienteAtualizado = req.body;
  const response = yield updateClienteService(cpf, clienteAtualizado);
  res.status(response.statusCode).json(response.body);
});
var deleteCliente = (req, res) => __async(null, null, function* () {
  const cpf = req.params.cpf;
  const response = yield deleteClienteService(cpf);
  if (response) {
    res.status(response.statusCode).json(response.body);
  } else {
    res.status(500).json({ error: "Unexpected error: response is undefined." });
  }
});

// src/routes/clienteRoutes.ts
var router2 = import_express2.default.Router();
router2.get("/clientes", getAllClientes).get("/clientes/:cpf", getClienteById).post("/clientes", createCliente).patch("/clientes/:cpf", updateCliente).delete("/clientes/:cpf", deleteCliente);
var clienteRoutes_default = router2;

// src/routes/funcionarioRoutes.ts
var import_express3 = __toESM(require("express"), 1);

// src/repositories/funcionarioRepository.ts
var getAllFuncionarioesRepository = () => __async(null, null, function* () {
  const { data, error } = yield supabase.from("funcionarios").select("*");
  if (error) throw error;
  return data;
});
var getFuncionarioByIdRepository = (id) => __async(null, null, function* () {
  const { data, error } = yield supabase.from("funcionarios").select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }
  return data;
});
var createFuncionarioRepository = (novoFuncionario) => __async(null, null, function* () {
  const { data, error } = yield supabase.from("funcionarios").insert(novoFuncionario).select().single();
  if (error) throw error;
  return data;
});
var updateFuncionarioRepository = (id, FuncionarioAtualizado) => __async(null, null, function* () {
  const { data, error } = yield supabase.from("funcionarios").update(FuncionarioAtualizado).eq("id", id).select().single();
  if (error) throw error;
  return data;
});
var deleteFuncionarioRepository = (id) => __async(null, null, function* () {
  const { error } = yield supabase.from("funcionarios").delete().eq("id", id);
  if (error) {
    if (error.code === "PGRST116") {
      return false;
    }
    throw error;
  }
  return true;
});

// src/services/funcionarioService.ts
var getAllFuncionarioesService = () => __async(null, null, function* () {
  const data = yield getAllFuncionarioesRepository();
  let response = null;
  if (data) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getFuncionarioByIdService = (id) => __async(null, null, function* () {
  const data = yield getFuncionarioByIdRepository(id);
  let response = null;
  if (data) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var createFuncionarioService = (novoFuncionario) => __async(null, null, function* () {
  let response = null;
  if (novoFuncionario) {
    if (novoFuncionario.nascimento && !novoFuncionario.data_nascimento) {
      novoFuncionario.data_nascimento = new Date(novoFuncionario.nascimento);
    }
    yield createFuncionarioRepository(novoFuncionario);
    return yield created();
  } else {
    return badRequest(new Error("Dados inv\xE1lidos"));
  }
});
var updateFuncionarioService = (id, FuncionarioAtualizado) => __async(null, null, function* () {
  const data = yield updateFuncionarioRepository(
    id,
    FuncionarioAtualizado
  );
  const response = yield ok(data);
  return response;
});
var deleteFuncionarioService = (id) => __async(null, null, function* () {
  if (id) {
    yield deleteFuncionarioRepository(id);
    return yield ok({ message: "Funcionario deletado com sucesso" });
  }
});

// src/controllers/funcionarioController.ts
var getAllFuncionarioes = (req, res) => __async(null, null, function* () {
  const response = yield getAllFuncionarioesService();
  res.status(response.statusCode).json(response.body);
});
var getFuncionarioById = (req, res) => __async(null, null, function* () {
  const id = req.params.id;
  const response = yield getFuncionarioByIdService(Number(id));
  res.status(response.statusCode).json(response.body);
});
var createFuncionario = (req, res) => __async(null, null, function* () {
  const Funcionario = req.body;
  const response = yield createFuncionarioService(Funcionario);
  if (response) {
    res.status(response.statusCode).json(response.body);
  }
});
var updateFuncionario = (req, res) => __async(null, null, function* () {
  const id = req.params.id;
  const FuncionarioAtualizado = req.body;
  const response = yield updateFuncionarioService(Number(id), FuncionarioAtualizado);
  res.status(response.statusCode).json(response.body);
});
var deleteFuncionario = (req, res) => __async(null, null, function* () {
  const id = req.params.id;
  const response = yield deleteFuncionarioService(Number(id));
  if (response) {
    res.status(response.statusCode).json(response.body);
  } else {
    res.status(500).json({ error: "Unexpected error: response is undefined." });
  }
});

// src/routes/funcionarioRoutes.ts
var router3 = import_express3.default.Router();
router3.get("/funcionarios", getAllFuncionarioes).get("/funcionarios/:id", getFuncionarioById).post("/funcionarios", createFuncionario).patch("/funcionarios/:id", updateFuncionario).delete("/funcionarios/:id", deleteFuncionario);
var funcionarioRoutes_default = router3;

// src/routes/acessorioRoutes.ts
var import_express4 = __toESM(require("express"), 1);

// src/repositories/acessorioRepository.ts
var getAcessoriosRepository = () => __async(null, null, function* () {
  const { data: acessorios, error } = yield supabase.from("acessorios").select("*");
  if (!acessorios) throw new HttpsError(Number(error.code), `Erro ao buscar acess\xF3rios: ${error == null ? void 0 : error.message}`);
  return acessorios;
});
var getAcessorioByIdRepository = (id) => __async(null, null, function* () {
  const { data: acessorio, error } = yield supabase.from("acessorios").select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new HttpsError(Number(error.code), `Erro ao buscar acess\xF3rio: ${error.message}`);
  }
  return acessorio;
});
var createAcessorioRepository = (novoAcessorio) => __async(null, null, function* () {
  const { data: acessorio, error } = yield supabase.from("acessorios").insert(novoAcessorio).select().single();
  if (error) throw new HttpsError(Number(error.code), `Erro ao criar acess\xF3rio: ${error.message}`);
  return acessorio;
});
var updateAcessorioRepository = (id, acessorioAtualizado) => __async(null, null, function* () {
  const { data: acessorio, error } = yield supabase.from("acessorios").update(acessorioAtualizado).eq("id", id).select().single();
  if (error) throw new HttpsError(Number(error.code), `Erro ao atualizar acess\xF3rio: ${error.message}`);
  return acessorio;
});
var deleteAcessorioRepository = (id) => __async(null, null, function* () {
  const { error } = yield supabase.from("acessorios").delete().eq("id", id);
  if (error) throw new HttpsError(Number(error.code), `Erro ao deletar acess\xF3rio: ${error.message}`);
});

// src/services/acessorioService.ts
var getAllAcessorios = () => __async(null, null, function* () {
  const data = yield getAcessoriosRepository();
  let response = null;
  if (data) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getAcessorioById = (id) => __async(null, null, function* () {
  const acessorio = yield getAcessorioByIdRepository(id);
  let response = null;
  if (acessorio) {
    response = yield ok(acessorio);
  } else {
    response = yield noContent();
  }
  return response;
});
var createAcessorio = (novoAcessorio) => __async(null, null, function* () {
  try {
    if (!novoAcessorio) {
      return yield badRequest("Dados do acess\xF3rio s\xE3o obrigat\xF3rios");
    }
    const camposObrigatorios = ["nome", "descricao", "preco"];
    for (const campo of camposObrigatorios) {
      if (!novoAcessorio[campo]) {
        return yield badRequest(`Campo "${campo}" \xE9 obrigat\xF3rio`);
      }
    }
    yield createAcessorioRepository(novoAcessorio);
    return yield created();
  } catch (error) {
    return yield internalServerError(`Erro ao criar acess\xF3rio: ${error.message}`);
  }
});
var updateAcessorio = (id, acessorioAtualizado) => __async(null, null, function* () {
  try {
    const data = yield updateAcessorioRepository(id, acessorioAtualizado);
    const response = yield ok(data);
    return response;
  } catch (error) {
    return yield internalServerError(`Erro ao atualizar acess\xF3rio: ${error.message}`);
  }
});
var deleteAcessorio = (id) => __async(null, null, function* () {
  try {
    if (id) {
      yield deleteAcessorioRepository(id);
      return yield ok({ message: "Acess\xF3rio deletado com sucesso" });
    }
  } catch (error) {
    return yield internalServerError(`Erro ao deletar acess\xF3rio: ${error.message}`);
  }
});

// src/controllers/acessorioController.ts
var getAllAcessorios2 = (req, res, next) => __async(null, null, function* () {
  try {
    const response = yield getAllAcessorios();
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao buscar acess\xF3rios", error));
  }
});
var getAcessorioById2 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = Number(req.params.id);
    const response = yield getAcessorioById(id);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao buscar acess\xF3rio por ID", error));
  }
});
var createAcessorio2 = (req, res, next) => __async(null, null, function* () {
  try {
    const novoAcessorio = req.body;
    const response = yield createAcessorio(novoAcessorio);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao criar acess\xF3rio", error));
  }
});
var updateAcessorio2 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = Number(req.params.id);
    const acessorioAtualizado = req.body;
    const response = yield updateAcessorio(id, acessorioAtualizado);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao atualizar acess\xF3rio", error));
  }
});
var deleteAcessorio2 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = Number(req.params.id);
    const response = yield deleteAcessorio(id);
    if (response) {
      res.status(response.statusCode).json(response.body);
    } else {
      next(new HttpsError(500, "Resposta inesperada do servi\xE7o"));
    }
  } catch (error) {
    next(new HttpsError(500, "Erro ao deletar acess\xF3rio", error));
  }
});

// src/routes/acessorioRoutes.ts
var router4 = import_express4.default.Router();
router4.get("/acessorios", getAllAcessorios2).get("/acessorios/:id", getAcessorioById2).post("/acessorios", createAcessorio2).patch("/acessorios/:id", updateAcessorio2).delete("/acessorios/:id", deleteAcessorio2);
var acessorioRoutes_default = router4;

// src/routes/usuarioRoutes.ts
var import_express5 = __toESM(require("express"), 1);

// src/repositories/usuarioRepository.ts
var getAllUsuarios = () => __async(null, null, function* () {
  const { data: usuarios, error } = yield supabase.from("usuarios").select("*");
  if (!usuarios)
    throw new HttpsError(Number(error.code), "Erro ao buscar usu\xE1rios");
  return usuarios;
});
var getUsuarioById = (id) => __async(null, null, function* () {
  const { data: usuarios, error } = yield supabase.from("usuarios").select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new HttpsError(
      Number(error.code),
      `Erro ao buscar usu\xE1rio: ${error.message}`
    );
  }
  return usuarios;
});
var getUsuarioByEmail = (email) => __async(null, null, function* () {
  const { data: usuarios, error } = yield supabase.from("usuarios").select("*").eq("email", email).single();
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new HttpsError(
      Number(error.code),
      `Erro ao buscar usu\xE1rio: ${error.message}`
    );
  }
  return usuarios;
});
var createUsuario = (novoUsuario) => __async(null, null, function* () {
  const { data: usuarios, error } = yield supabase.from("usuarios").insert(novoUsuario).select().single();
  if (error) {
    if (error.code === "23505") {
      throw new HttpsError(Number(error.code), "Email j\xE1 cadastrado no sistema");
    }
    if (error.code === "23514") {
      throw new HttpsError(
        Number(error.code),
        "Dados inv\xE1lidos: verifique os campos obrigat\xF3rios"
      );
    }
    throw new HttpsError(
      Number(error.code),
      `Erro ao criar usu\xE1rio: ${error.message}`
    );
  }
  return usuarios;
});
var atualizarUsuario = (id, usuarioAtualizado) => __async(null, null, function* () {
  const { data: usuarios, error } = yield supabase.from("usuarios").update(usuarioAtualizado).eq("id", id).select().single();
  if (error)
    throw new HttpsError(
      Number(error.code),
      `Erro ao atualizar usu\xE1rio: ${error.message}`
    );
  return usuarios;
});

// src/services/usuarioService.ts
var getAllUsuarios2 = () => __async(null, null, function* () {
  const data = yield getAllUsuarios();
  let response = null;
  if (data) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getUsuarioById2 = (id) => __async(null, null, function* () {
  const usuario = yield getUsuarioById(id);
  let response = null;
  if (usuario) {
    response = yield ok(usuario);
  } else {
    response = yield noContent();
  }
  return response;
});
var createUsuario2 = (novoUsuario) => __async(null, null, function* () {
  try {
    if (!novoUsuario) {
      return yield badRequest("Dados do usu\xE1rio s\xE3o obrigat\xF3rios");
    }
    const camposObrigatorios = ["nome", "email", "senha"];
    for (const campo of camposObrigatorios) {
      if (!novoUsuario[campo]) {
        return yield badRequest(`Campo "${campo}" \xE9 obrigat\xF3rio`);
      }
    }
    yield createUsuario(novoUsuario);
    return yield created();
  } catch (error) {
    return yield internalServerError(`Erro ao criar usu\xE1rio: ${error.message}`);
  }
});
var updateUsuario = (id, usuarioAtualizado) => __async(null, null, function* () {
  try {
    const data = yield atualizarUsuario(id, usuarioAtualizado);
    const response = yield ok(data);
    return response;
  } catch (error) {
    return yield internalServerError(`Erro ao atualizar usu\xE1rio: ${error.message}`);
  }
});
var deleteUsuario = (id) => __async(null, null, function* () {
  try {
    return yield noContent();
  } catch (error) {
    return yield internalServerError(`Erro ao deletar usu\xE1rio: ${error.message}`);
  }
});

// src/controllers/usuarioController.ts
var getAllUsuarios3 = (req, res, next) => __async(null, null, function* () {
  try {
    const response = yield getAllUsuarios2();
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao buscar usu\xE1rios", error));
  }
});
var getUsuarioById3 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = req.params.id;
    const response = yield getUsuarioById2(id);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao buscar usu\xE1rio por ID", error));
  }
});
var createUsuario3 = (req, res, next) => __async(null, null, function* () {
  try {
    const novoUsuario = req.body;
    const response = yield createUsuario2(novoUsuario);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao criar usu\xE1rio", error));
  }
});
var updateUsuario2 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = req.params.id;
    const usuarioAtualizado = req.body;
    const response = yield updateUsuario(id, usuarioAtualizado);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao atualizar usu\xE1rio", error));
  }
});
var deleteUsuario2 = (req, res, next) => __async(null, null, function* () {
  try {
    const id = req.params.id;
    const response = yield deleteUsuario(id);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao deletar usu\xE1rio", error));
  }
});

// src/routes/usuarioRoutes.ts
var router5 = import_express5.default.Router();
router5.get("/usuarios", getAllUsuarios3).get("/usuarios/:id", getUsuarioById3).post("/usuarios", createUsuario3).patch("/usuarios/:id", updateUsuario2).delete("/usuarios/:id", deleteUsuario2);
var usuarioRoutes_default = router5;

// src/routes/authRoutes.ts
var import_express6 = require("express");

// src/services/authService.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcrypt = __toESM(require("bcrypt"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "multicarros_secret_key_2025";
var JWT_EXPIRES_IN = "7d";
var login = (email, senha) => __async(null, null, function* () {
  try {
    const usuario = yield getUsuarioByEmail(email);
    if (!usuario) {
      return yield badRequest("Usu\xE1rio ou senha inv\xE1lidos");
    }
    const senhaValida = yield import_bcrypt.default.compare(senha, usuario.senha);
    if (!senhaValida) {
      return yield badRequest("Usu\xE1rio ou senha inv\xE1lidos");
    }
    const token = import_jsonwebtoken.default.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: usuario.tipo
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    const _a = usuario, { senha: _ } = _a, usuarioSemSenha = __objRest(_a, ["senha"]);
    return yield ok({
      success: true,
      message: "Login realizado com sucesso",
      token,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return yield badRequest("Erro ao fazer login");
  }
});
var register = (userData) => __async(null, null, function* () {
  var _b;
  try {
    const camposObrigatorios = ["nome", "email", "senha", "telefone", "cpf", "data_nascimento"];
    for (const campo of camposObrigatorios) {
      if (!userData[campo]) {
        return yield badRequest(`Campo "${campo}" \xE9 obrigat\xF3rio`);
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return yield badRequest("Email inv\xE1lido");
    }
    if (userData.senha.length < 6) {
      return yield badRequest("Senha deve ter no m\xEDnimo 6 caracteres");
    }
    const usuarioExistente = yield getUsuarioByEmail(userData.email);
    if (usuarioExistente) {
      return yield badRequest("Email j\xE1 cadastrado");
    }
    const senhaHash = yield import_bcrypt.default.hash(userData.senha, 10);
    const novoUsuario = __spreadProps(__spreadValues({}, userData), {
      senha: senhaHash,
      tipo: userData.tipo || 3
      // 3 = Cliente por padrão
    });
    const usuario = yield createUsuario(novoUsuario);
    const token = import_jsonwebtoken.default.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: usuario.tipo
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    const _a = usuario, { senha: _ } = _a, usuarioSemSenha = __objRest(_a, ["senha"]);
    return yield created({
      success: true,
      message: "Usu\xE1rio cadastrado com sucesso",
      token,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    if ((_b = error.message) == null ? void 0 : _b.includes("Email j\xE1 cadastrado")) {
      return yield badRequest("Email j\xE1 cadastrado no sistema");
    }
    return yield badRequest(error.message || "Erro ao cadastrar usu\xE1rio");
  }
});
var verifyToken = (token) => __async(null, null, function* () {
  try {
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    const usuario = yield getUsuarioById(decoded.id);
    if (!usuario) {
      return yield unauthorized("Usu\xE1rio n\xE3o encontrado");
    }
    const _a = usuario, { senha: _ } = _a, usuarioSemSenha = __objRest(_a, ["senha"]);
    return yield ok({
      success: true,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    return yield unauthorized("Token inv\xE1lido ou expirado");
  }
});

// src/controllers/authController.ts
var login2 = (req, res, next) => __async(null, null, function* () {
  try {
    console.log("\u{1F4E5} Dados recebidos:", req.body);
    const { email, senha } = req.body;
    if (!email || !senha) {
      console.log("\u274C Email ou senha faltando");
      return res.status(400).json({
        success: false,
        message: "Email e senha s\xE3o obrigat\xF3rios"
      });
    }
    console.log("\u{1F510} Tentando login com:", email);
    const response = yield login(email, senha);
    console.log("\u2705 Resposta do servi\xE7o:", response);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.error("\u274C Erro no controller:", error);
    next(new HttpsError(500, "Erro ao fazer login", error));
  }
});
var register2 = (req, res, next) => __async(null, null, function* () {
  try {
    const userData = req.body;
    const response = yield register(userData);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(500, "Erro ao registrar usu\xE1rio", error));
  }
});
var verifyToken2 = (req, res, next) => __async(null, null, function* () {
  var _a;
  try {
    const token = (_a = req.headers.authorization) == null ? void 0 : _a.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token n\xE3o fornecido"
      });
    }
    const response = yield verifyToken(token);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(new HttpsError(401, "Token inv\xE1lido", error));
  }
});

// src/routes/authRoutes.ts
var router6 = (0, import_express6.Router)();
router6.post("/login", login2);
router6.post("/register", register2);
router6.get("/verify", verifyToken2);
var authRoutes_default = router6;

// src/routes/index.ts
var route = (app2) => {
  app2.use(authRoutes_default);
  app2.use(veiculoRoutes_default);
  app2.use(clienteRoutes_default);
  app2.use(funcionarioRoutes_default);
  app2.use(acessorioRoutes_default);
  app2.use(usuarioRoutes_default);
  app2.route("/api").get(
    (req, res) => res.status(200).send({ message: "API Multi Carros" })
  );
};
var routes_default = route;

// src/app.ts
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);

// src/middleware/tratamentoErro.ts
function errorHandler(err, req, res, next) {
  if (err instanceof HttpsError) {
    return res.status(err.statusCode).json(__spreadValues({
      success: false,
      status: err.statusCode,
      message: err.message
    }, err.details ? { details: err.details } : {}));
  }
  const status = (err == null ? void 0 : err.statusCode) || (err == null ? void 0 : err.status) || 500;
  const message = (err == null ? void 0 : err.message) || "Internal Server Error";
  const details = err == null ? void 0 : err.details;
  console.error(`[${(/* @__PURE__ */ new Date()).toISOString()}] Error on ${req.method} ${req.originalUrl}:`, err);
  res.status(status).json(__spreadValues({
    success: false,
    status,
    message
  }, details ? { details } : {}));
}
var tratamentoErro_default = errorHandler;

// src/app.ts
function createApp() {
  const app2 = (0, import_express7.default)();
  app2.use((0, import_cors.default)());
  app2.use(import_express7.default.json());
  app2.use(import_express7.default.urlencoded({ extended: true }));
  const publicDir = import_path.default.join(process.cwd(), "public");
  app2.use("/public", import_express7.default.static(publicDir));
  app2.use("/HTML", import_express7.default.static(import_path.default.join(publicDir, "HTML")));
  app2.use("/css", import_express7.default.static(import_path.default.join(publicDir, "css")));
  app2.use("/js", import_express7.default.static(import_path.default.join(publicDir, "js")));
  app2.use("/images", import_express7.default.static(import_path.default.join(publicDir, "images")));
  app2.get("/", (req, res) => {
    res.sendFile(import_path.default.join(publicDir, "HTML", "index.html"));
  });
  routes_default(app2);
  app2.use(tratamentoErro_default);
  return app2;
}
var app_default = createApp;

// src/server.ts
var app = app_default();
var PORT = process.env.PORT || 3e3;
app.listen(PORT, () => {
  console.log(`\u{1F525}Server running on port ${PORT}`);
});
