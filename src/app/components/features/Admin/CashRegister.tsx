/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CashRegister.tsx

"use client";

import {
  Typography,
  Button,
  Row,
  Table,
  Tag,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  notification,
} from "antd";

import { EllipsisOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/app/actions/createSession";
import dayjs from "dayjs";

interface Props {
  cashRegister: any;
  sessions: any[];
}

export function CashRegister({ cashRegister }: Props) {
  const [openCreateSessionModal, setOpenCreateSessionModal] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  if (!cashRegister) {
    return (
      <Typography.Paragraph>
        Você não tem nenhum caixa atribuído.
      </Typography.Paragraph>
    );
  }

  console.log(cashRegister);

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
      title: "Fechamento",
      dataIndex: "fechamento",
      key: "fechamento",
    },
    {
      title: "",
      key: "action",
      width: "100px",
      render: (text: any, record: any) => (
        <Button onClick={() => handleAction(record)}>
          <EllipsisOutlined />
        </Button>
      ),
    },
  ];

  // Prepare the data source for the table
  const dataSource = sessions.map((sess: any) => ({
    key: sess.id,
    data: new Date(sess.openDate).toLocaleString(),
    caixa: cashRegister.name,
    fechamento: sess.closeDate ? (
      <Tag>{`Fechado: R$${sess.closure.totalRecordsAmount}`}</Tag>
    ) : (
      <Tag color="green">Aberto</Tag>
    ),
  }));

  // Handle action button click
  const handleAction = (record: any) => {
    // Navigate to session details
    router.push(`/cash-registers/${cashRegister.id}/sessions/${record.key}`);
  };

  // Handle form submission
  const handleCreateSession = async () => {
    try {
      // Validate the form fields
      const values = await form.validateFields();
      // Call the createSession function with form data
      await createSession({
        openAmount: values.openAmount,
        openDate: values.openDate.toDate(), // Convert to JavaScript Date
      });
      // Show success message
      api.success({ message: "Sessão criada com sucesso!" });
      // Close the modal
      setOpenCreateSessionModal(false);
      // Reset the form
      form.resetFields();
      // Refresh the page or update the sessions list
      router.refresh();
    } catch (error: any) {
      console.error("Error creating session:", error);
      api.error({ message: "Erro ao criar a sessão." });
    }
  };

  // Handle "Abrir caixa" button click
  const handleOpenModal = () => {
    if (isSessionOpen) {
      api.warning({ message: "Você já possui uma sessão aberta." });
      return;
    }
    setOpenCreateSessionModal(true);
  };

  return (
    <>
      {contextHolder}
      <Row justify="center" className="p-12">
        <div className="max-w-7xl w-full pt-7">
          <div className="flex items-start justify-between">
            <div className="w-28" />
            <div className="text-center">
              <Typography.Title level={3}>Caixas Anteriores</Typography.Title>
              <Typography.Text type="secondary">
                Clique sobre o caixa que deseja consultar.
              </Typography.Text>
            </div>
            <Button onClick={handleOpenModal} type="primary">
              Abrir caixa
            </Button>
          </div>
          <Table className="mt-8" columns={columns} dataSource={dataSource} />
        </div>
      </Row>
      {/* Create Session Modal */}
      <Modal
        title="Criar Nova Sessão"
        open={openCreateSessionModal}
        onOk={handleCreateSession}
        onCancel={() => setOpenCreateSessionModal(false)}
        okText="Criar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" name="create_session_form">
          <Form.Item
            name="openAmount"
            label="Valor Inicial"
            rules={[
              { required: true, message: "Por favor, insira o valor inicial" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              prefix="R$ "
              decimalSeparator=","
              step={0.01}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="openDate"
            label="Data de Abertura"
            rules={[
              {
                required: true,
                message: "Por favor, selecione a data de abertura",
              },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker
              format="DD/MM/YYYY HH:mm"
              showTime={{ format: "HH:mm" }}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
