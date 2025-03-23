/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { closeSession } from "@/app/actions/closingSession";
import { getTotalCollectedMoney, getTotalReceived } from "@/utils";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Row,
  Typography,
  notification,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface BillConfig {
  label: string;
  field: string;
  value: number;
}

export function ClosingSession({ session }: { session: any }) {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const router = useRouter();

  const onValuesChange = (changedValues: any, allValues: any) => {
    const denominations = [
      { field: "twoHundred", multiplier: 100 },
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
      total: (Math.round(total * 100) / 100).toFixed(2),
      difference: (
        Math.round(
          total * 100 -
            (session.openAmount * 100 +
              parseFloat(getTotalReceived(session)) * 100 -
              parseFloat(getTotalCollectedMoney(session)) * 100)
        ) / 100
      ).toFixed(2),
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      totalTape: (
        Math.round(
          (session.openAmount +
            parseFloat(getTotalReceived(session)) -
            parseFloat(getTotalCollectedMoney(session))) *
            100
        ) / 100
      ).toFixed(2),
      initial: session.openAmount || 0,
      received: parseFloat(getTotalReceived(session)),
      collected: parseFloat(getTotalCollectedMoney(session)),
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
        twoHundred: Number(values.twoHundred || 0),
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

  const handleAmountChange = (
    value: number | null,
    billValue: number,
    field: string
  ) => {
    if (value === null) {
      form.setFieldValue(field, 0);
      return;
    }

    // Convert to cents to avoid floating point precision issues
    const amountInCents = Math.round(value * 100);
    const billValueInCents = Math.round(billValue * 100);

    // Calculate quantity by dividing amount by bill value
    const quantity = Math.round(amountInCents / billValueInCents);
    form.setFieldValue(field, quantity);

    // Trigger the total calculation
    onValuesChange({}, form.getFieldsValue());
  };

  const billConfigs: BillConfig[] = [
    { label: "200", field: "twoHundred", value: 200 },
    { label: "100", field: "hundred", value: 100 },
    { label: "50", field: "fifty", value: 50 },
    { label: "20", field: "twenty", value: 20 },
    { label: "10", field: "ten", value: 10 },
    { label: "05", field: "five", value: 5 },
    { label: "02", field: "two", value: 2 },
    { label: "01", field: "one", value: 1 },
    { label: "0,50", field: "fiftyCent", value: 0.5 },
    { label: "0,25", field: "twentyFiveCent", value: 0.25 },
    { label: "0,10", field: "tenCent", value: 0.1 },
    { label: "0,05", field: "fiveCent", value: 0.05 },
  ];

  return (
    <div className="w-full h-full p-4">
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onValuesChange={onValuesChange}
        onFinish={handleSubmit}
      >
        <div className="flex gap-4 items-stretch">
          {/* Left Card: Contagem dinheiro */}
          <Card className="w-full">
            <Typography.Title level={5}>Contagem dinheiro</Typography.Title>
            <Typography.Text type="danger">
              Atenção: Essa é uma ação irreversível.
            </Typography.Text>
            <div className="grid grid-cols-2 gap-8 mt-4">
              {/* First Column */}
              <div>
                {billConfigs.slice(0, 6).map(({ label, field, value }) => (
                  <div key={field} className="mb-4">
                    <Typography.Text strong>R$ {label}</Typography.Text>
                    <div className="space-y-2 space-x-1">
                      <Form.Item name={`amount_${field}`} noStyle>
                        <InputNumber
                          min={0}
                          step={value}
                          placeholder="Valor"
                          className="w-full"
                          prefix="R$ "
                          onChange={(val) =>
                            handleAmountChange(val, value, field)
                          }
                        />
                      </Form.Item>
                      <Form.Item name={field} noStyle>
                        <InputNumber
                          min={0}
                          disabled
                          placeholder="Qtd"
                          className="w-full"
                        />
                      </Form.Item>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Column */}
              <div>
                {billConfigs.slice(6).map(({ label, field, value }) => (
                  <div key={field} className="mb-4">
                    <Typography.Text strong>R$ {label}</Typography.Text>
                    <div className="space-y-2 space-x-1">
                      <Form.Item name={`amount_${field}`} noStyle>
                        <InputNumber
                          min={0}
                          step={value}
                          placeholder="Valor"
                          className="w-full"
                          prefix="R$ "
                          onChange={(val) =>
                            handleAmountChange(val, value, field)
                          }
                        />
                      </Form.Item>
                      <Form.Item name={field} noStyle>
                        <InputNumber
                          min={0}
                          disabled
                          placeholder="Qtd"
                          className="w-full"
                        />
                      </Form.Item>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="mt-8 space-x-1">
                  <Typography.Text strong>Total</Typography.Text>
                  <Form.Item name="total" noStyle>
                    <InputNumber
                      disabled
                      className="w-full"
                      prefix="R$ "
                      decimalSeparator=","
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Card: Fechar Caixa */}
          <Card className="w-full">
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
                      prefix="R$ "
                      decimalSeparator=","
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
                      className="w-full"
                      disabled={field === "difference"}
                      prefix="R$ "
                      decimalSeparator=","
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
                    prefix="R$ "
                    decimalSeparator=","
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>
        <Row justify="center" className="mt-8">
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>
        </Row>
      </Form>
    </div>
  );
}
