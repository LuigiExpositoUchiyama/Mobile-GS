import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Importando o Picker

const EditarScreen: React.FC<any> = ({ route, navigation }) => {
  const { id } = route.params;
  const [eletronico, setEletronico] = useState<any>({
    eletronico: '',
    ambiente: '', // Adicionando estado para o ambiente
  });
  const [originalNome, setOriginalNome] = useState('');

  useEffect(() => {
    const carregarEletronico = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/eletronicos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setEletronico(response.data);
        setOriginalNome(response.data.eletronico);
      } catch (error) {
        console.error('Erro ao carregar o eletrônico:', error);
        alert('Erro ao carregar o eletrônico. Tente novamente.');
      }
    };
    carregarEletronico();
  }, [id]);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    const novoEletronico = {
      eletronico: eletronico.eletronico,
      status: eletronico.status,  // Manter o status original
      consumo: eletronico.consumo, // Manter o consumo original
      gasto: eletronico.gasto,
      descricao: eletronico.descricao,
      ambiente: eletronico.ambiente, // Incluindo o ambiente editado
    };

    try {
      await axios.put(`http://localhost:3000/eletronicos/${id}`, novoEletronico, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Eletrônico editado com sucesso!');
      navigation.goBack(); // Voltar para a tela anterior
    } catch (error) {
      console.error('Erro ao salvar o eletrônico:', error);
      alert('Erro ao salvar o eletrônico. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Eletrônico</Text>

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
        <Picker.Item label="Nenhum" value="" />
        <Picker.Item label="Sala" value="Sala" />
        <Picker.Item label="Cozinha" value="Cozinha" />
        <Picker.Item label="Quarto" value="Quarto" />
        <Picker.Item label="Banheiro" value="Banheiro" />
        <Picker.Item label="Escritório" value="Escritório" />
        <Picker.Item label="Área Externa" value="Área Externa" />
      </Picker>

      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
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
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
});

export default EditarScreen;
