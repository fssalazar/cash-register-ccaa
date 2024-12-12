/* eslint-disable @typescript-eslint/no-explicit-any */
// <p>PP - Pagamento Parcela</p>
// <p>PB - Pagamento Livros</p>
// <p>PD - Pagamento Diverso</p>
// <p>RB - Recebimento Livros</p>
// <p>RD - Recebimento Diverso</p>
// <p>RL - Recolhimento</p>
// <p>EXE - Extorno Entrada </p>
// <p>EXS - Extorno Saída</p>

// Subtração:
// EXE, EXS, RL

// inicial quanto comecou
// Recebido: tudo que entrou positivamente e negativamente - menos RL (não usar RL)
// Total recolhimento: Epenas RL

// Total da fita:
// valor inicial + recebido - recolhido

// Recolhimento - manual (cartao, cheque, dinheiro)

// Diferença = total da fita - contagem do dindin

//

// Diferença
//

export function getTotalReceived(session: any) {
  if (!session || !session.records || !Array.isArray(session.records)) {
    return 0; // Handle cases where session or records are undefined
  }

  const total = session.records.reduce((sum: any, record: any) => {
    if (record.action === "EXE" || record.action === "EXS") {
      return sum - Number(record.value);
    }
    if (record.action === "RL" || record.action === "EXR") {
      return (sum = sum);
    }
    return sum + Number(record.value);
  }, 0);

  return total;
}

export function getTotalCollectedMoney(session: any) {
  if (!session || !session.records || !Array.isArray(session.records)) {
    return 0; // Handle cases where session or records are undefined
  }

  const total = session.records.reduce((sum: any, record: any) => {
    if (record.action === "RL") {
      return sum + Number(record.value);
    }
    if (record.action === "EXR") {
      return sum - Number(record.value);
    }
    return sum;
  }, 0);

  return total;
}
