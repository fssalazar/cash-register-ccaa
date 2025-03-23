/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, InputNumber } from "antd";

interface Props {
  session1: any;
  session2: any;
}

export function SessionsTotal({ session1, session2 }: Props) {
  const cheque =
    session1.closure.receivedAmountByCheck ||
    0 + session2.closure.receivedAmountByCheck ||
    0;
  const dinheiro =
    session1.closure.receivedAmountByMoney ||
    0 + session2.closure.receivedAmountByMoney ||
    0;
  const cartao =
    session1.closure.receivedAmountByCard ||
    0 + session2.closure.receivedAmountByCard ||
    0;

  const totalInitialAmount =
    session1.closure.initialAmount || 0 + session2.closure.initialAmount || 0;
  const totalReceivedAmount =
    session1.closure.rereceivedAmount ||
    0 + session2.closure.rereceivedAmount ||
    0;
  const totalRecordsAmount =
    session1.closure.totalRecordsAmount ||
    0 + session2.closure.totalRecordsAmount ||
    0;

  const diff = totalRecordsAmount - dinheiro;

  return (
    <div className="p-8 w-full flex items-center justify-center">
      <Card className="flex-1 mb-4 w-full">
        <div className="font-semibold text-lg mb-4">Fechamento total</div>
        <div className="max-w-[500px] w-full flex items-center justify-between">
          <div className="font-semibold text-lg mb-4">
            Informações automatica:
            <div>
              <div className="max-w-[300px] mt-2 flex items-center justify-between w-full mx-auto">
                <span className="font-medium">Inicial</span>
                <InputNumber
                  value={totalInitialAmount}
                  disabled
                  className="w-full"
                />
              </div>
              <div className="max-w-[300px] mt-2 flex items-center justify-between w-full">
                <span className="font-medium">Recebido</span>
                <InputNumber
                  value={totalReceivedAmount}
                  disabled
                  className="w-full"
                />
              </div>
              <div className="max-w-[300px] mt-2 flex items-center justify-between w-full">
                <span className="font-medium">Total da fita</span>
                <InputNumber
                  value={totalRecordsAmount}
                  disabled
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="font-semibold text-lg mb-4">
            Recolhimento:
            <div>
              <div className="max-w-[300px] mt-2 flex items-center justify-between w-full">
                <span className="font-medium">Cartão</span>
                <InputNumber value={cartao} disabled className="w-full" />
              </div>
              <div className="max-w-[300px] mt-2 flex items-center justify-between w-full">
                <span className="font-medium">Cheque</span>
                <InputNumber value={cheque} disabled className="w-full" />
              </div>
              <div className="max-w-[300px] mt-2 flex items-center justify-between w-full">
                <span className="font-medium">Dinheiro</span>
                <InputNumber value={dinheiro} disabled className="w-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[200px] mt-2 flex items-center justify-between w-full font-semibold text-lg">
          <span className="font-medium">Diferença</span>
          <InputNumber value={diff} disabled className="w-full" />
        </div>
      </Card>
    </div>
  );
}
