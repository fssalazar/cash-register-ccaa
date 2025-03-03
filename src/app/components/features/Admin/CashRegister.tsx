/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CashRegister.tsx

"use client";

import { Typography, Button, Row, Table, Tag, notification, Alert } from "antd";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  cashRegisters: any[];
  sessions: any[];
}

export function CashRegister({ cashRegisters, sessions }: Props) {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [selectedSessions, setSelectedSessions] = useState<any[]>([]);

  if (!cashRegisters) {
    return (
      <Typography.Paragraph>
        Você não tem nenhum caixa atribuído.
      </Typography.Paragraph>
    );
  }

  console.log(cashRegisters);

  // Define the columns for the table
  const columns = [
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
    },
    {
      title: "Caixa",
      dataIndex: "caixa",
      key: "caixa",
    },
    {
      title: "Usuário",
      dataIndex: "operador",
      key: "operador",
    },
    {
      title: "Fechamento",
      dataIndex: "fechamento",
      key: "fechamento",
    },
  ];

  // Prepare the data source for the table
  const dataSource = sessions.map((sess: any) => {
    const cashRegister = cashRegisters.find(
      (cr) => cr.id === sess.cashRegisterId
    );
    return {
      key: sess.id,
      data: new Date(sess.openDate).toLocaleString(),
      caixa: cashRegister?.name || "N/A",
      operador: cashRegister?.user?.name || "N/A",
      fechamento: sess.closeDate ? (
        <Tag>{`Fechado: R$${sess.closure.totalRecordsAmount}`}</Tag>
      ) : (
        <Tag color="green">Aberto</Tag>
      ),
      cashRegisterId: sess.cashRegisterId,
      sessionId: sess.id,
    };
  });

  const handleCompareClick = () => {
    if (selectedSessions.length > 2) {
      api.warning({ message: "Selecione exatamente 2 sessões para comparar." });
      return;
    }

    const [session1, session2] = selectedSessions;
    if (session2) {
      router.push(
        `/admin/sessions?session1=${session1.sessionId}&cashRegister1=${session1.cashRegisterId}&session2=${session2.sessionId}&cashRegister2=${session2.cashRegisterId}`
      );
    } else {
      router.push(
        `/admin/sessions?session1=${session1.sessionId}&cashRegister1=${session1.cashRegisterId}`
      );
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedSessions.map((session) => session.key),
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      if (selectedRows.length > 2) {
        api.warning({ message: "Você pode selecionar no máximo 2 sessões." });
        return;
      }
      setSelectedSessions(selectedRows);
    },
  };

  return (
    <>
      {contextHolder}
      <Row justify="center" className="p-12">
        <div className="max-w-7xl w-full pt-7">
          <div className="flex items-start justify-between">
            <div className="w-28" />
            <div className="text-center">
              <Typography.Title level={3}>Caixas anteriores</Typography.Title>
              <Typography.Text type="secondary">
                Selecione até 2 sessões para comparar.
              </Typography.Text>
            </div>
            <Button
              onClick={handleCompareClick}
              type="primary"
              disabled={
                selectedSessions.length === 0 && selectedSessions.length > 2
              }
            >
              Visualizar Caixas
            </Button>
          </div>

          <Table
            className="mt-8 [&_.ant-table-row-selected>td]:!bg-blue-50"
            columns={columns}
            dataSource={dataSource}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} sessões`,
            }}
          />

          {/* Selection Status */}
          <div className="mt-4">
            {selectedSessions.length === 0 && (
              <Alert
                type="info"
                message="Selecione uma ou duas sessões para comparar"
                showIcon
              />
            )}
            {selectedSessions.length === 1 && (
              <Alert
                type="warning"
                message="Selecione mais uma sessão para poder comparar"
                showIcon
              />
            )}
            {selectedSessions.length === 2 && (
              <Alert
                type="success"
                message="Clique em 'Visualizar Caixas' para comparar as sessões selecionadas"
                showIcon
              />
            )}
          </div>
        </div>
      </Row>
    </>
  );
}
