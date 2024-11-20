import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Para os ícones

const DicasScreen: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dicas para Economizar Energia</Text>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Dicas Gerais</Text>
        <Text style={styles.dica}>1. Desligue os aparelhos eletrônicos quando não estiverem em uso.</Text>
        <Text style={styles.dica}>2. Use lâmpadas LED, que consomem menos energia.</Text>
        <Text style={styles.dica}>3. Evite deixar equipamentos em modo stand-by, como TVs e computadores.</Text>
        <Text style={styles.dica}>4. Aproveite a luz natural durante o dia para reduzir o uso de iluminação artificial.</Text>
        <Text style={styles.dica}>5. Verifique o isolamento térmico da sua casa para reduzir o consumo de energia com ar condicionado ou aquecedores.</Text>
        <Text style={styles.dica}>6. Prefira usar eletrodomésticos como a geladeira e o micro-ondas apenas quando necessário e com a carga completa.</Text>

        {/* Seção de Dispositivos Eficientes */}
        <Text style={styles.sectionTitle}>Dispositivos Eficientes</Text>
        <Text style={styles.dica}>1. Ar-condicionado Inverter: consome menos energia ao ajustar automaticamente a temperatura.</Text>
        <Text style={styles.dica}>2. Ventiladores de baixo consumo: mais eficientes do que aparelhos de ar condicionado em dias mais frescos.</Text>
        <Text style={styles.dica}>3. Eletrodomésticos com selo Procel A: garantem menor consumo de energia.</Text>
        <Text style={styles.dica}>4. Fornos elétricos de convecção: cozinham de maneira mais eficiente, utilizando menos energia.</Text>
        <Text style={styles.dica}>5. Máquinas de lavar roupa com tecnologia de baixo consumo de água e energia.</Text>
        <Text style={styles.dica}>6. Geladeiras e freezers com classe energética A+++ possuem ótimo desempenho energético.</Text>
      </ScrollView>

      {/* Barra inferior com os botões de navegação */}
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
      </View>
    </View>
  );
};

// Estilos para a tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  content: {
    marginTop: 10,
  },
  dica: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
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

export default DicasScreen;
