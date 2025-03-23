"use client";

import { createRecord } from "@/app/actions/createRecord";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LayoutCCAA } from "../../Layout";
import { ClosingSession } from "./ClosingSession";

export function Session({ session }: { session: any }) {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [openCreateRecordModal, setOpenCreateRecordModal] = useState(false);
  const router = useRouter();

  // Reference for the closing section
  const closingSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToClosing = () => {
    if (closingSectionRef.current) {
      closingSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  function getTagColor(action: string) {
    if (
      action === "EXE" ||
      action === "EXS" ||
      action === "EXR" ||
      action === "PB" ||
      action === "PD" ||
      action === "PP"
    ) {
      return "red";
    }
    if (action === "RL") {
      return "blue";
    }
    if (action === "Abertura") {
      return "green";
    }
    return "default";
  }

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
      render: (text: any, record: any) => (
        <Tag color={getTagColor(record.action)} key={text}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      render: (text: any, record: any) => (
        <span
          className={`${
            record.action === "EXE" ||
            record.action === "EXS" ||
            record.action === "EXR"
              ? "line-through"
              : ""
          }`}
        >
          {text}
        </span>
      ),
    },
  ];

  const dataSource = session.records?.map((record: any) => ({
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

  const handleCreateRecord = async () => {
    try {
      // Validate the form fields
      const values = await form.validateFields();

      // Call the createRecord function with form data
      await createRecord({
        code: values.code,
        action: values.action,
        value: values.value,
        sessionId: session.id,
      });

      // Show success message
      api.success({ message: "Lançamento criado com sucesso!" });

      // Close the modal
      setOpenCreateRecordModal(false);

      // Reset the form
      form.resetFields();

      // Refresh the page or update the records list
      router.refresh();
    } catch (error: any) {
      console.error("Error creating record:", error);
      api.error({ message: "Erro ao criar o lançamento. Tente novamente." });
    }
  };

  return (
    <LayoutCCAA>
      <div className="flex h-full">
        {contextHolder}
        {/* Left Sidebar */}
        <div className="w-64 bg-neutral-100 border-r border-neutral-300 p-6 shrink-0">
          <h2 className="text-lg font-bold">Lançamentos</h2>
          <div className="space-y-4 text-neutral-500 text-base mt-8">
            <p>PP - Pagamento Parcela</p>
            <p>PB - Pagamento Livros</p>
            <p>PD - Pagamento Diverso</p>
            <p>RP - Recebimento de Parcela</p>
            <p>RB - Recebimento Livros</p>
            <p>RD - Recebimento Diverso</p>
            <p>RL - Recolhimento</p>
            <p>EXE - Extorno Entrada </p>
            <p>EXS - Extorno Saída</p>
            <p>EXR - Extorno Recolhimento</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="min-w-[100vh]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <Typography.Title level={3}>
                  Caixa registradora
                </Typography.Title>
                <Typography.Text type="secondary">
                  {new Date(session.openDate).toLocaleString()}
                </Typography.Text>
              </div>
              <div className="flex gap-4">
                <Button onClick={handleScrollToClosing} type="default">
                  Fechar caixa
                </Button>
                <Button
                  onClick={() => setOpenCreateRecordModal(true)}
                  type="primary"
                >
                  Novo Lançamento
                </Button>
              </div>
            </div>

            <Table className="mb-8" columns={columns} dataSource={dataSource} />

            <div ref={closingSectionRef}>
              <ClosingSession session={session} />
            </div>
          </div>
        </div>
      </div>

      {/* Create Session Modal */}
      <Modal
        title="Criar Novo Lançamento"
        open={openCreateRecordModal}
        onOk={handleCreateRecord}
        onCancel={() => setOpenCreateRecordModal(false)}
        okText="Criar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" name="create_record_form">
          <Form.Item
            name="code"
            label="Código do Aluno"
            rules={[{ required: true, message: "Por favor, insira o código." }]}
          >
            <Input placeholder="Insira o código do aluno" />
          </Form.Item>
          <Form.Item
            name="action"
            label="Ação"
            rules={[
              { required: true, message: "Por favor, selecione a ação." },
            ]}
          >
            <Select placeholder="Selecione a ação">
              <Select.Option value="PP">PP</Select.Option>
              <Select.Option value="PB">PB</Select.Option>
              <Select.Option value="PD">PD</Select.Option>
              <Select.Option value="RB">RP</Select.Option>
              <Select.Option value="RB">RB</Select.Option>
              <Select.Option value="RD">RD</Select.Option>
              <Select.Option value="RL">RL</Select.Option>
              <Select.Option value="EXE">EXE</Select.Option>
              <Select.Option value="EXS">EXS</Select.Option>
              <Select.Option value="EXR">EXR</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="value"
            label="Valor"
            rules={[{ required: true, message: "Por favor, insira o valor." }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              prefix="R$ "
              decimalSeparator=","
              step={0.01}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </LayoutCCAA>
  );
}
