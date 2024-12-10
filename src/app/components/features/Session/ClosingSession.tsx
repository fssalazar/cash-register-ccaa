/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { closeSession } from "@/app/actions/closingSession";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Layout,
  Row,
  Typography,
  Col,
  notification,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export function ClosingSession({ session }: { session: any }) {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const router = useRouter();

  function getTotalReceived() {
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

  function getTotalCollectedMoney() {
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

  const onValuesChange = (changedValues: any, allValues: any) => {
    const denominations = [
      { field: "hundred", multiplier: 100 },
      { field: "fifty", multiplier: 50 },
      { field: "twenty", multiplier: 20 },
      { field: "ten", multiplier: 10 },
      { field: "five", multiplier: 5 },
      { field: "two", multiplier: 2 },
      { field: "one", multiplier: 1 },
      { field: "fiftyCent", multiplier: 0.5 },
      { field: "twentyFiveCent", multiplier: 0.25 },
      { field: "tenCent", multiplier: 0.1 },
      { field: "fiveCent", multiplier: 0.05 },
    ];

    const total = denominations.reduce((sum, { field, multiplier }) => {
      const value = allValues[field] || 0;
      return sum + value * multiplier;
    }, 0);

    form.setFieldsValue({
      total: total.toFixed(2),
      difference:
        total -
        (session.openAmount + getTotalReceived() - getTotalCollectedMoney()),
    });
  };

  useEffect(() => {
    console.log("q");
    form.setFieldsValue({
      totalTape:
        session.openAmount + getTotalReceived() - getTotalCollectedMoney(),
      initial: session.openAmount || 0,
      received: getTotalReceived(),
      collected: getTotalCollectedMoney(),
      difference: 0,
    });
  }, [form, session.records, session]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Prepare data for closing the session
      const closureData = {
        initialAmount: Number(values.initial ?? 0),
        rereceivedAmount: Number(values.received ?? 0),
        totalRecordsAmount: Number(values.totalTape ?? 0),
        receivedAmountByCard: Number(values.card ?? 0),
        receivedAmountByCheck: Number(values.check ?? 0),
        receivedAmountByMoney: Number(values.money ?? 0),
      };

      const billsData = {
        hundred: Number(values.hundred || 0),
        fifty: Number(values.fifty || 0),
        twenty: Number(values.twenty || 0),
        ten: Number(values.ten || 0),
        five: Number(values.five || 0),
        two: Number(values.two || 0),
        one: Number(values.one || 0),
        fiftyCent: Number(values.fiftyCent || 0),
        twentyFiveCent: Number(values.twentyFiveCent || 0),
        tenCent: Number(values.tenCent || 0),
        fiveCent: Number(values.fiveCent || 0),
        total: Number(values.total || 0),
      };

      await closeSession({
        sessionId: session.id,
        closure: closureData,
        bills: billsData,
      });

      // Notify the user of success
      api.success({ message: "Sessão fechada com sucesso!" });

      // Redirect to cash register page
      router.push(`/`);
    } catch (error: any) {
      console.error("Error closing session:", error);
      api.error({ message: "Erro ao fechar a sessão. Tente novamente." });
    }
  };

  return (
    <Layout className="h-screen w-screen">
      {contextHolder}
      <Layout.Content className="w-full h-full p-4 mt-10">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={onValuesChange}
          onFinish={handleSubmit}
        >
          <Row justify={"center"} align="stretch" className="h-full gap-6">
            {/* Left Card: Contagem dinheiro */}
            <Card className="w-[40%]">
              <Typography.Title level={5}>Contagem dinheiro</Typography.Title>
              <Typography.Text type="danger">
                Atenção: Essa é uma ação irreversível.
              </Typography.Text>
              <div className="w-full flex items-center">
                <Row gutter={[16, 16]} className="mt-4">
                  {[
                    { label: "100", field: "hundred" },
                    { label: "50", field: "fifty" },
                    { label: "20", field: "twenty" },
                    { label: "10", field: "ten" },
                    { label: "05", field: "five" },
                    { label: "02", field: "two" },
                  ].map(({ label, field }) => (
                    <React.Fragment key={field}>
                      <Col span={12}>
                        <Form.Item>
                          <Typography.Text>{label}</Typography.Text>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name={field}>
                          <InputNumber
                            min={0}
                            step={1}
                            type="number"
                            placeholder="Qtd"
                            className="w-full"
                          />
                        </Form.Item>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
                <Row gutter={[16, 16]} className="mt-4">
                  {[
                    { label: "01", field: "one" },
                    { label: "0,50", field: "fiftyCent" },
                    { label: "0,25", field: "twentyFiveCent" },
                    { label: "0,10", field: "tenCent" },
                    { label: "0,05", field: "fiveCent" },
                    { label: "Total", field: "total", disabled: true },
                  ].map(({ label, field, disabled }) => (
                    <React.Fragment key={field}>
                      <Col span={12}>
                        <Form.Item>
                          <Typography.Text>{label}</Typography.Text>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name={field}>
                          <InputNumber
                            type="number"
                            min={0}
                            step={1}
                            placeholder={label === "Total" ? "R$" : "Qtd"}
                            className="w-full"
                            disabled={disabled}
                          />
                        </Form.Item>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
              </div>
              {/* <Button type="default">Valores de ontem</Button> */}
            </Card>

            {/* Right Card: Fechar Caixa */}
            <Card className="w-[40%]">
              <Typography.Title level={5}>Fechar Caixa</Typography.Title>
              <Typography.Text type="danger">
                Atenção: Essa é uma ação irreversível.
              </Typography.Text>
              <div className="w-full flex items-start gap-6">
                <div>
                  <Form.Item className="mt-4">
                    <Typography.Text strong>
                      Informação automática:
                    </Typography.Text>
                  </Form.Item>
                  {[
                    { label: "Inicial", field: "initial" },
                    { label: "Recebido", field: "received" },
                    { label: "Recolhido", field: "collected" },
                    { label: "Total fita", field: "totalTape" },
                  ].map(({ label, field }) => (
                    <Form.Item key={field} name={field} label={label}>
                      <InputNumber
                        min={0}
                        step={0.01}
                        placeholder="R$"
                        className="w-full"
                        disabled={
                          field === "initial" ||
                          field === "totalTape" ||
                          field === "received" ||
                          field === "collected"
                        }
                      />
                    </Form.Item>
                  ))}
                </div>
                <div>
                  <Form.Item>
                    <Typography.Text strong>Recolhimento:</Typography.Text>
                  </Form.Item>
                  {[
                    { label: "Cartão", field: "card" },
                    { label: "Cheque", field: "check" },
                    { label: "Dinheiro", field: "money" },
                  ].map(({ label, field }) => (
                    <Form.Item key={field} name={field} label={label}>
                      <InputNumber
                        min={0}
                        step={0.01}
                        placeholder="R$"
                        className="w-full"
                        disabled={field === "difference"}
                      />
                    </Form.Item>
                  ))}
                </div>
                <div>
                  <Form.Item>
                    <Typography.Text strong>Diferença:</Typography.Text>
                  </Form.Item>
                  <Form.Item name="difference">
                    <InputNumber
                      min={0}
                      step={0.01}
                      placeholder="R$"
                      className="w-full"
                      disabled
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>
          </Row>
          <Row justify="center" className="mt-8">
            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </Row>
        </Form>
      </Layout.Content>
    </Layout>
  );
}
