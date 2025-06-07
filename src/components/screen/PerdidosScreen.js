import React, { useState, useEffect } from 'react';
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
  Alert,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import api from '../../api/api';

export default function PerdidosScreen() {
  const navigation = useNavigation();

  const [animaisPerdidos, setAnimaisPerdidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Estado para o formulário
  const [formData, setFormData] = useState({
    nomeAnimal: '',
    especieAnimal: 'Cachorro',
    porte: 'Pequeno',
    idadeEstimada: '',
    tipoAnimal: 'Resgatado',
  });

  // Opções para os seletores
  const especies = ['Cachorro', 'Gato', 'Outro'];
  const portes = ['Pequeno', 'Médio', 'Grande'];
  const tipos = ['Adotado', 'Resgatado', 'Disponível'];

  useEffect(() => {
    fetchAnimais();
  }, []);

  const fetchAnimais = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado.');
        setLoading(false);
        return;
      }

      const response = await api.get('/animal', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnimaisPerdidos(response.data.content || []);
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de animais.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setFormLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        return;
      }

      // Preparar dados no formato esperado pela API
      const animalData = {
        nomeAnimal: formData.nomeAnimal,
        especieAnimal: formData.especieAnimal,
        porte: formData.porte,
        idadeEstimada: parseInt(formData.idadeEstimada) || 0,
        tipoAnimal: formData.tipoAnimal
      };

      // Configuração do cabeçalho com o token
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (isEditing && animalSelecionado) {
        // Atualizar animal existente
        await api.put(`/animal/${animalSelecionado.idAnimal}`, animalData, config);
        Alert.alert('Sucesso', 'Animal atualizado com sucesso!');
      } else {
        // Criar novo animal
        await api.post('/animal', animalData, config);
        Alert.alert('Sucesso', 'Animal adicionado com sucesso!');
      }

      fetchAnimais();
      resetForm();
      setModalFormVisible(false);
    } catch (error) {
      console.error('Erro ao salvar animal:', error);
      
      // Mensagem de erro mais detalhada
      if (error.response) {
        console.log('Resposta do servidor:', error.response.data);
        Alert.alert('Erro', `Erro ${error.response.status}: ${error.response.data.message || 'Falha na autenticação'}`);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o animal');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      // Configuração do cabeçalho com o token
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      Alert.alert(
        'Confirmar exclusão',
        'Tem certeza que deseja excluir este animal?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              await api.delete(`/animal/${id}`, config);
              fetchAnimais();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao excluir animal:', error);
      Alert.alert('Erro', 'Não foi possível excluir o animal');
    }
  };

  const resetForm = () => {
    setFormData({
      nomeAnimal: '',
      especieAnimal: 'Cachorro',
      porte: 'Pequeno',
      idadeEstimada: '',
      tipoAnimal: 'Resgatado',
    });
    setAnimalSelecionado(null);
    setIsEditing(false);
  };

  const openEditModal = (animal) => {
    setAnimalSelecionado(animal);
    setIsEditing(true);
    setFormData({
      nomeAnimal: animal.nomeAnimal,
      especieAnimal: animal.especieAnimal,
      porte: animal.porte,
      idadeEstimada: String(animal.idadeEstimada),
      tipoAnimal: animal.tipoAnimal,
    });
    setModalFormVisible(true);
  };

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

  const renderPicker = (items, selectedValue, onValueChange) => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#4B6584"
      >
        {items.map((item, index) => (
          <Picker.Item 
            key={`${item}-${index}`} 
            label={item} 
            value={item} 
          />
        ))}
      </Picker>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backButton} onPress={voltar} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Animais 🐾</Text>
        <Text style={styles.subtitle}>Ajude a encontrar esses amigos</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalFormVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Novo Animal</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Carregando animais...</Text>
          </View>
        ) : animaisPerdidos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum animal encontrado.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {animaisPerdidos.map((animal) => (
              <View key={animal.idAnimal} style={styles.card}>
                <Text style={styles.animalName}>
                  {animal.especieAnimal === 'Cachorro' ? '🐶' : animal.especieAnimal === 'Gato' ? '🐱' : '🐾'} {animal.nomeAnimal}
                </Text>
                <Text style={styles.animalInfo}>Espécie: {animal.especieAnimal}</Text>
                <Text style={styles.animalInfo}>Porte: {animal.porte}</Text>
                <Text style={styles.animalInfo}>Idade: {animal.idadeEstimada} ano(s)</Text>
                <Text style={styles.animalInfo}>Status: {animal.tipoAnimal}</Text>
                
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={() => abrirModalDetalhes(animal)}
                  >
                    <Ionicons name="eye" size={16} color="#fff" />
                    <Text style={styles.actionText}>Ver</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEditModal(animal)}
                  >
                    <Ionicons name="pencil" size={16} color="#fff" />
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(animal.idAnimal)}
                  >
                    <Ionicons name="trash" size={16} color="#fff" />
                    <Text style={styles.actionText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
                {animalSelecionado?.especieAnimal === 'Cachorro' ? '🐶' : 
                 animalSelecionado?.especieAnimal === 'Gato' ? '🐱' : '🐾'} {animalSelecionado?.nomeAnimal}
              </Text>
              <View style={styles.modalLine} />
              <Text style={styles.modalInfo}>Espécie: {animalSelecionado?.especieAnimal}</Text>
              <Text style={styles.modalInfo}>Porte: {animalSelecionado?.porte}</Text>
              <Text style={styles.modalInfo}>Idade: {animalSelecionado?.idadeEstimada} ano(s)</Text>
              <Text style={styles.modalInfo}>Status: {animalSelecionado?.tipoAnimal}</Text>

              <Pressable style={styles.secondaryButton} onPress={fecharModalDetalhes}>
                <Text style={styles.secondaryButtonText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Modal Formulário */}
        <Modal
          transparent
          visible={modalFormVisible}
          animationType="slide"
          onRequestClose={() => setModalFormVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.formModalBox}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Editar Animal' : 'Adicionar Animal'}
              </Text>
              
              {/* Nome */}
              <Text style={styles.inputLabel}>Nome:</Text>
              <TextInput
                style={styles.input}
                value={formData.nomeAnimal}
                onChangeText={(text) => handleInputChange('nomeAnimal', text)}
                placeholder="Nome do animal"
              />
              
              {/* Espécie */}
              <Text style={styles.inputLabel}>Espécie:</Text>
              {renderPicker(
                especies,
                formData.especieAnimal,
                (value) => handleInputChange('especieAnimal', value)
              )}
              
              {/* Porte */}
              <Text style={styles.inputLabel}>Porte:</Text>
              {renderPicker(
                portes,
                formData.porte,
                (value) => handleInputChange('porte', value)
              )}
              
              {/* Idade */}
              <Text style={styles.inputLabel}>Idade estimada (anos):</Text>
              <TextInput
                style={styles.input}
                value={formData.idadeEstimada}
                onChangeText={(text) => handleInputChange('idadeEstimada', text)}
                placeholder="Idade estimada"
                keyboardType="numeric"
              />
              
              {/* Tipo */}
              <Text style={styles.inputLabel}>Status:</Text>
              {renderPicker(
                tipos,
                formData.tipoAnimal,
                (value) => handleInputChange('tipoAnimal', value)
              )}

              <View style={styles.modalButtonsContainer}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalFormVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmit}
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalButtonText}>
                      {isEditing ? 'Atualizar' : 'Adicionar'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </Modal>
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
  formModalBox: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0E2F44',
    textAlign: 'center',
    marginBottom: 20,
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
    textAlign: 'left',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E6BA8',
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#3498DB',
  },
  editButton: {
    backgroundColor: '#2ECC71',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  actionText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B6584',
    marginBottom: 8,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#CCD1D9',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#CCD1D9',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#0E2F44',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95A5A6',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#0E6BA8',
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});