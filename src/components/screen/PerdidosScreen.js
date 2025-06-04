import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  ImageBackground,
  SafeAreaView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PerdidosScreen() {
  const navigation = useNavigation();

  // Estado inicial com cães e gatos
  const [animaisPerdidos, setAnimaisPerdidos] = useState([
    { nome: 'Bolt', local: 'Praia Central', data: '30/05/2025', tipo: 'Cachorro' },
    { nome: 'Luna', local: 'Rua das Palmeiras', data: '28/05/2025', tipo: 'Gato' },
    { nome: 'Rex', local: 'Av. Brasil', data: '27/05/2025', tipo: 'Cachorro' },
    { nome: 'Mel', local: 'Av. Atlântica', data: '26/05/2025', tipo: 'Gato' },
    { nome: 'Thor', local: 'Praça das Águas', data: '25/05/2025', tipo: 'Cachorro' },
    { nome: 'Pipoca', local: 'Rua das Flores', data: '24/05/2025', tipo: 'Gato' },
  ]);

  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [modalNovoReportVisible, setModalNovoReportVisible] = useState(false);

  // Estados para novo reporte
  const [novoNome, setNovoNome] = useState('');
  const [novoLocal, setNovoLocal] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novoTipo, setNovoTipo] = useState('Cachorro');

  const voltar = () => {
    navigation.goBack();
  };

  const abrirModalDetalhes = (animal) => {
    setAnimalSelecionado(animal);
    setModalDetalhesVisible(true);
  };

  const fecharModalDetalhes = () => {
    setModalDetalhesVisible(false);
    setAnimalSelecionado(null);
  };

  const abrirModalNovoReport = () => {
    // Limpa campos ao abrir
    setNovoNome('');
    setNovoLocal('');
    setNovaData('');
    setNovoTipo('Cachorro');
    setModalNovoReportVisible(true);
  };

  const fecharModalNovoReport = () => {
    setModalNovoReportVisible(false);
  };

  const adicionarNovoReport = () => {
    if (!novoNome.trim() || !novoLocal.trim() || !novaData.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const novoAnimal = {
      nome: novoNome.trim(),
      local: novoLocal.trim(),
      data: novaData.trim(),
      tipo: novoTipo,
    };

    setAnimaisPerdidos([novoAnimal, ...animaisPerdidos]);
    setModalNovoReportVisible(false);
  };

  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={voltar}
          activeOpacity={0.7}
          accessibilityLabel="Botão voltar"
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Animais Perdidos 🐾</Text>
        <Text style={styles.subtitle}>Ajude a encontrar esses amigos</Text>

        {animaisPerdidos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum animal perdido encontrado.</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            accessibilityLabel="Lista de animais perdidos"
          >
            {animaisPerdidos.map((animal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => abrirModalDetalhes(animal)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes do ${animal.tipo} chamado ${animal.nome}`}
              >
                <Text style={styles.animalName}>
                  {animal.tipo === 'Cachorro' ? '🐶' : '🐱'} {animal.nome}
                </Text>
                <Text style={styles.animalInfo}>Local: {animal.local}</Text>
                <Text style={styles.animalInfo}>Data: {animal.data}</Text>
                <View style={styles.buttonWrapper}>
                  <Text style={styles.viewDetails}>Ver detalhes</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Modal Detalhes */}
        <Modal
          transparent
          visible={modalDetalhesVisible}
          animationType="fade"
          onRequestClose={fecharModalDetalhes}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {animalSelecionado?.tipo === 'Cachorro' ? '🐶' : '🐱'} {animalSelecionado?.nome}
              </Text>
              <View style={styles.modalLine} />
              <Text style={styles.modalInfo}>
                Foi visto pela região de{' '}
                <Text style={{ fontWeight: '700' }}>{animalSelecionado?.local}</Text>.
              </Text>
              <Text style={styles.modalInfo}>Perdido em: {animalSelecionado?.data}</Text>
              <Text style={styles.modalInfo}>Contato: (99) 99999-9999</Text>

              <Pressable
                style={styles.secondaryButton}
                onPress={fecharModalDetalhes}
                accessibilityRole="button"
                accessibilityLabel="Fechar detalhes"
              >
                <Text style={styles.secondaryButtonText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Modal Novo Report */}
        <Modal
          transparent
          visible={modalNovoReportVisible}
          animationType="slide"
          onRequestClose={fecharModalNovoReport}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={[styles.modalBox, { maxHeight: '90%' }]}>
              <Text style={styles.modalTitle}>Registrar animal perdido 📝</Text>
              <View style={styles.modalLine} />

              <TextInput
                style={styles.input}
                placeholder="Nome do animal"
                placeholderTextColor="#999"
                value={novoNome}
                onChangeText={setNovoNome}
                accessibilityLabel="Campo nome do animal"
              />
              <TextInput
                style={styles.input}
                placeholder="Local onde foi visto"
                placeholderTextColor="#999"
                value={novoLocal}
                onChangeText={setNovoLocal}
                accessibilityLabel="Campo local onde o animal foi visto"
              />
              <TextInput
                style={styles.input}
                placeholder="Data (dd/mm/aaaa)"
                placeholderTextColor="#999"
                value={novaData}
                onChangeText={setNovaData}
                keyboardType="numeric"
                accessibilityLabel="Campo data que o animal foi visto"
              />

              <View style={styles.tipoContainer}>
                <Text style={styles.tipoLabel}>Tipo:</Text>
                <TouchableOpacity
                  style={[
                    styles.tipoButton,
                    novoTipo === 'Cachorro' && styles.tipoButtonSelected,
                  ]}
                  onPress={() => setNovoTipo('Cachorro')}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: novoTipo === 'Cachorro' }}
                  accessibilityLabel="Selecionar cachorro"
                >
                  <Text
                    style={[
                      styles.tipoButtonText,
                      novoTipo === 'Cachorro' && styles.tipoButtonTextSelected,
                    ]}
                  >
                    🐶 Cachorro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tipoButton,
                    novoTipo === 'Gato' && styles.tipoButtonSelected,
                  ]}
                  onPress={() => setNovoTipo('Gato')}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: novoTipo === 'Gato' }}
                  accessibilityLabel="Selecionar gato"
                >
                  <Text
                    style={[
                      styles.tipoButtonText,
                      novoTipo === 'Gato' && styles.tipoButtonTextSelected,
                    ]}
                  >
                    🐱 Gato
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtonRow}>
                <Pressable
                  style={[styles.secondaryButton, { flex: 1, marginRight: 10 }]}
                  onPress={fecharModalNovoReport}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar novo reporte"
                >
                  <Text style={styles.secondaryButtonText}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={[styles.primaryButton, { flex: 1 }]}
                  onPress={adicionarNovoReport}
                  accessibilityRole="button"
                  accessibilityLabel="Salvar novo reporte"
                >
                  <Text style={styles.primaryButtonText}>Salvar</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Botão Novo Report fixo */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={abrirModalNovoReport}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Adicionar novo report de animal perdido"
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 20, 40, 0.5)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
  },
  backText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#EAEFF3',
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#C8D6E5',
    marginBottom: 20,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#ffffffee',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  animalName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0E2F44',
    marginBottom: 6,
  },
  animalInfo: {
    fontSize: 14,
    color: '#4B6584',
    marginBottom: 2,
  },
  buttonWrapper: {
    marginTop: 10,
    backgroundColor: '#0E6BA8',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewDetails: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  modalBox: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0E2F44',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalLine: {
    height: 1,
    backgroundColor: '#CCD1D9',
    marginVertical: 10,
  },
  modalInfo: {
    fontSize: 14,
    color: '#4B6584',
    marginBottom: 10,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#0E6BA8',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#0E2F44',
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#0E2F44',
  },
  tipoButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0E6BA8',
    marginRight: 10,
  },
  tipoButtonSelected: {
    backgroundColor: '#0E6BA8',
  },
  tipoButtonText: {
    fontSize: 16,
    color: '#0E6BA8',
  },
  tipoButtonTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#198754',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#ddd',
    fontStyle: 'italic',
  },
  floatingButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: '#0E6BA8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
});
