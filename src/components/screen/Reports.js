import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/api';

export default function ReportsScreen() {
  const navigation = useNavigation();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const [loadingEntidades, setLoadingEntidades] = useState(true);
  const [pessoas, setPessoas] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [locais, setLocais] = useState([]);
  const [sensores, setSensores] = useState([]);

  const [formData, setFormData] = useState({
    idPessoa: '',
    idAnimal: '',
    idLocal: '',
    idSensor: '',
    descricao: '',
    tipoDesastre: '',
    latitude: '',
    longitude: '',
    dataReport: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReports();
    fetchEntidades();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado.');
        setLoading(false);
        return;
      }
      const response = await api.get('/report', {
        headers: { Authorization: token },
      });
      setReports(response.data.content || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os relatórios.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchEntidades() {
    setLoadingEntidades(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const [pessoasRes, animaisRes, locaisRes, sensoresRes] = await Promise.all([
        api.get('/pessoa', { headers: { Authorization: token } }),
        api.get('/animal', { headers: { Authorization: token } }),
        api.get('/local', { headers: { Authorization: token } }),
        api.get('/sensor', { headers: { Authorization: token } }),
      ]);

      setPessoas(pessoasRes.data.content || []);
      setAnimais(animaisRes.data.content || []);
      setLocais(locaisRes.data.content || []);
      setSensores(sensoresRes.data.content || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados das entidades.');
    } finally {
      setLoadingEntidades(false);
    }
  }

  function handleInputChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        return;
      }

      const dataToSend = {
        ...formData,
        idPessoa: formData.idPessoa ? parseInt(formData.idPessoa) : null,
        idAnimal: formData.idAnimal ? parseInt(formData.idAnimal) : null,
        idLocal: formData.idLocal ? parseInt(formData.idLocal) : null,
        idSensor: formData.idSensor ? parseInt(formData.idSensor) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (isEditing && currentReport) {
        await api.put(`/report/${currentReport.idReport}`, dataToSend, {
          headers: { Authorization: token },
        });
        Alert.alert('Sucesso', 'Report atualizado com sucesso!');
      } else {
        await api.post('/report', dataToSend, {
          headers: { Authorization: token },
        });
        Alert.alert('Sucesso', 'Report criado com sucesso!');
      }
      fetchReports();
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o report.');
    }
  }

  async function handleDelete(id) {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      Alert.alert(
        'Confirmação',
        'Deseja realmente excluir este relatório?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              await api.delete(`/report/${id}`, {
                headers: { Authorization: token },
              });
              fetchReports();
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível excluir o relatório.');
    }
  }

  function resetForm() {
    setFormData({
      idPessoa: '',
      idAnimal: '',
      idLocal: '',
      idSensor: '',
      descricao: '',
      tipoDesastre: '',
      latitude: '',
      longitude: '',
      dataReport: new Date().toISOString().split('T')[0],
    });
    setCurrentReport(null);
    setIsEditing(false);
  }

  function openEditModal(report) {
    setCurrentReport(report);
    setIsEditing(true);
    setFormData({
      idPessoa: report.idPessoa ? String(report.idPessoa) : '',
      idAnimal: report.idAnimal ? String(report.idAnimal) : '',
      idLocal: report.idLocal ? String(report.idLocal) : '',
      idSensor: report.idSensor ? String(report.idSensor) : '',
      descricao: report.descricao || '',
      tipoDesastre: report.tipoDesastre || '',
      latitude: report.latitude ? String(report.latitude) : '',
      longitude: report.longitude ? String(report.longitude) : '',
      dataReport: report.dataReport ? report.dataReport.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setModalVisible(true);
  }

  function voltar() {
    navigation.goBack();
  }

  function renderPicker(items, keyField, labelField, value, onChange, placeholder) {
    if (loadingEntidades) {
      return (
        <View style={styles.pickerContainer}>
          <ActivityIndicator size="small" color="#0E6BA8" />
        </View>
      );
    }
    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
          dropdownIconColor="#4B6584"
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item, index) => (
            <Picker.Item
              key={item[keyField] ?? `item-${index}`}
              label={item[labelField]}
              value={String(item[keyField])}
            />
          ))}
        </Picker>
      </View>
    );
  }

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

        <Text style={styles.title}>Reports 📋</Text>
        <Text style={styles.subtitle}>Gerenciamento de reports</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Novo Report</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Carregando relatórios...</Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum relatório encontrado.</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {reports.map((report) => (
              <View key={report.idReport} style={styles.card}>
                <Text style={styles.reportTitle}>{report.tipoDesastre}</Text>
                <Text style={styles.reportInfo}>Descrição: {report.descricao}</Text>
                <Text style={styles.reportInfo}>
                  Data: {report.dataReport.split('T')[0]}
                </Text>
                <Text style={styles.reportInfo}>
                  Localização: {report.latitude}, {report.longitude}
                </Text>

                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEditModal(report)}
                  >
                    <Ionicons name="pencil" size={16} color="#fff" />
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(report.idReport)}
                  >
                    <Ionicons name="trash" size={16} color="#fff" />
                    <Text style={styles.actionText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Editar Report' : 'Novo Report'}
              </Text>

              <ScrollView
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.inputLabel}>Pessoa:</Text>
                {renderPicker(
                  pessoas,
                  'idPessoa',
                  'nome',
                  formData.idPessoa,
                  (val) => handleInputChange('idPessoa', val),
                  'Selecione uma pessoa'
                )}

                <Text style={styles.inputLabel}>Animal:</Text>
                {renderPicker(
                  animais,
                  'idAnimal',
                  'nomeAnimal',
                  formData.idAnimal,
                  (val) => handleInputChange('idAnimal', val),
                  'Selecione um animal'
                )}

                <Text style={styles.inputLabel}>Local:</Text>
                {renderPicker(
                  locais,
                  'idLocal',
                  'cidade',
                  formData.idLocal,
                  (val) => handleInputChange('idLocal', val),
                  'Selecione um local'
                )}

                <Text style={styles.inputLabel}>Sensor:</Text>
                {renderPicker(
                  sensores,
                  'idSensor',
                  'tipoSensor',
                  formData.idSensor,
                  (val) => handleInputChange('idSensor', val),
                  'Selecione um sensor'
                )}

                <Text style={styles.inputLabel}>Descrição:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.descricao}
                  onChangeText={(text) => handleInputChange('descricao', text)}
                  placeholder="Descrição do report"
                  multiline
                />

                <Text style={styles.inputLabel}>Tipo de Desastre:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.tipoDesastre}
                  onChangeText={(text) => handleInputChange('tipoDesastre', text)}
                  placeholder="Tipo de desastre"
                />

                <Text style={styles.inputLabel}>Latitude:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.latitude}
                  onChangeText={(text) => handleInputChange('latitude', text)}
                  placeholder="Latitude"
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Longitude:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.longitude}
                  onChangeText={(text) => handleInputChange('longitude', text)}
                  placeholder="Longitude"
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Data do Report:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.dataReport}
                  onChangeText={(text) => handleInputChange('dataReport', text)}
                  placeholder="YYYY-MM-DD"
                />
              </ScrollView>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.modalButtonText}>
                    {isEditing ? 'Atualizar' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0E2F44',
    marginBottom: 8,
  },
  reportInfo: {
    fontSize: 14,
    color: '#4B6584',
    marginBottom: 4,
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
  editButton: {
    backgroundColor: '#0E6BA8',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  actionText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
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
  textArea: {
    backgroundColor: '#fff',
    borderColor: '#CCD1D9',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
});
