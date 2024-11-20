import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Importando o Picker para seleção

const AdicionarScreen: React.FC<any> = ({ navigation }) => {
  const [eletronico, setEletronico] = useState({
    eletronico: '',
    ambiente: '', // Inicializando como uma string vazia
  });

  const gerarStatusAleatorio = () => {
    return Math.random() < 0.7; // 70% de chance de ser ativo
  };

  const gerarConsumoAleatorio = () => {
    return Math.floor(Math.random() * 1000) + 1; // Consumo entre 1 e 1000
  };

  const handleAdd = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const statusAleatorio = gerarStatusAleatorio();
      const consumoAleatorio = statusAleatorio ? gerarConsumoAleatorio() : 0;

      let mensagemGasto = '';
      let descricao = '';

      if (consumoAleatorio === 0) {
        mensagemGasto = "Este eletrônico não está consumindo energia no momento.";
        descricao =
          "Aproveite para ganhar pontos por economizar energia! Considere manter seus aparelhos desligados ou em stand-by.";
      } else if (consumoAleatorio > 500) {
        mensagemGasto =
          "Seu consumo de energia está elevado. Lembre-se de que você pode perder pontos por gastar muita energia.";
        descricao =
          "Tente usar aparelhos de baixo consumo e desligue-os quando não estiverem em uso.";
      } else {
        mensagemGasto = "Seu consumo de energia está equilibrado.";
        descricao =
          "Seu consumo de energia está em níveis saudáveis. Continue assim para economizar ainda mais!";
      }

      const novoEletronico = {
        eletronico: eletronico.eletronico,
        status: statusAleatorio,
        consumo: consumoAleatorio,
        gasto: mensagemGasto,
        descricao,
        ambiente: eletronico.ambiente, // Incluindo o ambiente
      };

      await axios.post('http://localhost:3000/eletronicos', novoEletronico, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Eletrônico adicionado com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao adicionar o eletrônico:', error);
      alert('Erro ao adicionar o eletrônico. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Eletrônico</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={eletronico.eletronico}
        onChangeText={(text) => setEletronico({ ...eletronico, eletronico: text })}
      />

      {/* Caixa de seleção para o ambiente */}
      <Text style={styles.label}>Selecione o Ambiente</Text>
      <Picker
        selectedValue={eletronico.ambiente}
        style={styles.picker}
        onValueChange={(itemValue) => setEletronico({ ...eletronico, ambiente: itemValue })}
      >
        <Picker.Item label="Nenhum" value="" /> {/* Adicionando a opção Nenhum */}
        <Picker.Item label="Sala" value="Sala" />
        <Picker.Item label="Cozinha" value="Cozinha" />
        <Picker.Item label="Quarto" value="Quarto" />
        <Picker.Item label="Banheiro" value="Banheiro" />
        <Picker.Item label="Escritório" value="Escritório" />
        <Picker.Item label="Área Externa" value="Área Externa" />
      </Picker>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1.5,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  picker: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1.5,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdicionarScreen;
