import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Para os ícones

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const [eletronicos, setEletronicos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const carregarEletronicos = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/eletronicos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setEletronicos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar os eletrônicos:', error);
      alert('Erro ao carregar os eletrônicos. Tente novamente.');
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEletronicos();

    const focusListener = navigation.addListener('focus', () => {
      carregarEletronicos();
    });

    return () => {
      focusListener();
    };
  }, [navigation]);

  const excluirEletronico = async (id: number) => {
    const token = await AsyncStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:3000/eletronicos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setEletronicos((prev) => prev.filter((eletronico) => eletronico.id !== id));
    } catch (error) {
      console.error('Erro ao excluir o eletrônico:', error);
      alert('Erro ao excluir o eletrônico. Tente novamente.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const organizarPorAmbiente = (eletronicos: any[]) => {
    // Agrupar os eletrônicos por ambiente
    return eletronicos.reduce((acc, eletronico) => {
      const ambiente = eletronico.ambiente || 'Sem Ambiente'; // Caso não tenha ambiente
      if (!acc[ambiente]) {
        acc[ambiente] = [];
      }
      acc[ambiente].push(eletronico);
      return acc;
    }, {});
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.eletronico}</Text>
      <Text style={styles.itemConsumo}>Consumo: {item.consumo} kWh</Text>
      <Text style={styles.itemGasto}>Gasto: {item.gasto}</Text>
      <Text style={styles.itemDescricao}>Descrição: {item.descricao}</Text>
      <Text style={styles.itemStatus}>
        Status: {item.status ? 'Ativo' : 'Inativo'}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editarButton]}
          onPress={() => navigation.navigate('Editar', { id: item.id })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.excluirButton]}
          onPress={() => excluirEletronico(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAmbiente = ({ item }: { item: any }) => {
    return (
      <View style={styles.ambienteContainer}>
        <Text style={styles.ambienteTitle}>{item.ambiente}</Text>
        <FlatList
          data={item.eletronicos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };

  const ambientes = Object.entries(organizarPorAmbiente(eletronicos)).map(
    ([ambiente, eletronicos]) => ({
      ambiente,
      eletronicos,
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Eletrônicos</Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={ambientes}
          renderItem={renderAmbiente}
          keyExtractor={(item) => item.ambiente}
        />
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={24} color="#fff" />
          <Text style={styles.bottomButtonText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate('Dicas')} // Navega para a tela de Dicas
        >
          <Icon name="lightbulb-o" size={24} color="#fff" />
          <Text style={styles.bottomButtonText}>Dicas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate('Adicionar')}
        >
          <Icon name="plus" size={24} color="#fff" />
          <Text style={styles.bottomButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  ambienteContainer: {
    marginBottom: 20,
  },
  ambienteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDescricao: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  itemConsumo: {
    fontSize: 16,
    color: '#777',
  },
  itemGasto: {
    fontSize: 16,
    color: '#777',
  },
  itemStatus: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  editarButton: {
    backgroundColor: '#4CAF50',
  },
  excluirButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Barra transparente
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  bottomButton: {
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default HomeScreen;
