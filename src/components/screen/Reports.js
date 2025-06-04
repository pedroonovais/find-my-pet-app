import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function DenunciaScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [tituloCustomizado, setTituloCustomizado] = useState('');
  const [descricao, setDescricao] = useState('');
  const [selecionados, setSelecionados] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const categorias = [
    { nome: 'Acidente', icone: 'car-crash' },
    { nome: 'Animal perdido', icone: 'pets' },
    { nome: 'Maus-tratos', icone: 'report-problem' },
    { nome: 'Animal doente', icone: 'healing' },
    { nome: 'Outro', icone: 'add-circle-outline' },
  ];

  const toggleSelecionado = (categoria) => {
    if (selecionados.includes(categoria)) {
      setSelecionados(selecionados.filter((item) => item !== categoria));
    } else {
      setSelecionados([...selecionados, categoria]);
    }
  };

  const enviarReports = () => {
    if (selecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma denúncia.');
      return;
    }
    setEnviado(true);
  };

  const enviarCustomReport = () => {
    if (tituloCustomizado.trim() === '') {
      Alert.alert('Título obrigatório', 'Digite o título da denúncia.');
      return;
    }
    setSelecionados([...selecionados, tituloCustomizado]);
    setModalVisible(false);
    setTituloCustomizado('');
    setDescricao('');
  };

  const voltarParaHome = () => {
    navigation.goBack();
  };

  const novoReport = () => {
    setSelecionados([]);
    setEnviado(false);
    setTituloCustomizado('');
    setDescricao('');
  };

  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.fundo}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={voltarParaHome}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloPrincipal}>Seu report faz a diferença</Text>
          <Text style={styles.tituloSecundario}>Ajude a proteger os animais!</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {!enviado ? (
            categorias.map((categoria, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.botaoCategoria,
                  selecionados.includes(categoria.nome) && styles.botaoSelecionado,
                ]}
                onPress={() =>
                  categoria.nome === 'Outro'
                    ? setModalVisible(true)
                    : toggleSelecionado(categoria.nome)
                }
              >
                <Icon
                  name={categoria.icone}
                  size={24}
                  color={selecionados.includes(categoria.nome) ? '#fff' : '#4f4f4f'}
                  style={styles.icone}
                />
                <Text
                  style={[
                    styles.textoBotao,
                    selecionados.includes(categoria.nome) && styles.textoSelecionado,
                  ]}
                >
                  {categoria.nome}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            selecionados.map((item, idx) => (
              <View
                key={idx}
                style={[styles.botaoCategoria, styles.botaoSelecionado]}
              >
                <Text style={[styles.textoBotao, styles.textoSelecionado]}>
                  {item}
                </Text>
              </View>
            ))
          )}

          {!enviado ? (
            <TouchableOpacity style={styles.botaoEnviar} onPress={enviarReports}>
              <Text style={styles.textoEnviar}>Enviar Denúncia</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.confirmacao}>Report enviado com sucesso!</Text>
              <TouchableOpacity style={styles.botaoNovoReport} onPress={novoReport}>
                <Text style={styles.textoNovoReport}>Fazer Novo Report</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Report personalizado</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={tituloCustomizado}
              onChangeText={setTituloCustomizado}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição (opcional)"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.botaoModal, { backgroundColor: '#2ecc71' }]}
                onPress={enviarCustomReport}
              >
                <Text style={styles.textoModal}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoModal, { backgroundColor: '#e74c3c' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoModal}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  tituloContainer: {
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f1f1',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 6,
    fontFamily: 'System',
  },
  tituloSecundario: {
    fontSize: 20,
    fontWeight: '500',
    color: '#d1d1d1',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  scrollContainer: {
    paddingBottom: 20,
  },
  botaoCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffee',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    elevation: 2,
  },
  botaoSelecionado: {
    backgroundColor: '#3498db',
  },
  icone: {
    marginRight: 12,
  },
  textoBotao: {
    fontSize: 18,
    color: '#333',
  },
  textoSelecionado: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoEnviar: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  textoEnviar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmacao: {
    marginTop: 15,
    fontSize: 16,
    color: '#2ecc71',
    textAlign: 'center',
  },
  botaoNovoReport: {
    backgroundColor: '#2980b9',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  textoNovoReport: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#34495e88',
    padding: 8,
    borderRadius: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoModal: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
