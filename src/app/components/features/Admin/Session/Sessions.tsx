/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, InputNumber, Row, Table, Tag } from "antd";
import React from "react";

interface SessionRecord {
  id: string;
  code: string;
  action: string;
  datetime: Date;
  value: number;
}

interface Bills {
  twoHundred: number;
  hundred: number;
  fifty: number;
  twenty: number;
  ten: number;
  five: number;
  two: number;
  one: number;
  fiftyCent: number;
  twentyFiveCent: number;
  tenCent: number;
  fiveCent: number;
  total: number;
}

interface Closure {
  initialAmount: number;
  rereceivedAmount: number;
  totalRecordsAmount: number;
  receivedAmountByCard: number;
  receivedAmountByCheck: number;
  receivedAmountByMoney: number;
}

interface Session {
  id: string;
  openDate: Date;
  openAmount: number;
  records: SessionRecord[];
  bills?: Bills;
  closure?: Closure;
}

interface CashRegister {
  id: string;
  name: string;
}

interface Props {
  session: Session;
  cashRegister: CashRegister;
}

export function AdminSession({ session, cashRegister }: Props) {
  // Table columns configuration
  const columns = [
    {
      title: "Código do aluno",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Ação",
      dataIndex: "action",
      key: "action",
      render: (text: string) => (
        <Tag color={getTagColor(text)} key={text}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      render: (text: string, record: any) => (
        <span
          className={`${
            ["EXE", "EXS", "EXR"].includes(record.action) ? "line-through" : ""
          }`}
        >
          {text}
        </span>
      ),
    },
  ];

  function getTagColor(action: string) {
    if (["EXE", "EXS", "EXR", "PB", "PD", "PP"].includes(action)) return "red";
    if (action === "RL") return "blue";
    if (action === "Abertura") return "green";
    return "default";
  }

  const dataSource = session.records?.map((record) => ({
    key: record.id,
    code: record.code,
    action: record.action,
    data: new Date(record.datetime).toLocaleString(),
    amount: `R$ ${record.value.toFixed(2).replace(".", ",")}`,
  }));

  const openAmountRow = {
    key: "openAmount",
    code: "Valor inicial",
    action: "Abertura",
    data: new Date(session.openDate).toLocaleString(),
    amount: `R$ ${session.openAmount.toFixed(2).replace(".", ",")}`,
  };

  dataSource?.unshift(openAmountRow);

  return (
    <div className="p-8 w-full">
      <Row gutter={16} className="w-full gap-4">
        {/* Records Table */}
        <Card className="flex-1 mb-4">
          <div className="font-semibold text-lg mb-4">
            Lançamentos {cashRegister.name}
          </div>
          <Table columns={columns} dataSource={dataSource} />
        </Card>

        {session.bills && session.closure ? (
          <>
            {/* Money Count - Only show if session is closed */}
            <Card className="flex-1 mb-4">
              <div className="font-semibold text-lg mb-4">
                Contagem dinheiro
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "200", value: session.bills.twoHundred },
                  { label: "100", value: session.bills.hundred },
                  { label: "50", value: session.bills.fifty },
                  { label: "20", value: session.bills.twenty },
                  { label: "10", value: session.bills.ten },
                  { label: "5", value: session.bills.five },
                  { label: "2", value: session.bills.two },
                  { label: "1", value: session.bills.one },
                  { label: "0,50", value: session.bills.fiftyCent },
                  { label: "0,25", value: session.bills.twentyFiveCent },
                  { label: "0,10", value: session.bills.tenCent },
                  { label: "0,05", value: session.bills.fiveCent },
                  { label: "Total", value: session.bills.total },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="max-w-[200px] mt-2 flex items-center justify-between w-full"
                  >
                    <span className="font-medium">{label}</span>
                    <InputNumber value={value} disabled className="w-full" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Closing Details - Only show if session is closed */}
            <Card className="flex-1 mb-4">
              <div className="font-semibold text-lg mb-4">Fechar Caixa</div>
              <div className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Informação automática:</div>
                  {[
                    { label: "Inicial", value: session.closure.initialAmount },
                    {
                      label: "Recebido",
                      value: session.closure.rereceivedAmount,
                    },
                    {
                      label: "Total fita",
                      value: session.closure.totalRecordsAmount,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="max-w-[200px] mt-2 flex items-center justify-between w-full"
                    >
                      <span className="font-medium">{label}</span>
                      <InputNumber
                        value={value}
                        disabled
                        className="w-full"
                        prefix="R$ "
                        decimalSeparator=","
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="font-medium mb-2">Recolhimento:</div>
                  {[
                    {
                      label: "Cartão",
                      value: session.closure.receivedAmountByCard,
                    },
                    {
                      label: "Cheque",
                      value: session.closure.receivedAmountByCheck,
                    },
                    {
                      label: "Dinheiro",
                      value: session.closure.receivedAmountByMoney,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="max-w-[200px] mt-2 flex items-center justify-between w-full"
                    >
                      <span className="font-medium">{label}</span>
                      <InputNumber
                        value={value}
                        disabled
                        className="w-full"
                        prefix="R$ "
                        decimalSeparator=","
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="flex-1 mb-4">
            <div className="text-neutral-500">
              Esta sessão ainda não foi fechada. Os dados de fechamento estarão
              disponíveis após o fechamento da sessão.
            </div>
          </Card>
        )}
      </Row>
    </div>
  );
}
