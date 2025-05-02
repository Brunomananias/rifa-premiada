/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import './MaiorMenorCota.css'
import apiClient from '../services/apiClient';
import AdminLayout from './AdminLayout';
import { Button } from '@mui/material';

const MaiorMenorCotaPage = () => {
  const [rifa, setRifa] = useState<string>(''); // Armazena a rifa
  const [dataInicio, setDataInicio] = useState<string>(''); // Armazena a data de início
  const [dataFim, setDataFim] = useState<string>(''); // Armazena a data de fim
  const [rifas, setRifas] = useState<any[]>([]); // Lista de rifas
  const [idRaffles, setIdRaffles] = useState<number>();
  const [resultados, setResultados] = useState<{ maiorCota: number; menorCota: number } | null>(null); // Resultados

  useEffect(() => {
    // Carregar as rifas do sistema
    const fetchRifas = async () => {
      const response = await apiClient.get('api/raffles'); // Endpoint para listar as rifas
      console.log(response.data)
      setRifas(response.data); // Presumindo que a resposta seja um array de rifas
    };

    fetchRifas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inicio = new Date(dataInicio).toISOString();  // Formata a data de início
    const fim = new Date(dataFim).toISOString();        // Formata a data de fim

    const response = await apiClient.get('api/NumbersSold/filtrar-cotas', {
        params: {
          rifa: idRaffles,
          inicio: inicio,
          fim: fim
        }
      });

    if (response) {
      setResultados(response.data); // Atualiza os resultados com a resposta da API
      console.log(response.data);
    } else {
      console.error('Erro ao buscar as cotas');
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h1 style={{ color: "white" }}>Maior e Menor Cota</h1>

        {/* Formulário */}
        <Form
          onSubmit={handleSubmit}
          className="bg-light p-4 rounded shadow-sm"
        >
          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label for="rifa">Selecione a Rifa</Label>
                <Input
                  type="select"
                  id="rifa"
                  value={rifa}
                  onChange={(e) => {
                    setRifa(e.target.value);
                    setIdRaffles(Number(e.target.value));
                  }}
                  required
                >
                  <option value="">Selecione...</option>
                  {rifas.map((rifaOption) => (
                    <option key={rifaOption.id} value={rifaOption.id}>
                      {rifaOption.title}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="dataInicio">Data de Início</Label>
                <Input
                  type="date"
                  id="dataInicio"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="dataFim">Data de Fim</Label>
                <Input
                  type="date"
                  id="dataFim"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Button
            onClick={(e) => handleSubmit(e)} // Passa o evento de submit corretamente
            variant="contained"
            color="primary"
            sx={{ mt: 4 }} // Espaçamento superior
            type="submit" // Especificando que o botão é do tipo submit
          >
            Buscar
          </Button>
        </Form>

        {/* Resultados */}
        {resultados && (
          <div className="mt-5">
            <Card className="custom-card shadow-lg">
              <CardBody>
                <CardTitle tag="h5" className="text-center custom-card-title">
                  Resultado da Busca
                </CardTitle>
                <CardText className="custom-card-text">
                  <strong>Maior Cota:</strong>{" "}
                  {resultados.maiorCota !== undefined
                    ? resultados.maiorCota
                    : "N/A"}
                </CardText>
                <CardText className="custom-card-text">
                  <strong>Menor Cota:</strong>{" "}
                  {resultados.menorCota !== undefined
                    ? resultados.menorCota
                    : "N/A"}
                </CardText>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MaiorMenorCotaPage;
