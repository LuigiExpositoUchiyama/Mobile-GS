import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Interface que define a estrutura de um eletrônico
interface Eletronico {
  id: number;
  eletronico: string;
  consumo: number;
  status: boolean;
  gasto: string;
  descricao: string;
  ambiente: string;  // Adicionando o campo ambiente
}

// Interface que define o contexto global de estado
interface ContextoEstadoGlobal {
  eletronicos: Eletronico[];
  adicionarEletronico: (eletronico: Omit<Eletronico, 'id'>) => void;
  editarEletronico: (id: number, novoEletronico: Omit<Eletronico, 'id'>) => void;
  excluirEletronico: (id: number) => void;
}

// Cria o contexto global de estado
const ContextoEstadoGlobal = createContext<ContextoEstadoGlobal>(null!);

// Hook para acessar o contexto global de estado
export const useEstadoGlobal = () => useContext(ContextoEstadoGlobal);

// Componente que fornece o contexto global de estado para seus filhos
export const ProvedorEstadoGlobal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eletronicos, setEletronicos] = useState<Eletronico[]>([]);

  const carregarEletronicos = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/eletronicos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setEletronicos(response.data);
    } catch (error) {
      console.error('Erro ao carregar os eletrônicos:', error);
      alert('Erro ao carregar os eletrônicos. Tente novamente.');
    }
  };

  const adicionarEletronico = async (eletronico: Omit<Eletronico, 'id'>) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/eletronicos', eletronico, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setEletronicos(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar o eletrônico:', error);
      alert('Erro ao adicionar o eletrônico. Tente novamente.');
    }
  };

  const editarEletronico = async (id: number, novoEletronico: Omit<Eletronico, 'id'>) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:3000/eletronicos/${id}`, novoEletronico, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setEletronicos(prev => prev.map(eletronico =>
        eletronico.id === id ? { ...eletronico, ...novoEletronico } : eletronico
      ));
    } catch (error) {
      console.error('Erro ao editar o eletrônico:', error);
      alert('Erro ao editar o eletrônico. Tente novamente.');
    }
  };

  const excluirEletronico = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/eletronicos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setEletronicos(prev => prev.filter(eletronico => eletronico.id !== id));
    } catch (error) {
      console.error('Erro ao excluir o eletrônico:', error);
      alert('Erro ao excluir o eletrônico. Tente novamente.');
    }
  };

  useEffect(() => {
    carregarEletronicos();
  }, []);

  return (
    <ContextoEstadoGlobal.Provider value={{ eletronicos, adicionarEletronico, editarEletronico, excluirEletronico }}>
      {children}
    </ContextoEstadoGlobal.Provider>
  );
};
