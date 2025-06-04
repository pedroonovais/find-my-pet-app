import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const alertasIniciais = [
  {
    id: '1',
    titulo: 'Filhote precisa de abrigo',
    local: 'Zona Norte, SP',
    data: '01/06/2025',
    descricao: 'Um filhote foi encontrado tremendo de frio após uma tempestade. Precisa de abrigo urgente.',
  },
  {
    id: '2',
    titulo: 'Cão abandonado após enchente',
    local: 'Vila Mariana, SP',
    data: '30/05/2025',
    descricao: 'Cão de porte médio avistado sozinho próximo a área alagada. Sinais de fome e sede.',
  },
  {
    id: '3',
    titulo: 'Gatinho preso em árvore',
    local: 'Ipiranga, SP',
    data: '28/05/2025',
    descricao: 'Gatinho miando há horas em cima de uma árvore alta. Necessário auxílio para resgate.',
  },
];

export default function AlertasScreen() {
  const navigation = useNavigation();
  const [alertas, setAlertas] = useState(alertasIniciais);
  const [alertaSelecionado, setAlertaSelecionado] = useState(null);
  const [modalAlertaVisible, setModalAlertaVisible] = useState(false);
  const [modalNovoVisible, setModalNovoVisible] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoLocal, setNovoLocal] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');

  const abrirModalAlerta = (item) => {
    setAlertaSelecionado(item);
    setModalAlertaVisible(true);
  };

  const fecharModalAlerta = () => {
    setAlertaSelecionado(null);
    setModalAlertaVisible(false);
  };

  const adicionarAlerta = () => {
    if (novoTitulo.trim() && novoLocal.trim() && novaDescricao.trim()) {
      const novo = {
        id: (alertas.length + 1).toString(),
        titulo: novoTitulo.trim(),
        local: novoLocal.trim(),
        data: new Date().toLocaleDateString(),
        descricao: novaDescricao.trim(),
      };
      setAlertas([novo, ...alertas]);
      setModalNovoVisible(false);
      setNovoTitulo('');
      setNovoLocal('');
      setNovaDescricao('');
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  const excluirAlerta = (id) => {
    Alert.alert(
      'Excluir alerta',
      'Tem certeza que deseja excluir este alerta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setAlertas(alertas.filter((item) => item.id !== id));
            if (alertaSelecionado?.id === id) {
              fecharModalAlerta();
            }
          },
        },
      ]
    );
  };

  const renderAlerta = ({ item }) => (
    <TouchableOpacity onPress={() => abrirModalAlerta(item)} style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.texto}>{item.local}</Text>
          <Text style={styles.data}>{item.data}</Text>
        </View>
        <TouchableOpacity onPress={() => excluirAlerta(item.id)} style={styles.botaoLixeira}>
          <Ionicons name="trash-outline" size={24} color="#C62828" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/image.png')} 
      style={styles.container}
      resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonTopo}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloPrincipal}>Ajude e proteja os animais</Text>
          <Text style={styles.tituloSecundario}>Deixe seu alerta</Text>
        </View>
      </View>

      <FlatList
        data={alertas}
        renderItem={renderAlerta}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
      <Modal visible={modalAlertaVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContentClaro}>
            <ScrollView>
              <Text style={styles.modalTituloClaro}>{alertaSelecionado?.titulo}</Text>
              <Text style={styles.modalTextoClaro}>
                <Text style={styles.modalNegrito}>Local:</Text> {alertaSelecionado?.local}
              </Text>
              <Text style={styles.modalTextoClaro}>
                <Text style={styles.modalNegrito}>Data:</Text> {alertaSelecionado?.data}
              </Text>
              <Text style={styles.modalTextoClaro}>
                <Text style={styles.modalNegrito}>Descrição:</Text> {alertaSelecionado?.descricao}
              </Text>
              <TouchableOpacity onPress={fecharModalAlerta} style={styles.fecharBotao}>
                <Text style={styles.fecharTexto}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal visible={modalNovoVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContentClaro}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTituloClaro}>Novo Alerta</Text>
              <TextInput
                placeholder="Título"
                value={novoTitulo}
                onChangeText={setNovoTitulo}
                style={styles.inputClaro}
              />
              <TextInput
                placeholder="Local"
                value={novoLocal}
                onChangeText={setNovoLocal}
                style={styles.inputClaro}
              />
              <TextInput
                placeholder="Descrição"
                value={novaDescricao}
                onChangeText={setNovaDescricao}
                style={[styles.inputClaro, { height: 80 }]}
                multiline
              />
              <TouchableOpacity onPress={adicionarAlerta} style={styles.adicionarBotao}>
                <Text style={styles.textoBotao}>Enviar Alerta</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalNovoVisible(false)} style={styles.fecharBotao}>
                <Text style={styles.fecharTexto}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.botaoFlutuante} onPress={() => setModalNovoVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topo: {
    paddingTop: 40, 
    paddingLeft: 16,
    backgroundColor: 'transparent',
  },
  backButtonTopo: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  tituloContainer: {
    alignItems: 'center',
  },
  tituloPrincipal: {
    fontSize: 26, 
    fontWeight: '700',
    color: '#fff',
    textShadowColor: '#00000099',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 1,
    textAlign: 'center',
  },
  tituloSecundario: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CCCCCC',
    textShadowColor: '#22222299',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginTop: 6,
    textAlign: 'center',
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  texto: {
    fontSize: 14,
    color: '#666',
  },
  data: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  botaoLixeira: {
    padding: 6,
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContentClaro: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTituloClaro: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  modalTextoClaro: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  modalNegrito: {
    fontWeight: '700',
  },
  fecharBotao: {
    marginTop: 20,
    backgroundColor: '#C62828',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fecharTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  inputClaro: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  adicionarBotao: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  botaoFlutuante: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
